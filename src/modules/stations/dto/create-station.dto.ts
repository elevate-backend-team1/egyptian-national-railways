import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStationDto {
  @ApiProperty({ description: 'Station name in English', example: 'Ramsis' })
  @IsNotEmpty()
  @IsString()
  name_en: string;

  @ApiProperty({ description: 'Station name in Arabic', example: 'رمسيس' })
  @IsNotEmpty()
  @IsString()
  name_ar: string;

  @ApiProperty({ description: 'City name in English', example: 'cairo' })
  @IsNotEmpty()
  @IsString()
  city_en: string;

  @ApiProperty({ description: 'City name in Arabic', example: 'القاهرة' })
  @IsNotEmpty()
  @IsString()
  city_ar: string;

  @ApiProperty({ description: 'Unique station code', example: 'RMS123' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ description: 'Distance from main zero in kilometers', example: 5 })
  @IsNotEmpty()
  km_from_main_zero: number;

  @ApiProperty({ description: 'Geographical location of the station', example: { lat: 30.0444, lng: 31.2357 } })
  location: { lat: number; lng: number };
}
