# Especificación Técnica de la API

Esta sección proporciona detalles técnicos exhaustivos sobre los puntos de enlace (endpoints) de SoberGuard, diseñados para facilitar la extracción y el análisis de datos.

## Información de Conexión

Para acceder a los datos de producción, utilice los siguientes puntos de enlace:

- **Base URL (API):** `https://sober-guard.onrender.com`
- **Base URL (WebSocket):** `wss://sober-guard.onrender.com/ws`
- **Swagger UI (Interactive):** [https://sober-guard.onrender.com/swagger](https://sober-guard.onrender.com/swagger)

---

## Estructura de Datos (Modelos)

Para los analistas de datos, es fundamental entender el esquema de la información almacenada:

### Objeto `Reading` (Lectura)
Representa una captura individual de un sensor.

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `_id` | String (UUID) | Identificador único de la lectura en MongoDB. |
| `value` | Number | Valor analógico detectado (rango típico: 0-1023 para ESP8266). |
| `deviceId` | String | Identificador único del dispositivo que envió el dato. |
| `timestamp` | Date (ISO 8601) | Fecha y hora exacta de la captura. |

---

## Endpoints de Datos

### 1. Historial de Lecturas
Recupera los datos crudos para análisis temporal.

- **URL:** `/api/dashboard/history`
- **Método:** `GET`
- **Respuesta (Array de Objetos):**
  ```json
  [
    {
      "_id": "66268393e8...",
      "value": 450,
      "deviceId": "esp8266_01",
      "timestamp": "2024-04-22T15:30:00.000Z"
    },
    ...
  ]
  ```

### 2. Estadísticas Agregadas
Proporciona métricas pre-calculadas por el servidor.

- **URL:** `/api/dashboard/stats`
- **Método:** `GET`
- **Campos de Respuesta:**
    - `totalReadings` (Number): Cantidad total de registros en la BD.
    - `averageValue` (Number): Promedio aritmético de todos los niveles de alcohol.
    - `lastReading` (Object): El objeto `Reading` más reciente.

---

## Entrada de Datos (Ingesta)

### Registro de Sensor
Utilizado para simular o recibir datos de dispositivos.

- **URL:** `/api/sensor`
- **Método:** `POST`
- **Cuerpo (JSON):**
  ```json
  {
    "value": 512,
    "deviceId": "analista_test_01"
  }
  ```
- **Respuesta:**
  ```json
  {
    "success": true,
    "turnOnLed": false
  }
  ```

---

## Análisis en Tiempo Real (WebSockets)

Para análisis de flujo (streaming data), los analistas pueden conectarse al WebSocket.

- **URL:** `wss://sober-guard.onrender.com/ws`
- **Evento:** `new_reading`
- **Formato del Mensaje:**
  ```json
  {
    "type": "new_reading",
    "data": {
      "value": 450,
      "deviceId": "esp8266_01",
      "timestamp": "2024-04-22T..."
    }
  }
  ```

---

## Notas para el Análisis
1. **Frecuencia:** Los dispositivos están configurados por defecto para enviar datos cada 5 segundos.
2. **Valores Nulos:** El sistema garantiza que `value` y `deviceId` siempre estén presentes.
3. **Formato de Fecha:** Todas las marcas de tiempo están en formato UTC ISO 8601.
