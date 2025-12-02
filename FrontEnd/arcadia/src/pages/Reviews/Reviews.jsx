import Navbar02 from "../../components/Navbar02/Navbar02";
import ReviewCard from "../../components/ReviewCard/ReviewCard";
import styles from "./Reviews.module.css";
import { reviewService } from "../../services/reviewApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getCurrentUserFromToken } from "../../services/api";

/**
 * Página Reviews
 * exibe todas as reviews feitas pelos usuários no sistema
 */
export default function Reviews() {
  // armazena a lista de reviews retornadas da API
  const [reviews, setReviews] = useState([]);

  // usuário atual (caso tenha login)
  const currentUser = getCurrentUserFromToken();

  // função para carregar as reviews cadastradas no sistema
  async function loadReviews() {
    try {
      const data = await reviewService.getAllReviews(); // busca reviews no backend
      setReviews(data); // atualiza estado
    } catch {
      toast.error("Erro ao carregar reviews.");
    }
  }

  /**
   * useEffect executado apenas uma vez
   * Ao montar a página, carrega as reviews iniciais
   */
  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <div className={styles.container}>
      <Navbar02/>
      <h1 className={styles.title}>TODAS AS REVIEWS</h1>

      {/* Se não houver reviews cadastradas */}
      {reviews.length === 0 ? (
        <p className={styles.empty}>Nenhuma review encontrada.</p>
      ) : (
        // grid com todos os cards de review
        <div className={styles.gridReviews}>
          {reviews.map((review) => (
            <ReviewCard
              key={review.id} // chave única
              review={review} // dados da review
              currentUser={currentUser} // dados do usuário atual (para validar edição/exclusão)
              onRefresh={loadReviews} // recarrega após like/dislike/editar/excluir
              
            />
          ))}
        </div>
      )}
    </div>
  );
}
