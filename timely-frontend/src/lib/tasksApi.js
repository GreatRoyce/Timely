import api from "./api";

export const getTasks = async (params = {}) => {
  const response = await api.get("/tasks", { params });
  return response.data.data;
};

export const getTask = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data.data.task;
};

export const createTask = async (payload) => {
  const response = await api.post("/tasks", payload);
  return response.data.data.task;
};

export const updateTask = async (taskId, payload) => {
  const response = await api.patch(`/tasks/${taskId}`, payload);
  return response.data.data.task;
};

export const deleteTask = async (taskId) => {
  await api.delete(`/tasks/${taskId}`);
};

export const startTask = async (taskId) => {
  const response = await api.patch(`/tasks/${taskId}/start`);
  return response.data.data.task;
};

export const completeTask = async (taskId) => {
  const response = await api.patch(`/tasks/${taskId}/complete`);
  return response.data.data.task;
};

export const cancelTask = async (taskId) => {
  const response = await api.patch(`/tasks/${taskId}/cancel`);
  return response.data.data.task;
};
