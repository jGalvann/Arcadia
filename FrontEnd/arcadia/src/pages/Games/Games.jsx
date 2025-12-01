import { useEffect, useState } from "react";
import { getGames } from "../../services/rawgApi";
import Navbar02 from "../../components/Navbar02/Navbar02";
import SearchBar from "../../components/SearchBar/SearchBar";
import GameCard from "../../components/GameCard/GameCard";
import styles from "./Games.module.css";
import BntRandom from "../../components/Buttons/BtnRandom";

export default function Games() {
  const [games, setGames] = useState([]);
  const [resultadosPesquisa, setResultadosPesquisa] = useState([]);

  const [page, setPage] = useState(1);
  const [ordering, setOrdering] = useState("");

  useEffect(() => {
    async function carregarJogosIniciais() {
      const jogos = await getGames(
        ordering === "" ? null : 1, // se não há filtro → página aleatória
        ordering === "" ? "-added" : ordering // random base para RAWG
      );
      setGames(jogos);
      setPage(1);
    }

    if (resultadosPesquisa.length === 0) {
      carregarJogosIniciais();
    }
  }, [ordering]);

  async function carregarMais() {
    const proximaPagina = page + 1;
    const novosJogos = await getGames(proximaPagina, ordering);
    setGames((prev) => [...prev, ...novosJogos]);
    setPage(proximaPagina);
  }

  function handleOrderChange(e) {
    setOrdering(e.target.value);
  }

  const listaJogos = resultadosPesquisa.length > 0 ? resultadosPesquisa : games;

  return (
    <div className={styles.container}>
      <Navbar02 />

      {/* Cabeçalho */}
      <div className={styles.headerContainer}>
        <div className={styles.titulo}>
          <span>TODOS OS JOGOS</span>
        </div>

        <div className={styles.controles}>
          <select
            className={styles.filtro}
            value={ordering}
            onChange={handleOrderChange}
          >
            <option value="">Selecionar filtro</option> {/* NOVO */}
            <option value="-added">Populares</option>
            <option value="name">Nome (A-Z)</option>
            <option value="-name">Nome (Z-A)</option>
            <option value="-released">Lançamento</option>
            <option value="-rating">Melhor Avaliados</option>
          </select>

          <SearchBar onResults={setResultadosPesquisa} />
        </div>

        <BntRandom />
      </div>

      {/* GRID DE JOGOS */}
      <div className={styles.grid}>
        {listaJogos.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {/* BOTÃO DE CARREGAR MAIS */}
      {resultadosPesquisa.length === 0 && games.length > 0 && (
        <button className={styles.loadMore} onClick={carregarMais}>
          Carregar mais
        </button>
      )}
    </div>
  );
}
