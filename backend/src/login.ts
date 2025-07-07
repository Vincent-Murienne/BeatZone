import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { supabase } from './db'

async function loginRoutes(app: FastifyInstance, options: FastifyPluginOptions) {
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
                return reply.code(error?.status || 400).send({ message: error?.code || 'Identifiants invalides mon pote' });
            }

            console.log('Utilisateur connecté:', data.user);
            return reply.code(200).send({
                message: 'Connexion réussie',
                user: data.user,
                session: data.session
            });

        } catch (err) {
            console.error('Erreur lors de la connexion:', err);
            return reply.code(500).send({ message: 'Erreur interne du serveur' });
        }
    });
}

export default loginRoutes;