import axios from "axios";
import { jwtDecode } from "jwt-decode"; // biblioteca para decodificar tokens JWT

// cria uma instância do axios com a URL base do backend
const api = axios.create({
  baseURL: "http://localhost:8080", // URL do seu servidor backend
});

/**
 * Interceptor de requisições
 * antes de cada request, verifica se existe um token salvo no localStorage
 * se existir, adiciona o token no cabeçalho Authorization
 * isso autentica requisições protegidas automaticamente
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // busca token do usuário
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // coloca token no header HTTP
  }
  return config;
});

/**
 * getCurrentUserFromToken()
 * lê o token JWT armazenado no navegador e recupera os dados do usuário autenticado
 * retorna informações decodificadas, sem precisar consultar o backend novamente
 */
export function getCurrentUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  // decodifica o token -> contém dados como id, email, role, nickname
  const decoded = jwtDecode(token);

  return {
    id: decoded.id, // id do usuário
    nickname: decoded.nickname, // nickname do usuário
    email: decoded.sub, // email do usuário
    role: decoded.role, // papel do usuário (USER ou ADMIN)
  };
}

/**
 * Busca usuário por ID no backend
 * é útil para pegar informações mais completas
 * que não estão no token (ex: avatar, data de criação, etc.)
 */
export async function getUserById(id) {
  const response = await api.get(`/users/${id}`); // sua rota pode ser diferente
  return response.data;
}

export default api;
