import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket, TicketDocument } from './schema';
import { Status } from './dto/status.enum';

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
    if (updateTicketDto.status === Status.PAID && !ticket.paidTime) {
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
}
