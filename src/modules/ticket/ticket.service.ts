import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiResponses } from 'src/common/dto/response.dto';
import { OneWayReservationDto } from './dto';

import { Model, Types } from 'mongoose';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket, TicketDocument } from './schema';
import { ticketStatus } from './enums/status.enum';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<TicketDocument>
  ) {}

  async create(userId: string, createTicketDto: CreateTicketDto): Promise<Ticket> {
    const ticket = new this.ticketModel({
      ...createTicketDto,
      userId: new Types.ObjectId(userId),
      tripId: new Types.ObjectId(createTicketDto.tripId)
    });

    return ticket.save();
  }

  async update(ticketId: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.ticketModel.findById(ticketId);

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    // Business rule
    if (updateTicketDto.status === ticketStatus.PAID && !ticket.paidTime) {
      ticket.paidTime = new Date();
    }

    Object.assign(ticket, updateTicketDto);

    return ticket.save();
  }

  // Get list of tickets
  async listTickets(): Promise<Ticket[]> {
    const tickets = await this.ticketModel.find();

    if (!tickets || tickets.length === 0) {
      throw new NotFoundException('No tickets found');
    }
    return tickets;
  }

  // Delete specific ticket by id
  async deleteTicket(id: string): Promise<string> {
    const result = await this.ticketModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return 'Ticket deleted successfully';
  }

  /**
   * Reserve one way ticket
   */
  async reserveOneWay(body: OneWayReservationDto): Promise<ApiResponses<Ticket>> {
    // Check seat availability
    const seatReserved = await this.ticketModel.findOne({
      travelDate: new Date(body.travelDate),
      carNumber: body.carNumber,
      seatNumber: body.seatNumber,
      status: { $in: ['booked', 'paid'] }
    });

    if (seatReserved) {
      throw new BadRequestException('Seat already reserved');
    }

    // Create document
    const ticket = await this.ticketModel.create({
      userId: body.userId,

      fromStation: body.fromStation,
      toStation: body.toStation,
      travelDate: body.travelDate,

      class: body.class,
      carNumber: body.carNumber,
      seatNumber: body.seatNumber,

      price: body.price,
      status: 'booked'
    });

    // Return
    return ApiResponses.success('Ticket reserved successfully', ticket);
  }
}
