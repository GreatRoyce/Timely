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

const getTasks = async (userId) => {
  const tasks = await Task.find({
    userId,
  })
    .populate("customerId", "name phone")
    .sort({
      dueDate: 1,
      dueTime: 1,
    });

  return tasks;
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