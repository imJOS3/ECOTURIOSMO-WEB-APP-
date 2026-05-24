import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const getToken = () => localStorage.getItem("eco_token");

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("eco_user"));
  } catch {
    return null;
  }
};

export const api = axios.create({
  baseURL: API,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const extractMessage = (error) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.error) return error.response.data.error;
  return error?.message || "Error en la solicitud";
};

export const apiFetch = async (path, opts = {}) => {
  const { method = "GET", body, params, headers = {}, responseType } = opts;
  const hasFormData = typeof FormData !== "undefined" && body instanceof FormData;

  try {
    const response = await api.request({
      url: path,
      method,
      params,
      data: body,
      responseType,
      headers: {
        ...headers,
        ...(hasFormData ? {} : { "Content-Type": "application/json" }),
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(extractMessage(error), { cause: error });
  }
};

export const apiUpload = async (path, formData, opts = {}) => apiFetch(path, {
  method: "POST",
  body: formData,
  ...opts,
});