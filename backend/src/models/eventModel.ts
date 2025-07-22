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
                    description,
                    image_url,
                    avoir (
                        genre (
                            type_musique
                        )
                    )
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
                description,
                image_url,
                avoir (
                    genre (
                        type_musique
                    )
                )
            )
        )
        `)
        .eq("id_event", id_event)
        .single();
};

export const fetchUniqueGenres = async () => {
    const now = new Date().toISOString();
    return supabase
        .from("event")
        .select(`
            jouer (
                band (
                    avoir (
                        genre (
                            type_musique
                        )
                    )
                )
            )
        `)
        .or(`and(debut.lte.${now},fin.gte.${now}),debut.gte.${now}`);
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
