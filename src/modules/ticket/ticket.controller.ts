import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { Ticket } from './schema';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiResponses } from 'src/common/dto/response.dto';
import { OneWayReservationDto } from './dto';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketsService: TicketService) {}
  /**
   * GET/tickets
   * @Returns list of tickets
   */
  @Get()
  @Public()
  async findAllTickets(): Promise<ApiResponses<Ticket[]>> {
    return await this.ticketsService.listTickets();
  }

  /**
   * DELETE/tickets/:id
   * @Returns no content
   */
  @Delete(':id')
  @Public()
  async deleteTicket(@Param('id') id: string): Promise<ApiResponses<void>> {
    return await this.ticketsService.deleteTicket(id);
  }

  /**
   * @api {post} /tickets/onWayReserve Reserve one way ticket
   * @returns {Ticket}
   */
  @Post('onWayReserve')
  @Public()
  reserveOneWay(@Body() body: OneWayReservationDto): Promise<ApiResponses<Ticket>> {
  return this.ticketsService.reserveOneWay(body);
  }
}
