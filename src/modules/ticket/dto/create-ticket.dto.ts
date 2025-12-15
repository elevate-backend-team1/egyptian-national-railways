import { IsMongoId, IsNumber, IsString, IsEnum, IsDateString } from 'class-validator';

export class CreateTicketDto {
  @IsMongoId()
  tripId: string;

  @IsNumber()
  seatNumber: number;

  @IsEnum(['first', 'second', 'third'])
  class: 'first' | 'second' | 'third';

  @IsNumber()
  carNumber: number;

  @IsString()
  fromStation: string;

  @IsString()
  toStation: string;

  @IsDateString()
  travelDate: Date;

  @IsNumber()
  price: number;
}
