import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Counter } from './counter.schema';
import { ticketStatus } from '../enums/status.enum';
import { Class } from 'src/modules/train/enums/car-class.enums';
export type TicketDocument = HydratedDocument<Ticket>;

@Schema({ timestamps: true })
export class Ticket {
  @Prop({
    required: true,
    unique: true
  })
  ticketNumber: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true
  })
  userId: Types.ObjectId;

  @Prop({
    type: {
      fullName: String,
      nationalId: String
    },
    required: true
  })
  passengerDetails: any;

  // @Prop({
  //   type: Types.ObjectId,
  //   ref: 'Trip'
  //   // required: true
  // })
  // tripId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Schedule', required: true })
  scheduleId: Types.ObjectId;

  @Prop({
    type: Number,
    required: true
  })
  seatNumber: number;

  @Prop({
    type: String,
    enum: Class,
    required: true
  })
  class: Class;

  @Prop({
    type: Number,
    required: true
  })
  carNumber: number;

  @Prop({ type: Types.ObjectId, ref: 'Station', required: true })
  fromStationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Station', required: true })
  toStationId: Types.ObjectId;

  // @Prop({
  //   type: Date,
  //   required: true
  // })
  // travelDate: Date;

  @Prop({ required: true })
  fromOrder: number;

  @Prop({ required: true })
  toOrder: number;

  @Prop({
    type: String,
    enum: ticketStatus,
    default: ticketStatus.BOOKED
  })
  status: ticketStatus;

  // @Prop({
  //   type: {
  //     basePrice: Number, // (المسافة * سعر كيلو القطار)
  //     fees: Number, // (تأمين + حجز)
  //     total: Number // السعر النهائي
  //   }
  // })
  @Prop({
    type: Number
  })
  priceDetails: number;

  @Prop({
    type: String
  })
  qrCode: string;

  @Prop({
    type: Date,
    default: () => new Date()
  })
  bookingTime: Date;

  @Prop({
    type: Date
  })
  paidTime: Date;

  @Prop({
    type: Date,
    required: false
  })
  cancelDate?: Date;
}

const TicketSchema = SchemaFactory.createForClass(Ticket);
export const TicketModel = MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]);
TicketSchema.index({ scheduleId: 1, carNumber: 1, seatNumber: 1 }, { unique: true });

/**
 * Auto Generate Cancel Date
 */

TicketSchema.pre('save', function (next) {
  if (this.status === ticketStatus.CANCELLED && !this.cancelDate) {
    this.cancelDate = new Date();
  }
  next();
});

/**
 * Auto Generated Ticket Number
 */

TicketSchema.pre('save', async function (next) {
  if (this.ticketNumber) return next(); // =========> If ticket number is already generated

  const counterModel = this.db.model('Counter'); // =================> Counter Collection
  const year = new Date().getFullYear();
  const counterName = `ticketNumber-${year}`;

  const counter: Counter = await counterModel.findOneAndUpdate(
    {
      name: counterName // =================> search for Counter Name in Counter Collection
    },
    {
      $inc: { value: 1 }
    },
    {
      new: true,
      upsert: true
    }
  );

  const serial: string = counter.value.toString().padStart(6, '0');

  this.ticketNumber = `EG-TR-${year}-${serial}`;

  next();
});
