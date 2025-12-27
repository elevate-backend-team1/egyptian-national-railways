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
  Matches,
  IsMongoId
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateScheduleDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Route MongoDB ObjectId' })
  @IsNotEmpty()
  @IsMongoId()
  routeId: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012', description: 'Train MongoDB ObjectId' })
  @IsNotEmpty()
  @IsMongoId()
  trainId: string;

  @ApiProperty({
    description: 'Departure date',
    example: '2026-12-25',
    type: Date
  })
  @IsDate()
  @Type(() => Date)
  @MinDate(() => new Date(), { message: 'Schedule date must be in the future' })
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
}
