import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsEnum, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Car, TrainTypeAr, TrainTypeEN } from '../schema/train.schema';

export class CreateTrainDto {
  @ApiProperty({
    description: 'Unique train number',
    example: 'T-1001'
  })
  @IsString()
  @IsNotEmpty()
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
    description: 'Number of cars',
    example: 8,
    minimum: 1
  })
  @IsArray()
  cars: Car[];

  @ApiProperty({
    description: 'Whether the train is active',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
