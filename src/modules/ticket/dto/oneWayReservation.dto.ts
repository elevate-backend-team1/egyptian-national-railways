import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class OneWayReservationDto {
  @IsString()
  userId: string;

  @IsString()
  @IsOptional() // TODO: make it required when create trip collection
  tripId?: string;

  @IsString()
  fromStation: string;

  @IsString()
  toStation: string;

  @IsDateString()
  travelDate: Date;

  @IsString()
  class: 'first' | 'second' | 'third';

  @IsNumber()
  seatNumber: number;

  @IsNumber()
  carNumber: number;

  @IsNumber()
  price: number;
}
