import type { Users } from "./users";

export interface Owner {
    id_owner: string;
    nom_etablissement: string;
    image_url: string;
    adresse: string;
    ville: string;
    code_postal: string;
    latitude: number;
    longitude: number;
    cree_le: string;
    user?: Users;
}
