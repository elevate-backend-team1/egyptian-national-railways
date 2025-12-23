import { OneWayReservationDto } from './oneWayReservation.dto';

export class RoundTripReservationDto {
  outbound: OneWayReservationDto;
  return: OneWayReservationDto;
}
