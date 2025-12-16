import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket } from './schema';
import { Model, Types } from 'mongoose';
import { ApiResponses } from 'src/common/dto/response.dto';
import { OneWayReservationDto } from './dto';

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


  /**
   * Reserve one way ticket
   */
  async reserveOneWay(body: OneWayReservationDto): Promise<ApiResponses<Ticket>> {

    // Check seat availability
    const seatReserved = await this.ticketModel.findOne({
      travelDate: new Date(body.travelDate),
      carNumber: body.carNumber,
      seatNumber: body.seatNumber,
      status: { $in: ['booked', 'paid'] },
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
      status: 'booked',
  });

    // Return
    return ApiResponses.success('Ticket reserved successfully', ticket);
  }
}
