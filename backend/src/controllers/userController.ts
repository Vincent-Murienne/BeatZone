import { FastifyRequest, FastifyReply } from "fastify";
import { fetchUserByEmail, fetchUserById, updateUserProfile as updateUserProfileModel } from "../models/userModel";

// Récupérer un utilisateur par son email (pour le login côté front)
export const getUserByEmail = async (req: FastifyRequest, reply: FastifyReply) => {
    const { email } = req.params as { email: string };
    if (!email) {
        return reply.status(400).send({ message: "Email manquant" });
    }

    const { data, error } = await fetchUserByEmail(email);

    if (error || !data) {
        return reply.status(404).send({ message: "Utilisateur non trouvé" });
    }

    // On adapte le format pour le front
    return reply.send({
        id: data.id_user,
        email: data.email,
        pseudo: data.pseudo,
        avatar_url: data.avatar_url,
        bio: data.bio,
        role: data.role,
    });
};

// Récupérer un utilisateur par son id
export const getUserById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    if (!id) {
        return reply.status(400).send({ message: "ID manquant" });
    }

    const { data, error } = await fetchUserById(id);

    if (error || !data) {
        return reply.status(404).send({ message: "Utilisateur non trouvé" });
    }

    return reply.send({
        id: data.id_user,
        email: data.email,
        pseudo: data.pseudo,
        avatar_url: data.avatar_url,
        bio: data.bio,
        role: data.role,
    });
};

// Mettre à jour le profil utilisateur (pseudo, bio, avatar_url)
export const updateUserProfile = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const { pseudo, bio, avatar_url } = req.body as { pseudo?: string; bio?: string; avatar_url?: string };

    if (!id) {
        return reply.status(400).send({ message: "ID manquant" });
    }

    const updates: any = {};
    if (pseudo !== undefined) updates.pseudo = pseudo;
    if (bio !== undefined) updates.bio = bio;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;

    if (Object.keys(updates).length === 0) {
        return reply.status(400).send({ message: "Aucune donnée à mettre à jour" });
    }

    const { data, error } = await updateUserProfileModel(id, updates);

    if (error || !data) {
        return reply.status(500).send({ message: "Erreur lors de la mise à jour du profil" });
    }

    return reply.send({
        id: data.id_user,
        email: data.email,
        pseudo: data.pseudo,
        avatar_url: data.avatar_url,
        bio: data.bio,
        role: data.role,
    });
};
