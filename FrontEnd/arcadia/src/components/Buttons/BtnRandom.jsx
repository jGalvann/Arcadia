import React, { useState, useEffect } from "react";
import axios from "axios";
import GameModal from "../../components/ModalGame/ModalGame";
import Button from "@mui/material/Button";
import CasinoIcon from "@mui/icons-material/Casino";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import { toast } from "react-toastify";
import { getRandomWishlistItem } from "../../services/wishlistApi";
import { getGameDetails } from "../../services/rawgApi";

const API_KEY = "74789459df8c4381a2b1d53cee393da1";
const BASE_URL = "https://api.rawg.io/api";

export default function BntRandom() {
  const [totalGames, setTotalGames] = useState(null);
  const [randomGame, setRandomGame] = useState(null);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // define o tamanho da página como 40 (máximo permitido pela API RAWG).
  // necessário para calcular o número total de páginas e realizar o sorteio
  // sem precisar baixar o banco de dados inteiro de jogos.
  const PAGE_SIZE = 40;

  useEffect(() => {
    async function fetchTotalGames() {
      try {
        const response = await axios.get(
          `${BASE_URL}/games?key=${API_KEY}&page_size=1`
        );
        setTotalGames(response.data.count);
      } catch (error) {
        console.error("Erro count:", error);
      }
    }
    fetchTotalGames();
  }, []); // executa uma vez ao montar o componente

  const fetchRandomGlobal = async () => {
    if (!totalGames) return; // impede execução antes do count ser carregado

    setLoadingGlobal(true);
    setRandomGame(null); // limpa o último sorteio

    try {
      // calcula quantas páginas existem no catálogo
      const totalPages = Math.ceil(totalGames / PAGE_SIZE);

      // sorteia uma página aleatória
      const randomPage = Math.floor(Math.random() * totalPages) + 1;

      // busca os jogos dessa página
      const response = await axios.get(
        `${BASE_URL}/games?key=${API_KEY}&page=${randomPage}&page_size=${PAGE_SIZE}`
      );
      const games = response.data.results;

      // escolhe um jogo aleatório dentro dessa página
      if (games.length > 0) {
        const randomIndex = Math.floor(Math.random() * games.length);
        setRandomGame(games[randomIndex]);
        setIsModalOpen(true); // abre o modal com o jogo sorteado
      }
    } finally {
      setLoadingGlobal(false); // desativa o spinner
    }
  };

  // lógica de Sorteio da Wishlist
  const fetchRandomWishlist = async () => {
    setLoadingWishlist(true); // ativa spinner do botão amarelo
    setRandomGame(null);

    try {
      // pede um item aleatório da wishlist ao backend
      const wishlistData = await getRandomWishlistItem();

      // se o backend devolveu um gameId válido
      // busca detalhes completos na RAWG (imagem, descrição, etc.)
      if (wishlistData && wishlistData.gameId) {
        const gameDetails = await getGameDetails(wishlistData.gameId);
        setRandomGame(gameDetails); // Salva o jogo completo com imagem
        setIsModalOpen(true); // Abre o modal
      }
    } catch (error) {
      console.error("ERRO DETALHADO:", error.response);

      // tratamento de erros
      const status = error.response?.status;
      if (status === 404) {
        toast.warn(
          "Sua wishlist está vazia! Adicione jogos para utilizar essa funcionalidade."
        );
      } else if (status === 403 || status === 401) {
        toast.error("Você precisa fazer login para acessar sua wishlist.");
      } else {
        toast.error("Ocorreu um erro ao buscar sua wishlist.");
      }
    } finally {
      setLoadingWishlist(false); // encerra o loading independente do resultado
    }
  };

  return (
    <Box
      sx={{
        padding: "0",
        textAlign: "center",
        display: "flex",
        gap: "10px",
        justifyContent: "center",
      }}
    >
      {/* botao para sortear de TODO O CATÁLOGO */}
      <Button
        variant="contained"
        onClick={fetchRandomGlobal}
        disabled={loadingGlobal || !totalGames}
        size="small"
        title="Sortear jogo de todo o catálogo"
        sx={{
          backgroundColor: "#00b6e8",
          color: "#ffffff",
          borderRadius: "50px",
          marginLeft: "20px",
          padding: "6px 16px",
          minWidth: "auto",
          boxShadow: "none",
          transition: "all 0.3s ease",
        }}
      >
        {/* icone muda para spinner quando está carregando */}
        {loadingGlobal ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <CasinoIcon sx={{ fontSize: "1.5rem" }} />
        )}
      </Button>

      {/* botão para sortear jogo da WISHLIST */}
      <Button
        variant="contained"
        onClick={fetchRandomWishlist}
        disabled={loadingWishlist}
        size="small"
        title="Sortear jogo da minha Wishlist"
        sx={{
          backgroundColor: "#f5b402",
          color: "#151515",
          borderRadius: "50px",
          padding: "6px 16px",
          minWidth: "auto",
          boxShadow: "none",
          transition: "all 0.3s ease",
        }}
      >
        {loadingWishlist ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <StarIcon sx={{ fontSize: "1.5rem" }} />
        )}
      </Button>

      {/* quando um jogo é sorteado, abre o modal */}
      {randomGame && (
        <GameModal
          game={randomGame}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Box>
  );
}

/*  Busca inicial - obtém o número total de jogos do RAWG 
    Botão azul - sorteia um jogo aleatório do catálogo inteiro
    Botão amarelo - sorteia um jogo aleatório da Wishlist do usuário
    Spinners - evitam múltiplos cliques enquanto carrega
*/
