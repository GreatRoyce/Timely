import api from "./api";

export const getReminders = async () => {
  const response = await api.get("/reminders");
  return response.data.data.reminders;
};

export const getReminder = async (reminderId) => {
  const response = await api.get(`/reminders/${reminderId}`);
  return response.data.data.reminder;
};

export const createReminder = async (payload) => {
  const response = await api.post("/reminders", payload);
  return response.data.data.reminder;
};

export const updateReminder = async (reminderId, payload) => {
  const response = await api.patch(`/reminders/${reminderId}`, payload);
  return response.data.data.reminder;
};

export const cancelReminder = async (reminderId) => {
  const response = await api.patch(`/reminders/${reminderId}/cancel`);
  return response.data.data.reminder;
};

export const deleteReminder = async (reminderId) => {
  await api.delete(`/reminders/${reminderId}`);
};
