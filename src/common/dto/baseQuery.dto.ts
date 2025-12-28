import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, Max, IsDate } from 'class-validator';

export class BaseQueryDto {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    minimum: 1,
    default: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Sort by fields (comma-separated). Use - for descending order',
    example: 'createdAt,-updatedAt'
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({
    description: 'Select specific fields (comma-separated)',
    example: 'name,email,createdAt'
  })
  @IsOptional()
  @IsString()
  fields?: string;

  @ApiPropertyOptional({
    description: 'Search keyword',
    example: 'search term'
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    description: 'Filter from date (YYYY-MM-DD or ISO date string)',
    example: '2024-12-01',
    type: Date
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fromDate?: Date;

  @ApiPropertyOptional({
    description: 'Filter to date (YYYY-MM-DD or ISO date string)',
    example: '2024-12-31',
    type: Date
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  toDate?: Date;
}
