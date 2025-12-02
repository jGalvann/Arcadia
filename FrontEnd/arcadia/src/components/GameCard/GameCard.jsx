import styles from "../GameCard/GameCard.module.css";
import GameModal from "../ModalGame/ModalGame";

import { useState } from "react";

export default function GameCard({ game }) {
  const [modalOpen, setModalOpen] = useState(false);

  // impede a renderização caso não exista o objeto game
  if (!game) return null;

  // abre o modal
  const handleCardClick = () => {
    setModalOpen(true);
  };

  return (
    <>
      {/* CARD DO JOGO */}
      <div className={styles.card} onClick={handleCardClick}>
        <div
          className={styles.bg}
          style={{
            backgroundImage: game.background_image
              ? `url(${game.background_image.replace(
                  "/media/",
                  "/media/resize/640/-/" // aqui eu peço para a imagem ser redimensionada pois se não fica muito grande e pesada
                )})`
              : "none",
          }}
        ></div>

        {/* overlay */}
        <div className={styles.overlay}></div>

        {/* nome do jogo */}
        <div className={styles.content}>
          <p className={styles.nome}>{game.name}</p>
        </div>
      </div>

      {/* MODAL */}
      <GameModal
        game={game}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
