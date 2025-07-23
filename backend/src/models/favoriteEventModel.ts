import { supabase } from "../db";

// Ajouter un événement aux favoris
export const addEventFavorite = async (id_user: string, id_event: number) => {
  const { data, error } = await supabase
    .from("favoriser_event")
    .insert([{ id_user, id_event }]);

  if (error) {
    console.error("Erreur Supabase dans addEventFavorite:", error.message);
  }

  return { data, error };
};

// Supprimer un événement des favoris
export const removeEventFavorite = async (id_user: string, id_event: number) => {
  const { data, error } = await supabase
    .from("favoriser_event")
    .delete()
    .match({ id_user, id_event });

  return { data, error };
};

// Récupérer les événements favoris d’un utilisateur
export const getEventFavoritesByUser = async (id_user: string) => {
  const { data, error } = await supabase
    .from("favoriser_event")
    .select("event:event(*)")
    .eq("id_user", id_user);

  const events = data?.map((row: any) => row.event) ?? [];
  return { data: events, error };
};

// Vérifier si un événement est déjà en favori
export const isEventFavorite = async (id_user: string, id_event: number) => {
  const { data, error } = await supabase
    .from("favoriser_event")
    .select("*")
    .match({ id_user, id_event })
    .maybeSingle();

  return { data, error };
};
