import { FastifyInstance } from "fastify";
import { getOwnerByUserId, updateOwnerInfo } from "../controllers/ownerController";

export default async function userRoutes(fastify: FastifyInstance) {
    fastify.get("/owner/:userId", getOwnerByUserId);
    fastify.put("/owner/update/:id_owner", updateOwnerInfo);
}