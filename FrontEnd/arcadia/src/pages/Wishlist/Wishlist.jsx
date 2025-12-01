import styles from "./Wishlist.module.css";
import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../../services/wishlistApi";
import { getGameDetails } from "../../services/rawgApi";
import GameCard from "../../components/GameCard/GameCard";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Navbar02 from "../../components/Navbar02/Navbar02";

export default function Wishlist() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    async function loadWishlist() {
      try {
        const wishlist = await getWishlist(); // { id, gameId }

        const detailed = await Promise.all(
          wishlist.map(async (item) => {
            const details = await getGameDetails(item.gameId);
            return { ...details, wishlistId: item.id };
          })
        );

        setGames(detailed);
      } catch (error) {
        console.error("Erro ao carregar wishlist:", error);
      }
    }

    loadWishlist();
  }, []);

  const handleRemove = async (id) => {
    await removeFromWishlist(id);
    setGames(games.filter((game) => game.wishlistId !== id));
  };

  return (
    <div className={styles.container}>
      <Navbar02 />

      <div className={styles.titulo}>
        <span>MINHA WISHLIST</span>
      </div>

      {games.length === 0 ? (
        <div className={styles.noFav}>
          <FavoriteBorderIcon
            style={{ fontSize: "5rem", color: "#555", marginBottom: "1rem" }}
          />
          <h2>A sua lista está vazia</h2>
          <p>Explore os jogos e adicione aos seus favoritos!</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {games.map((game) => (
            <div key={game.id} className={styles.cardWrapper}>
              <GameCard game={game} />
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