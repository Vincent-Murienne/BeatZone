import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { supabase } from './db'
// import bcrypt from 'bcrypt'

async function registerRoutes(app: FastifyInstance, options: FastifyPluginOptions) {
    app.post('/api/register', async (request, reply) => {
        const body = request.body as any;
        try {
            const { type, email, password, bio, genre, website, pseudo } = body;

            if (!type || !email || !password) {
                return reply.code(400).send({ message: 'Données manquantes' });
            }

            if (type === 'artist') {
                if (!bio || !genre || !website) {
                    return reply.code(400).send({ message: 'Champs artistiques manquants' });
                }
                return reply.code(201).send({ message: 'Inscription artiste réussie' });

            } else if (type === 'user') {
                if (!pseudo || !email || !password) {
                    return reply.code(400).send({ message: 'Champs utilisateur manquants' });
                }

                try {
                    const { data, error } = await supabase.auth.signUp({
                        email: email,
                        password: password
                    })

                    if (error) {
                        return reply.code(500).send({
                            message: 'Erreur lors de la création du compte et l\'insertion ne sera pas effectué',
                            detail: error.message
                        });

                    } else if (data.user) {
                        const { data: updateData, error: updateError } = await supabase
                            .from('users')
                            .update({
                                pseudo: pseudo,
                            }).eq('id_user', data.user.id)

                        if (updateError) {
                            return reply.code(500).send({ message: 'Erreur lors de la création du compte', });

                        }
                    }

                    return reply.code(201).send({ message: 'Inscription réussie bien joué' });
                } catch (err) {
                    return reply.code(500).send({ message: 'Erreur serveur interne' });
                }
            } else {
                return reply.code(400).send({ message: 'Type d’utilisateur invalide' });
            }
        } catch (err) {
            return reply.code(500).send({ message: 'Erreur interne serveur' });
        }
    });
}

export default registerRoutes
