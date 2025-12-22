import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsOptional,
  IsBoolean,
  Min,
  Matches,
  MinDate,
  IsMongoId
} from 'class-validator';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTripDto {
  @ApiProperty({
    description: 'Train ID reference',
    example: '507f1f77bcf86cd799439011'
  })
  @IsMongoId({ message: 'Invalid train ID format' })
  @IsNotEmpty()
  train: string;

  @ApiProperty({
    description: 'Departure station name',
    example: 'cairo'
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams): string => (typeof value === 'string' ? value.toLowerCase().trim() : value))
  departureStation: string;

  @ApiProperty({
    description: 'Arrival station name',
    example: 'alexandria'
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams): string => (typeof value === 'string' ? value.toLowerCase().trim() : value))
  arrivalStation: string;

  @ApiProperty({
    description: 'Date of the trip',
    example: '2024-12-25',
    type: Date
  })
  @IsDate()
  @Type(() => Date)
  @MinDate(() => new Date(), { message: 'Trip date must be in the future' })
  tripDate: Date;

  @ApiProperty({
    description: 'Departure time in HH:mm format',
    example: '14:30'
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Departure time must be in HH:mm format (e.g., 14:30)'
  })
  departureTime: string;

  @ApiProperty({
    description: 'Arrival time in HH:mm format',
    example: '18:45'
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Arrival time must be in HH:mm format (e.g., 18:45)'
  })
  arrivalTime: string;

  @ApiProperty({
    description: 'Trip duration in minutes',
    example: 255,
    minimum: 0
  })
  @IsNumber()
  @Min(0, { message: 'Duration must be a positive number' })
  duration: number;

  @ApiProperty({
    description: 'Total number of seats available in the trip',
    example: 50,
    minimum: 1
  })
  @IsNumber()
  @Min(1, { message: 'Total seats must be at least 1' })
  totalSeats: number;

  @ApiPropertyOptional({
    description: 'Number of remaining seats (defaults to totalSeats if not provided)',
    example: 50,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Remaining seats cannot be negative' })
  remainingSeats?: number;

  @ApiProperty({
    description: 'Price of the trip in EGP',
    example: 120,
    minimum: 0
  })
  @IsNumber()
  @Min(0, { message: 'Base Price must be a positive number' })
  basePrice: number;

  @ApiPropertyOptional({
    description: 'First class ticket price in EGP',
    example: 200,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'First class Price must be a positive number' })
  firstClassPrice?: number;

  @ApiPropertyOptional({
    description: 'Second class ticket price in EGP',
    example: 150,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Second class Price must be a positive number' })
  secondClassPrice?: number;

  @ApiPropertyOptional({
    description: 'Whether the trip is active',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
