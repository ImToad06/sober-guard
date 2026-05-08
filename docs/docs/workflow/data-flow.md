# Flujo de Datos

Para entender SoberGuard, es crucial visualizar el camino que recorre la información desde el aliento del usuario hasta el navegador.

## 1. Captura (Hardware)
El sensor MQ135 detecta la presencia de partículas de etanol. El microcontrolador ESP8266 convierte la señal analógica en un valor numérico (0-1023).

## 2. Transmisión (HTTP)
El microcontrolador empaqueta el valor en un JSON y realiza una petición `POST` a la ruta `/api/sensor` del backend vía Wi-Fi.

## 3. Procesamiento y Almacenamiento (Backend)
El servidor Elysia recibe la petición, valida los datos y:
- Guarda la lectura en la base de datos **MongoDB**.
- Verifica si hay una alerta (ej: nivel de alcohol muy alto).
- Retorna una respuesta al hardware indicando si debe realizar alguna acción física (como encender un LED de alerta).

## 4. Difusión (WebSockets)
Simultáneamente, el servidor emite el nuevo dato a través de un canal de **WebSocket**. Todos los clientes (navegadores) conectados al dashboard reciben este mensaje inmediatamente.

## 5. Visualización (Frontend)
El frontend en SvelteKit recibe el mensaje del WebSocket y actualiza el gráfico en pantalla sin necesidad de que el usuario recargue la página.

---

## Diagrama Conceptual

```text
[ Sensor MQ135 ] 
      | (Señal Analógica)
      v
[ ESP8266 / ESP32 ] 
      | (HTTP POST JSON)
      v
[ Backend (Elysia/Bun) ] ----> [ MongoDB ]
      | (WebSocket Broadcast)
      v
[ Frontend (SvelteKit) ]
```
