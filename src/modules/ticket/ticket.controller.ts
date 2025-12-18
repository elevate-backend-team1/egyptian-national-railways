import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { Ticket } from './schema';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import type { AuthRequest } from 'src/common/interfaces/AuthRequest.interface';

@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketsService: TicketService) {}

  @Post()
  create(@Request() req: AuthRequest, @Body() dto: CreateTicketDto) {
    const userId = req.user.userId;
    return this.ticketsService.create(userId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.ticketsService.update(id, dto);
  }

  /**
   * GET/tickets
   * @Returns list of tickets
   */
  @Get()
  @Public()
  async findAllTickets(): Promise<Ticket[]> {
    return await this.ticketsService.listTickets();
  }

  /**
   * DELETE/tickets/:id
   * @Returns no content
   */
  @Delete(':id')
  @Public()
  async deleteTicket(@Param('id') id: string): Promise<string> {
    return await this.ticketsService.deleteTicket(id);
  }
}
