import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from './schema';
import { Model } from 'mongoose';
import { ApiResponses } from 'src/common/dto/response.dto';

@Injectable()
export class TicketService {
  constructor(@InjectModel(Ticket.name) private ticketModel: Model<Ticket>) {}
  // Get list of tickets
  async listTickets(): Promise<ApiResponses<Ticket[]>> {
    const tickets = await this.ticketModel.find();

    if (!tickets || tickets.length === 0) {
      throw new NotFoundException('No tickets found');
    }
    return ApiResponses.success('', tickets);
  }

  // Delete specific ticket by id
  async deleteTicket(id: string): Promise<ApiResponses<void>> {
    const result = await this.ticketModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return ApiResponses.success('Ticket deleted successfully');
  }
}
