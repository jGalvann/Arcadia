import styles from "./ModalReview.module.css";
import { reviewService } from "../../services/reviewApi";
import { useState } from "react";
import { toast } from "react-toastify";

// componente ModalReview
// recebe três props:
// isOpen: controla se o modal está visível ou não
// onClose: função para fechar o modal
// gameId: ID do jogo que esta review pertence
export default function ModalReview({ isOpen, onClose, gameId }) {

  const [nota, setNota] = useState(""); // nota de 0 a 5
  const [textReview, setTextReview] = useState(""); // texto da review
  const [statusJogo, setStatusJogo] = useState("JOGANDO"); // status do jogo

  // se o modal não estiver aberto, não renderiza nada na tela
  if (!isOpen) return null;

  // função chamada ao clicar no botão "Salvar"
  async function handleSave() {
    try {
      // envia os dados da review para o backend
      await reviewService.createReview({
        gameId: gameId,
        nota: parseFloat(nota), // transforma texto para número
        textReview,
        status: statusJogo,
      });

      // alerta de sucesso
      toast.success("Review salva com sucesso!");

      // fecha o modal depois de salvar
      onClose();
    } catch {
      // alerta de erro
      toast.error("Erro ao salvar a review. Tente novamente.");
    }
  }
  return (
    <>
      {/* Overlay do modal — clicar nele fecha o modal */}
      <div className={styles.reviewOverlay} onClick={onClose}>

        {/* conteúdo central do modal — clicar aqui não fecha o modal */}
        <div
          className={styles.reviewModal}
          onClick={(e) => e.stopPropagation()} // evita que o clique feche o modal
        >
          <h2>Fazer Review</h2>
          {/* seleção do status do jogo */}
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

          {/* campo numérico da nota */}
          <label>Nota (0 a 5):</label>
          <input
            type="number"
            min="0"
            max="5"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          />

          {/* campo de texto para escrever a review */}
          <label>Escreva sua Review:</label>
          <textarea
            value={textReview}
            onChange={(e) => setTextReview(e.target.value)}
          />

          {/* botões de salvar ou cancelar */}
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
