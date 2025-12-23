import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  MinDate,
  Matches
  //   IsArray,
  //   ValidateNested,
  //   ArrayMinSize
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateScheduleDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Route MongoDB ObjectId' })
  @IsNotEmpty()
  @IsString()
  routeId: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012', description: 'Train MongoDB ObjectId' })
  @IsNotEmpty()
  @IsString()
  trainId: string;

  //   @ApiProperty({ example: 'EX-1234', description: 'Train number' })
  //   @IsNotEmpty()
  //   @IsString()
  //   trainNumber: string;

  //   @ApiProperty({ example: 'Cairo Express', description: 'Train name' })
  //   @IsNotEmpty()
  //   @IsString()
  //   trainName: string;

  //   @ApiProperty({ example: 'express', description: 'Type of train' })
  //   @IsNotEmpty()
  //   @IsString()
  //   trainType: string;

  @ApiProperty({
    description: 'Departure date',
    example: '2026-12-25',
    type: Date
  })
  @IsDate()
  @Type(() => Date)
  @MinDate(() => new Date(), { message: 'Trip date must be in the future' })
  date: Date;

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

  //   @ApiProperty({ example: '2024-12-25T00:00:00Z', description: 'Arrival date' })
  //   @IsNotEmpty()
  //   @Type(() => Date)
  //   @IsDate()
  //   arrivalDate: Date;

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

  @ApiProperty({ description: 'Journey duration in minutes', example: 510, minimum: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Duration must be a positive number' })
  durationMinutes: number;

  @ApiProperty({
    description: 'Schedule status in english',
    example: ['on_time', 'delayed', 'cancelled'],
    default: 'on_time'
  })
  @IsString()
  status_en: string;

  @ApiProperty({ description: 'Schedule status in arabic', example: ['وصل', 'متأخر', 'ملغى'], default: 'وصل' })
  @IsString()
  status_ar: string;

  @ApiPropertyOptional({ example: true, description: 'Whether schedule is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  //   @ApiProperty({ type: AvailableSeatsDto, description: 'Available seats by class' })
  //   @IsNotEmpty()
  //   @ValidateNested()
  //   @Type(() => AvailableSeatsDto)
  //   availableSeats: AvailableSeatsDto;

  //   @ApiProperty({ type: FarePricingDto, description: 'Fare pricing by class' })
  //   @IsNotEmpty()
  //   @ValidateNested()
  //   @Type(() => FarePricingDto)
  //   farePricing: FarePricingDto;

  //   @ApiProperty({ type: [ScheduleStopDto], description: 'List of stops in schedule' })
  //   @IsNotEmpty()
  //   @IsArray()
  //   @ArrayMinSize(2)
  //   @ValidateNested({ each: true })
  //   @Type(() => ScheduleStopDto)
  //   stops: ScheduleStopDto[];

  //   @ApiPropertyOptional({ example: ['WiFi', 'AC', 'Meals'], description: 'Available amenities' })
  //   @IsOptional()
  //   @IsArray()
  //   @IsString({ each: true })
  //   amenities?: string[];

  //   @ApiPropertyOptional({ example: 'Special holiday service', description: 'Additional remarks' })
  //   @IsOptional()
  //   @IsString()
  //   remarks?: string;
}
