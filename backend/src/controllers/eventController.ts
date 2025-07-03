import { FastifyRequest, FastifyReply } from "fastify";
import { supabase } from "../db";
import { Event } from "../types/event";

export const getAllEvents = async (req: FastifyRequest, reply: FastifyReply) => {
    const { data, error } = await supabase
    .from("event")
    .select("*");
    
    if (error) {
        return reply.status(500).send({ error: error.message });
    }

    return reply.send(data as Event[]);
};
