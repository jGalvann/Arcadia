import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import styles from "./Login.module.css";
import valheim from "../../assets/Images/valheim.jpg";
import Navbar01 from "../../components/Navbar01/Navbar01";

/*
 * Página de Login:
 * permite que o usuário insira email e senha e seja autenticado no sistema.
 */
function Login() {
  //armazenando email e senha digitado pelo usuário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //função para redirecionar o usuario para a HOME, após o login
  const navigate = useNavigate();

  //FUNÇÃO DE LOGIN, responsável por enviar as credenciais ao backend e autenticar o usuário no sistema
  async function handleLogin(e) {
    e.preventDefault(); //aqui impede q a página recarregue toda vez

    try {
      const response = await api.post("/auth/login", {
        //aqui o front faz a requisição para o back no endpoint /auth/login
        email,
        password,
      });

      localStorage.setItem("token", response.data.token); // depois que o back valida, ele gera um token que fica armazenado aqui
      localStorage.setItem("role", response.data.role); // armazeno a ROLE para controle de visualização

      toast.success("Login realizado com sucesso!"); // feedback de sucesso
      navigate("/home"); // caso de certo o usuário vai para a HOME
    } catch {
      toast.error("Email ou senha inválidos!"); // mensagem de erro, caso o login esteja inválido
    }
  }

  return (
    // conteúdo da esquerda - imagem
    <div className={styles.container}>
      <div className={styles.left}>
        <img src={valheim} alt="Imagem de fundo" />
      </div>

      {/* conteúdo da direita - formulário de login */}
      <div className={styles.right}>
        <div className={styles.navbar}>
          <Navbar01 />
        </div>

        <div>
          <h1>Arcadia</h1>
          <p>Faça seu login</p>
        </div>

        {/* formulário de login */}
        <div className={styles.formulario}>
          <form onSubmit={handleLogin}>
            
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
            {/* botão de submit do formulário */}
            <div className={styles.botao}>
              <button type="submit">Entrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Login;
