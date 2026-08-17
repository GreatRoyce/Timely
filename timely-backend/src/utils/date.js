const { DateTime } = require("luxon");

const { env } = require("../config/env");

// ==========================================
// Combine Task Date + Time
// ==========================================

const getTaskDueDateTime = (
  dueDate,
  dueTime
) => {
  if (!dueDate || !dueTime) {
    return null;
  }

  const [hours, minutes] =
    dueTime.split(":").map(Number);

  // Validate time
  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  const date =
    DateTime.fromJSDate(
      new Date(dueDate),
      {
        zone: env.appTimezone,
      }
    );

  if (!date.isValid) {
    return null;
  }

  return date
    .set({
      hour: hours,
      minute: minutes,
      second: 0,
      millisecond: 0,
    })
    .toUTC();
};

// ==========================================
// Is Task Overdue?
// ==========================================

const isTaskOverdue = (
  dueDate,
  dueTime
) => {
  const deadline =
    getTaskDueDateTime(
      dueDate,
      dueTime
    );

  if (!deadline) {
    return false;
  }

  return (
    deadline.toMillis() <
    DateTime.utc().toMillis()
  );
};

// ==========================================
// Is Task Due Within
// ==========================================

const isTaskDueWithin = (
  dueDate,
  dueTime,
  minutes
) => {
  const deadline =
    getTaskDueDateTime(
      dueDate,
      dueTime
    );

  if (!deadline) {
    return false;
  }

  const now =
    DateTime.utc();

  const difference =
    deadline.diff(
      now,
      "minutes"
    ).minutes;

  return (
    difference >= 0 &&
    difference <= minutes
  );
};

// ==========================================
// Is Task Due Today?
// ==========================================

const isTaskDueToday = (
  dueDate,
  dueTime
) => {
  const deadline =
    getTaskDueDateTime(
      dueDate,
      dueTime
    );

  if (!deadline) {
    return false;
  }

  const today =
    DateTime.now().setZone(
      env.appTimezone
    );

  const localDeadline =
    deadline.setZone(
      env.appTimezone
    );

  return (
    localDeadline.hasSame(
      today,
      "day"
    )
  );
};

// ==========================================
// Exports
// ==========================================

module.exports = {
  getTaskDueDateTime,
  isTaskOverdue,
  isTaskDueWithin,
  isTaskDueToday,
};