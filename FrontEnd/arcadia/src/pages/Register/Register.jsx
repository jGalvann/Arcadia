import styles from "./Register.module.css";
import ghostimage from "../../assets/Images/ghostimage.jpg";
import Navbar01 from "../../components/Navbar01/Navbar01";
import { useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        username,
        email,
        password,
      });

      toast.success("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch {
      toast.error("E-mail já cadastrado, ou inválido!");
      toast.warn("Tente novamente com outro e-mail.");
    }
  }

  const s = styles;
  return (
    <div>
      <nav className={s.navbar}>
        <Navbar01 />
      </nav>
      <div className={s.container}>
        <div className={s.containerdados}>
          <h1>Arcadia</h1>
          <p>Crie sua conta</p>

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