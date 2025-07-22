import axios from "axios";

export async function addToFavorites(id_user: string, id_band: number) {
  try {
    const response = await axios.post("/api/favorites", { id_user, id_band });
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de l'ajout du favori :", error.response?.data || error.message);
    throw error;
  }
}
