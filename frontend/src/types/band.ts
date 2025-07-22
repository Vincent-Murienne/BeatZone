// src/types/band.ts

export interface Band {
    id_band: number;
    nom: string;
    description: string;
    image_url: string;
    cree_le: string;
    id_user: number;
}

export interface Genre {
    type_musique: string;
}

export interface BandWithGenre extends Band {
    avoir?: {
        genre: Genre;
    }[];
}
