import axios from "axios";

export const ACCESS_TOKEN_KEY = "accessToken";
export const AUTH_USER_KEY = "timely-auth-current-user";
export const AUTH_EXPIRED_EVENT = "timely:auth-expired";

const baseURL = import.meta.env.VITE_API_URL || "/api/v1";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAccessToken = () =>
  window.localStorage.getItem(ACCESS_TOKEN_KEY);

export const setAccessToken = (token) => {
  if (token) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

export const clearStoredSession = () => {
  setAccessToken(null);
  window.localStorage.removeItem(AUTH_USER_KEY);
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshPromise = null;

const isPublicAuthRequest = (url = "") =>
  ["/auth/login", "/auth/register", "/auth/refresh"].some((path) =>
    url.includes(path),
  );

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const shouldRefresh =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isPublicAuthRequest(originalRequest.url);

    if (!shouldRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshPromise ??= refreshClient
        .post("/auth/refresh")
        .then((response) => response.data.data.accessToken)
        .finally(() => {
          refreshPromise = null;
        });

      const accessToken = await refreshPromise;
      setAccessToken(accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearStoredSession();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
      return Promise.reject(refreshError);
    }
  },
);

export default api;
