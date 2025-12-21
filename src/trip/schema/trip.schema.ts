import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TripDocument = Trip & Document;

@Schema({ timestamps: true })
export class Trip {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Train' })
  train: Types.ObjectId;

  @Prop({ required: true, trim: true })
  departureStation: string;

  @Prop({ required: true, trim: true })
  arrivalStation: string;

  @Prop({ required: true })
  tripDate: Date;

  @Prop({ required: true })
  departureTime: string; // Format: "HH:mm" (e.g., "14:30")

  @Prop({ required: true })
  arrivalTime: string; // Format: "HH:mm" (e.g., "18:45")

  @Prop({ required: true, min: 0 })
  duration: number; // Duration in minutes

  @Prop({ required: true, min: 0 })
  totalSeats: number;

  @Prop({ required: true, min: 0 })
  remainingSeats: number;

  @Prop({ required: true, min: 0 })
  basePrice: number; // Base price or economy/third class price

  @Prop({ min: 0 })
  firstClassPrice?: number;

  @Prop({ min: 0 })
  secondClassPrice?: number;

  @Prop({ default: true })
  isActive: boolean;
}

const TripSchema = SchemaFactory.createForClass(Trip);
export const TripModel = MongooseModule.forFeature([{ name: Trip.name, schema: TripSchema }]);

// Add indexes for better query performance
TripSchema.index({ departureStation: 1, arrivalStation: 1, tripDate: 1 });
TripSchema.index({ tripDate: 1 });

// Virtual property to format trip route
TripSchema.virtual('route').get(function () {
  return `${this.departureStation} → ${this.arrivalStation}`;
});

// Virtual property to format duration as hours and minutes
TripSchema.virtual('formattedDuration').get(function () {
  const hours = Math.floor(this.duration);
  const minutes = Math.round((this.duration - hours) * 60);

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
});

// Ensure virtuals are included when converting to JSON
TripSchema.set('toJSON', { virtuals: true });
TripSchema.set('toObject', { virtuals: true });
