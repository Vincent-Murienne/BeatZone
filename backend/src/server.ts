import Fastify from 'fastify'
import dotenv from 'dotenv';
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'

const app = Fastify()
app.register(cors, {
    origin: '*',
})
app.register(helmet)
const port = Number(process.env.PORT) || 3000

// Charger les variables d'environnement
dotenv.config();

app.get('/', async () => {
    return { hello: 'world' }
})

app.listen({ port }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`🚀 Serveur démarré sur ${address}`)
})

export default app;