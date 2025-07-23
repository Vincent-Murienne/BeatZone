import { log } from "console";
import { supabase } from "../db";

export const fetchAllBands = async () => {
    return supabase
        .from("band")
        .select(`
            *,
            avoir (
                genre (
                    type_musique
                )
            )
        `)
        .order("nom", { ascending: true });
};

export const fetchBandById = async (id_band: string) => {
    let query = supabase
        .from("band")
        .select(`
            *,
            band_socials (
                spotify_url,
                deezer_url,
                youtube_url,
                instagram_url,
                facebook_url,
                tiktok_url,
                site_web_url
            ),
            member (
                id_member,
                nom,
                prenom,
                bio,
                image_url,
                cree_le,
                detenir (
                    date_ajout,
                    role (
                        instrument
                    )
                )
            ),
            avoir (
                genre (
                    type_musique
                )
            )
        `);


    if (/^\d+$/.test(id_band)) {
        query = query.eq("id_band", Number(id_band));
    } else if (
        typeof id_band === "string" &&
        id_band.length === 36 &&
        /^[0-9a-fA-F\-]{36}$/.test(id_band)
    ) {
        query = query.eq("id_user", id_band);
    } else {
        query = query.eq("id_band", -1);
    }
    return query.single();
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

export const updateBand = async (id_band: number, bandData: any) => {

    const allowedFields = ['nom', 'description', 'image_url', 'cree_le', 'id_user', 'ville', 'pays'];
    const filteredData = Object.fromEntries(
        Object.entries(bandData).filter(([key]) => allowedFields.includes(key))
    );

    log(`Updating band with ID: ${id_band} with data:`, filteredData);

    const { data, error } = await supabase
        .from("band")
        .update(filteredData)
        .eq("id_band", id_band)
        .single();

    if (error) {
        log(`Error updating band with ID ${id_band}:`, error);
        throw new Error(`Error updating band info: ${error.message}`);
    }

    return data;
};

export const searchBandsByName = async (query: string) => {
    return supabase
        .from("band")
        .select("id_band, nom")
        .ilike("nom", `%${query}%`)
        .limit(10);
};

export const fetchMusicGenre = async () => {
    return supabase
        .from("band")
        .select(`
            avoir (
                genre (
                    type_musique
                )
            )
        `);
};

export const fetchEventsByBandId = async (id_band: string) => {
    return supabase
        .from("band")
        .select(`
        jouer (
            event (
            id_event,
            titre,
            description,
            debut,
            fin,
            image_url,
            prix,
            infos_complementaires
            )
        )
        `)
        .eq("id_band", id_band);
};

