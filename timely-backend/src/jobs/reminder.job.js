const cron = require("node-cron");

const Reminder = require("../modules/reminders/reminder.model");
const Task = require("../modules/tasks/task.model");

const {
  sendTaskReminder,
} = require("../modules/notifications/notification.service");

// ==========================================
// Process Due Reminders
// ==========================================

const processDueReminders = async () => {
  try {
    const now = new Date();

    let processed = 0;

    while (processed < 50) {
      // --------------------------------------
      // Atomically claim one reminder
      // --------------------------------------

      const reminder =
        await Reminder.findOneAndUpdate(
          {
            status: "scheduled",
            remindAt: {
              $lte: now,
            },
          },
          {
            $set: {
              status: "processing",
            },

            $inc: {
              attempts: 1,
            },
          },
          {
            sort: {
              remindAt: 1,
            },

            new: true,
          }
        );

      // Nothing left to process
      if (!reminder) {
        break;
      }

      processed += 1;

      try {
        // ------------------------------------
        // Verify task still exists
        // ------------------------------------

        const task = await Task.findOne({
          _id: reminder.taskId,
          userId: reminder.userId,
        });

        if (!task) {
          await Reminder.findByIdAndUpdate(
            reminder._id,
            {
              $set: {
                status: "cancelled",
                errorMessage:
                  "Task no longer exists",
              },
            }
          );

          continue;
        }

        // ------------------------------------
        // Don't send reminder for completed
        // or cancelled tasks
        // ------------------------------------

        if (
          task.status === "completed" ||
          task.status === "cancelled"
        ) {
          await Reminder.findByIdAndUpdate(
            reminder._id,
            {
              $set: {
                status: "cancelled",
                errorMessage:
                  "Task is completed or cancelled",
              },
            }
          );

          continue;
        }

        // ------------------------------------
        // Send notification
        // ------------------------------------

        await sendTaskReminder(
          reminder._id
        );

        console.log(
          `Reminder ${reminder._id} processed successfully`
        );
      } catch (error) {
        console.error(
          `Failed to process reminder ${reminder._id}:`,
          error.message
        );

        // ------------------------------------
        // Mark failed
        // ------------------------------------

        await Reminder.findByIdAndUpdate(
          reminder._id,
          {
            $set: {
              status: "failed",
              failedAt: new Date(),
              errorMessage:
                error.message,
            },
          }
        );
      }
    }

    if (processed > 0) {
      console.log(
        `Processed ${processed} reminder(s).`
      );
    }
  } catch (error) {
    console.error(
      "Reminder job failed:",
      error.message
    );
  }
};

// ==========================================
// Start Reminder Job
// ==========================================

const startReminderJob = () => {
  cron.schedule(
    "* * * * *",
    async () => {
      await processDueReminders();
    }
  );

  console.log(
    "Reminder job started. Checking every minute."
  );
};

module.exports = {
  startReminderJob,
  processDueReminders,
};