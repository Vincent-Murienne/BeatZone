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
    return supabase
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
        `)
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
