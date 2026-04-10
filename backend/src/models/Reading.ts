import { Schema, model, type Document } from "mongoose";

export interface IReading extends Document {
  value: number;
  deviceId: string;
  timestamp: Date;
}

const readingSchema = new Schema<IReading>({
  value: { type: Number, required: true },
  deviceId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
});

export const Reading = model<IReading>("Reading", readingSchema);
