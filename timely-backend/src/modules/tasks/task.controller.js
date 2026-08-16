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
  completeTask,
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
  const tasks = await getTasks(
    req.user.userId
  );

  res.status(200).json({
    success: true,
    data: {
      tasks,
    },
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
// Complete Task
// ==========================================

const complete = asyncHandler(async (req, res) => {
  const task = await completeTask(
    req.user.userId,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Task marked as completed",
    data: {
      task,
    },
  });
});

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove,
  complete,
};