import { ApiPropertyOptional } from '@nestjs/swagger';
import { ticketStatus } from '../enums/status.enum';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { PassengerDetailsDto } from './oneWayReservation.dto';
import { Type } from 'class-transformer';

export class UpdateTicketDto {
  @ApiPropertyOptional({
    description: 'New status of the ticket',
    enum: ticketStatus,
    example: ticketStatus.PAID
  })
  @IsOptional()
  @IsEnum(ticketStatus)
  status?: ticketStatus;

  @ApiPropertyOptional({
    description: 'Updated passenger details',
    type: PassengerDetailsDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PassengerDetailsDto)
  passengerDetails: PassengerDetailsDto;
}
