import { Body, Controller, Param, Patch, Post, Req } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { Public } from 'src/common/decorators/public.decorator';
import { OneWayReservationDto } from './dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import type { AuthRequest } from 'src/common/interfaces/AuthRequest.interface';
import { RoundTripReservationDto } from './dto/round-trip-reservation.dto';

@ApiTags('Tickets')
@ApiBearerAuth()
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketsService: TicketService) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ticket' })
  @ApiParam({ name: 'id', description: 'The ID of the ticket to update' })
  @ApiResponse({ status: 200, description: 'Ticket updated successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  updateTicket(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.ticketsService.updateTicket(id, dto);
  }

  // @Get()
  // @Public()
  // findAll() {
  //   return this.ticketsService.listTickets();
  // }

  // @Delete(':id')
  // delete(@Param('id') id: string) {
  //   return this.ticketsService.deleteTicket(id);
  // }

  @Post('one-way')
  @Public()
  @ApiOperation({ summary: 'Reserve a one-way ticket' })
  @ApiResponse({ status: 201, description: 'Ticket reserved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  reserveOneWay(@Body() dto: OneWayReservationDto, @Req() req: AuthRequest) {
    return this.ticketsService.reserveOneWay(dto, req.user.userId);
  }

  @Post('round-trip')
  @Public()
  @ApiOperation({ summary: 'Reserve a round-trip ticket' })
  @ApiResponse({ status: 201, description: 'Tickets reserved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  reserveRoundTrip(@Body() dto: RoundTripReservationDto, @Req() req: AuthRequest) {
    return this.ticketsService.reserveRoundTrip(dto, req.user.userId);
  }
}
