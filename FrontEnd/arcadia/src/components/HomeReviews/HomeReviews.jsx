import { useEffect, useState, useRef } from "react";
import { reviewService } from "../../services/reviewApi";
import ReviewCard from "../ReviewCard/ReviewCard";
import styles from "./HomeReviews.module.css";
import { toast } from "react-toastify";

export default function HomeReviews() {
  const [reviews, setReviews] = useState([]);
  const scrollRef = useRef(null);

  // função para carregar as reviews
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

  // funções para os botões de scroll
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
        {/* de novo um map para carregar os dados, porém dessa vez puxa as reviews que tem salva no backend*/}
        {reviews.map((review) => (
          <div key={review.id} className={styles.reviewWrapper}>
            <ReviewCard // componente do card da review
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
