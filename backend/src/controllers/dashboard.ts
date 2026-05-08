import { Elysia, t } from 'elysia';
import { Reading } from '../models/Reading';

export const dashboardController = (app: Elysia) =>
  app.group('/api/dashboard', (app) =>
    app
      .get(
        '/history',
        async ({ query }) => {
          const limit = query.limit ? parseInt(query.limit) : 100;
          const history = await Reading.find().sort({ timestamp: -1 }).limit(limit);
          return history;
        },
        {
          query: t.Object({
            limit: t.Optional(t.String()),
          }),
          detail: {
            tags: ['Dashboard'],
            summary: 'Historial de lecturas',
            description: 'Obtiene las últimas lecturas registradas. Use el parámetro limit para ajustar la cantidad de datos (por defecto 100).',
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
