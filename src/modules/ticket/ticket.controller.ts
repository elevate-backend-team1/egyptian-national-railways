import { Body, Controller, Param, Patch, Post, Request } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketsService: TicketService) {}

  @Post()
  create(@Request() req: any, @Body() dto: CreateTicketDto) {
    const userId = req.user.userId;
    return this.ticketsService.create(userId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.ticketsService.update(id, dto);
  }
}
