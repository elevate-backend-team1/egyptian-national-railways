import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, Min, min } from 'class-validator';
import { IRouteStop } from '../schema/route.schema';

export class CreateRouteDto {
  @ApiProperty({ description: 'ID of the train associated with the route', example: '64b8f0c2e1d3c2a5f4e8b456' })
  @IsNotEmpty()
  @IsMongoId()
  trainId: string;

  @ApiProperty({ description: 'Route Name', example: 'RT-010' })
  @IsNotEmpty()
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
    description: 'Stops Stations ',
    example:
      '[{"stationId":"64b8f0c2e1d3c2a5f4e8b458","arrivalTime":"10:00","departureTime":"10:15","stopOrder":1,"distanceFromStart":50}]'
  })
  @IsNotEmpty()
  stops: IRouteStop[];

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
