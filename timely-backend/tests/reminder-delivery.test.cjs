const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const loadModule = (relativePath, dependencies) => {
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../src", relativePath), "utf8"), {
    module, Date, console: { log() {}, error() {} },
    require(name) {
      assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
      return dependencies[name];
    },
  });
  return module.exports;
};

const setup = (sendEmail = async () => {}) => {
  const records = [];
  const reminders = [];
  const tasks = new Map();
  const Reminder = {
    async findOne(filter) {
      return reminders.find((item) => item._id === filter._id && item.status === filter.status);
    },
    async findOneAndUpdate(filter, update) {
      const item = reminders.find((candidate) => candidate.status === filter.status && candidate.remindAt <= filter.remindAt.$lte);
      if (!item) return null;
      Object.assign(item, update.$set);
      item.attempts = (item.attempts || 0) + update.$inc.attempts;
      return item;
    },
    async findByIdAndUpdate(id, update) {
      Object.assign(reminders.find((item) => item._id === id), update.$set);
    },
  };
  const Task = {
    findOne(filter) {
      const task = tasks.get(filter._id);
      const query = Promise.resolve(task?.userId === filter.userId ? task : null);
      query.populate = () => query;
      return query;
    },
  };
  const service = loadModule("modules/notifications/notification.service.js", {
    "../../utils/AppError": class AppError extends Error {},
    "./notification.model": { async create(record) {
      const item = { ...record, _id: `notification-${records.length}`, async save() {} };
      records.push(item);
      return item;
    } },
    "../reminders/reminder.model": Reminder,
    "../tasks/task.model": Task,
    "../users/user.model": { async findById(id) { return { _id: id, email: "test@example.test" }; } },
    "../../services/email.service": { sendTaskReminderEmail: sendEmail },
  });
  const schedules = [];
  const job = loadModule("jobs/reminder.job.js", {
    "node-cron": { schedule(...args) { schedules.push(args); } },
    "../modules/reminders/reminder.model": Reminder,
    "../modules/tasks/task.model": Task,
    "../modules/notifications/notification.service": service,
  });
  const add = (id, status = "pending", remindAt = new Date(Date.now() - 1000)) => {
    const reminder = { _id: id, taskId: id, userId: "owner", status: "scheduled", remindAt, async save() {} };
    reminders.push(reminder);
    tasks.set(id, { _id: id, userId: "owner", title: id, status, dueDate: new Date("2026-10-06"), dueTime: "17:00" });
    return reminder;
  };
  return { records, reminders, tasks, service, job, schedules, add };
};

test("a due reminder reaches the app even when email fails", async () => {
  const harness = setup(async () => { throw new Error("SMTP unavailable"); });
  const reminder = harness.add("due");
  await harness.job.processDueReminders();
  await new Promise(setImmediate);
  assert.equal(reminder.status, "sent");
  assert.ok(reminder.sentAt instanceof Date);
  assert.equal(harness.records.length, 2);
  assert.equal(harness.records[0].channel, "in_app");
  assert.equal(harness.records[0].status, "sent");
  assert.equal(harness.records[1].channel, "email");
  assert.equal(harness.records[1].status, "failed");
  assert.equal(harness.records[1].errorMessage, "SMTP unavailable");
});

test("slow email does not delay other due reminders and a second run does not redeliver", async () => {
  let finishEmail;
  const waitingEmail = new Promise((resolve) => { finishEmail = resolve; });
  const harness = setup(() => waitingEmail);
  harness.add("first");
  harness.add("second");
  await harness.job.processDueReminders();
  assert.equal(harness.records.filter((item) => item.channel === "in_app").length, 2);
  assert.ok(harness.reminders.every((item) => item.status === "sent"));
  await harness.job.processDueReminders();
  assert.equal(harness.records.filter((item) => item.channel === "in_app").length, 2);
  finishEmail();
  await new Promise(setImmediate);
  assert.ok(harness.records.every((item) => item.status === "sent"));
});

test("completed, cancelled, missing and foreign tasks do not alert; future reminders wait", async () => {
  const harness = setup();
  harness.add("completed", "completed");
  harness.add("cancelled", "cancelled");
  harness.add("deleted");
  harness.tasks.delete("deleted");
  harness.add("foreign");
  harness.tasks.get("foreign").userId = "someone-else";
  const future = harness.add("future", "pending", new Date(Date.now() + 60_000));
  await harness.job.processDueReminders();
  assert.equal(harness.records.length, 0);
  assert.equal(future.status, "scheduled");
  assert.ok(harness.reminders.filter((item) => item !== future).every((item) => item.status === "cancelled"));
});

test("the scheduler checks every ten seconds and prevents overlapping runs", () => {
  const harness = setup();
  harness.job.startReminderJob();
  assert.equal(harness.schedules[0][0], "*/10 * * * * *");
  assert.equal(harness.schedules[0][2].noOverlap, true);
});
