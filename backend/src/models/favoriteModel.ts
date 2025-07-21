import { supabase } from "../db";

// Ajouter un favori
export const addFavorite = async (id_user: string, id_band: number) => {
  const { data, error } = await supabase
    .from("favoriser")
    .insert([{ id_user, id_band, date_ajout: new Date().toISOString() }]);
  if (error) {
    console.error("Erreur Supabase dans addFavorite:", error.message);
  }

  return { data, error };
};

// Supprimer un favori
export const removeFavorite = async (id_user: string, id_band: number) => {
  const { data, error } = await supabase
    .from("favoriser")
    .delete()
    .match({ id_user, id_band });
  return { data, error };
};

// Récupérer les favoris d’un utilisateur
export const getFavoritesByUser = async (id_user: string) => {
  const { data, error } = await supabase
    .from("favoriser")
    .select("band:band(*)") // on joint la table "band"
    .eq("id_user", id_user);

const bands = data?.map((row: any) => row.band) ?? [];
  return { data: bands, error };
};

// Vérifier si un groupe est déjà en favori
export const isFavorite = async (id_user: string, id_band: number) => {
  const { data, error } = await supabase
    .from("favoriser")
    .select("*")
    .match({ id_user, id_band })
    .maybeSingle();

  return { data, error };
};
