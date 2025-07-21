import { FastifyInstance } from "fastify";
import { getAllBands, getBandById, } from "../controllers/bandController";

export default async function eventRoutes(fastify: FastifyInstance) {
    fastify.get("/bands", getAllBands);
    fastify.get('/band/:id', getBandById);
}