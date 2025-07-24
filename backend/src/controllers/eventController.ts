import { FastifyRequest, FastifyReply } from "fastify";
import type { Event } from "../types/event";
import {
    fetchEventById,
    fetchUniqueGenres,
    fetchUniqueSuggestions,
    fetchEventsByStatus,
    fetchEventsByArtist,
    fetchEventsByOwner,
    fetchNowFuturEvents
} from "../models/eventModel";
import { EventStatus } from "../types/event";

// GET /eventsDate
export const getNowFuturEvents = async (_req: FastifyRequest, reply: FastifyReply) => {
    const { data, error } = await fetchNowFuturEvents();
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

// GET /events/suggestions
export const getAllSuggestions = async (_req: FastifyRequest, reply: FastifyReply) => {
    const { data, error } = await fetchUniqueSuggestions();
    if (error) return reply.status(500).send({ error: error.message });

    const seen = new Set<string>();
    const suggestions = data
        .map((event) => {
            const owner = Array.isArray(event.id_owner) ? event.id_owner[0] || {} : event.id_owner || {};
            const { adresse, code_postal, ville } = owner;
            return `${adresse}, ${code_postal}, ${ville}`;
        })
        .filter((s) => {
            if (seen.has(s)) return false;
            seen.add(s);
            return true;
        });

    return reply.send(suggestions);
};

export const getEventsByStatus = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const { status } = req.params as { status: EventStatus };
        const { data, error } = await fetchEventsByStatus(status);
        
        if (error) return reply.status(500).send({ error: error.message });
        if (!data) return reply.send([]);
        
        return reply.send(data);
    } catch (error: any) {
        console.error('Error in getEventsByStatus:', error);
        return reply.status(500).send({ error: error.message });
    }
};
export const getEventsByArtist = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id_band, status } = req.params as { id_band: string, status: EventStatus };
    const { data, error } = await fetchEventsByArtist(id_band, status);
    
    if (error) return reply.status(500).send({ error: error.message });
    if (!data) return reply.send([]);
    
    return reply.send(data);
};

export const getEventsByOwner = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id_owner, status } = req.params as { id_owner: string, status: EventStatus };
    const { data, error } = await fetchEventsByOwner(id_owner, status);
    
    if (error) return reply.status(500).send({ error: error.message });
    if (!data) return reply.send([]);
    
    return reply.send(data);
};