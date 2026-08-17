const AppError = require("../../utils/AppError");

const Task = require("./task.model");
const Customer = require("../customers/customer.model");
const Reminder = require("../reminders/reminder.model");

const {
  isTaskOverdue,
  isTaskDueToday,
} = require("../../utils/date");

// ==========================================
// Create Task
// ==========================================

const createTask = async (userId, taskData) => {
  const {
    customerId,
    title,
    dueDate,
    dueTime,
    priority,
    notes,
  } = taskData;

  // Make sure the customer belongs
  // to the authenticated user
  const customer = await Customer.findOne({
    _id: customerId,
    userId,
  });

  if (!customer) {
    throw new AppError(
      "Customer not found",
      404
    );
  }

  const task = await Task.create({
    userId,
    customerId,
    title,
    dueDate,
    dueTime,
    priority,
    notes,
  });

  return task;
};

// ==========================================
// Get All Tasks
// ==========================================

const getTasks = async (
  userId,
  filters = {}
) => {
  const {
    status,
    priority,
    due,
    search,
    page = 1,
    limit = 20,
  } = filters;

  const query = {
    userId,
  };

  // ------------------------------------------
  // Status Filter
  // ------------------------------------------

  if (status) {
    query.status = status;
  }

  // ------------------------------------------
  // Priority Filter
  // ------------------------------------------

  if (priority) {
    query.priority = priority;
  }

  // ------------------------------------------
  // Search
  // ------------------------------------------

  if (search) {
    query.title = {
      $regex: search,
      $options: "i",
    };
  }

  // ------------------------------------------
  // Due Filters
  // ------------------------------------------
  //
  // Date-based filtering is handled after
  // retrieving the tasks because the actual
  // deadline consists of:
  //
  // dueDate + dueTime
  //
  // The date utility handles the application
  // timezone consistently.
  //
  // ------------------------------------------

  const hasDueFilter = [
    "today",
    "upcoming",
    "overdue",
  ].includes(due);

  if (hasDueFilter) {
    // Due-based views only contain active tasks.
    //
    // If the caller also supplied a specific
    // status, respect that status only if it
    // represents an active task.
    if (
      status === "completed" ||
      status === "cancelled"
    ) {
      return {
        tasks: [],
        pagination: {
          page: Math.max(
            Number(page) || 1,
            1
          ),
          limit: Math.min(
            Math.max(
              Number(limit) || 20,
              1
            ),
            100
          ),
          total: 0,
          totalPages: 0,
        },
      };
    }

    if (!status) {
      query.status = {
        $nin: [
          "completed",
          "cancelled",
        ],
      };
    }
  }

  // ------------------------------------------
  // Fetch Tasks
  // ------------------------------------------

  let tasks = await Task.find(query)
    .populate(
      "customerId",
      "name phone"
    )
    .sort({
      dueDate: 1,
      dueTime: 1,
    });

  // ------------------------------------------
  // Apply Deadline Filters
  // ------------------------------------------

  if (due === "today") {
    tasks = tasks.filter((task) =>
      isTaskDueToday(
        task.dueDate,
        task.dueTime
      )
    );
  }

  if (due === "overdue") {
    tasks = tasks.filter((task) =>
      isTaskOverdue(
        task.dueDate,
        task.dueTime
      )
    );
  }

  if (due === "upcoming") {
    tasks = tasks.filter(
      (task) =>
        !isTaskOverdue(
          task.dueDate,
          task.dueTime
        )
    );
  }

  // ------------------------------------------
  // Pagination
  // ------------------------------------------

  const currentPage = Math.max(
    Number(page) || 1,
    1
  );

  const perPage = Math.min(
    Math.max(
      Number(limit) || 20,
      1
    ),
    100
  );

  const total = tasks.length;

  const skip =
    (currentPage - 1) *
    perPage;

  tasks = tasks.slice(
    skip,
    skip + perPage
  );

  return {
    tasks,

    pagination: {
      page: currentPage,
      limit: perPage,
      total,
      totalPages: Math.ceil(
        total / perPage
      ),
    },
  };
};

