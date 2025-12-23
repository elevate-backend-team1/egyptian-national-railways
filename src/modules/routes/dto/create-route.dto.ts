import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, Matches, Min } from 'class-validator';
import { IRouteStop } from '../interface/route-station.interface';

export class CreateRouteDto {
  @ApiProperty({ description: 'ID of the train associated with the route', example: '64b8f0c2e1d3c2a5f4e8b456' })
  @IsNotEmpty()
  @IsMongoId()
  trainId: string;

  @ApiProperty({ description: 'Route Name', example: 'RT-010' })
  @IsNotEmpty()
  @Matches(/^TR-(?:\d+|number)$/, {
    message: 'Name must be TR-number (e.g., TR-012345)'
  })
  routeName: string;

  @ApiProperty({ description: 'ID of the start station', example: '64b8f0c2e1d3c2a5f4e8b457' })
  @IsNotEmpty()
  @IsMongoId()
  startStationId: string;

  @ApiProperty({ description: 'ID of the End station', example: '64b8f0c2e1d3c2a5f4e8b457' })
  @IsNotEmpty()
  @IsMongoId()
  endStationId: string;

  @ApiProperty({
    description: 'all Stations in this route including start and end stations ',
    example: `[{
    "stationId":"64b8f0c2e1d3c2a5f4e8b458",
    "arrivalTime":"10:00",
    "departureTime":"10:15",
    "stopOrder":1,
    "distanceFromStart":50
    }]`
  })
  @IsNotEmpty()
  staionLists: IRouteStop[];

  @ApiProperty({ description: 'Total duration of the route in minutes', example: 180 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Total duration must be at least 1' })
  totalDuration: number;

  @ApiProperty({ description: 'Total Distance of the route in kilometers', example: 120 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Total Distance must be at least 1' })
  totalDistance: number;
}
