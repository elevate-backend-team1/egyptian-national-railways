import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsOptional, IsEnum } from 'class-validator';
import { Class } from '../../train/enums/car-class.enums';

export class SearchTripsDto {
  @ApiProperty({
    description: 'Origin station ID',
    example: '60d21b4667d0d8992e610c86'
  })
  @IsMongoId()
  fromStationId: string;

  @ApiProperty({
    description: 'Destination station ID',
    example: '60d21b4667d0d8992e610c87'
  })
  @IsMongoId()
  toStationId: string;

  @ApiProperty({
    description: 'Date of travel in YYYY-MM-DD format',
    example: '2023-12-25'
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Class of travel',
    enum: Class,
    required: false,
    example: Class.FIRST
  })
  @IsOptional()
  @IsEnum(Class)
  class?: Class;
}
