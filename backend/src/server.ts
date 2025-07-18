import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import registerRoutes from './register'
import loginRoutes from './login'

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

export default app;