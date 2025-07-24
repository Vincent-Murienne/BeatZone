import type { Band } from "./band";
import type { Owner } from "./owner";

export type EventStatus = 'upcoming' | 'current' | 'past';

export interface Event {
  id_event: number;
  titre: string;
  description: string;
  debut: string;
  fin: string;
  prix: number;
  cree_le: string;
  image_url: string;
  infos_complementaires: string;
  id_owner: string;

  jouer?: {
    band: Band;
    debut_passage: string | null;
    fin_passage: string | null;
  }[];

  owner?: Owner;
}