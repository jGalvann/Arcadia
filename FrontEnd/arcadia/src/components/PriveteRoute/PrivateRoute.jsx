import { Navigate } from "react-router-dom";

/**
 * componente PrivateRoute:
 * ele serve como um "guardião" de rotas privadas
 * só permite acesso a rota caso exista um token no localStorage
 */
export default function PrivateRoute({ children }) {
  // busca o token salvo no navegador
  const token = localStorage.getItem("token"); 

  // se existir token, renderiza os filhos (children) normalmente
  // caso contrário, redireciona o usuário para a página de login
  return token ? children : <Navigate to="/login" />
}