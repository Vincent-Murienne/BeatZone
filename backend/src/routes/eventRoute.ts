import { FastifyInstance } from "fastify";
import { getAllSuggestions, getAllGenres, getEventById, getEventsByStatus, getEventsByArtist, getEventsByOwner, getNowFuturEvents} from "../controllers/eventController";

export default async function eventRoutes(fastify: FastifyInstance) {
  fastify.get("/events/suggestions", getAllSuggestions);
  fastify.get("/events/genres", getAllGenres);
  fastify.get("/events/artist/:id_band/:status", getEventsByArtist);
  fastify.get("/events/owner/:id_owner/:status", getEventsByOwner);
  fastify.get("/events/:status", getEventsByStatus);
  fastify.get('/event/:id', getEventById);
  fastify.get('/eventsDate', getNowFuturEvents);
}