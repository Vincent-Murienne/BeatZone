import { supabase } from "../db";

// Récupérer un utilisateur par son email
export const fetchUserByEmail = async (email: string) => {
    return await supabase
        .from("users")
        .select("id_user, email, pseudo, avatar_url, bio, role")
        .eq("email", email)
        .single();
};

// Récupérer un utilisateur par son id
export const fetchUserById = async (id: string) => {
    return await supabase
        .from("users")
        .select("id_user, email, pseudo, avatar_url, bio, role")
        .eq("id_user", id)
        .single();
};

// Mettre à jour le profil utilisateur (pseudo, bio, avatar_url)
export const updateUserProfile = async (
    id: string,
    updates: { pseudo?: string; bio?: string; avatar_url?: string }
) => {
    return await supabase
        .from("users")
        .update(updates)
        .eq("id_user", id)
        .select("id_user, email, pseudo, avatar_url, bio, role")
        .single();
};
