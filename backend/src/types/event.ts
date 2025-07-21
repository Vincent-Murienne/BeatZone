import type { Band } from "./band";

export interface Event {
  id_event: number;
  titre: string;
  description: string;
  debut: string;
  fin: string;
  latitude: number;
  longitude: number;
  adresse: string;
  code_postal: number;
  ville: string;
  prix: number;
  cree_le: string;
  image_url: string;
  infos_complementaires: string;
  jouer?: {
    band: Band;
    debut_passage: string | null;
    fin_passage: string | null;
  }[];
}
