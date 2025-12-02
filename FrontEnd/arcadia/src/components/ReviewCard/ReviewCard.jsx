import { useState, useEffect } from "react";
import styles from "./ReviewCard.module.css";
import { reviewService } from "../../services/reviewApi";
import { toast } from "react-toastify";
import { getGameDetails, getGameName } from "../../services/rawgApi";
import GameModal from "../ModalGame/ModalGame";

/**
 * ReviewCard
 * exibe uma review feita por um usuário sobre um jogo.
 * da para curtir, descurtir, editar, excluir e abrir modal do jogo.
 *
 * Props:
 * - review: dados da review
 * - currentUser: usuário logado (para permissões)
 * - onRefresh: função para recarregar a lista depois das alterações
 */
export default function ReviewCard({ review, currentUser, onRefresh }) {
  // estado para controlar se está editando a review
  const [isEditing, setIsEditing] = useState(false);

  // estado para controlar se o modal do jogo está aberto
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);

  // estado para guardar informações do jogo
  const [gameInfo, setGameInfo] = useState(null);

  const [nota, setNota] = useState(review.nota);
  const [textReview, setTextReview] = useState(review.textReview);
  const [status, setStatus] = useState(review.status);

  // estado para guardar o nome do jogo
  const [gameName, setGameName] = useState("Carregando...");

  // verifica se o usuário pode editar (autor da review ou admin)
  const podeEditar =
    currentUser &&
    (currentUser.id === review.userId || currentUser.role === "ADMIN");

  /**
   * Carrega o nome do jogo:
   * se já veio salvo na review, usa esse nome
   * caso contrário, busca pela API RAWG usando o gameId
   */
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

  // função para like da review
  async function handleLike(e) {
    e.stopPropagation();
    try {
      await reviewService.likeReview(review.id);
      onRefresh();
    } catch {
      toast.error("Erro ao curtir review.");
    }
  }

  // função para deslike da review
  async function handleDislike(e) {
    e.stopPropagation();
    try {
      await reviewService.dislikeReview(review.id);
      onRefresh();
    } catch {
      toast.error("Erro ao descurtir review.");
    }
  }

  // função para excluir a review
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

  // função para salvar a edição da review
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

  /*
   * ABRIR MODAL DO JOGO
   * busca imagem e infos completas do RAWG
   */  async function openGameModal() {
    try {
      const details = await getGameDetails(review.gameId); // busca o jogo completo no RAWG

      // guarda os dados necessários para o GameModal
      setGameInfo({
        id: review.gameId,
        name: gameName,
        background_image: details.background_image,
      });

      setIsGameModalOpen(true);
    } catch (error) {
      console.error("Erro ao carregar imagem do jogo:", error);
      setIsGameModalOpen(true);
    }
  }

  return (
    <>
      {/* CARD DA REVIEW*/}
      <div className={styles.reviewCard} onClick={openGameModal}>
        <div className={styles.reviewHeader}>
          <span className={styles.gameName}>{gameName}</span>
          <span className={styles.stars}>⭐ {review.nota}/5</span>
        </div>

        <p className={styles.reviewText}>{review.textReview}</p>

        {/* PARTE INFERIOR DO CARD (AÇÕES E LIKES) */}
        <div className={styles.footerRow}>

          {/* AÇÕES DE EDIÇÃO (somente se autorizado) */}
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

          {/* LIKE / DISLIKE */}
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
        <div
          className={styles.modalOverlay}
          onClick={() => setIsEditing(false)}
        >
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
