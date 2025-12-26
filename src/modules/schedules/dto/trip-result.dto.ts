import { ApiProperty } from '@nestjs/swagger';
import { Class } from '../../train/enums/car-class.enums';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  IsArray,
  IsMongoId,
  Matches,
  ValidateNested,
  ArrayNotEmpty
} from 'class-validator';
import { Type } from 'class-transformer';

export class CarAvailabilityDto {
  @ApiProperty({
    description: 'Car number',
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  carNumber: number;

  @ApiProperty({
    description: 'Class of the car',
    enum: Class,
    example: Class.FIRST
  })
  @IsNotEmpty()
  @IsEnum(Class)
  class: Class;

  @ApiProperty({
    description: 'Total seats in the car',
    example: 50
  })
  @IsNotEmpty()
  @IsNumber()
  @IsNumber({}, { message: 'Total seats must be a positive number' })
  totalSeats: number;

  @ApiProperty({
    description: 'Number of available seats',
    example: 35
  })
  @IsNotEmpty()
  @IsNumber()
  @IsNumber({}, { message: 'Available seats must be a positive number' })
  availableSeats: number;

  @ApiProperty({
    description: 'List of available seat numbers',
    example: [1, 2, 3, 5, 7, 8]
  })
  @IsArray()
  @IsNumber({}, { each: true })
  availableSeatNumbers: number[];
}

export class TripResultDto {
  @ApiProperty({
    description: 'Schedule ID',
    example: '60d21b4667d0d8992e610c85'
  })
  @IsNotEmpty()
  @IsMongoId()
  scheduleId: string;

  @ApiProperty({
    description: 'Train ID',
    example: '60d21b4667d0d8992e610c84'
  })
  @IsNotEmpty()
  @IsMongoId()
  trainId: string;

  @ApiProperty({
    description: 'Train number',
    example: 'T1234'
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z0-9]+$/, { message: 'Train number must be alphanumeric' })
  trainNumber: string;

  @ApiProperty({
    description: 'Departure time in HH:mm format',
    example: '08:30'
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?\d|2[0-3]):[0-5]\d$/, { message: 'Departure time must be in HH:mm format' })
  departureTime: string;

  @ApiProperty({
    description: 'Arrival time in HH:mm format',
    example: '12:45'
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?\d|2[0-3]):[0-5]\d$/, { message: 'Arrival time must be in HH:mm format' })
  arrivalTime: string;

  @ApiProperty({
    description: 'Duration in minutes',
    example: 255
  })
  @IsNotEmpty()
  @IsNumber()
  @IsNumber({}, { message: 'Duration must be a positive number' })
  durationMinutes: number;

  @ApiProperty({
    description: 'List of cars with seat availability',
    type: [CarAvailabilityDto]
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CarAvailabilityDto)
  cars: CarAvailabilityDto[];
}
