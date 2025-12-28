import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsMongoId } from 'class-validator';

export class RouteStopDto {
  @ApiProperty({
    description: 'ID of the station',
    example: '64b8f0c2e1d3c2a5f4e8b458'
  })
  @IsNotEmpty()
  @IsMongoId()
  stationId: string;

  @ApiProperty({
    description: 'Arrival time at the station',
    example: '10:00'
  })
  @IsNotEmpty()
  @IsString()
  arrivalTime: string;

  @ApiProperty({
    description: 'Departure time from the station',
    example: '10:15'
  })
  @IsNotEmpty()
  @IsString()
  departureTime: string;

  @ApiProperty({
    description: 'Order of the stop in the route',
    example: 1
  })
  @IsNotEmpty()
  @IsNumber()
  stopOrder: number;

  @ApiProperty({
    description: 'Distance from the start station in kilometers',
    example: 50
  })
  @IsNotEmpty()
  @IsNumber()
  distanceFromStart: number;
}
