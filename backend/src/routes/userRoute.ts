import { FastifyInstance } from "fastify";
import { 
    getUserByEmail, 
    getUserById, 
    updateUserProfile 
} from "../controllers/userController";

export default async function userRoutes(fastify: FastifyInstance) {
    // Récupérer un utilisateur par email (pour le login)
    fastify.get("/users/by-email/:email", getUserByEmail);

    // Récupérer un utilisateur par id
    fastify.get("/users/:id", getUserById);

    // Mettre à jour le profil utilisateur
    fastify.put("/users/:id", updateUserProfile);
}
