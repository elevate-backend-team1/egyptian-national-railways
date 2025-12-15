import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket, TicketDocument } from './schema';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<TicketDocument>
  ) {}

  async create(userId, createTicketDto: CreateTicketDto): Promise<Ticket> {
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
    if (updateTicketDto.status === 'paid' && !ticket.paidTime) {
      ticket.paidTime = new Date();
    }

    Object.assign(ticket, updateTicketDto);

    return ticket.save();
  }
}
