import api, { setAccessToken } from "./api";

export const registerAccount = async (payload) => {
  const response = await api.post("/auth/register", payload);
  return response.data.data.user;
};

export const loginAccount = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  const { accessToken, user } = response.data.data;

  setAccessToken(accessToken);
  return user;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data.data.user;
};

export const logoutAccount = async () => {
  await api.post("/auth/logout");
};

export const requestPasswordReset = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async ({ token, password, confirmPassword }) => {
  const response = await api.post("/auth/reset-password", {
    token,
    password,
    confirmPassword,
  });
  return response.data;
};
