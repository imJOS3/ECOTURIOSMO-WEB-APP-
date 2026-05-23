const API = "http://localhost:3000/api";

export const getToken = () => localStorage.getItem("eco_token");
export const getUser = () => {
  try { return JSON.parse(localStorage.getItem("eco_user")); }
  catch { return null; }
};

export const apiFetch = async (path, opts = {}) => {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Error en la solicitud");
  return data;
};