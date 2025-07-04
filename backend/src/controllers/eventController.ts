import { FastifyRequest, FastifyReply } from "fastify";
import {
    fetchAllEvents,
    fetchEventById,
    fetchUniqueFieldValues,
    fetchUniqueSuggestions,
    fetchUniquePrices,
} from "../models/eventModel";

// GET /events
export const getAllEvents = async (_req: FastifyRequest, reply: FastifyReply) => {
    const { data, error } = await fetchAllEvents();
    if (error) return reply.status(500).send({ error: error.message });
    return reply.send(data);
};

// GET /event/:id
export const getEventById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const { data, error } = await fetchEventById(id);
    if (error) return reply.status(500).send({ error: error.message });
    return reply.send(data);
};

// GET /events/genres
export const getAllGenres = async (_req: FastifyRequest, reply: FastifyReply) => {
    const { data, error } = await fetchUniqueFieldValues("genre");
    if (error) return reply.status(500).send({ error: error.message });

    const uniqueGenres = Array.from(
        new Set(data.map((item: Record<string, any>) => item.genre).filter(Boolean))
    );

    return reply.send(uniqueGenres);
};

// GET /events/prices
export const getAllPrices = async (_req: FastifyRequest, reply: FastifyReply) => {
    const { data, error } = await fetchUniquePrices();
    if (error) return reply.status(500).send({ error: error.message });

    const uniquePrices = Array.from(
        new Set(data.map(({ prix }) => prix).filter((p) => typeof p === "number" && !isNaN(p)))
    );

    return reply.send(uniquePrices);
};

// GET /events/suggestions
export const getAllSuggestions = async (_req: FastifyRequest, reply: FastifyReply) => {
    const { data, error } = await fetchUniqueSuggestions();
    if (error) return reply.status(500).send({ error: error.message });

    const seen = new Set<string>();
    const suggestions = data
        .map(({ adresse, code_postal, ville }) => `${adresse}, ${code_postal}, ${ville}`)
        .filter((s) => {
        if (seen.has(s)) return false;
        seen.add(s);
        return true;
        });

    return reply.send(suggestions);
};
