import styles from "./Profile.module.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Navbar02 from "../../components/Navbar02/Navbar02";
import { useEffect, useState } from "react";
import { reviewService } from "../../services/reviewApi";
import { toast } from "react-toastify";
import { getCurrentUserFromToken } from "../../services/api";
import ReviewCard from "../../components/ReviewCard/ReviewCard";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = getCurrentUserFromToken();
    if (!data) {
      toast.error("Usuário não autenticado!");
      navigate("/login");
      return;
    }
    setUser(data);
  }, []);

  async function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Você saiu da conta!");
    navigate("/login"); // redireciona para a tela de login
  }

  async function loadReviews() {
    if (!user) return;
    try {
      const data = await reviewService.getReviewsByUser(user.id);
      setReviews(data);
    } catch {
      toast.error("Erro ao carregar suas reviews.");
    }
  }

  useEffect(() => {
    loadReviews();
  }, [user]);

  return (
    <div className={styles.container}>
      <Navbar02 />

      <div className={styles.content}>
        {/* ───────── PERFIL ───────── */}
        <div className={styles.profileSection}>
          <div className={styles.avatarWrapper}>
            <AccountCircleIcon style={{ fontSize: "12rem", color: "#ccc" }} />
          </div>

          <div className={styles.infoBox}>
            {user?.nickname ?? "Carregando nome..."}
          </div>

          <div className={styles.infoBox}>
            {user?.email ?? "Carregando e-mail..."}
          </div>

          {/* ───────── BOTÃO DE SAIR ───────── */}
          <button className={styles.logoutBtn} onClick={logout}>
            Sair da Conta
          </button>
        </div>

        {/* ───────── REVIEWS ───────── */}
        <div className={styles.reviewsSection}>
          <h2 className={styles.title}>Suas Reviews</h2>

          {reviews.length === 0 ? (
            <div className={styles.reviewBox}>
              <p className={styles.placeholderText}>
                Você ainda não possui nenhuma review.
              </p>
            </div>
          ) : (
            <div className={styles.reviewList}>
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  currentUser={user}
                  onRefresh={loadReviews}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
