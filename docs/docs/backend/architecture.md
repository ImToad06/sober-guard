# Arquitectura del Backend

El backend de SoberGuard está diseñado para ser extremadamente rápido y eficiente, aprovechando el ecosistema de **Bun**.

## Tecnologías Utilizadas

- **Bun:** Runtime de JavaScript "all-in-one" que sustituye a Node.js, ofreciendo un gestor de paquetes y un ejecutor de tests integrados.
- **ElysiaJS:** Framework web optimizado para Bun, conocido por su tipado estático con TypeScript y su alto rendimiento.
- **MongoDB & Mongoose:** Base de datos NoSQL para almacenar lecturas de sensores y datos de usuario.
- **JWT (JSON Web Tokens):** Para la autenticación segura de usuarios.

## Estructura de Archivos

- `src/index.ts`: Punto de entrada del servidor.
- `src/controllers/`: Lógica de los endpoints (Auth, Sensor, Dashboard).
- `src/models/`: Esquemas de Mongoose.
- `src/services/`: Conexión a base de datos y otros servicios externos.

## Comunicación en Tiempo Real

El backend utiliza **WebSockets** nativos de Elysia para transmitir las lecturas de los sensores en el momento exacto en que llegan. Cuando el servidor recibe un `POST` en `/api/sensor`, automáticamente publica el dato en el canal `readings` al que está suscrito el frontend.
