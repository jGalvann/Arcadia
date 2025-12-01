import { useEffect, useState } from "react";
import Navbar02 from "../../components/Navbar02/Navbar02";
import styles from "./Reviews.module.css";
import { reviewService } from "../../services/reviewApi";
import { toast } from "react-toastify";
import ReviewCard from "../../components/ReviewCard/ReviewCard";
import { getCurrentUserFromToken } from "../../services/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  const currentUser = getCurrentUserFromToken();

  async function loadReviews() {
    try {
      const data = await reviewService.getAllReviews();
      setReviews(data);
    } catch {
      toast.error("Erro ao carregar reviews.");
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <div className={styles.container}>
      <Navbar02/>
      <h1 className={styles.title}>TODAS AS REVIEWS</h1>

      {reviews.length === 0 ? (
        <p className={styles.empty}>Nenhuma review encontrada.</p>
      ) : (
        <div className={styles.gridReviews}>
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUser={currentUser}
              onRefresh={loadReviews} // recarrega após like/dislike/editar/excluir
              
            />
          ))}
        </div>
      )}
    </div>
  );
}
