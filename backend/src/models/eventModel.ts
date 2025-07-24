import { supabase } from "../db";
import type { EventStatus } from "../types/event";


const buildEventQuery = (status: EventStatus) => {
    const now = new Date().toISOString();
    const query = supabase
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
                code_postal
            )
        `);

    if (status === 'upcoming') {
        return query.gt('debut', now); // début > maintenant
    } else if (status === 'current') {
        return query.lte('debut', now).gte('fin', now); // début ≤ now et fin ≥ now
    } else if (status === 'past') {
        return query.lt('fin', now); // fin < maintenant
    }

    return query;
};

export const fetchNowFuturEvents = async () => {
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

export const fetchEventsByArtist = async (id_band: string, status: EventStatus) => {
    return buildEventQuery(status)
        .select(`
            *,
            jouer!inner(
                debut_passage,
                fin_passage,
                band!inner(
                    id_band,
                    nom,
                    description,
                    image_url
                )
            ),
            owner (
                id_owner,
                nom_etablissement,
                image_url,
                adresse,
                ville,
                code_postal
            )
                `)
        .eq('jouer.band.id_band', id_band);
};

export const fetchEventsByOwner = async (id_owner: string, status: EventStatus) => {
    return buildEventQuery(status)
        .select(`
            *,
            jouer (
                debut_passage,
                fin_passage,
                band (
                    id_band,
                    nom,
                     description,
                    image_url
                )
            ),
            owner!inner(
                id_owner,
                nom_etablissement,
                image_url,
                adresse,
                ville,
                code_postal
            )
        `)
        .eq('owner.id_owner', id_owner);
};

export const fetchEventsByStatus = async (status: EventStatus) => {
    return buildEventQuery(status)
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
                code_postal
            )
        `)
        .order('debut', { ascending: true });

};