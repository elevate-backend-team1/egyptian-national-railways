import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { Trip } from './schema/trip.schema';
import { ApiResponses } from '../common/dto/response.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}
  /**
   * POST /trips
   * @Returns the created trip
   */
  @Post()
  @Public()
  async create(@Body() createTripDto: CreateTripDto): Promise<Trip> {
    return this.tripService.createTrip(createTripDto);
  }

  /**
   * GET /trips
   * @param query
   * @returns list of trips
   */
  @Get()
  @Public()
  async findAll(@Query() query: any): Promise<{ pagination: any; tripList: Trip[] }> {
    return this.tripService.findAll(query);
  }

  /**
   * GET /trips/:id
   * @param id
   * @returns specific trip by id
   */
  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string): Promise<Trip> {
    return this.tripService.findOne(id);
  }

  /**
   * PATCH /trips/:id
   * @param id
   * @body updateTripDto
   * @returns updated trip
   */
  @Patch(':id')
  @Public()
  async update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto): Promise<Trip> {
    return this.tripService.update(id, updateTripDto);
  }

  /**
   * DELETE /trips/:id
   * @param id
   * @returns no content
   */
  @Delete(':id')
  @Public()
  async remove(@Param('id') id: string): Promise<ApiResponses<void>> {
    return this.tripService.removeTrip(id);
  }
}
