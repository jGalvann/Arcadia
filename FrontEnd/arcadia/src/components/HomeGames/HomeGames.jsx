import { useEffect, useState, useRef } from "react";
import { getGames } from "../../services/rawgApi";
import GameCard from "../GameCard/GameCard";
import styles from "./HomeGames.module.css";

export default function HomeGames() {
  const [games, setGames] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function carregar() {
      const jogos = await getGames(null);
      setGames(jogos); //aqui eu salvo no estado
    }

    carregar();
  }, []); //roda só uma vez quando o componente abrir

  // funções para os botões de scroll
  function left() {
    scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
  }

  function right() {
    scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>PARA VOCÊ</h2>

      <div className={styles.jogos} ref={scrollRef}>
        {games.map((game) => (
          <div key={game.id}>
            <GameCard game={game} /> {/* componente do card do jogo, faz um map dele, então vai carregar vários jogos (da api do RAWG) */}
          </div>
        ))}
      </div>
      <div className={styles.botoesscroll}>
        <button className={styles.arrow} onClick={left}>
          ❮
        </button>
        <button className={styles.arrow} onClick={right}>
          ❯
        </button>
      </div>
    </div>
  );
}
