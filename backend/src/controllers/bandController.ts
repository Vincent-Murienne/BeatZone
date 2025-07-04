import { FastifyRequest, FastifyReply } from "fastify";
import { fetchAllBands, fetchBandById } from "../models/bandModel";

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
