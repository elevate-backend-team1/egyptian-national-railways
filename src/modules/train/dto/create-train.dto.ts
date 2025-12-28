import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
  Min,
  Matches,
  ValidateNested,
  ArrayMinSize
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CarDto } from './car.dto';
import { Type } from 'class-transformer';
import { TrainTypeAr, TrainTypeEN } from '../enums/train-type.enum';

export class CreateTrainDto {
  @ApiProperty({
    description: 'Unique train number',
    example: 'T-1001'
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^T-\d+$/, {
    message: 'Name must be started with T- followed by train numbers (e.g., T-1001)'
  })
  trainNumber: string;

  @ApiProperty({
    description: 'Type of train in english',
    enum: TrainTypeEN,
    example: TrainTypeEN.EXPRESS
  })
  @IsEnum(TrainTypeEN, { message: 'Invalid train type' })
  @IsNotEmpty()
  type_en: TrainTypeEN;

  @ApiProperty({
    description: 'Type of train in arabic',
    enum: TrainTypeAr,
    example: TrainTypeAr.EXPRESS
  })
  @IsEnum(TrainTypeAr, { message: 'Invalid train type' })
  @IsNotEmpty()
  type_ar: TrainTypeAr;

  @ApiProperty({
    description: 'Base price per km ',
    example: 50,
    minimum: 0,
    default: 0
  })
  @IsNumber()
  @Min(0, { message: 'Base rate price cannot be negative' })
  base_rate_per_km: number;

  @ApiProperty({
    description: 'Minimum fare for the train',
    example: 200,
    minimum: 1
  })
  @IsNumber()
  @Min(0, { message: 'Minimum fare cannot be negative' })
  min_fare: number;

  @ApiProperty({
    description: 'List of cars in the trip',
    example: [
      {
        carNumber: 101,
        class: 'economy',
        totalSeats: 50,
        unavailableSeats: [3, 7, 12]
      },
      {
        carNumber: 102,
        class: 'business',
        totalSeats: 30,
        unavailableSeats: [1, 2]
      }
    ]
  })
  @IsArray({ message: 'Cars must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CarDto)
  @ArrayMinSize(1, { message: 'At least one car is required' })
  cars: CarDto[];

  @ApiProperty({
    description: 'Whether the train is active',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
