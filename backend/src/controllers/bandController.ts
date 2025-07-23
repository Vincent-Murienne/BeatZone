import { FastifyRequest, FastifyReply } from "fastify";
import { fetchAllBands, fetchBandById, updateBand } from "../models/bandModel";

export const getAllBands = async (_req: FastifyRequest, reply: FastifyReply) => {
    const { data, error } = await fetchAllBands();
    if (error) return reply.status(500).send({ error: error.message });
    return reply.send(data);
};

export const getBandById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const { data, error } = await fetchBandById(id);
    if (error) return reply.status(500).send({ error: error.message });
    return reply.send(data);
};

export const updateBandInfo = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: number };
    const bandData = req.body;

    console.log(`Received request to update band with ID: ${id}`, bandData);
    try {
        const updatedBand = await updateBand(id, bandData);
        return reply.send(updatedBand);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        return reply.status(500).send({ error: errorMessage });
    }
}
