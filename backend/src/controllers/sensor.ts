import { Elysia, t } from 'elysia';
import { Reading } from '../models/Reading';

// In-memory store for pending commands per device
const pendingCommands: Record<string, { turnOnLed?: boolean }> = {};

export const sensorController = (app: Elysia) =>
  app
    .post(
      '/api/sensor',
      async ({ body, server }) => {
        const { value, deviceId } = body;
        const reading = new Reading({ value, deviceId });
        await reading.save();

        // Broadcast new reading to all WebSocket clients
        server?.publish(
          'readings',
          JSON.stringify({
            type: 'new_reading',
            data: reading,
          }),
        );

        // Check for pending commands
        const turnOnLed = pendingCommands[deviceId]?.turnOnLed || false;
        
        // Reset command after sending
        if (pendingCommands[deviceId]) {
          pendingCommands[deviceId].turnOnLed = false;
        }

        return { success: true, turnOnLed };
      },
      {
        body: t.Object({
          value: t.Number(),
          deviceId: t.String(),
        }),
        detail: {
          tags: ['Sensores'],
          summary: 'Registrar lectura del sensor',
          description: 'Recibe datos del sensor MQ135 desde el hardware y los guarda en la base de datos.',
        },
      },
    )
    .post(
      '/api/device/:deviceId/command',
      ({ params, body }) => {
        const { deviceId } = params;
        
        if (!pendingCommands[deviceId]) {
          pendingCommands[deviceId] = {};
        }
        
        if (body.turnOnLed !== undefined) {
          pendingCommands[deviceId].turnOnLed = body.turnOnLed;
        }

        return { success: true, pendingCommands: pendingCommands[deviceId] };
      },
      {
        params: t.Object({
          deviceId: t.String(),
        }),
        body: t.Object({
          turnOnLed: t.Optional(t.Boolean()),
        }),
        detail: {
          tags: ['Sensores'],
          summary: 'Enviar comando al dispositivo',
          description: 'Encola un comando (ej. encender LED) para ser recogido por el dispositivo hardware.',
        },
      }
    )
    .ws('/ws', {
      open(ws) {
        ws.subscribe('readings');
        console.log('Client connected to WebSocket');
      },
      close(ws) {
        ws.unsubscribe('readings');
        console.log('Client disconnected from WebSocket');
      },
    });
