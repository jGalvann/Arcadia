import styles from "./BtnReview.module.css";
import ModalReview from "../ModalReview/ModalReview";
import { useState } from "react";

export default function BtnReview({ gameId }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={styles.btnReview}>
        Faça sua Review
      </button>

      <ModalReview
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        gameId={gameId}
      />
    </>
  );
}
