import { FastifyInstance } from "fastify";
import { getUserInfo, getUserBand, updateUserInfo } from "../controllers/usersController";

export default async function userRoutes(fastify: FastifyInstance) {
    fastify.get("/user/:userId", getUserInfo);
    fastify.get("/user/getBand/:userId", getUserBand);
    fastify.put("/user/update/:userId", updateUserInfo);
}

