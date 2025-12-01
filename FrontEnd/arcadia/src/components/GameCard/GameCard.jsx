import styles from "../GameCard/GameCard.module.css";
import GameModal from "../ModalGame/ModalGame";
import BtnReview from "../Buttons/BtnReview"; // botão para criar review

import { useState } from "react";
import { getGameDetails } from "../../services/rawgApi"; // busca detalhes completos do RAWG
import { addToWishlist } from "../../services/wishlistApi"; // adicionar jogo na wishlist

import { toast } from "react-toastify";

export default function GameCard({ game }) {
  const [modalOpen, setModalOpen] = useState(false); // controla o modal de detalhes do jogo
  const [detalhes, setDetalhes] = useState(null); // detalhes do jogo via RAWG
  const [loading, setLoading] = useState(false); // controla o loading da descrição

  // se por algum motivo o componente for renderizado sem game, não exibe nada
  if (!game) return null;

  // handler que adiciona o jogo a wishlist
  async function handleAddWishlist(e) {
    e.stopPropagation(); // evita abrir o modal ao clicar no botão
    try {
      await addToWishlist(game.id);
      toast.success("Jogo adicionado à wishlist!");
    } catch (error) {
      // backend retorna 409 se o jogo já estiver na lista
      if (error.response?.status === 409) {
        toast.warning("Este jogo já está na sua wishlist.");
      } else {
        toast.error("Erro ao adicionar o jogo à wishlist.");
      }
    }
  }

  // executado quando o usuário clica no card
  // abre o modal e busca informações do jogo com os detalhes
  const handleCardClick = async () => {
    setModalOpen(true);
    setDetalhes(null); // limpa dados anteriores, caso tenha algum salvo
    setLoading(true);

    try {
      if (game?.id) {
        const data = await getGameDetails(game.id); // busca detalhes do RAWG e outras infos
        setDetalhes(data);
      }
    } catch {
      toast.error("Erro ao carregar informações do jogo.");
    } finally {
      setLoading(false); // desativa o loading depois da tentativa de busca
    }
  };

  // fecha o modal sem propagação, impede de fechar ao clicar dentro do modal
  const handleCloseModal = (e) => {
    e.stopPropagation();
    setModalOpen(false);
  };

  return (
    <>
      {/* CARD DO JOGO */}
      <div className={styles.card} onClick={handleCardClick}>
        <div
          /* Imagem de capa do jogo com redução tamanho */
          className={styles.bg}
          style={{
            backgroundImage: game.background_image
              ? `url(${game.background_image.replace(
                  "/media/",
                  "/media/resize/640/-/" // aqui eu peço para a api do RAWG uma imagem com largura 640px, podia pedir 320, 640, 1280..., mas 640px é o meio termo, nem tão leve nem tão pesado
                )})`
              : "none",
          }}
        ></div>

        {/* Camada de overlay escura */}
        <div className={styles.overlay}></div>

        {/* Nome do jogo */}
        <div className={styles.content}>
          <p className={styles.nome}>{game.name}</p>
        </div>
      </div>

      {/* Modal com detalhes do jogo */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()} // mesma coisa de antes, evita fechar ao clicar dentro do modal
          >
            {/* CABEÇALHO DO MODAL */}
            <div>
              {/* Imagem maior do jogo */}
              {game.background_image && (
                <img
                  src={game.background_image}
                  alt={game.name}
                  className={styles.modalImage}
                />
              )}

              {/* Título + botão wishlist */}
              <div className={styles.header}>
                <span className={styles.fake}></span>
                <h2 className={styles.modalh2}>{game.name}</h2>

                {/* Botão pra adicionar a Wishlist */}
                <button
                  className={styles.wishlistButton}
                  onClick={handleAddWishlist}
                >
                  Adicionar à Wishlist
                </button>
              </div>

              <div className={styles.ou}>ou</div>

              {/* Botão que abre modal para fazer a Review */}
              <div className={styles.makeReview}>
                <BtnReview gameId={game.id} />
              </div>
            </div>

            {/* Corpo do Modal - aqui é a descrição do jogo*/}
            <div className={styles.modalBody}>
              {loading ? (
                <p className={styles.loadingText}>Carregando informações...</p>
              ) : (
                <p className={styles.description}>
                {/* Caso o RAWG não retorne descrição */}
                  {detalhes?.description_raw ||
                    "Nenhuma descrição disponível para este jogo."}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Componente que envolve modal */}
      <GameModal
        game={game}
        gameId={game.id}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
