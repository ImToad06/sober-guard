import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';
import { swagger } from '@elysiajs/swagger';
import { connectDB } from './services/db';
import { authController } from './controllers/auth';
import { sensorController } from './controllers/sensor';
import { dashboardController } from './controllers/dashboard';
import { config } from './config';

connectDB();

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Documentación de la API de SoberGuard',
          version: '1.0.0',
          description: 'API para el sistema de monitoreo de alcohol y seguridad SoberGuard',
        },
        tags: [
          { name: 'Autenticación', description: 'Endpoints para registro e inicio de sesión' },
          { name: 'Sensores', description: 'Endpoints para datos de hardware y comandos de dispositivos' },
          { name: 'Dashboard', description: 'Endpoints para visualización de datos y estadísticas' },
        ],
      },
    })
  )
  .use(
    cors({
      origin: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    })
  )
  .use(
    jwt({
      name: 'jwt',
      secret: config.jwtSecret,
    }),
  )
  .use(authController)
  .use(sensorController)
  .use(dashboardController)
  .listen(config.port);

console.log(`Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
