import { IsString, IsOptional, IsDate, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryTripDto {
  @ApiPropertyOptional({
    description: 'Filter by departure station',
    example: 'Cairo'
  })
  @IsOptional()
  @IsString()
  departureStation?: string;

  @ApiPropertyOptional({
    description: 'Filter by arrival station',
    example: 'Alexandria'
  })
  @IsOptional()
  @IsString()
  arrivalStation?: string;

  @ApiPropertyOptional({
    description: 'Filter by trip date',
    example: '2024-12-25',
    type: Date
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  tripDate?: Date;

  @ApiPropertyOptional({
    description: 'Filter trips from this date onwards',
    example: '2024-12-20',
    type: Date
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fromDate?: Date;

  @ApiPropertyOptional({
    description: 'Filter trips until this date',
    example: '2024-12-31',
    type: Date
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  toDate?: Date;

  @ApiPropertyOptional({
    description: 'Minimum price filter',
    example: 50,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price filter',
    example: 200,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Minimum remaining seats',
    example: 10,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  minSeats?: number;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Sort fields (comma-separated, prefix with - for descending)',
    example: 'tripDate,-price'
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    default: 1
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Fields to include in response (comma-separated)',
    example: 'departureStation,arrivalStation,price'
  })
  @IsOptional()
  @IsString()
  fields?: string;

  @ApiPropertyOptional({
    description: 'Search keyword for stations (searches both departure and arrival)',
    example: 'Cairo'
  })
  @IsOptional()
  @IsString()
  keyword?: string;
}
