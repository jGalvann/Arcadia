import { useState, useEffect } from "react";
import styles from "./ReviewCard.module.css";
import { reviewService } from "../../services/reviewApi";
import { toast } from "react-toastify";
import { getGameDetails, getGameName } from "../../services/rawgApi";
import GameModal from "../ModalGame/ModalGame";

export default function ReviewCard({ review, currentUser, onRefresh }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [gameInfo, setGameInfo] = useState(null);

  const [nota, setNota] = useState(review.nota);
  const [textReview, setTextReview] = useState(review.textReview);
  const [status, setStatus] = useState(review.status);
  const [gameName, setGameName] = useState("Carregando...");

  const podeEditar =
    currentUser &&
    (currentUser.id === review.userId || currentUser.role === "ADMIN");

  useEffect(() => {
    async function loadName() {
      if (review.gameName) {
        setGameName(review.gameName);
      } else if (review.gameId) {
        try {
          const nome = await getGameName(review.gameId);
          setGameName(nome);
        } catch {
          setGameName("Jogo não encontrado");
        }
      }
    }
    loadName();
  }, [review.gameId, review.gameName]);

  async function handleLike(e) {
    e.stopPropagation();
    try {
      await reviewService.likeReview(review.id);
      onRefresh();
    } catch {
      toast.error("Erro ao curtir review.");
    }
  }

  async function handleDislike(e) {
    e.stopPropagation();
    try {
      await reviewService.dislikeReview(review.id);
      onRefresh();
    } catch {
      toast.error("Erro ao descurtir review.");
    }
  }

  async function handleDelete(e) {
    e.stopPropagation();
    if (!window.confirm("Tem certeza que deseja excluir esta review?")) return;
    try {
      await reviewService.deleteReview(review.id);
      toast.success("Review excluída!");
      onRefresh();
    } catch {
      toast.error("Erro ao excluir review.");
    }
  }

  async function salvarEdicao(e) {
    e.stopPropagation();
    try {
      await reviewService.updateReview(review.id, {
        nota: parseFloat(nota),
        textReview,
        status,
      });

      toast.success("Review atualizada!");
      setIsEditing(false);
      onRefresh();
    } catch {
      toast.error("Erro ao salvar alterações.");
    }
  }

async function openGameModal() {
  try {
    const details = await getGameDetails(review.gameId); // busca o jogo completo no RAWG

    setGameInfo({
      id: review.gameId,
      name: gameName,
      background_image: details.background_image, // AQUI AGORA VEM A IMAGEM!
    });

    setIsGameModalOpen(true);
  } catch (error) {
    console.error("Erro ao carregar imagem do jogo:", error);
    setIsGameModalOpen(true);
  }
}

  return (
    <>
      {/* CARD */}
      <div className={styles.reviewCard} onClick={openGameModal}>
        <div className={styles.reviewHeader}>
          <span className={styles.gameName}>{gameName}</span>
          <span className={styles.stars}>⭐ {review.nota}/5</span>
        </div>

        <p className={styles.reviewText}>{review.textReview}</p>

        {/* LINHA INFERIOR */}
        <div className={styles.footerRow}>
          {podeEditar && (
            <div className={styles.actions}>
              <button
                className={styles.editBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                Editar
              </button>

              <button className={styles.deleteBtn} onClick={handleDelete}>
                Excluir
              </button>
            </div>
          )}

          <div className={styles.likeContainer}>
            <button onClick={handleLike} className={styles.likeBtn}>
              👍 {review.countLike}
            </button>
            <button onClick={handleDislike} className={styles.dislikeBtn}>
              👎 {review.countDislike}
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE EDITAR REVIEW */}
      {isEditing && (
        <div className={styles.modalOverlay} onClick={() => setIsEditing(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Editar Review</h3>

            <label>Nota:</label>
            <input
              type="number"
              min="0"
              max="5"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />

            <label>Texto:</label>
            <textarea
              value={textReview}
              onChange={(e) => setTextReview(e.target.value)}
            />

            <label>Status do Jogo:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="JOGANDO">Jogando</option>
              <option value="ZERADO">Terminado / Zerado</option>
              <option value="ABANDONADO">Abandonei</option>
              <option value="QUERO_JOGAR">Quero Jogar</option>
            </select>

            <div className={styles.modalButtons}>
              <button className={styles.saveBtn} onClick={salvarEdicao}>
                Salvar
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DO JOGO */}
      {isGameModalOpen && gameInfo && (
        <GameModal
          game={gameInfo}
          isOpen={isGameModalOpen}
          onClose={() => setIsGameModalOpen(false)}
        />
      )}
    </>
  );
}
