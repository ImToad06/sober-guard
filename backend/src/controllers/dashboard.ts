import { Elysia } from 'elysia';
import { Reading } from '../models/Reading';

export const dashboardController = (app: Elysia) =>
  app.group('/api/dashboard', (app) =>
    app
      .get(
        '/history',
        async () => {
          const history = await Reading.find().sort({ timestamp: -1 }).limit(100);
          return history;
        },
        {
          detail: {
            tags: ['Dashboard'],
            summary: 'Historial de lecturas',
            description: 'Obtiene las últimas 100 lecturas registradas por los sensores.',
          },
        },
      )
      .get(
        '/stats',
        async () => {
          const totalReadings = await Reading.countDocuments();
          const averageValue = await Reading.aggregate([
            { $group: { _id: null, avg: { $avg: '$value' } } },
          ]);
          const lastReading = await Reading.findOne().sort({ timestamp: -1 });

          return {
            totalReadings,
            averageValue: averageValue[0]?.avg || 0,
            lastReading,
          };
        },
        {
          detail: {
            tags: ['Dashboard'],
            summary: 'Estadísticas generales',
            description: 'Calcula el total de lecturas, el promedio y recupera la última lectura.',
          },
        },
      ),
  );
