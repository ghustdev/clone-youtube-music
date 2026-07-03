import { api } from "./api";

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post("/api/auth/login", { email, password });

    const { accessToken, user } = response.data;

    if (accessToken) {
      localStorage.setItem("@YTMusic:token", accessToken);

      // Salva o nome do usuário se existir
      if (user && user.name) {
        localStorage.setItem("@YTMusic:nome", user.name);
      }

      // Dispara um "alarme" avisando as outras telas que o usuário logou
      window.dispatchEvent(new Event("auth-change"));
    }

    return response.data;
  },

  logout: () => {
    // Limpa tudo
    localStorage.removeItem("@YTMusic:token");
    localStorage.removeItem("@YTMusic:nome");

    // Dispara o alarme de logout
    window.dispatchEvent(new Event("auth-change"));

    window.location.href = "/";
  },

  isAutenticado: () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("@YTMusic:token");
  },
};
