import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsEnum, IsInt, Min, Matches, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { BaseQueryDto } from 'src/common/dto/baseQuery.dto';

export enum ScheduleStatus {
  ON_TIME = 'on_time',
  DELAYED = 'delayed',
  CANCELLED = 'cancelled'
}

/**
 * Query DTO for Schedule module
 * Extends BaseQueryDto with schedule-specific filters
 */
export class ScheduleQueryDto extends BaseQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by route ID',
    example: '507f1f77bcf86cd799439011'
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9a-fA-F]{24}$/, {
    message: 'routeId must be a valid MongoDB ObjectId'
  })
  routeId?: string;

  @ApiPropertyOptional({
    description: 'Filter by train ID',
    example: '507f1f77bcf86cd799439012'
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9a-fA-F]{24}$/, {
    message: 'trainId must be a valid MongoDB ObjectId'
  })
  trainId?: string;

  @ApiPropertyOptional({
    description: 'Filter by exact date (YYYY-MM-DD or ISO date string)',
    example: '2024-12-25',
    type: Date
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: ScheduleStatus,
    example: ScheduleStatus.ON_TIME
  })
  @IsOptional()
  @IsEnum(ScheduleStatus)
  status_en?: ScheduleStatus;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Minimum duration in minutes',
    example: 60,
    minimum: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  'durationMinutes[gte]'?: number;

  @ApiPropertyOptional({
    description: 'Maximum duration in minutes',
    example: 300,
    minimum: 0
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  'durationMinutes[lte]'?: number;

  @ApiPropertyOptional({
    description: 'Departure time filter (HH:mm)',
    example: '14:30'
  })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'departureTime must be in HH:mm format'
  })
  departureTime?: string;

  @ApiPropertyOptional({
    description: 'Arrival time filter (HH:mm)',
    example: '18:45'
  })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'arrivalTime must be in HH:mm format'
  })
  arrivalTime?: string;
}
