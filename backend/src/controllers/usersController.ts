import { FastifyRequest, FastifyReply } from "fastify";
import { getUsersInfo, updateUser } from "../models/usersModel";
import { fetchUserBand } from "../models/bandModel";
import { log } from "console";

export const getUserInfo = async (req: FastifyRequest, reply: FastifyReply) => {
    const { userId } = req.params as { userId: string };
    console.log(`Received request for user info with ID: ${userId}`);

    try {
        const data = await getUsersInfo(userId);
        return reply.send(data);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return reply.status(500).send({ error: errorMessage });
    }
};

export const getUserBand = async (req: FastifyRequest, reply: FastifyReply) => {
    const { userId } = req.params as { userId: string };
    console.log(`Received request for user info by ID: ${userId}`);

    try {
        const data = await fetchUserBand(userId);
        if (!data) {
            return reply.status(404).send({ error: 'User not found' });
        }
        return reply.send(data);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return reply.status(500).send({ error: errorMessage });
    }
};

export const updateUserInfo = async (req: FastifyRequest, reply: FastifyReply) => {
    const { userId } = req.params as { userId: string };
    const userData = req.body;

    console.log(`Received request to update user with ID: ${userId}`);

    try {
        const updatedData = await updateUser(userId, userData);
        return reply.send(updatedData);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return reply.status(500).send({ error: errorMessage });
    }
};