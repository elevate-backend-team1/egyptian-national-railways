import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as QRCode from 'qrcode';
import { Ticket, TicketDocument } from './schema';
import { OneWayReservationDto } from './dto';
import { ticketStatus } from './enums/status.enum';
import { StationData } from './interface/station.interface';
// import { PriceDetails } from './interface/price.interface';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Schedule, ScheduleDocument } from '../schedules/schema/schedule.schema';
import { Route, RouteDocument } from '../routes/schema/route.schema';
import { Train, TrainDocument } from '../train/schema/train.schema';
import { RoundTripReservationDto } from './dto/round-trip-reservation.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<TicketDocument>,

    @InjectModel(Schedule.name)
    private readonly scheduleModel: Model<ScheduleDocument>,

    @InjectModel(Route.name)
    private readonly routeModel: Model<RouteDocument>,

    @InjectModel(Train.name)
    private readonly trainModel: Model<TrainDocument>
  ) {}

  async createTickets(dto: OneWayReservationDto, stationData: StationData, priceDetails: number, userId: string) {
    const session = await this.ticketModel.db.startSession();
    session.startTransaction();

    try {
      const tickets: TicketDocument[] = [];

      for (const passenger of dto.passengers) {
        const qrCode = await this.generateQrOrFail(`${dto.scheduleId}-${passenger.carNumber}-${passenger.seatNumber}`);

        const ticket = new this.ticketModel({
          userId: userId,
          scheduleId: dto.scheduleId,
          fromStationId: dto.fromStationId,
          toStationId: dto.toStationId,
          fromOrder: stationData.fromOrder,
          toOrder: stationData.toOrder,
          seatNumber: passenger.seatNumber,
          carNumber: passenger.carNumber,
          class: dto.class,
          passengerDetails: passenger.passengerDetails,
          priceDetails,
          qrCode,
          status: ticketStatus.BOOKED
        });

        await ticket.save({ session });
        tickets.push(ticket);
      }

      await session.commitTransaction();
      return tickets;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  async updateTicket(ticketId: string, dto: UpdateTicketDto, userId: string): Promise<TicketDocument> {
    if (!Types.ObjectId.isValid(ticketId)) {
      throw new BadRequestException('Invalid ticket id');
    }

    const ticket = await this.ticketModel.findById(ticketId);

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    if (ticket.userId.toString() !== userId) {
      throw new BadRequestException('You are not authorized to update this ticket');
    }
    if (dto.passengerDetails) {
      ticket.passengerDetails = dto.passengerDetails;
    }

    await ticket.save();
    return ticket;
  }

  async cancelTicket(id: string) {
    const ticket = await this.ticketModel.findById(id);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    this.validateStatusTransition(ticket.status, ticketStatus.CANCELLED);

    ticket.status = ticketStatus.CANCELLED;
    await ticket.save();
    return ticket;
  }

  private validateStatusTransition(current: ticketStatus, next: ticketStatus) {
    const allowedTransitions: Record<ticketStatus, ticketStatus[]> = {
      [ticketStatus.BOOKED]: [ticketStatus.PAID, ticketStatus.CANCELLED],
      [ticketStatus.PAID]: [ticketStatus.EXPIRED, ticketStatus.CANCELLED, ticketStatus.REFUNDED],
      [ticketStatus.EXPIRED]: [],
      [ticketStatus.CANCELLED]: [],
      [ticketStatus.REFUNDED]: []
    };

    if (!allowedTransitions[current].includes(next)) {
      throw new BadRequestException(`Invalid status transition from ${current} to ${next}`);
    }
  }

  private async generateQrOrFail(data: string): Promise<string> {
    const qr = await QRCode.toDataURL(data);
    if (!qr) throw new Error('QR generation failed');
    return qr;
  }
  async reserveOneWay(dto: OneWayReservationDto, userId: string) {
    const schedule = await this.scheduleModel.findById(dto.scheduleId).populate('routeId');
    if (!schedule || !schedule.routeId || schedule.routeId instanceof Types.ObjectId) {
      throw new Error('Route not populated');
    }
    const route = schedule.routeId as RouteDocument;
    const train = await this.getTrain(route);

    const stationData = this.resolveStations(route, dto.fromStationId, dto.toStationId);

    const priceDetails = this.calculatePrice(train, stationData.distanceKm);

    this.validateSeats(dto, train);
    await this.checkSeatCollision(dto);

    return this.createTickets(dto, stationData, priceDetails, userId);
  }

  async reserveRoundTrip(dto: RoundTripReservationDto, userId: string) {
    const outboundTickets = await this.reserveOneWay(dto.outbound, userId);
    const returnTickets = await this.reserveOneWay(dto.return, userId);
    return { outboundTickets, returnTickets };
  }

  private async getTrain(route: RouteDocument) {
    const routeWithTrain = await this.routeModel.findById(route._id).populate('trainId');
    if (!routeWithTrain || !routeWithTrain.trainId || routeWithTrain.trainId instanceof Types.ObjectId) {
      throw new NotFoundException('Train not found for the route');
    }

    return routeWithTrain.trainId as TrainDocument;
  }

  private resolveStations(route: RouteDocument, fromId: string, toId: string) {
    const from = route.staionLists.find((s) => s.stationId.toString() === fromId);
    const to = route.staionLists.find((s) => s.stationId.toString() === toId);

    if (!from || !to || from.stopOrder >= to.stopOrder) {
      throw new BadRequestException('Invalid stations');
    }

    return {
      fromOrder: from.stopOrder,
      toOrder: to.stopOrder,
      distanceKm: to.distanceFromStart - from.distanceFromStart
    };
  }

  private calculatePrice(train: TrainDocument, distanceKm: number) {
    const base = distanceKm * train.base_rate_per_km;
    const finalBase = Math.max(base, train.min_fare);

    // const fees = train.insurance_fee + train.reservation_fee;

    return finalBase;
    // return {
    //   price: finalBase
    //   total: finalBase + fees
    // };
  }

  private validateSeats(dto: OneWayReservationDto, train: TrainDocument) {
    for (const p of dto.passengers) {
      const car = train.cars.find((c) => c.carNumber === p.carNumber);

      if (!car) throw new BadRequestException('Invalid car');

      if (car.class !== dto.class) throw new BadRequestException('Wrong class');

      if (p.seatNumber > car.totalSeats) throw new BadRequestException('Invalid seat');

      if (car.unavailableSeats?.includes(p.seatNumber)) throw new BadRequestException('Seat unavailable');
    }
  }

  private async checkSeatCollision(dto: OneWayReservationDto) {
    const seatSet = new Set();
    for (const p of dto.passengers) {
      const key = `${p.carNumber}-${p.seatNumber}`;
      if (seatSet.has(key)) {
        throw new BadRequestException(`Duplicate seat in request: Car ${p.carNumber} Seat ${p.seatNumber}`);
      }
      seatSet.add(key);
    }
    const seats = dto.passengers.map((p) => ({
      carNumber: p.carNumber,
      seatNumber: p.seatNumber
    }));

    const reserved = await this.ticketModel.find({
      scheduleId: dto.scheduleId,
      status: { $in: [ticketStatus.BOOKED, ticketStatus.PAID] },
      $or: seats
    });

    if (reserved.length) {
      throw new BadRequestException('Seats taken');
    }
  }
}
