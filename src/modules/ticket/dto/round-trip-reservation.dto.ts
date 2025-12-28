import { OneWayReservationDto } from './oneWayReservation.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RoundTripReservationDto {
  @ApiProperty({
    description: 'Outbound journey details',
    type: OneWayReservationDto
  })
  outbound: OneWayReservationDto;

  @ApiProperty({
    description: 'Return journey details',
    type: OneWayReservationDto
  })
  return: OneWayReservationDto;
}
