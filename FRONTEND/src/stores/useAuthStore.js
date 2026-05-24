import { create } from "zustand";
import { apiFetch, getUser } from "../utils/api";

const initialUser = getUser() || null;

const useAuthStore = create((set, get) => ({
  user: initialUser,
  loading: false,
  error: null,

  isAuthenticated: () => !!(get().user),

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      // expect { token, user }
      if (data?.token) localStorage.setItem("eco_token", data.token);
      if (data?.user) localStorage.setItem("eco_user", JSON.stringify(data.user));
      set({ user: data.user || null });
      return data.user;
    } catch (e) { set({ error: e.message }); throw e; }
    finally { set({ loading: false }); }
  },

  logout: () => {
    localStorage.removeItem("eco_token");
    localStorage.removeItem("eco_user");
    set({ user: null });
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch("/auth/register", { method: "POST", body: JSON.stringify(payload) });
      return data;
    } catch (e) { set({ error: e.message }); throw e; }
    finally { set({ loading: false }); }
  },

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const user = await apiFetch("/auth/me");
      if (user) { localStorage.setItem("eco_user", JSON.stringify(user)); set({ user }); }
      return user;
    } catch (e) { set({ error: e.message }); throw e; }
    finally { set({ loading: false }); }
  }
}));

export default useAuthStore;
