const {
  getTaskDueDateTime,
  isTaskOverdue,
  isTaskDueWithin,
  isTaskDueToday,
} = require("./date");

const dueDate =
  new Date("2026-08-18T00:00:00.000Z");

const dueTime = "17:00";

const deadline =
  getTaskDueDateTime(
    dueDate,
    dueTime
  );

console.log(
  "Deadline UTC:",
  deadline.toISO()
);

console.log(
  "Is overdue:",
  isTaskOverdue(
    dueDate,
    dueTime
  )
);

console.log(
  "Due within 1440 minutes:",
  isTaskDueWithin(
    dueDate,
    dueTime,
    1440
  )
);

console.log(
  "Due today:",
  isTaskDueToday(
    dueDate,
    dueTime
  )
);