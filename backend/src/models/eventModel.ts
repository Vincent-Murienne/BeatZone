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
        ),
        owner (
            id_owner,
            nom_etablissement,
            image_url,
            adresse,
            ville,
            code_postal,
            latitude,
            longitude,
            cree_le
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
        ),
        owner (
            id_owner,
            nom_etablissement,
            image_url,
            adresse,
            ville,
            code_postal,
            latitude,
            longitude,
            cree_le
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
        .select("id_owner(adresse, code_postal, ville)")
        .not("id_owner.adresse", "is", null)
        .not("id_owner.ville", "is", null)
        .not("id_owner.code_postal", "is", null)
        .or(`and(debut.lte.${now},fin.gte.${now}),debut.gte.${now}`);
};

export const fetchUniquePrices = async () => {
    return supabase
        .from("event")
        .select("prix")
        .not("prix", "is", null);
};
