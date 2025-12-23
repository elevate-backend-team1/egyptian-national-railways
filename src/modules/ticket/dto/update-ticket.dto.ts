import { ApiPropertyOptional } from '@nestjs/swagger';
import { ticketStatus } from '../enums/status.enum';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { PassengerDetailsDto } from './oneWayReservation.dto';
import { Type } from 'class-transformer';

export class UpdateTicketDto {
  @ApiPropertyOptional({ enum: ticketStatus })
  @IsOptional()
  @IsEnum(ticketStatus)
  status?: ticketStatus;

  @ApiPropertyOptional({ type: PassengerDetailsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PassengerDetailsDto)
  passengerDetails: PassengerDetailsDto;
}
