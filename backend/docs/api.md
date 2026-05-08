# Documentación de la API de SoberGuard

Este documento describe los puntos de enlace (endpoints) de la API para el backend de SoberGuard.

## URL Base
La API está desplegada en: `https://sober-guard.onrender.com`
Desarrollo local: `http://localhost:3000`

---

## Autenticación

### Registro de Usuario
Registra un nuevo usuario en el sistema.

- **URL:** `/auth/signup`
- **Método:** `POST`
- **Cuerpo (JSON):**
  ```json
  {
    "username": "usuario123",
    "email": "usuario@ejemplo.com",
    "password": "mi_password_seguro"
  }
  ```
- **Respuesta Exitosa:**
  - **Código:** 200
  - **Contenido:** `{ "success": true, "message": "User created" }`
- **Respuesta de Error:**
  - **Código:** 400
  - **Contenido:** `{ "error": "User already exists" }`

### Inicio de Sesión (Login)
Autentica a un usuario y devuelve un token JWT.

- **URL:** `/auth/login`
- **Método:** `POST`
- **Cuerpo (JSON):**
  ```json
  {
    "username": "usuario123",
    "password": "mi_password_seguro"
  }
  ```
- **Respuesta Exitosa:**
  - **Código:** 200
  - **Contenido:** `{ "success": true, "token": "<JWT_TOKEN>" }`
- **Respuesta de Error:**
  - **Código:** 401
  - **Contenido:** `{ "error": "Invalid credentials" }`

---

## Sensores y Dispositivos

### Enviar Lectura del Sensor
Utilizado por el hardware (ESP8266/ESP32) para reportar datos del sensor.

- **URL:** `/api/sensor`
- **Método:** `POST`
- **Cuerpo (JSON):**
  ```json
  {
    "value": 450,
    "deviceId": "ESP8266_01"
  }
  ```
- **Respuesta Exitosa:**
  - **Código:** 200
  - **Contenido:** `{ "success": true, "turnOnLed": false }`
- **Notas:**
  - Devuelve `turnOnLed: true` si hay un comando pendiente para que el dispositivo active su LED.
  - Emite automáticamente la lectura a todos los clientes WebSocket conectados.

### Enviar Comando al Dispositivo
Envía un comando (ej. encender LED) a un dispositivo específico.

- **URL:** `/api/device/:deviceId/command`
- **Método:** `POST`
- **Parámetros:** `deviceId` (string)
- **Cuerpo (JSON):**
  ```json
  {
    "turnOnLed": true
  }
  ```
- **Respuesta Exitosa:**
  - **Código:** 200
  - **Contenido:** 
    ```json
    { 
      "success": true, 
      "pendingCommands": { "turnOnLed": true } 
    }
    ```

---

## Panel de Control (Dashboard)

### Obtener Historial de Lecturas
Recupera las últimas 100 lecturas del sensor.

- **URL:** `/api/dashboard/history`
- **Método:** `GET`
- **Respuesta Exitosa:**
  - **Código:** 200
  - **Contenido:** 
    ```json
    [
      {
        "_id": "...",
        "value": 450,
        "deviceId": "ESP8266_01",
        "timestamp": "2024-04-22T..."
      },
      ...
    ]
    ```

### Obtener Estadísticas
Recupera datos agregados para el dashboard.

- **URL:** `/api/dashboard/stats`
- **Método:** `GET`
- **Respuesta Exitosa:**
  - **Código:** 200
  - **Contenido:** 
    ```json
    {
      "totalReadings": 1250,
      "averageValue": 342.5,
      "lastReading": {
        "_id": "...",
        "value": 450,
        "deviceId": "ESP8266_01",
        "timestamp": "2024-04-22T..."
      }
    }
    ```

---

## Actualizaciones en Tiempo Real (WebSockets)

La API proporciona un endpoint de WebSocket para actualizaciones en vivo.

- **URL:** `/ws`
- **Protocolo:** `ws` (o `wss` en producción)
- **Flujo de trabajo:**
  1. Conectarse a `/ws`.
  2. El servidor suscribe automáticamente al cliente al canal de lecturas.
  3. Cuando se recibe una nueva lectura vía `POST /api/sensor`, el servidor emite:
     ```json
     {
       "type": "new_reading",
       "data": {
         "value": 450,
         "deviceId": "ESP8266_01",
         "timestamp": "..."
       }
     }
     ```
