import { Controller, Delete, Get, Param } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { Ticket } from './schema';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiResponse } from 'src/common/dto/response.dto';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketsService: TicketService) {}
  /**
   * GET/tickets
   * @Returns list of tickets
   */
  @Get()
  @Public()
  async findAllTickets(): Promise<ApiResponse<Ticket[]>> {
    return await this.ticketsService.listTickets();
  }

  /**
   * DELETE/tickets/:id
   * @Returns no content
   */
  @Delete(':id')
  @Public()
  async deleteTicket(@Param('id') id: string) {
    return await this.ticketsService.deleteTicket(id);
  }
}
