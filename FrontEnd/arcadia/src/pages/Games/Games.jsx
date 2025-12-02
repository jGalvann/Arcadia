import { useEffect, useState } from "react";
import { getGames } from "../../services/rawgApi";
import Navbar02 from "../../components/Navbar02/Navbar02";
import SearchBar from "../../components/SearchBar/SearchBar";
import GameCard from "../../components/GameCard/GameCard";
import styles from "./Games.module.css";
import BntRandom from "../../components/Buttons/BtnRandom";

/**
 * Página Games
 * exibe uma listagem de jogos com scroll infinito manual (botão "Carregar mais")
 * permite ordenar resultados e pesquisar por nome
 */
export default function Games() {
  // lista de jogos exibidos inicialmente ou após paginação
  const [games, setGames] = useState([]);
  // resultados da pesquisa
  const [resultadosPesquisa, setResultadosPesquisa] = useState([]);

  // controle da página
  const [page, setPage] = useState(1);

  // filtro de ordenação aplicado na listagem
  const [ordering, setOrdering] = useState("");

  /**
   * useEffect executado quando o filtro ordering muda
   * recarrega os jogos com base no filtro selecionado
   */
  useEffect(() => {
    async function carregarJogosIniciais() {
      // RAWG exige ordering para definir a ordem
      // caso não tenha filtro, força uso base random (-added)
      const jogos = await getGames(
        ordering === "" ? null : 1, // se não tem filtro → ignora a página
        ordering === "" ? "-added" : ordering // se não tem filtro → usa random
      );
      setGames(jogos); // insere os jogos retornados pela API
      setPage(1); // reinicia paginação
    }

    // só carrega os jogos iniciais se não tem resultados de pesquisa ativos
    if (resultadosPesquisa.length === 0) {
      carregarJogosIniciais();
    }
  }, [ordering, resultadosPesquisa]); // dispara sempre que o filtro for alterado

  // função para carregar mais jogos (carregar mais)
  async function carregarMais() {
    const proximaPagina = page + 1;
    const novosJogos = await getGames(proximaPagina, ordering);

    // concatena os jogos novos com os anteriores, ou seja o array cresce cada vez que o botão é clicado
    setGames((prev) => [...prev, ...novosJogos]);

    // avança uma página
    setPage(proximaPagina);
  }

  // função para alterar o filtro de ordenação
  function handleOrderChange(e) {
    setOrdering(e.target.value);
  }

  /**
   * Define qual lista será utilizada:
   * - se o usuário fez pesquisa, usa resultadosPesquisa
   * - caso contrário, usa a lista padrão de jogos
   */
  const listaJogos = resultadosPesquisa.length > 0 ? resultadosPesquisa : games;

  return (
    <div className={styles.container}>
      <Navbar02 />

      {/* Cabeçalho com título, filtros e barra de pesquisa */}
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
            {/* opções de ordenação disponíveis */}
            <option value="">Selecionar filtro</option> {/* NOVO */}
            <option value="-added">Populares</option>
            <option value="name">Nome (A-Z)</option>
            <option value="-name">Nome (Z-A)</option>
            <option value="-released">Lançamento</option>
            <option value="-rating">Melhor Avaliados</option>
          </select>

          {/* componente de pesquisa */}
          <SearchBar onResults={setResultadosPesquisa} />
        </div>

        {/* botão que escolhe um jogo aleatório */}
        <BntRandom />
      </div>

      {/* GRID DE JOGOS */}
      <div className={styles.grid}>
        {listaJogos.map((game) => (  // mais um map para renderizar os jogos, usando o componente GameCard
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
