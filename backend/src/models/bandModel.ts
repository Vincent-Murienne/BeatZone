import { supabase } from "../db";

export const fetchAllBands = async () => {
    return supabase
        .from("band")
        .select("*")
        .order("nom", { ascending: true });
};

export const fetchBandById = async (id_band: string) => {
    return supabase
        .from("band")
        .select("*")
        .eq("id_band", id_band)
        .single();
};

export const fetchUserBand = async (userId: string) => {
    return supabase
        .from("band")
        .select(`*,
            avoir(
                genre(
                    type_musique
                )
            )`)
        .eq("id_user", userId)
        .single();
}
