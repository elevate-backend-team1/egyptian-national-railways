import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min
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

  @ApiProperty({ example: '2024-12-25T00:00:00Z', description: 'Departure date' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({ example: '08:00', description: 'Departure time (HH:mm format)' })
  @IsNotEmpty()
  @IsString()
  departureTime: string;

  //   @ApiProperty({ example: '2024-12-25T00:00:00Z', description: 'Arrival date' })
  //   @IsNotEmpty()
  //   @Type(() => Date)
  //   @IsDate()
  //   arrivalDate: Date;

  @ApiProperty({ example: '16:30', description: 'Arrival time (HH:mm format)' })
  @IsNotEmpty()
  @IsString()
  arrivalTime: string;

  @ApiProperty({ example: 510, description: 'Journey duration in minutes' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  durationMinutes: number;

  @ApiProperty({})
  @IsString()
  status_en: string;

  @ApiProperty({})
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