// ==========================================
// Get Single Task
// ==========================================

const getTaskById = async (
  userId,
  taskId
) => {
  const task = await Task.findOne({
    _id: taskId,
    userId,
  }).populate(
    "customerId",
    "name phone"
  );

  if (!task) {
    throw new AppError(
      "Task not found",
      404
    );
  }

  return task;
};

// ==========================================
// Update Task
// ==========================================

const updateTask = async (
  userId,
  taskId,
  taskData
) => {
  const task = await Task.findOne({
    _id: taskId,
    userId,
  });

  if (!task) {
    throw new AppError(
      "Task not found",
      404
    );
  }

  // Completed tasks cannot be modified.
  if (
    task.status === "completed"
  ) {
    throw new AppError(
      "Completed tasks cannot be modified",
      400
    );
  }

  // Cancelled tasks cannot be modified.
  if (
    task.status === "cancelled"
  ) {
    throw new AppError(
      "Cancelled tasks cannot be modified",
      400
    );
  }

  // If changing the customer,
  // make sure the new customer belongs
  // to the authenticated user.
  if (taskData.customerId) {
    const customer =
      await Customer.findOne({
        _id: taskData.customerId,
        userId,
      });

    if (!customer) {
      throw new AppError(
        "Customer not found",
        404
      );
    }
  }

  Object.assign(
    task,
    taskData
  );

  await task.save();

  return task;
};

// ==========================================
// Delete Task
// ==========================================

const deleteTask = async (
  userId,
  taskId
) => {
  const task =
    await Task.findOneAndDelete({
      _id: taskId,
      userId,
    });

  if (!task) {
    throw new AppError(
      "Task not found",
      404
    );
  }

  // Remove scheduled reminders
  // associated with this task.
  await Reminder.deleteMany({
    taskId: task._id,
    userId,
    status: "scheduled",
  });

  return task;
};

// ==========================================
// Start Task
// ==========================================

const startTask = async (
  userId,
  taskId
) => {
  const task = await Task.findOne({
    _id: taskId,
    userId,
  });

  if (!task) {
    throw new AppError(
      "Task not found",
      404
    );
  }

  if (
    task.status !== "pending"
  ) {
    throw new AppError(
      `Task cannot be started while it is ${task.status}`,
      400
    );
  }

  task.status = "in_progress";

  await task.save();

  return task;
};

// ==========================================
// Complete Task
// ==========================================

const completeTask = async (
  userId,
  taskId
) => {
  const task = await Task.findOne({
    _id: taskId,
    userId,
  });

  if (!task) {
    throw new AppError(
      "Task not found",
      404
    );
  }

  if (
    task.status === "completed"
  ) {
    throw new AppError(
      "Task is already completed",
      400
    );
  }

  if (
    task.status === "cancelled"
  ) {
    throw new AppError(
      "Cancelled tasks cannot be completed",
      400
    );
  }

  task.status = "completed";
  task.completedAt = new Date();

  await task.save();

  // Cancel any scheduled reminders.
  await Reminder.updateMany(
    {
      taskId: task._id,
      userId,
      status: "scheduled",
    },
    {
      status: "cancelled",
    }
  );

  return task;
};

// ==========================================
// Cancel Task
// ==========================================

const cancelTask = async (
  userId,
  taskId
) => {
  const task = await Task.findOne({
    _id: taskId,
    userId,
  });

  if (!task) {
    throw new AppError(
      "Task not found",
      404
    );
  }

  if (
    task.status === "completed"
  ) {
    throw new AppError(
      "Completed tasks cannot be cancelled",
      400
    );
  }

  if (
    task.status === "cancelled"
  ) {
    throw new AppError(
      "Task is already cancelled",
      400
    );
  }

  task.status = "cancelled";

  await task.save();

  // Cancel any scheduled reminders.
  await Reminder.updateMany(
    {
      taskId: task._id,
      userId,
      status: "scheduled",
    },
    {
      status: "cancelled",
    }
  );

  return task;
};

// ==========================================
// Exports
// ==========================================

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  startTask,
  completeTask,
  cancelTask,
};