import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { SearchTripsDto } from './dto/search-trips.dto';
import { TripResultDto } from './dto/trip-result.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @Public()
  async create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulesService.createSchedule(createScheduleDto);
  }

  @Get()
  @Public()
  async findAll() {
    return this.schedulesService.findAll();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return this.schedulesService.findOne(id);
  }

  @Patch(':id')
  @Public()
  async update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.schedulesService.updateSchedule(id, updateScheduleDto);
  }

  @Delete(':id')
  @Public()
  async remove(@Param('id') id: string) {
    return this.schedulesService.removeSchedule(id);
  }

  @Post('search')
  @Public()
  @ApiOperation({ summary: 'Search for available trips' })
  @ApiResponse({ status: 200, description: 'List of available trips', type: [TripResultDto] })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async searchTrips(@Body() searchDto: SearchTripsDto): Promise<TripResultDto[]> {
    return this.schedulesService.searchTrips(searchDto);
  }
}
