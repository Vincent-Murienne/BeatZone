import { FastifyRequest, FastifyReply } from "fastify";
import { supabase } from "../db";
import { Event } from "../types/event";

// Fonction générique pour récupérer les valeurs uniques d'un champ
async function getUniqueFieldValues(
    reply: FastifyReply,
    field: string
): Promise<void> {
    const { data, error } = await supabase
        .from("event")
        .select(field)
        .neq(field, "");

    if (error) {
        reply.status(500).send({ error: error.message });
        return;
    }

    // Filtrer les valeurs uniques et non vides
    const uniqueValues = Array.from(
        new Set(
        data
            .map((item: Record<string, any>) => item[field])
            .filter(Boolean)
        )
    );

    reply.send(uniqueValues);
}

// Fonction spécifique pour les suggestions qui combine plusieurs champs
async function getUniqueSuggestions(
    reply: FastifyReply
): Promise<void> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
        .from("event")
        .select("adresse, code_postal, ville")
        .neq("adresse", "")
        .neq("code_postal", "")
        .neq("ville", "")
        .or(`and(debut.lte.${now},fin.gte.${now}),debut.gte.${now}`);

    if (error) {
        reply.status(500).send({ error: error.message });
        return;
    }

    const seen = new Set<string>();
    const suggestions = data
        .map(({ adresse, code_postal, ville }) => `${adresse}, ${code_postal}, ${ville}`)
        .filter((s) => {
        if (seen.has(s)) return false;
        seen.add(s);
        return true;
        });

    reply.send(suggestions);
}

export const getAllEvents = async (req: FastifyRequest, reply: FastifyReply) => {
    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from("event")
        .select("*")
        .or(`and(debut.lte.${now},fin.gte.${now}),debut.gte.${now}`);

    if (error) {
        return reply.status(500).send({ error: error.message });
    }

    return reply.send(data as Event[]);
};

export const getAllSuggestions = async (req: FastifyRequest, reply: FastifyReply) => {
    return getUniqueSuggestions(reply);
};

export const getAllGenres = async (req: FastifyRequest, reply: FastifyReply) => {
    return getUniqueFieldValues(reply, "genre");
};

export const getAllPrices = async (req: FastifyRequest, reply: FastifyReply) => {
    const { data, error } = await supabase
        .from("event")
        .select("prix")
        .not("prix", "is", null);

    if (error) {
        return reply.status(500).send({ error: error.message });
    }

    const uniquePrices = Array.from(
        new Set(data.map(({ prix }) => prix).filter((p) => typeof p === "number" && !isNaN(p)))
    );

    return reply.send(uniquePrices);
};

