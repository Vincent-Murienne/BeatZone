import { FastifyInstance } from "fastify";
import { getAllEvents } from "../controllers/eventController";

export default async function eventRoutes(fastify: FastifyInstance) {
  fastify.get("/events", getAllEvents);
}