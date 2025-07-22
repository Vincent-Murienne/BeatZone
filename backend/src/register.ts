import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { supabase } from './db'
import { log } from 'console';
// import bcrypt from 'bcrypt'

async function registerRoutes(app: FastifyInstance, options: FastifyPluginOptions) {
    app.post('/api/register', async (request, reply) => {
        const body = request.body as any;
        try {
            const { type, email, password, pseudo, bandName, music, city, country, businessName, address, postalCode
            } = body;


            if (!type || !email || !password) {
                return reply.code(400).send({ message: 'Données manquantes' });
            }

            if (type === 'artist') {

                if (!email || !pseudo || !password) {
                    return reply.code(400).send({ message: 'Champs artistiques manquants' });
                }

                try {
                    const { data, error } = await supabase.auth.signUp({
                        email: email,
                        password: password
                    })
                    if (error) {
                        return reply.code(500).send({
                            message: 'Erreur lors de la création du compte et l\'insertion ne sera pas effectué(artiste)',
                            detail: error.message
                        });

                    } else if (data.user) {
                        const { data: updateData, error: updateError } = await supabase
                            .from('users')
                            .update({
                                pseudo: pseudo,
                                role: 'artist',
                            })
                            .eq('id_user', data.user.id)

                        if (updateError) {
                            return reply.code(500).send({ message: 'Erreur lors de la création du compte', });

                        }

                        // Insertion dans la table band
                        const { data: bandData, error: bandError } = await supabase
                            .from('band')
                            .insert({
                                nom: bandName,
                                ville: city,
                                pays: country,
                                cree_le: new Date(),
                                id_user: data.user.id // clé étrangère
                            });

                        if (bandError) {
                            return reply.code(500).send({
                                message: 'Erreur lors de l’insertion du groupe (band)',
                                detail: bandError.message
                            });
                        }
                    }

                } catch (error) {
                    return reply.code(500).send({ message: 'Erreur serveur interne (artiste)' });
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
                    return reply.code(500).send({ message: 'Erreur serveur interne (user)' });
                }
            } else if (type === 'owner') {

                if (!email || !pseudo || !password) {
                    return reply.code(400).send({ message: 'Champs artistiques manquants' });
                }

                try {
                    const { data, error } = await supabase.auth.signUp({
                        email: email,
                        password: password
                    })
                    if (error) {
                        return reply.code(500).send({
                            message: 'Erreur lors de la création du compte et l\'insertion ne sera pas effectué(artiste)',
                            detail: error.message
                        });

                    } else if (data.user) {
                        const { data: updateData, error: updateError } = await supabase
                            .from('users')
                            .update({
                                pseudo: pseudo,
                                role: 'owner',
                            })
                            .eq('id_user', data.user.id)

                        if (updateError) {
                            return reply.code(500).send({ message: 'Erreur lors de la création du compte', });

                        }
                        log('data user', data.user.id, businessName, address, city, postalCode);
                        // Insertion dans la table band
                        const { data: bandData, error: bandError } = await supabase
                            .from('owner')
                            .insert({
                                nom_etablissement: businessName,
                                adresse: address,
                                ville: city,
                                code_postal: postalCode,
                                cree_le: new Date(),
                                id_user: data.user.id // clé étrangère
                            });

                        if (bandError) {
                            return reply.code(500).send({
                                message: 'Erreur lors de l’insertion des infos owner',
                                detail: bandError.message
                            });
                        }
                    }

                } catch (error) {
                    return reply.code(500).send({ message: 'Erreur serveur interne (artiste)' });
                }

                return reply.code(201).send({ message: 'Inscription artiste réussie' });

            } else {
                return reply.code(400).send({ message: 'Type d’utilisateur invalide' });
            }
        } catch (err) {
            return reply.code(500).send({ message: 'Erreur interne serveur' });
        }
    });
}

export default registerRoutes
