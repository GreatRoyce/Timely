import api from "./api";

export const getCustomers = async () => {
  const response = await api.get("/customers");
  return response.data.data.customers;
};

export const getCustomer = async (customerId) => {
  const response = await api.get(`/customers/${customerId}`);
  return response.data.data.customer;
};

export const createCustomer = async (payload) => {
  const response = await api.post("/customers", payload);
  return response.data.data.customer;
};

export const updateCustomer = async (customerId, payload) => {
  const response = await api.patch(`/customers/${customerId}`, payload);
  return response.data.data.customer;
};

export const deleteCustomer = async (customerId) => {
  await api.delete(`/customers/${customerId}`);
};
