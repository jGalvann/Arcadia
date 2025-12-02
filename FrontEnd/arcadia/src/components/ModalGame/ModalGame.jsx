import React, { useState, useEffect } from "react";
import styles from "../GameCard/GameCard.module.css";
import { getGameDetails } from "../../services/rawgApi";
import { addToWishlist } from "../../services/wishlistApi";
import { toast } from "react-toastify";
import BtnReview from "../Buttons/BtnReview";

// recebe props: 
// game (dados básicos), isOpen (controle de visibilidade), onClose (função para fechar)
export default function GameModal({ game, isOpen, onClose }) {
  
  // estado para guardar detalhes extras que não vêm na listagem simples
  const [detalhes, setDetalhes] = useState(null);
  // estado para controlar o feedback visual de carregamento
  const [loading, setLoading] = useState(false);

  // useEffect: Ocorre toda vez que o Modal abre (isOpen = true) ou o jogo muda.
  useEffect(() => {
    // só executa a busca se o modal estiver aberto e houver um ID de jogo válido
    if (isOpen && game?.id) {
      const fetchDetails = async () => {
        setLoading(true); // inicia o texto de carregamento
        setDetalhes(null); // limpa detalhes anteriores para não mostrar dados do jogo errado
        
        try {
          // busca dados na API do RAWG (descrição, etc.)
          const data = await getGameDetails(game.id);
          setDetalhes(data);
        } catch (error) {
          console.error("Erro ao carregar detalhes:", error);
        } finally {
          setLoading(false); // finaliza o carregamento independente de sucesso ou erro
        }
      };
      fetchDetails();
    }
  }, [isOpen, game]);

  // função para adicionar aos favoritos no Backend
  async function handleAddWishlist() {
    try {
      await addToWishlist(game.id);
      // alerta de sucesso
      toast.success("Jogo adicionado à wishlist!");
    } catch (error) {
      // tratamento específico: Erro 409 = já está na wishlist
      if (error.response?.status === 409) {
        toast.error("Este jogo já está na sua wishlist!");
      } else {
        // alerta genérico de erro
        toast.error("Erro ao adicionar o jogo à wishlist!");
      }
    }
  }

  // se o modal estiver fechado ou não houver dados do jogo, não renderiza nada
  if (!isOpen || !game) return null;

  return (
    // overlay: O fundo escuro atrás do modal. Clicar nele fecha o modal (onClose)
    <div className={styles.modalOverlay} onClick={onClose}>
      
      {/* conteúdo do Modal:
        e.stopPropagation() impede que o clique DENTRO da caixa branca 
        feche o modal sem querer
      */}
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* --- Cabeçalho do Modal --- */}
        <div>
          {/* renderização da imagem: só mostra se a URL existir */}
          {game.background_image && (
            <img
              src={game.background_image}
              alt={game.name}
              className={styles.modalImage}
            />
          )}
          
          <div className={styles.header}>
            <span className={styles.fake}></span>
            <h2 className={styles.modalh2}>{game.name}</h2> {/* nome do jogo */}
            
            <button className={styles.wishlistButton} onClick={handleAddWishlist}>
              Adicionar a Wishlist
            </button> {/* botão para adicionar à wishlist */}
          </div>

          <div className={styles.ou}>ou</div>
          
          <div className={styles.makeReview}>
            <BtnReview gameId={game.id}/>
          </div> {/* botão para fazer review */}
        </div>

        {/* corpo do Modal (descrição) */}
        <div className={styles.modalBody}>
          {/* lógica Ternária: Se estiver carregando, mostra texto. Se terminou, mostra descrição. */}
          {loading ? (
            <p className={styles.loadingText}>Carregando informações...</p>
          ) : (
            // O "?" previne erro se 'detalhes' ainda for null
            <p className={styles.description}>{detalhes?.description_raw}</p>
          )}
        </div>
        
      </div>
    </div>
  );
}