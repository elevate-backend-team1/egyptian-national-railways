// import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, Min, Max } from 'class-validator';
// import { Type } from 'class-transformer';
// import { ApiPropertyOptional } from '@nestjs/swagger';
// export class QueryTrainDto {
//   @ApiPropertyOptional({
//     description: 'Filter by train number',
//     example: 'T-1001'
//   })
//   @IsOptional()
//   @IsString()
//   trainNumber?: string;

//   @ApiPropertyOptional({
//     description: 'Filter by train name',
//     example: 'Cairo Express'
//   })
//   @IsOptional()
//   @IsString()
//   trainName?: string;

//   @ApiPropertyOptional({
//     description: 'Filter by train type',
//     enum: TrainType,
//     example: TrainType.EXPRESS
//   })
//   @IsOptional()
//   @IsEnum(TrainType)
//   type?: TrainType;

//   @ApiPropertyOptional({
//     description: 'Filter by train status',
//     enum: TrainStatus,
//     example: TrainStatus.ACTIVE
//   })
//   @IsOptional()
//   @IsEnum(TrainStatus)
//   status?: TrainStatus;

//   @ApiPropertyOptional({
//     description: 'Minimum number of carriages',
//     example: 5,
//     minimum: 1
//   })
//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   @Min(1)
//   minCars?: number;

//   @ApiPropertyOptional({
//     description: 'Filter by specific amenity (checks if amenity exists)',
//     example: 'wifi'
//   })
//   @IsOptional()
//   @IsString()
//   amenities?: string[];

//   @ApiPropertyOptional({
//     description: 'Minimum max speed in km/h',
//     example: 100,
//     minimum: 0
//   })
//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   @Min(0)
//   minMaxSpeed?: number;

//   @ApiPropertyOptional({
//     description: 'Filter by manufacturer',
//     example: 'Siemens'
//   })
//   @IsOptional()
//   @IsString()
//   manufacturer?: string;

//   @ApiPropertyOptional({
//     description: 'Filter by manufacturing year',
//     example: 2020,
//     minimum: 1900
//   })
//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   @Min(1900)
//   yearManufactured?: number;

//   @ApiPropertyOptional({
//     description: 'Filter trains with maintenance due',
//     example: true
//   })
//   @IsOptional()
//   @IsBoolean()
//   @Type(() => Boolean)
//   maintenanceDue?: boolean;

//   @ApiPropertyOptional({
//     description: 'Sort fields (comma-separated, prefix with - for descending)',
//     example: 'trainNumber,-totalSeats'
//   })
//   @IsOptional()
//   @IsString()
//   sort?: string;

//   @ApiPropertyOptional({
//     description: 'Fields to include in response (comma-separated)',
//     example: 'trainNumber,trainName,type,totalSeats'
//   })
//   @IsOptional()
//   @IsString()
//   fields?: string;

//   @ApiPropertyOptional({
//     description: 'Search keyword for train number or name',
//     example: 'Express'
//   })
//   @IsOptional()
//   @IsString()
//   keyword?: string;

//   @ApiPropertyOptional({
//     description: 'Page number for pagination',
//     example: 1,
//     minimum: 1,
//     default: 1
//   })
//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   @Min(1)
//   page?: number;

//   @ApiPropertyOptional({
//     description: 'Number of items per page',
//     example: 10,
//     minimum: 1,
//     maximum: 100,
//     default: 10
//   })
//   @IsOptional()
//   @IsNumber()
//   @Type(() => Number)
//   @Min(1)
//   @Max(100)
//   limit?: number;
// }
