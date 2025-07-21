import { FastifyInstance } from "fastify";
import {
  addToFavorites,
  deleteFromFavorites,
  getFavorites
} from "../controllers/favoriteController";

export default async function favoriteRoutes(fastify: FastifyInstance) {
  fastify.post("/favorites", addToFavorites);
  fastify.delete("/favorites", deleteFromFavorites);
  fastify.get("/favorites/:id_user", getFavorites);
}
