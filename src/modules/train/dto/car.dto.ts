import { IsArray, IsNumber, IsEnum, IsNotEmpty, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Class } from '../schema/train.schema';

export class CarDto {
  @ApiProperty({ description: 'Car identification number', example: 101 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  carNumber: number;

  @ApiProperty({ description: 'Total number of seats', example: 'economy', enum: Class })
  @IsNotEmpty()
  @IsEnum(Class)
  class: string;

  @ApiProperty({ example: 50 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
  totalSeats: number;

  @ApiProperty({ description: 'Unavailable seat numbers', example: [3, 7, 12], type: [Number] })
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  unavailableSeats: number[];
}
