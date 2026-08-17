const Task = require("../tasks/task.model");
const Reminder = require("../reminders/reminder.model");
const Customer = require("../customers/customer.model");

const {
  isTaskOverdue,
  isTaskDueToday,
} = require("../../utils/date");

// ==========================================
// Get Dashboard
// ==========================================

const getDashboard = async (userId) => {
  // ==========================================
  // Fetch Dashboard Data
  // ==========================================

  const [
    activeTaskDocuments,
    recentTasks,
    totalCustomers,
    totalReminders,
  ] = await Promise.all([
    // ------------------------------------------
    // Active Tasks
    // ------------------------------------------

    Task.find({
      userId,
      status: {
        $nin: [
          "completed",
          "cancelled",
        ],
      },
    })
      .populate(
        "customerId",
        "name phone"
      )
      .sort({
        dueDate: 1,
        dueTime: 1,
      }),

    // ------------------------------------------
    // Recent Activity
    // ------------------------------------------

    Task.find({
      userId,
    })
      .populate(
        "customerId",
        "name phone"
      )
      .sort({
        updatedAt: -1,
      })
      .limit(5),

    // ------------------------------------------
    // Total Customers
    // ------------------------------------------

    Customer.countDocuments({
      userId,
    }),

    // ------------------------------------------
    // Scheduled Reminders
    // ------------------------------------------

    Reminder.countDocuments({
      userId,
      status: "scheduled",
    }),
  ]);

  // ==========================================
  // Due Today
  // ==========================================

  const dueTodayTasks =
    activeTaskDocuments.filter(
      (task) =>
        isTaskDueToday(
          task.dueDate,
          task.dueTime
        )
    );

  // ==========================================
  // Overdue
  // ==========================================

  const overdueTasks =
    activeTaskDocuments.filter(
      (task) =>
        isTaskOverdue(
          task.dueDate,
          task.dueTime
        )
    );

  // ==========================================
  // Upcoming Tasks
  // ==========================================

  const upcomingTasks =
    activeTaskDocuments
      .filter(
        (task) =>
          !isTaskOverdue(
            task.dueDate,
            task.dueTime
          )
      )
      .slice(0, 5);

  // ==========================================
  // Needs Attention
  // ==========================================

  const attentionTasks =
    activeTaskDocuments
      .filter((task) => {
        const isHighPriority =
          task.priority === "high";

        const isOverdue =
          isTaskOverdue(
            task.dueDate,
            task.dueTime
          );

        const isDueToday =
          isTaskDueToday(
            task.dueDate,
            task.dueTime
          );

        return (
          isHighPriority ||
          isOverdue ||
          isDueToday
        );
      })
      .slice(0, 5);

  // ==========================================
  // In Progress
  // ==========================================

  const inProgressTasks =
    activeTaskDocuments.filter(
      (task) =>
        task.status ===
        "in_progress"
    );

  // ==========================================
  // High Priority
  // ==========================================

  const highPriorityTasks =
    activeTaskDocuments.filter(
      (task) =>
        task.priority === "high"
    );

  // ==========================================
  // Response
  // ==========================================

  return {
    summary: {
      activeTasks:
        activeTaskDocuments.length,

      inProgressTasks:
        inProgressTasks.length,

      dueToday:
        dueTodayTasks.length,

      overdueTasks:
        overdueTasks.length,

      highPriorityTasks:
        highPriorityTasks.length,

      totalCustomers,

      totalReminders,
    },

    upcomingTasks,

    recentActivity:
      recentTasks,

    needsAttention:
      attentionTasks,
  };
};

module.exports = {
  getDashboard,
};