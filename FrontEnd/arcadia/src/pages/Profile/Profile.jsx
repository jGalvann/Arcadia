import styles from "./Profile.module.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // avatar padrão
import Navbar02 from "../../components/Navbar02/Navbar02";
import { useEffect, useState } from "react";
import { reviewService } from "../../services/reviewApi"; // serviços relacionados as reviews
import { toast } from "react-toastify";
import { getCurrentUserFromToken } from "../../services/api"; // obtém dados do usuário autenticado
import { useNavigate } from "react-router-dom";
import ReviewCard from "../../components/ReviewCard/ReviewCard"; // componente que exibe uma review

/**
 * Página Profile
 * exibe informações do usuário logado e todas as reviews feitas por ele
 */
export default function Profile() {
  // armazena os dados do usuário autenticado
  const [user, setUser] = useState(null);

  // lista de reviews DO usuário
  const [reviews, setReviews] = useState([]);

  // redirecionamento de rotas
  const navigate = useNavigate();

  /**
   * Verifica se existe usuário autenticado via token armazenado
   * Caso não exista, redireciona para login
   */
  useEffect(() => {
    const data = getCurrentUserFromToken(); // tenta extrair dados do token
    if (!data) {
      toast.error("Usuário não autenticado!");
      navigate("/login"); // força login
      return;
    }

    setUser(data); // salva dados do usuário
  }, []);

  /**
   * Função de logout:
   * remove dados do usuário do localStorage e redireciona para login
   */
  async function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // caso tenha armazenado usuário

    toast.success("Você saiu da conta!");
    navigate("/login"); // redireciona para a tela de login
  }

  // carrega as reviews feitas pelo usuário
  async function loadReviews() {
    if (!user) return; // evita chamada sem usuário pronto
    try {
      const data = await reviewService.getReviewsByUser(user.id);
      setReviews(data); // atualiza lista de reviews
    } catch {
      toast.error("Erro ao carregar suas reviews.");
    }
  }

  // carrega as reviews sempre que o usuário for definido
  useEffect(() => {
    loadReviews();
  }, [user]);

  return (
    <div className={styles.container}>
      <Navbar02 />

      <div className={styles.content}>
        {/* PERFIL */}
        <div className={styles.profileSection}>
          {/* avatar do usuário */}
          <div className={styles.avatarWrapper}>
            <AccountCircleIcon style={{ fontSize: "12rem", color: "#ccc" }} />
          </div>

          {/* nickname do usuário */}
          <div className={styles.infoBox}>
            {user?.nickname ?? "Carregando nome..."}
          </div>

          {/* e-mail do usuário */}
          <div className={styles.infoBox}>
            {user?.email ?? "Carregando e-mail..."}
          </div>

          {/* BOTÃO DE SAIR */}
          <button className={styles.logoutBtn} onClick={logout}>
            Sair da Conta
          </button>
        </div>

        {/* REVIEWS */}
        <div className={styles.reviewsSection}>
          <h2 className={styles.title}>Suas Reviews</h2>

          {/* se o usuário ainda não tem reviews */}
          {reviews.length === 0 ? (
            <div className={styles.reviewBox}>
              <p className={styles.placeholderText}>
                Você ainda não possui nenhuma review.
              </p>
            </div>
          ) : (
            // renderiza cada review usando o componente ReviewCard
            <div className={styles.reviewList}>
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id} // chave única para cada review
                  review={review} // dados da review
                  currentUser={user} // passa dados do usuário atual para validar a edição/exclusão
                  onRefresh={loadReviews} // função para recarregar reviews após edição/exclusão
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
