import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { PassengerDetailsDto } from './oneWayReservation.dto';
import { Type } from 'class-transformer';

export class UpdateTicketDto {
  @ApiPropertyOptional({
    description: 'Updated passenger details',
    type: PassengerDetailsDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PassengerDetailsDto)
  passengerDetails: PassengerDetailsDto;
}
