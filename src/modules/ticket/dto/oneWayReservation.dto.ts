import {
  IsArray,
  IsMongoId,
  ValidateNested,
  IsEnum,
  IsString,
  IsInt,
  Min,
  ArrayMinSize,
  Matches
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Class } from 'src/modules/train/enums/car-class.enums';

export class PassengerDetailsDto {
  @ApiProperty({
    description: 'Full name of the passenger',
    example: 'Ahmed Mohamed'
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'National ID of the passenger (14 digits)',
    example: '29001011234567',
    pattern: String.raw`^\d{14}$`
  })
  @IsString()
  @Matches(/^\d{14}$/)
  nationalId: string;
}

export class PassengerWithSeatDto {
  @ApiProperty({
    description: 'Car number for the passenger',
    example: 1,
    minimum: 1
  })
  @IsInt()
  @Min(1)
  carNumber: number;

  @ApiProperty({
    description: 'Seat number for the passenger',
    example: 15,
    minimum: 1
  })
  @IsInt()
  @Min(1)
  seatNumber: number;

  @ApiProperty({
    description: 'Passenger details',
    type: PassengerDetailsDto
  })
  @ValidateNested()
  @Type(() => PassengerDetailsDto)
  passengerDetails: PassengerDetailsDto;
}

export class OneWayReservationDto {
  @ApiProperty({
    description: 'Schedule ID for the trip',
    example: '60d21b4667d0d8992e610c85'
  })
  @IsMongoId()
  scheduleId: string;

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
    description: 'Class of travel',
    enum: Class,
    example: Class.FIRST
  })
  @IsEnum(Class)
  class: Class;

  @ApiProperty({
    description: 'List of passengers with their seat assignments',
    type: [PassengerWithSeatDto],
    minItems: 1
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PassengerWithSeatDto)
  passengers: PassengerWithSeatDto[];
}
