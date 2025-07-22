import { FastifyRequest, FastifyReply } from "fastify";
import { fetchAllBands, fetchBandById, fetchMusicGenre, searchBandsByName, fetchEventsByBandId } from "../models/bandModel";
import { Band } from "../types/band";

// GET /bands
export const getAllBands = async (_req: FastifyRequest, reply: FastifyReply) => {
    const { data, error } = await fetchAllBands();
    if (error) return reply.status(500).send({ error: error.message });
    return reply.send(data);
};

// GET /band/:id
export const getBandById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const { data, error } = await fetchBandById(id);
    if (error) return reply.status(500).send({ error: error.message });
    return reply.send(data);
};

// GET /bands/search?query=
export const getBandSuggestions = async (req: FastifyRequest, reply: FastifyReply) => {
    const { query } = req.query as { query?: string };

    if (!query || query.length < 2) {
        return reply.send([]); // rien si moins de 2 caractères
    }

    const { data, error } = await searchBandsByName(query);

    if (error) {
        return reply.status(500).send({ error: error.message });
    }

    return reply.send(data);
};

// GET /bands/genres
export const getAllGenres = async (_req: FastifyRequest, reply: FastifyReply) => {
    const { data, error } = await fetchMusicGenre();
    if (error) return reply.status(500).send({ error: error.message });
    if (!data) return reply.send([]);

    const genres = new Set<string>();

    for (const band of data as unknown as Band[]) {
            for (const a of band.avoir || []) {
                const genre = a.genre?.type_musique;
                if (genre) genres.add(genre);
            }
    }

    return reply.send(Array.from(genres));
};

export const getEventsByBandId = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };

    const { data, error } = await fetchEventsByBandId(id);
    if (error) return reply.status(500).send({ error: error.message });
    if (!data) return reply.send([]);

    const band = data[0];
    if (!band || !band.jouer) return reply.send([]);

    const events = band.jouer
        .map((j: any) => j.event)
        .filter((e: any) => e != null);

    return reply.send(events);
};
