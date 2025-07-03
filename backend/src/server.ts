import Fastify, { fastify } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import eventRoutes from "./routes/eventRoute";

const app = Fastify()
app.register(cors, {
    origin: '*',
})
app.register(helmet)
const PORT = Number(process.env.PORT)

app.get('/', async () => {
    let { data: users, error } = await supabase
    .from('users')
    .select('*')
    
    return { users }
})

app.listen({ 
        port: PORT,
        host: '0.0.0.0'
    }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`🚀 Serveur démarré sur ${address}`)
})

app.register(eventRoutes, { prefix: "/api" });

export default app;