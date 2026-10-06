import { test } from "node:test";
import assert from "node:assert/strict";
import { getNewAlerts, mergeNotificationChannels, playReminderChime } from "../src/features/notifications/utils/reminderAlerts.js";

const now = Date.parse("2026-10-06T12:00:00Z");
const item = (id, fields = {}) => ({ _id: id, reminderId: id, channel: "in_app", status: "sent", createdAt: new Date(now).toISOString(), ...fields });

test("new app reminders alert once; old history and email records stay silent", () => {
  const items = [item("new"), item("seen"), item("old", { createdAt: new Date(now - 120_000).toISOString() }), item("email", { channel: "email" }), item("failed", { status: "failed" })];
  const seen = new Set(["seen"]);
  assert.deepEqual(getNewAlerts(items, seen, now).map((alert) => alert._id), ["new"]);
  seen.add("new");
  assert.equal(getNewAlerts(items, seen, now).length, 0);
});

test("reminders arriving while disconnected are caught after reconnecting", () => {
  const later = item("later", { createdAt: new Date(now + 600_000).toISOString() });
  assert.equal(getNewAlerts([later], new Set(), now).length, 1);
});

test("history keeps legacy email reminders and shows one record for each new reminder", () => {
  const app = item("app", { reminderId: "shared" });
  const email = item("email", { reminderId: "shared", channel: "email" });
  const legacy = item("legacy", { channel: "email", status: "failed" });
  assert.deepEqual(mergeNotificationChannels([email, app, legacy]).map((entry) => entry._id), ["app", "legacy"]);
});

test("sound requires a running audio context", () => {
  assert.equal(playReminderChime(null), false);
  assert.equal(playReminderChime({ state: "suspended" }), false);
  const notes = [];
  const context = {
    state: "running", currentTime: 10, destination: {},
    createOscillator() {
      const note = { frequency: {}, connect() {}, disconnect() {}, start(time) { this.startTime = time; }, stop(time) { this.stopTime = time; } };
      notes.push(note);
      return note;
    },
    createGain() { return { gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, disconnect() {} }; },
  };
  assert.equal(playReminderChime(context), true);
  assert.deepEqual(notes.map((note) => note.frequency.value), [660, 880, 660]);
  assert.ok(notes.every((note) => note.stopTime > note.startTime));
});
