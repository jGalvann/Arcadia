import styles from "./Wishlist.module.css";
import GameCard from "../../components/GameCard/GameCard";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Navbar02 from "../../components/Navbar02/Navbar02";
import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../../services/wishlistApi";
import { getGameDetails } from "../../services/rawgApi";

/**
 * Página Wishlist
 * exibe todos os jogos que o usuário adicionou como favoritos (wishlist)
 */
export default function Wishlist() {

  // Lista de jogos favoritados, já com informações detalhadas
  const [games, setGames] = useState([]);

  /**
   * useEffect executado ao carregar a página
   * busca a wishlist e para cada item faz uma requisição para o RAWG para obter os detalhes do jogo
   */
  useEffect(() => {
    async function loadWishlist() {
      try {
        // Busca no backend os ids dos jogos favoritados
        const wishlist = await getWishlist(); // { id, gameId }

        /**
         * Para cada gameId salvo na wishlist,
         * faz uma requisição para o RAWG para obter detalhes completos do jogo,
         * e anexa o ID da wishlist para permitir remoção
         */
        const detailed = await Promise.all(
          wishlist.map(async (item) => {
            const details = await getGameDetails(item.gameId);
            return { ...details, wishlistId: item.id }; // inclui id para remover depois
          })
        );

        // atualiza o estado com os jogos detalhados
        setGames(detailed);
      } catch (error) {
        console.error("Erro ao carregar wishlist:", error);
      }
    }

    loadWishlist();
  }, []); // executa apenas ao montar o componente

  // função para remover um jogo da wishlist
  const handleRemove = async (id) => {
    await removeFromWishlist(id); // remove no backend

    // atualiza estado local removendo o item
    setGames(games.filter((game) => game.wishlistId !== id));
  };

  return (
    <div className={styles.container}>
      <Navbar02 />

      <div className={styles.titulo}>
        <span>MINHA WISHLIST</span>
      </div>

      {/* se o usuário não tiver favoritos */}
      {games.length === 0 ? (
        <div className={styles.noFav}>
          <FavoriteBorderIcon
            style={{ fontSize: "5rem", color: "#555", marginBottom: "1rem" }}
          />
          <h2>A sua lista está vazia</h2>
          <p>Explore os jogos e adicione aos seus favoritos!</p>
        </div>
      ) : (
        // mostra cada jogo favoritado em grid
        <div className={styles.grid}>
          {games.map((game) => (
            <div key={game.id} className={styles.cardWrapper}>
              <GameCard game={game} />

              {/* botão para remover da wishlist */}
              <button
                className={styles.removeButton}
                onClick={() => handleRemove(game.wishlistId)}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}