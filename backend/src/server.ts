import Fastify, { fastify } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import registerRoutes from './register'
import loginRoutes from './login'
import eventRoute from "./routes/eventRoute";
import bandRoute from "./routes/bandRoute";
import userRoutes from './routes/usersRoute';
import ownerRoutes from './routes/ownerRoute';

const app = Fastify()
app.register(cors, {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
})

app.register(registerRoutes)
app.register(loginRoutes)

app.register(helmet)
const PORT = Number(process.env.PORT)

app.get('/', async () => {
    return { hello: 'world' }
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

app.register(eventRoute, { prefix: "/api" });
app.register(bandRoute, { prefix: "/api" });
app.register(userRoutes, { prefix: "/api" });
app.register(ownerRoutes, { prefix: "/api" });

export default app;