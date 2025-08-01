import { FastifyInstance } from "fastify";
import { getAllBands, getBandById, getBandSuggestions, getAllGenres, getEventsByBandId, updateBandInfo } from "../controllers/bandController";

export default async function eventRoutes(fastify: FastifyInstance) {
    fastify.get("/bands", getAllBands);
    fastify.get('/band/:id', getBandById);
    fastify.put('/band/update/:id', updateBandInfo);
    fastify.get("/bands/search", getBandSuggestions);
    fastify.get("/bands/genres", getAllGenres);
    fastify.get("/band/:id/events", getEventsByBandId);
}