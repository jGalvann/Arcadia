import { useEffect, useState, useRef } from "react";
import { reviewService } from "../../services/reviewApi";
import ReviewCard from "../ReviewCard/ReviewCard";
import styles from "./HomeReviews.module.css";
import { toast } from "react-toastify";

export default function HomeReviews() {
  const [reviews, setReviews] = useState([]);
  const scrollRef = useRef(null);

  async function carregarReviews() {
    try {
      const data = await reviewService.getAllReviews();
      setReviews(data);
    } catch {
      toast.error("Erro ao carregar reviews.");
    }
  }

  useEffect(() => {
    carregarReviews();
  }, []);

  function left() {
    scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
  }

  function right() {
    scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
  }

  // usuário atual (caso tenha login)
  const currentUser = JSON.parse(localStorage.getItem("user"));

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>AVALIAÇÕES DOS USUÁRIOS</h2>

      <div className={styles.reviews} ref={scrollRef}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.reviewWrapper}>
            <ReviewCard
              review={review}
              currentUser={currentUser}
              onRefresh={carregarReviews}
            />
          </div>
        ))}
      </div>

      <div className={styles.botoesscroll}>
        <button className={styles.arrow} onClick={left}>❮</button>
        <button className={styles.arrow} onClick={right}>❯</button>
      </div>
    </div>
  );
}
