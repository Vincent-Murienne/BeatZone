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
