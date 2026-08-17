const asyncHandler = require("../../utils/asyncHandler");

const {
  createTaskSchema,
  updateTaskSchema,
} = require("./task.validation");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  startTask,
  completeTask,
  cancelTask,
} = require("./task.service");

// ==========================================
// Create Task
// ==========================================

const create = asyncHandler(async (req, res) => {
  const data = createTaskSchema.parse(req.body);

  const task = await createTask(
    req.user.userId,
    data
  );

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: {
      task,
    },
  });
});

// ==========================================
// Get All Tasks
// ==========================================

const getAll = asyncHandler(async (req, res) => {
  const result = await getTasks(
    req.user.userId,
    req.query
  );

  res.status(200).json({
    success: true,
    data: result,
  });
});

// ==========================================
// Get Single Task
// ==========================================

const getOne = asyncHandler(async (req, res) => {
  const task = await getTaskById(
    req.user.userId,
    req.params.id
  );

  res.status(200).json({
    success: true,
    data: {
      task,
    },
  });
});

// ==========================================
// Update Task
// ==========================================

const update = asyncHandler(async (req, res) => {
  const data = updateTaskSchema.parse(req.body);

  const task = await updateTask(
    req.user.userId,
    req.params.id,
    data
  );

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: {
      task,
    },
  });
});

// ==========================================
// Delete Task
// ==========================================

const remove = asyncHandler(async (req, res) => {
  await deleteTask(
    req.user.userId,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});

// ==========================================
// Start Task
// ==========================================

const start = asyncHandler(async (req, res) => {
  const task = await startTask(
    req.user.userId,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Task started successfully",
    data: {
      task,
    },
  });
});

// ==========================================
// Complete Task
// ==========================================

const complete = asyncHandler(async (req, res) => {
  const task = await completeTask(
    req.user.userId,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Task completed successfully",
    data: {
      task,
    },
  });
});

// ==========================================
// Cancel Task
// ==========================================

const cancel = asyncHandler(async (req, res) => {
  const task = await cancelTask(
    req.user.userId,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Task cancelled successfully",
    data: {
      task,
    },
  });
});

// ==========================================
// Exports
// ==========================================

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove,
  start,
  complete,
  cancel,
};