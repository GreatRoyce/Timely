import { useCallback, useEffect, useMemo, useState } from "react";
import AuthContext from "./auth-context";

const DEFAULT_USERS = [
  {
    email: "demo@timely.com",
    password: "password123",
    fullName: "Timely Demo",
    businessName: "Timely Co",
  },
];

const STORAGE_KEY = "timely-auth-users";
const AUTH_USER_KEY = "timely-auth-current-user";

const loadPersistedUsers = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_USERS;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
};

const saveUsers = (users) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
};

const loadCurrentUser = () => {
  try {
    const stored = window.localStorage.getItem(AUTH_USER_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

const saveCurrentUser = (user) => {
  try {
    if (!user) {
      window.localStorage.removeItem(AUTH_USER_KEY);
      return;
    }
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
};

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(loadPersistedUsers);
  const [user, setUser] = useState(loadCurrentUser);
  const isAuthenticated = Boolean(user);

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    saveCurrentUser(user);
  }, [user]);

  const login = useCallback(({ email, password }) => {
    if (!email || !password) {
      return { success: false, error: "Please provide email and password." };
    }

    const matchedUser = users.find(
      (existing) => existing.email.toLowerCase() === email.toLowerCase(),
    );
    if (!matchedUser || matchedUser.password !== password) {
      return { success: false, error: "Invalid email or password." };
    }

    setUser({
      email: matchedUser.email,
      fullName: matchedUser.fullName,
      businessName: matchedUser.businessName,
    });
    return { success: true };
  }, [users]);

  const register = useCallback(({
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

    const emailExists = users.some(
      (existing) => existing.email.toLowerCase() === email.toLowerCase(),
    );
    if (emailExists) {
      return {
        success: false,
        error: "An account already exists with this email.",
      };
    }

    const newUser = { email, password, fullName, businessName };
    setUsers((currentUsers) => [...currentUsers, newUser]);
    setUser({ email, fullName, businessName });
    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
    saveCurrentUser(null);
  }, []);

  const value = useMemo(
    () => ({ users, user, isAuthenticated, login, register, logout }),
    [users, user, isAuthenticated, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
