import { IsString, IsNotEmpty, IsNumber, IsDate, IsOptional, IsBoolean, IsEnum, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TrainType, TrainStatus } from '../schema/train.schema';

export class CreateTrainDto {
  @ApiProperty({
    description: 'Unique train number',
    example: 'T-1001'
  })
  @IsString()
  @IsNotEmpty()
  trainNumber: string;

  @ApiProperty({
    description: 'Train name',
    example: 'Cairo Express'
  })
  @IsString()
  @IsNotEmpty()
  trainName: string;

  @ApiProperty({
    description: 'Type of train',
    enum: TrainType,
    example: TrainType.EXPRESS
  })
  @IsEnum(TrainType, { message: 'Invalid train type' })
  @IsNotEmpty()
  type: TrainType;

  @ApiProperty({
    description: 'Current status of the train',
    enum: TrainStatus,
    example: TrainStatus.ACTIVE,
    default: TrainStatus.ACTIVE
  })
  @IsEnum(TrainStatus, { message: 'Invalid train status' })
  status: TrainStatus;

  @ApiProperty({
    description: 'Total number of seats',
    example: 200,
    minimum: 1
  })
  @IsNumber()
  @Min(1, { message: 'Total seats must be at least 1' })
  totalSeats: number;

  @ApiProperty({
    description: 'Number of cars',
    example: 8,
    minimum: 1
  })
  @IsNumber()
  @Min(1, { message: 'Cars must be at least 1' })
  cars: number;

  @ApiPropertyOptional({
    description: 'Number of first class seats',
    example: 50,
    minimum: 0,
    default: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'First class seats cannot be negative' })
  firstClassSeats?: number;

  @ApiPropertyOptional({
    description: 'Number of second class seats',
    example: 100,
    minimum: 0,
    default: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Second class seats cannot be negative' })
  secondClassSeats?: number;

  @ApiPropertyOptional({
    description: 'Number of third class seats',
    example: 50,
    minimum: 0,
    default: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Third class seats cannot be negative' })
  thirdClassSeats?: number;

  @ApiPropertyOptional({
    description: 'List of amenities available on the train',
    example: ['wifi', 'ac', 'dining', 'power_outlets'],
    type: [String],
    default: []
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiPropertyOptional({
    description: 'Maximum speed in km/h',
    example: 160,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Max speed cannot be negative' })
  maxSpeed?: number;

  @ApiPropertyOptional({
    description: 'Train manufacturer',
    example: 'Siemens'
  })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional({
    description: 'Year the train was manufactured',
    example: 2020,
    minimum: 1900
  })
  @IsOptional()
  @IsNumber()
  @Min(1900, { message: 'Year manufactured must be 1900 or later' })
  yearManufactured?: number;

  @ApiPropertyOptional({
    description: 'Last maintenance date',
    example: '2024-11-15',
    type: Date
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastMaintenanceDate?: Date;

  @ApiPropertyOptional({
    description: 'Next scheduled maintenance date',
    example: '2025-02-15',
    type: Date
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  nextMaintenanceDate?: Date;

  @ApiPropertyOptional({
    description: 'Whether the train is active',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
