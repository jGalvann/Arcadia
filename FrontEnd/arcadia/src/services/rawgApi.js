import axios from 'axios'

const API_KEY = import.meta.env.VITE_RAWG_API_KEY // key da RAWG está no .env
const API_URL = 'https://api.rawg.io/api' //URL da API RAWG

/*
 * Função para traduzir textos do inglês para o português usando
 * a API pública do Google Translate
 *
 * @param {string} texto - texto original em inglês
 * @returns texto traduzido ou o original caso falhe
 */
async function traduzirTexto (texto) {
  try {
    // URL da API gratuita do Google Translate
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(
      texto
    )}`

    const resposta = await axios.get(url)

    // caso o retorno seja válido, percorre cada parte traduzida e concatena
    if (resposta.data && resposta.data[0]) {
      return resposta.data[0].map(item => item[0]).join('')
    }

    return texto // fallback: retorna texto original
  } catch (error) {
    console.error('Erro detalhes:', error)
    return null // retorno em caso de erro
  }
}

/**
 * Busca lista de jogos da RAWG API
 *
 * @param {number|null} page - página de resultados (ignorado quando null para gerar aleatória)
 * @param {string} ordering - ordenação dos jogos
 * @returns lista com jogos filtrados conforme as regras aplicadas
 */
export async function getGames (page = null, ordering = '-added') {
  try {
    // se nenhuma página for passada, usa uma aleatória entre 1 e 50
    if (!page) {
      page = Math.floor(Math.random() * 50) + 1
    }

    // parâmetros padrão para consulta
    const params = {
      key: API_KEY,
      page, // página de resultados
      page_size: 40, // número de jogos por página
      parent_platforms: '1,2,3,7', // PC, Xbox, PlayStation, Nintendo
      ordering // ordenação conforme selecionado
    }

    /**
     * Ajustes conforme o filtro aplicado
     * as regras ajudam a consulta para obter resultados melhores
     */

    // Se a ordenação for por nome (A-Z ou Z-A), adiciona filtro Metacritic
    // para evitar jogos desconhecidos
    if (ordering === 'name' || ordering === '-name') {
      params.metacritic = '1,100'
    }

    // MELHORES AVALIADOS (CRÍTICA)
    // pega apenas a "elite" com nota 80+ no Metacritic
    if (ordering === '-rating') {
      params.ordering = '-metacritic'
      params.metacritic = '80,100'
    }

    // LANÇAMENTOS (APENAS DESTE ANO)
    // se a ordenação for por data de lançamento, restringe ao ano atual.
    if (ordering === '-released') {
      const anoAtual = new Date().getFullYear() // Pega 2025 automaticamente
      params.dates = `${anoAtual}-01-01,${anoAtual}-12-31`
    }

    // faz requisição a API RAWG
    const response = await axios.get(`${API_URL}/games`, { params })

    // retorna somente os resultados
    return response.data.results

  } catch (error) {
    console.error('Erro ao buscar jogos:', error)
    return []
  }
}

/**
 * Busca detalhes completos de um jogo específico
 * se encontrar descrição, traduz automaticamente para PT-BR
 *
 * @param {number} id - id do jogo na RAWG
 * @returns objeto com detalhes do jogo
 */
export async function getGameDetails (id) {
  try {
    const response = await axios.get(`${API_URL}/games/${id}`, {
      params: { key: API_KEY }
    })

    const gameData = response.data

    // Se existir descrição, traduz para PT-BR
    if (gameData.description_raw) {
      gameData.description_raw = await traduzirTexto(gameData.description_raw)
    }

    return gameData // retorna os dados do jogo já traduzidos
  } catch (error) {
    console.error('Erro ao buscar detalhes do jogo: ', error)
    return null
  }
}

/**
 * Busca apenas o nome do jogo pelo ID
 * usado para exibir nomes sem precisar carregar todos os detalhes
 *
 * @param {number} gameId - id do jogo
 * @returns {string} nome do jogo
 */
export async function getGameName (gameId) {
  const response = await axios.get(
    `https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`
  )
  return response.data.name // só retorna o nome
}
