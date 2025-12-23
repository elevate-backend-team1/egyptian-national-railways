import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Matches, Max, Min, ValidateNested } from 'class-validator';
export class CoordinatesDto {
  @IsNumber({}, { message: 'Latitude must be a number' })
  @Min(-90, { message: 'Latitude must be at least -90' })
  @Max(90, { message: 'Latitude must be at most 90' })
  lat: number;

  @IsNumber({}, { message: 'Longitude must be a number' })
  @Min(-180, { message: 'Longitude must be at least -180' })
  @Max(180, { message: 'Longitude must be at most 180' })
  lng: number;
}
export class CreateStationDto {
  @ApiProperty({ description: 'Station name in English', example: 'ramsis' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams): string => (typeof value === 'string' ? value.toLowerCase().trim() : value))
  name_en: string;

  @ApiProperty({ description: 'Station name in Arabic', example: 'رمسيس' })
  @IsNotEmpty()
  @IsString()
  name_ar: string;

  @ApiProperty({ description: 'City name in English', example: 'cairo' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: TransformFnParams): string => (typeof value === 'string' ? value.toLowerCase().trim() : value))
  city_en: string;

  @ApiProperty({ description: 'City name in Arabic', example: 'القاهرة' })
  @IsNotEmpty()
  @IsString()
  city_ar: string;

  @ApiProperty({ description: 'Unique station code', example: 'RMS123' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z]+\d+$/, {
    message: 'Station code must be uppercase letters followed by numbers (e.g., RMS123)'
  })
  code: string;

  @ApiProperty({ description: 'Distance from main zero in kilometers', example: 5 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Distance must be positive number' })
  km_from_main_zero: number;

  @ApiProperty({
    description: 'Geographical location of the station',
    example: { lat: 30.0444, lng: 31.2357 },
    type: CoordinatesDto
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  location: CoordinatesDto;
}
