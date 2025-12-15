import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from './schema';
import { Model } from 'mongoose';
import { ApiResponse } from 'src/common/dto/response.dto';

@Injectable()
export class TicketService {
  constructor(@InjectModel(Ticket.name) private ticketModel: Model<Ticket>) {}
  // Get list of tickets
  async listTickets(): Promise<ApiResponse<Ticket[]>> {
    const tickets = await this.ticketModel.find();

    if (!tickets || tickets.length === 0) {
      throw new NotFoundException('No tickets found');
    }
    return ApiResponse.success('', tickets);
  }

  // Delete specific ticket by id
  async deleteTicket(id: string): Promise<ApiResponse<void>> {
    const result = await this.ticketModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return ApiResponse.success('Ticket deleted successfully');
  }
}
