import { FastifyRequest, FastifyReply } from "fastify";
import {
  addFavorite,
  removeFavorite,
  getFavoritesByUser,
  isFavorite
} from "../models/favoriteModel";

// POST /favorites
export const addToFavorites = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id_user, id_band } = req.body as { id_user: string; id_band: number };

  const already = await isFavorite(id_user, id_band);
  if (already.data) {
    return reply.status(400).send({ error: "Déjà en favori" });
  }

  const { data, error } = await addFavorite(id_user, id_band);
  if (error) return reply.status(500).send({ error: error.message });

  return reply.status(201).send(data);
};

// DELETE /favorites
export const deleteFromFavorites = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id_user, id_band } = req.body as { id_user: string; id_band: number };

  const { data, error } = await removeFavorite(id_user, id_band);
  if (error) return reply.status(500).send({ error: error.message });

  return reply.send({ success: true });
};

// GET /favorites/:id_user
export const getFavorites = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id_user } = req.params as { id_user: string };

  const { data, error } = await getFavoritesByUser(id_user);
  if (error) return reply.status(500).send({ error: error.message });

  return reply.send(data);
};
