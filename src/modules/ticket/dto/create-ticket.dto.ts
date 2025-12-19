import { IsMongoId, IsNumber, IsString, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'ID of the trip' })
  @IsMongoId()
  tripId: string;

  @ApiProperty({ example: 15, description: 'Seat number' })
  @IsNumber()
  seatNumber: number;

  @ApiProperty({ example: 'first', enum: ['first', 'second', 'third'], description: 'Class of the ticket' })
  @IsEnum(['first', 'second', 'third'])
  class: 'first' | 'second' | 'third';

  @ApiProperty({ example: 3, description: 'Car number' })
  @IsNumber()
  carNumber: number;

  @ApiProperty({ example: 'Cairo', description: 'Departure station' })
  @IsString()
  fromStation: string;

  @ApiProperty({ example: 'Alexandria', description: 'Arrival station' })
  @IsString()
  toStation: string;

  @ApiProperty({ example: '2023-12-25', description: 'Travel date' })
  @IsDateString()
  travelDate: Date;

  @ApiProperty({ example: 150, description: 'Ticket price' })
  @IsNumber()
  price: number;
}
