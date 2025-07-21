import Fastify, { fastify } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import registerRoutes from './register'
import loginRoutes from './login'
import eventRoute from "./routes/eventRoute";
import bandRoute from "./routes/bandRoute";
import favoriteRoute from "./routes/favoriteRoute";


const app = Fastify()
app.register(cors, {
    origin: 'http://localhost:5173',
    credentials: true,
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
app.register(favoriteRoute, { prefix: "/api" });


export default app;