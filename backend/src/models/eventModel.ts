import { supabase } from "../db";

export const fetchAllEvents = async () => {
    const now = new Date().toISOString();

    return supabase
        .from("event")
        .select(`
        *,
        jouer (
            debut_passage,
            fin_passage,
            band (
            id_band,
            nom,
            genre,
            description,
            image_url
            )
        )
        `)
        .or(`and(debut.lte.${now},fin.gte.${now}),debut.gte.${now}`);
};

export const fetchEventById = async (id_event: string) => {
    return supabase
        .from("event")
        .select(`
        *,
        jouer (
            debut_passage,
            fin_passage,
            band (
            id_band,
            nom,
            genre,
            description,
            image_url
            )
        )
        `)
        .eq("id_event", id_event)
        .single();
};

export const fetchUniqueFieldValues = async (field: string) => {
    return supabase
        .from("event")
        .select(field)
        .neq(field, "");
};

export const fetchUniqueSuggestions = async () => {
    const now = new Date().toISOString();
    return supabase
        .from("event")
        .select("adresse, code_postal, ville")
        .neq("adresse", "")
        .neq("code_postal", "")
        .neq("ville", "")
        .or(`and(debut.lte.${now},fin.gte.${now}),debut.gte.${now}`);
};

export const fetchUniquePrices = async () => {
    return supabase
        .from("event")
        .select("prix")
        .not("prix", "is", null);
};
