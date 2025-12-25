import { ApiProperty } from '@nestjs/swagger';
import { Class } from '../../train/enums/car-class.enums';

export class CarAvailabilityDto {
  @ApiProperty({
    description: 'Car number',
    example: 1
  })
  carNumber: number;

  @ApiProperty({
    description: 'Class of the car',
    enum: Class,
    example: Class.FIRST
  })
  class: Class;

  @ApiProperty({
    description: 'Total seats in the car',
    example: 50
  })
  totalSeats: number;

  @ApiProperty({
    description: 'Number of available seats',
    example: 35
  })
  availableSeats: number;

  @ApiProperty({
    description: 'List of available seat numbers',
    example: [1, 2, 3, 5, 7, 8]
  })
  availableSeatNumbers: number[];
}

export class TripResultDto {
  @ApiProperty({
    description: 'Schedule ID',
    example: '60d21b4667d0d8992e610c85'
  })
  scheduleId: string;

  @ApiProperty({
    description: 'Train ID',
    example: '60d21b4667d0d8992e610c84'
  })
  trainId: string;

  @ApiProperty({
    description: 'Train number',
    example: 'T1234'
  })
  trainNumber: string;

  @ApiProperty({
    description: 'Departure time in HH:mm format',
    example: '08:30'
  })
  departureTime: string;

  @ApiProperty({
    description: 'Arrival time in HH:mm format',
    example: '12:45'
  })
  arrivalTime: string;

  @ApiProperty({
    description: 'Duration in minutes',
    example: 255
  })
  durationMinutes: number;

  @ApiProperty({
    description: 'List of cars with seat availability',
    type: [CarAvailabilityDto]
  })
  cars: CarAvailabilityDto[];
}
