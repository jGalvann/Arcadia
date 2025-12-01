import api from "./api";

// ADICIONAR À WISHLIST (POST)
export async function addToWishlist(gameId) {
  return api.post("/wishlist", { gameId });
}

// PEGAR WISHLIST DO USUÁRIO LOGADO (GET)
export async function getWishlist() {
  const response = await api.get("/wishlist");
  return response.data; // lista de { id, gameId }
}

// REMOVER ITEM DA WISHLIST (DELETE)
export async function removeFromWishlist(itemId) {
  return api.delete(`/wishlist/${itemId}`);
}

// BUSCAR ITEM ALEATÓRIO DA WISHLIST (GET)
export async function getRandomWishlistItem() {
  const response = await api.get("/wishlist/random");
  return response.data;
}