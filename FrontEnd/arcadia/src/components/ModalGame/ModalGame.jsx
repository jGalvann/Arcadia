import React, { useState, useEffect } from "react";
import styles from "../GameCard/GameCard.module.css";
import { getGameDetails } from "../../services/rawgApi";
import { addToWishlist } from "../../services/wishlistApi";
import { toast } from "react-toastify";
import BtnReview from "../Buttons/BtnReview";

// Recebe props: 
// game (dados básicos), isOpen (controle de visibilidade), onClose (função para fechar)
export default function GameModal({ game, isOpen, onClose }) {
  
  // Estado para guardar detalhes extras que não vêm na listagem simples
  const [detalhes, setDetalhes] = useState(null);
  // Estado para controlar o feedback visual de carregamento
  const [loading, setLoading] = useState(false);

  // useEffect: Ocorre toda vez que o Modal abre (isOpen = true) ou o jogo muda.
  useEffect(() => {
    // Só executa a busca se o modal estiver aberto e houver um ID de jogo válido
    if (isOpen && game?.id) {
      const fetchDetails = async () => {
        setLoading(true); // Inicia o texto de carregamento
        setDetalhes(null); // Limpa detalhes anteriores para não mostrar dados do jogo errado
        
        try {
          // Busca dados profundos na API do RAWG (descrição, website, etc.)
          const data = await getGameDetails(game.id);
          setDetalhes(data);
        } catch (error) {
          console.error("Erro ao carregar detalhes:", error);
        } finally {
          setLoading(false); // Finaliza o carregamento independente de sucesso ou erro
        }
      };
      fetchDetails();
    }
  }, [isOpen, game]);

  // Função para adicionar aos favoritos no Backend
  async function handleAddWishlist() {
    try {
      await addToWishlist(game.id);
      // Usa alert nativo aqui (pode ser trocado por toast.success para ficar mais bonito)
      toast.success("Jogo adicionado à wishlist!");
    } catch (error) {
      // Tratamento específico: Erro 409 geralmente significa "Conflito" (já existe)
      if (error.response?.status === 409) {
        toast.error("Este jogo já está na sua wishlist!");
      } else {
        toast.error("Erro ao adicionar o jogo à wishlist!");
      }
    }
  }

  // Renderização Condicional:
  // Se o modal estiver fechado ou não houver dados do jogo, não renderiza nada no DOM.
  if (!isOpen || !game) return null;

  return (
    // Overlay: O fundo escuro atrás do modal. Clicar nele fecha o modal (onClose).
    <div className={styles.modalOverlay} onClick={onClose}>
      
      {/* Conteúdo do Modal:
         e.stopPropagation() impede que o clique DENTRO da caixa branca 
         se propague para o Overlay e feche o modal sem querer.
      */}
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* --- Cabeçalho do Modal --- */}
        <div>
          {/* Renderização condicional da imagem: só mostra se a URL existir */}
          {game.background_image && (
            <img
              src={game.background_image}
              alt={game.name}
              className={styles.modalImage}
            />
          )}
          
          <div className={styles.header}>
            <span className={styles.fake}></span>
            <h2 className={styles.modalh2}>{game.name}</h2>
            
            <button className={styles.wishlistButton} onClick={handleAddWishlist}>
              Adicionar a Wishlist
            </button>
          </div>

          <div className={styles.ou}>ou</div>
          
          <div className={styles.makeReview}>
            <BtnReview gameId={game.id}/>
          </div>
        </div>

        {/* --- Corpo do Modal (Descrição) --- */}
        <div className={styles.modalBody}>
          {/* Lógica Ternária: Se estiver carregando, mostra texto. Se terminou, mostra descrição. */}
          {loading ? (
            <p className={styles.loadingText}>Carregando informações...</p>
          ) : (
            // O "?" (Optional Chaining) previne erro se 'detalhes' ainda for null
            <p className={styles.description}>{detalhes?.description_raw}</p>
          )}
        </div>
        
      </div>
    </div>
  );
}