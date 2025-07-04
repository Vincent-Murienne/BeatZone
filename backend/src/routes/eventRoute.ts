import { FastifyInstance } from "fastify";
import { getAllEvents, getAllSuggestions, getAllGenres, getAllPrices, getEventById } from "../controllers/eventController";

export default async function eventRoutes(fastify: FastifyInstance) {
  fastify.get("/events", getAllEvents);
  fastify.get("/suggestions", getAllSuggestions);
  fastify.get("/genres", getAllGenres);
  fastify.get("/prices", getAllPrices);
  fastify.get('/event/:id', getEventById);
}