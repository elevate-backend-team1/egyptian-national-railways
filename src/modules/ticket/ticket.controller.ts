import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { TicketService } from './ticket.service';
import { Ticket } from './schema';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import type { AuthRequest } from 'src/common/interfaces/AuthRequest.interface';

@ApiTags('Tickets')
@ApiBearerAuth()
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketsService: TicketService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: CreateTicketDto })
  create(@Request() req: AuthRequest, @Body() dto: CreateTicketDto) {
    const userId = req.user.userId;
    return this.ticketsService.create(userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ticket' })
  @ApiParam({ name: 'id', description: 'Ticket ID', example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'Ticket updated successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiBody({ type: UpdateTicketDto })
  update(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.ticketsService.update(id, dto);
  }

  /**
   * GET/tickets
   * @Returns list of tickets
   */
  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all tickets' })
  @ApiResponse({ status: 200, description: 'List of all tickets', type: [Ticket] })
  async findAllTickets(): Promise<Ticket[]> {
    return await this.ticketsService.listTickets();
  }

  /**
   * DELETE/tickets/:id
   * @Returns no content
   */
  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Delete a ticket' })
  @ApiParam({ name: 'id', description: 'Ticket ID', example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'Ticket deleted successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async deleteTicket(@Param('id') id: string): Promise<string> {
    return await this.ticketsService.deleteTicket(id);
  }
}
