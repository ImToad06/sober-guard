import { Elysia, t } from "elysia";
import { Reading } from "../models/Reading";

export const dashboardController = (app: Elysia) =>
  app.group("/api/dashboard", (app) =>
    app
      .get("/history", async () => {
        const history = await Reading.find().sort({ timestamp: -1 }).limit(100);
        return history;
      })
      .get("/stats", async () => {
        const totalReadings = await Reading.countDocuments();
        const averageValue = await Reading.aggregate([
          { $group: { _id: null, avg: { $avg: "$value" } } },
        ]);
        const lastReading = await Reading.findOne().sort({ timestamp: -1 });

        return {
          totalReadings,
          averageValue: averageValue[0]?.avg || 0,
          lastReading,
        };
      }),
  );
