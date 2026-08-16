const Task = require("../tasks/task.model");
const Customer = require("../customers/customer.model");

const getDashboard = async (userId) => {
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const [
    activeTasks,
    inProgressTasks,
    completedTasks,
    todayTasks,
    overdueTasks,
    highPriorityTasks,
    totalCustomers,
    upcomingTasks,
    recentTasks,
  ] = await Promise.all([
    // Active
    Task.countDocuments({
      userId,
      status: {
        $nin: ["completed", "cancelled"],
      },
    }),

    // In progress
    Task.countDocuments({
      userId,
      status: "in_progress",
    }),

    // Completed
    Task.countDocuments({
      userId,
      status: "completed",
    }),

    // Due today
    Task.countDocuments({
      userId,
      dueDate: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
      status: {
        $nin: ["completed", "cancelled"],
      },
    }),

    // Overdue
    Task.countDocuments({
      userId,
      dueDate: {
        $lt: startOfToday,
      },
      status: {
        $nin: ["completed", "cancelled"],
      },
    }),

    // High priority
    Task.countDocuments({
      userId,
      priority: "high",
      status: {
        $nin: ["completed", "cancelled"],
      },
    }),

    // Customers
    Customer.countDocuments({
      userId,
    }),

    // Upcoming
    Task.find({
      userId,
      dueDate: {
        $gte: startOfToday,
      },
      status: {
        $nin: ["completed", "cancelled"],
      },
    })
      .populate("customerId", "name phone")
      .sort({
        dueDate: 1,
        dueTime: 1,
      })
      .limit(5),

    // Recent activity
    Task.find({
      userId,
    })
      .populate("customerId", "name phone")
      .sort({
        updatedAt: -1,
      })
      .limit(5),
  ]);

  return {
    summary: {
      activeTasks,
      inProgressTasks,
      completedTasks,
      todayTasks,
      overdueTasks,
      highPriorityTasks,
      totalCustomers,
    },

    upcomingTasks,

    recentActivity: recentTasks,
  };
};

module.exports = {
  getDashboard,
};