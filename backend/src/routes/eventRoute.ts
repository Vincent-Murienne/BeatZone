import { FastifyInstance } from "fastify";
import { getAllEvents, getAllSuggestions, getAllGenres, getEventById } from "../controllers/eventController";

export default async function eventRoutes(fastify: FastifyInstance) {
  fastify.get("/events", getAllEvents);
  fastify.get("/events/suggestions", getAllSuggestions);
  fastify.get("/events/genres", getAllGenres);
  fastify.get('/event/:id', getEventById);
}