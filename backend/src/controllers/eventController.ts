import { FastifyRequest, FastifyReply } from "fastify";
import type { Event } from "../types/event";
import {
    fetchAllEvents,
    fetchEventById,
    fetchUniqueGenres,
    fetchUniqueSuggestions,
    fetchUniquePrices,
} from "../models/eventModel";

// GET /events
export const getAllEvents = async (_req: FastifyRequest, reply: FastifyReply) => {
    const { data, error } = await fetchAllEvents();
    if (error) return reply.status(500).send({ error: error.message });
    if (!data) return reply.send([]);

    const typedEvents = data as unknown as Event[];
    return reply.send(typedEvents);
};

// GET /event/:id
export const getEventById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const { data, error } = await fetchEventById(id);
    if (error) return reply.status(500).send({ error: error.message });
    if (!data) return reply.status(404).send({ error: "Événement non trouvé" });

    const typedEvent = data as unknown as Event;

    const genresSet = new Set<string>();
    for (const passage of typedEvent.jouer || []) {
        const band = passage.band;
        for (const avoir of band.avoir || []) {
            const genre = avoir.genre?.type_musique;
            if (genre) genresSet.add(genre);
        }
    }

    return reply.send({
        ...typedEvent,
        genres: Array.from(genresSet)
    });
};

// GET /events/genres
export const getAllGenres = async (_req: FastifyRequest, reply: FastifyReply) => {
    const { data, error } = await fetchUniqueGenres();
    if (error) return reply.status(500).send({ error: error.message });
    if (!data) return reply.send([]);

    const genres = new Set<string>();

    for (const event of data as unknown as Event[]) {
        for (const passage of event.jouer || []) {
            const band = passage.band;
            for (const a of band.avoir || []) {
                const genre = a.genre?.type_musique;
                if (genre) genres.add(genre);
            }
        }
    }

    return reply.send(Array.from(genres));
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
