import { Elysia, t } from 'elysia';
import { Reading } from '../models/Reading';

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

        return { success: true };
      },
      {
        body: t.Object({
          value: t.Number(),
          deviceId: t.String(),
        }),
      },
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
