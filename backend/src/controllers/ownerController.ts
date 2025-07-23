import { FastifyRequest, FastifyReply } from "fastify";
import { fetchOwnerByIdUser, updateOwner } from "../models/ownerModel";
import { log } from "console";

export const getOwnerByUserId = async (req: FastifyRequest, reply: FastifyReply) => {
    const { userId } = req.params as { userId: string };
    console.log(`ID: ${userId}`);
    const data = await fetchOwnerByIdUser(userId);
    if (!data) {
        return reply.status(404).send({ error: 'Owner not found' });
    }

    try {
        return reply.send(data);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return reply.status(500).send({ error: errorMessage });
    }
}

export const updateOwnerInfo = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id_owner } = req.params as { id_owner: string };
    const ownerData = req.body;

    console.log(`Received request to update owner with ID: ${id_owner}`);

    try {
        const updatedData = await updateOwner(id_owner, ownerData);
        return reply.send(updatedData);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return reply.status(500).send({ error: errorMessage });
    }
};