import styles from "./ModalReview.module.css";
import { reviewService } from "../../services/reviewApi";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ModalReview({ isOpen, onClose, gameId }) {
  const [nota, setNota] = useState("");
  const [textReview, setTextReview] = useState("");
  const [statusJogo, setStatusJogo] = useState("JOGANDO");

  if (!isOpen) return null;

  async function handleSave() {
    try {
      await reviewService.createReview({
        gameId: gameId, // 👈 ADICIONE ESTA LINHA
        nota: parseFloat(nota),
        textReview,
        status: statusJogo,
      });
      toast.success("Review salva com sucesso!");

      onClose();
    } catch {
      toast.error("Erro ao salvar a review. Tente novamente.");
    }
  }
  return (
    <>
      <div className={styles.reviewOverlay} onClick={onClose}>
        <div
          className={styles.reviewModal}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>Fazer Review</h2>
          <label>Status do jogo:</label>
          <select
            className={styles.statusSelect}
            value={statusJogo}
            onChange={(e) => setStatusJogo(e.target.value)}
          >
            <option value="JOGANDO">Jogando</option>
            <option value="ZERADO">Terminado / Zerado</option>
            <option value="ABANDONADO">Abandonado</option>
            <option value="QUERO_JOGAR">Quero jogar</option>
          </select>

          <label>Nota (0 a 5):</label>
          <input
            type="number"
            min="0"
            max="5"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          />

          <label>Escreva sua Review:</label>
          <textarea
            value={textReview}
            onChange={(e) => setTextReview(e.target.value)}
          />

          <div className={styles.reviewBtn}>
            <button className={styles.btnSave} onClick={handleSave}>
              Salvar
            </button>
            <button className={styles.btnCancel} onClick={onClose}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
