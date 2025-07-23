import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { supabase } from './db'
import { log } from 'console';

export async function loginRoutes(app: FastifyInstance, options: FastifyPluginOptions) {
    app.post('/api/login', async (request, reply) => {
        const body = request.body as any;

        const { email, password } = body;

        if (!email || !password) {
            return reply.code(400).send({ message: 'Email et mot de passe requis' });
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });


            if (error) {
                if (error.code === 'invalid_credentials') {
                    return reply.code(400).send({ message: 'Identifiants invalides' });
                }
                if (error.code === 'email_not_confirmed') {
                    return reply.code(400).send({ message: 'Email non confirmé' });
                }
            }

            return reply.code(200).send({
                message: 'Connexion réussie',
                user: data.user,
                session: data.session
            });

        } catch (err) {
            return reply.code(500).send({ message: 'Erreur interne du serveur' });
        }
    });
}

export async function logoutRoutes(app: FastifyInstance, options: FastifyPluginOptions) {
    app.post('/logout', async (request, reply) => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('Erreur lors de la déconnexion:', error);
                return reply.code(500).send({ message: 'Erreur lors de la déconnexion' });
            }

            return reply.code(200).send({ message: 'Déconnexion réussie' });
        } catch (err) {
            return reply.code(500).send({ message: 'Erreur interne du serveur' });
        }
    });
}