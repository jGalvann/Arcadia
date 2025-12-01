import axios from "axios";

const API_KEY = import.meta.env.VITE_RAWG_API_KEY; // key da RAWG
const API_URL = "https://api.rawg.io/api"; //URL da API

async function traduzirTexto(texto) {
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(texto)}`;
        const resposta = await axios.get(url);
        if (resposta.data && resposta.data[0]) {
            return resposta.data[0].map(item => item[0]).join("");
        }
        return texto;
    } catch (error) {
        console.error("Erro detalhes:", error);
        return null;
    }
}

export async function getGames(page = null, ordering = "-added") {
  try {
    // Se nenhuma página for passada, usa uma aleatória entre 1 e 50
    if (!page) {
      page = Math.floor(Math.random() * 50) + 1;
    }

    const params = {
      key: API_KEY,
      page,
      page_size: 40,
      parent_platforms: "1,2,3,7",
      ordering,
    };  

        // LIMPEZA DO A-Z / Z-A
        if (ordering === 'name' || ordering === '-name') {
            params.metacritic = "1,100";
        }

        // MELHORES AVALIADOS (CRÍTICA)
        // Pega apenas a "elite" com nota 80+ no Metacritic
        if (ordering === '-rating') {
            params.ordering = '-metacritic'; 
            params.metacritic = "80,100";    
        }

        // LANÇAMENTOS (APENAS DESTE ANO)
        // Se a ordenação for por data de lançamento, restringe ao ano atual.
        if (ordering === '-released') {
            const anoAtual = new Date().getFullYear(); // Pega 2025 automaticamente
            params.dates = `${anoAtual}-01-01,${anoAtual}-12-31`;
        }

        const response = await axios.get(`${API_URL}/games`, { params });
        return response.data.results;

    } catch (error) {
        console.error("Erro ao buscar jogos:", error);
        return [];
    }
}
export async function getGameDetails(id) {
  try {
    const response = await axios.get(`${API_URL}/games/${id}`, {
      params: { key: API_KEY },
    });

    const gameData = response.data;

    // Se existir descrição, traduz para PT-BR
    if (gameData.description_raw) {
      gameData.description_raw = await traduzirTexto(gameData.description_raw);
    }

    return gameData; // retorna os dados do jogo já traduzidos

  } catch (error) {
    console.error("Erro ao buscar detalhes do jogo: ", error);
    return null;
  }
}


export async function getGameName(gameId) {
  const response = await axios.get(
    `https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`
  );
  return response.data.name; // só retorna o nome
}