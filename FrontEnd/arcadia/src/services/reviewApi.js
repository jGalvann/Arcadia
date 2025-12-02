import axios from 'axios'

// URL base do serviço de reviews
const API_URL = 'http://localhost:8080/reviews'

/**
 * Função auxiliar para inserir o token JWT nos headers das requisições protegidas
 * retorna o header de Authorization configurado com o token salvo no localStorage
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`, // adiciona token JWT no cabeçalho
      'Content-Type': 'application/json' // define o tipo de conteúdo como JSON
    }
  }
}

/**
 * reviewService
 * objeto que contém todas as chamadas REST relacionadas a Reviews.
 */
export const reviewService = {
  /**
   * Busca todas as reviews de um usuário específico
   * Método GET -> /reviews/user/{userId}
   */ getReviewsByUser: async userId => {
    const response = await axios.get(
      `${API_URL}/user/${userId}`,
      getAuthHeaders()
    )
    return response.data
  },

  /**
   * Busca TODAS as reviews cadastradas no sistema
   * Método GET -> /reviews
   */ getAllReviews: async () => {
    try {
      const response = await axios.get(API_URL, getAuthHeaders())
      return response.data
    } catch (error) {
      console.error('Erro ao buscar todas as reviews:', error)
      throw error // Lança o erro para o componente tratar
    }
  },

  /**
   * Cria uma nova review
   * Método POST - /reviews
   * DTO esperado pelo backend:
   * {
   *    gameId,
   *    nota,
   *    textReview,
   *    status
   * }
   */
  createReview: async ({ gameId, nota, textReview, status }) => {
    return (
      await axios.post(
        API_URL,
        { gameId, nota, textReview, status },
        getAuthHeaders()
      )
    ).data
  },

  /**
   * Atualiza uma review existente
   * método PUT - /reviews/{id}
   * DTO:
   * {
   *    nota,
   *    textReview,
   *    status
   * }
   */
  updateReview: async (reviewId, reviewData) => {
    const response = await axios.put(
      `${API_URL}/${reviewId}`,
      reviewData,
      getAuthHeaders()
    )
    return response.data
  },

  /**
   * Deleta uma review
   * método DELETE - /reviews/{id}
   */ deleteReview: async reviewId => {
    await axios.delete(`${API_URL}/${reviewId}`, getAuthHeaders())
  },

  /**
   * CURTIR review
   * método PUT - /reviews/{id}/like
   * envia body vazio porque só incrementa contagem
   */ likeReview: async reviewId => {
    const response = await axios.put(
      `${API_URL}/${reviewId}/like`,
      {},
      getAuthHeaders()
    )
    return response.data
  },

  /**
   * DESCURTIR review
   * método PUT - /reviews/{id}/dislike
   * também envia body vazio
   */ dislikeReview: async reviewId => {
    const response = await axios.put(
      `${API_URL}/${reviewId}/dislike`,
      {},
      getAuthHeaders()
    )
    return response.data
  }
}
