import styles from "./Register.module.css";
import ghostimage from "../../assets/Images/ghostimage.jpg";
import Navbar01 from "../../components/Navbar01/Navbar01";
import { useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

/**
 * Página de Registro (Cadastro de Usuário)
 * permite que novos usuários criem uma conta no sistema
 */
export default function Register() {
  // estados responsáveis por armazenar o input digitado pelo usuário
  const [username, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // hook para navegação

  /**
   * handleRegister
   * executa quando o formulário é enviado. Realiza requisição ao backend
   * para cadastro de um novo usuário.
   */
  async function handleRegister(e) {
    e.preventDefault(); // impede que a página recarregue

    try {
      // envia os dados preenchidos para o backend
      await api.post("/auth/register", {
        username,
        email,
        password,
      });

      // se der certo, avisa o usuário e redireciona para login
      toast.success("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch {
      // em caso de erro, avisa o usuário
      toast.error("E-mail já cadastrado, ou inválido!");
      toast.warn("Tente novamente com outro e-mail.");
    }
  }

  const s = styles; // atalho para facilitar o uso das classes CSS

  return (
    <div>
      <nav className={s.navbar}>
        <Navbar01 />
      </nav>

      <div className={s.container}>
        <div className={s.containerdados}>
          <h1>Arcadia</h1>
          <p>Crie sua conta</p>

          {/* formulário de cadastro */}
          <form onSubmit={handleRegister} className={s.campospreencher}>
            <input
              type="text"
              placeholder="Nome Completo"
              value={username}
              onChange={(e) => setNome(e.target.value)}
            />

            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Criar Conta</button>
          </form>
        </div>

        <div className={s.containerimg}>
          <img src={ghostimage} alt="Imagem de fundo" />
        </div>
      </div>
    </div>
  );
}
