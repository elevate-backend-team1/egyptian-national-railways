import { Body, Controller, Param, Patch, Post, Req } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { Public } from 'src/common/decorators/public.decorator';
import { OneWayReservationDto } from './dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import type { AuthRequest } from 'src/common/interfaces/AuthRequest.interface';
import { RoundTripReservationDto } from './dto/round-trip-reservation.dto';

@ApiTags('Tickets')
@ApiBearerAuth()
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketsService: TicketService) {}

  @Patch(':id')
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
  reserveOneWay(@Body() dto: OneWayReservationDto, @Req() req: AuthRequest) {
    return this.ticketsService.reserveOneWay(dto, req.user.userId);
  }

  @Post('round-trip')
  @Public()
  reserveRoundTrip(@Body() dto: RoundTripReservationDto, @Req() req: AuthRequest) {
    return this.ticketsService.reserveRoundTrip(dto, req.user.userId);
  }
}
