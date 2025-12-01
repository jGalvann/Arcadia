import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getCurrentUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const decoded = jwtDecode(token);

  return {
    id: decoded.id,
    nickname: decoded.nickname,
    email: decoded.sub,    // normalmente o email vem no campo "sub"
    role: decoded.role,
  };
}

export async function getUserById(id) {
  const response = await api.get(`/users/${id}`); // sua rota pode ser diferente
  return response.data;
}

export default api;
// teste