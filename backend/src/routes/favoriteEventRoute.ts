import { FastifyInstance } from "fastify";
import {
  addEventToFavorites,
  deleteEventFromFavorites,
  getEventFavorites
} from "../controllers/favoriteEventController";

export default async function favoriteEventRoutes(fastify: FastifyInstance) {
  fastify.post("/favorites-event", addEventToFavorites);
  fastify.delete("/favorites-event", deleteEventFromFavorites);
  fastify.get("/favorites-event/:id_user", getEventFavorites);
}
