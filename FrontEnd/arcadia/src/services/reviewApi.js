import axios from "axios";

const API_URL = "http://localhost:8080/reviews";

// função para pegar o token salvo 
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

// Servico com todas as chamadas de API relacionadas a reviews
export const reviewService = {
    // busca as reviews de um usuário específico (GET)
    getReviewsByUser: async (userId) => {
  const response = await axios.get(`${API_URL}/user/${userId}`, getAuthHeaders());
  return response.data;
},


    // BUSCAR todas as Reviews (GET)
    getAllReviews: async () => {
        try {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar todas as reviews:", error);
        throw error; // Lança o erro para o componente tratar
    }
},


    // CRIAR Review (POST)
    // DTO: { gameId, nota, textReview, status }
createReview: async ({ gameId, nota, textReview, status }) => {
  return (await axios.post(API_URL, { gameId, nota, textReview, status }, getAuthHeaders())).data;
},

    // 3. ATUALIZAR Review (PUT)
    // DTO: { nota, textReview, status }
    updateReview: async (reviewId, reviewData) => {
        const response = await axios.put(`${API_URL}/${reviewId}`, reviewData, getAuthHeaders());
        return response.data;
    },

    // 4. DELETAR Review (DELETE)
    deleteReview: async (reviewId) => {
        await axios.delete(`${API_URL}/${reviewId}`, getAuthHeaders());
    },

    // 5. CURTIR Review (PUT
    likeReview: async (reviewId) => {
  const response = await axios.put(`${API_URL}/${reviewId}/like`, {}, getAuthHeaders());
  return response.data;
},

// 6. DESCURTIR Review (PUT)
dislikeReview: async (reviewId) => {
  const response = await axios.put(`${API_URL}/${reviewId}/dislike`, {}, getAuthHeaders());
  return response.data;
    },
};