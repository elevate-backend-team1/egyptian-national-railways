import { IsArray, IsNumber, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Class } from '../enums/car-class.enums';

export class UpdateCarDto {
  @ApiProperty({ description: 'Total number of seats', example: 50, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  totalSeats?: number;

  @ApiProperty({ description: 'Car class', enum: Class, required: false })
  @IsOptional()
  @IsEnum(Class)
  class?: Class;

  @ApiProperty({ description: 'Unavailable seat numbers', example: [3, 7, 12], type: [Number], required: false })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  unavailableSeats?: number[];
}
