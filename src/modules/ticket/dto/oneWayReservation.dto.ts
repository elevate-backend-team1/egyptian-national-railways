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
import { TicketClass } from '../enums/ticket-class.enum';
export class PassengerDetailsDto {
  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\d{14}$/)
  nationalId: string;
}
export class PassengerWithSeatDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  carNumber: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  seatNumber: number;

  @ApiProperty({ type: PassengerDetailsDto })
  @ValidateNested()
  @Type(() => PassengerDetailsDto)
  passengerDetails: PassengerDetailsDto;
}

export class OneWayReservationDto {
  @IsMongoId()
  userId: string;

  @IsMongoId()
  scheduleId: string;

  @IsMongoId()
  fromStationId: string;

  @IsMongoId()
  toStationId: string;

  @IsEnum(TicketClass)
  class: TicketClass;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PassengerWithSeatDto)
  passengers: PassengerWithSeatDto[];
}
