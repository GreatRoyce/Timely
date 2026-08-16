const AppError = require("../../utils/AppError");
const Task = require("./task.model");
const Customer = require("../customers/customer.model");

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

const getTasks = async (userId, filters = {}) => {
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

  // Status filter
  if (status) {
    query.status = status;
  }

  // Priority filter
  if (priority) {
    query.priority = priority;
  }

  // Search by task title
  if (search) {
    query.title = {
      $regex: search,
      $options: "i",
    };
  }

  // Date filters
  const now = new Date();

  if (due === "today") {
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    query.dueDate = {
      $gte: startOfDay,
      $lte: endOfDay,
    };
  }

  if (due === "upcoming") {
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    query.dueDate = {
      $gte: startOfDay,
    };

    query.status = {
      $nin: ["completed", "cancelled"],
    };
  }

  if (due === "overdue") {
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    query.dueDate = {
      $lt: startOfToday,
    };

    query.status = {
      $nin: ["completed", "cancelled"],
    };
  }

  // Pagination
  const currentPage = Math.max(
    Number(page) || 1,
    1
  );

  const perPage = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  const skip =
    (currentPage - 1) * perPage;

  const [tasks, total] = await Promise.all([
    Task.find(query)
      .populate(
        "customerId",
        "name phone"
      )
      .sort({
        dueDate: 1,
        dueTime: 1,
      })
      .skip(skip)
      .limit(perPage),

    Task.countDocuments(query),
  ]);

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
  }).populate("customerId", "name phone");

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

  Object.assign(task, taskData);

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

  task.status = "completed";
  task.completedAt = new Date();

  await task.save();

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
  completeTask,
};