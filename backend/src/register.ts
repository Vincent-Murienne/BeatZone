import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { supabase } from './db'
// import bcrypt from 'bcrypt'

async function registerRoutes(app: FastifyInstance, options: FastifyPluginOptions) {
    app.post('/api/register', async (request, reply) => {
        console.log('Reçu requête /api/register');
        const body = request.body as any;
        console.log(body);
        try {

            const { type, email, password, bio, genre, website, pseudo } = body;

            if (!type || !email || !password) {
                return reply.code(400).send({ message: 'Données manquantes' });
            }

            if (type === 'artist') {
                if (!bio || !genre || !website) {
                    return reply.code(400).send({ message: 'Champs artistiques manquants' });
                }
                console.log('Nouvel artiste:', { email, bio, genre, website });
                return reply.code(201).send({ message: 'Inscription artiste réussie' });

            } else if (type === 'user') {
                if (!pseudo || !email || !password) {
                    return reply.code(400).send({ message: 'Champs utilisateur manquants' });
                }

                try {
                    let { data, error } = await supabase.auth.signUp({
                        email: email,
                        password: password
                    })

                    const cree_le = new Date().toISOString();

                    if (error) {
                        console.error('Erreur insertion utilisateur:', error);
                        return reply.code(500).send({
                            message: 'Erreur lors de la création du compte et l\'insertion ne sera pas effectué',
                            detail: error.message
                        });

                    } else if (data.user) {
                        const { data: updateData, error: updateError } = await supabase
                            .from('users')
                            .insert({
                                pseudo: pseudo,
                                email: email,
                                cree_le: cree_le,
                            })

                            .eq('id', data.user.id)
                        // .select()

                        if (updateError) {
                            console.error('Erreur insertion utilisateur:', updateError);
                            return reply.code(500).send({ message: 'Erreur lors de la création du compte', });

                        }
                    }

                    console.log('Nouvel utilisateur inséré:');
                    return reply.code(201).send({ message: 'Inscription réussie bien joué' });
                } catch (err) {
                    console.error('Exception Supabase:', err);
                    return reply.code(500).send({ message: 'Erreur serveur interne' });
                }
            } else {
                return reply.code(400).send({ message: 'Type d’utilisateur invalide' });
            }
        } catch (err) {
            console.error('Erreur interne dans /api/register:', err);
            return reply.code(500).send({ message: 'Erreur interne serveur' });
        }
    });
}

export default registerRoutes
