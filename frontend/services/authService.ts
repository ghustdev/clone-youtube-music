import { api } from "./api";

export type AuthUser = {
  name?: string;
  isAdmin?: boolean;
  [key: string]: unknown;
};

const TOKEN_KEY = "@YTMusic:token";
const USER_KEY = "@YTMusic:user";
const AUTH_CHANGE_EVENT = "auth-change";

const readStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;

  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
};

const notifyAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post("/api/auth/login", { email, password });

    const { accessToken, user } = response.data;

    if (accessToken) {
      localStorage.setItem(TOKEN_KEY, accessToken);

      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        if (user.name) {
          localStorage.setItem("@YTMusic:nome", user.name);
        }
      }

      // Dispara um "alarme" avisando as outras telas que o usuário logou
      notifyAuthChange();
    }

    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await api.post("/api/auth/register", {
      name,
      email,
      password,
    });

    return response.data;
  },

  logout: () => {
    // Limpa tudo
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("@YTMusic:nome");
    localStorage.removeItem(USER_KEY);

    // Dispara o alarme de logout
    notifyAuthChange();

    window.location.href = "/auth";
  },

  isAuthenticated: () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(TOKEN_KEY);
  },

  getAuthSnapshot: () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(TOKEN_KEY);
  },

  getUserSnapshot: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(USER_KEY);
  },

  isAdmin: () => {
    const user = readStoredUser();
    return !!user?.isAdmin;
  },

  getAdminSnapshot: () => {
    if (typeof window === "undefined") return false;
    const rawUser = localStorage.getItem(USER_KEY);

    if (!rawUser) return false;

    try {
      const user = JSON.parse(rawUser) as AuthUser;
      return !!user?.isAdmin;
    } catch {
      return false;
    }
  },

  getCurrentUser: () => {
    return readStoredUser();
  },

  subscribeAuthChanges: (callback: () => void) => {
    window.addEventListener(AUTH_CHANGE_EVENT, callback);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, callback);
    };
  },
};
