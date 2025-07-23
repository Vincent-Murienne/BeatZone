import { FastifyRequest, FastifyReply } from "fastify";
import {
  addEventFavorite,
  removeEventFavorite,
  getEventFavoritesByUser,
  isEventFavorite
} from "../models/favoriteEventModel";

// POST /favorites-event
export const addEventToFavorites = async (req: FastifyRequest, reply: FastifyReply) => {
        console.log("BODY:", req.body);

  const { id_user, id_event } = req.body as { id_user: string; id_event: number };

  const already = await isEventFavorite(id_user, id_event);
  if (already.data) {
    return reply.status(400).send({ error: "Déjà en favori" });
  }

  const { data, error } = await addEventFavorite(id_user, id_event);
  if (error) return reply.status(500).send({ error: error.message });

  return reply.status(201).send(data);
};

// DELETE /favorites-event
export const deleteEventFromFavorites = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id_user, id_event } = req.body as { id_user: string; id_event: number };

  const { data, error } = await removeEventFavorite(id_user, id_event);
  if (error) return reply.status(500).send({ error: error.message });

  return reply.send({ success: true });
};

// GET /favorites-event/:id_user
export const getEventFavorites = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id_user } = req.params as { id_user: string };

  const { data, error } = await getEventFavoritesByUser(id_user);
  if (error) return reply.status(500).send({ error: error.message });

  return reply.send(data);
};
