

export interface Band {
    id_band: number;
    nom: string;
    description: string;
    ville: string;
    pays: string;
    image_url: string;
    cree_le: string;
    id_user: number;
    band_socials?: BandSocials | null;
    membres?: Member[] | null;
    avoir?: {
        genre: Genre;
        date_ajout: string | null;
    }[];
}

export interface BandSocials {
    spotify_url: string | null;
    deezer_url: string | null;
    youtube_url: string | null;
    instagram_url: string | null;
    facebook_url: string | null;
    tiktok_url: string | null;
    site_web_url: string | null;
}

export interface Member {
    id_member: number;
    nom: string;
    prenom: string;
    bio: string;
    image_url: string;
    cree_le: string;
    id_band: number;
    detenir?: {
        role: Role;
        date_ajout: string | null;
    }[];
}

export interface Genre {
    id_genre: number;
    type_musique: string;
}