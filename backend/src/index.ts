import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';
import { connectDB } from './services/db';
import { authController } from './controllers/auth';
import { sensorController } from './controllers/sensor';
import { dashboardController } from './controllers/dashboard';
import { config } from './config';

// Connect to MongoDB
connectDB();

const app = new Elysia()
    .use(cors())
    .use(
        jwt({
            name: 'jwt',
            secret: config.jwtSecret
        })
    )
    .use(authController)
    .use(sensorController)
    .use(dashboardController)
    .listen(config.port);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
