import { useCallback, useEffect, useMemo, useState } from "react";
import AuthContext from "./auth-context";
import {
  AUTH_EXPIRED_EVENT,
  AUTH_USER_KEY,
  clearStoredSession,
  getAccessToken,
} from "../lib/api";
import { loginAccount, logoutAccount, registerAccount } from "../lib/authApi";
import { getApiErrorMessage } from "../lib/apiError";

const loadCurrentUser = () => {
  try {
    const stored = window.localStorage.getItem(AUTH_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const saveCurrentUser = (user) => {
  if (user) {
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(AUTH_USER_KEY);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadCurrentUser);
  const isAuthenticated = Boolean(user && getAccessToken());

  useEffect(() => {
    saveCurrentUser(user);
  }, [user]);

  useEffect(() => {
    const handleExpiredSession = () => setUser(null);
    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpiredSession);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpiredSession);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    if (!email || !password) {
      return { success: false, error: "Please provide email and password." };
    }

    try {
      const authenticatedUser = await loginAccount({ email, password });
      setUser(authenticatedUser);
      return { success: true, user: authenticatedUser };
    } catch (error) {
      return {
        success: false,
        error: getApiErrorMessage(error, "Unable to sign in."),
      };
    }
  }, []);

  const register = useCallback(async ({
    businessName,
    fullName,
    email,
    password,
    confirmPassword,
  }) => {
    if (!businessName || !fullName || !email || !password || !confirmPassword) {
      return { success: false, error: "Please fill in all fields." };
    }

    if (password !== confirmPassword) {
      return { success: false, error: "Passwords do not match." };
    }

    try {
      await registerAccount({
        businessName,
        ownerName: fullName,
        email,
        password,
        confirmPassword,
      });

      const authenticatedUser = await loginAccount({ email, password });
      setUser(authenticatedUser);
      return { success: true, user: authenticatedUser };
    } catch (error) {
      return {
        success: false,
        error: getApiErrorMessage(error, "Unable to create your account."),
      };
    }
  }, []);

  const logout = useCallback(async () => {
    const logoutRequest = logoutAccount().catch(() => undefined);
    clearStoredSession();
    setUser(null);
    await logoutRequest;
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated, login, register, logout }),
    [user, isAuthenticated, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
