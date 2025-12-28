import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ScheduleQueryDto } from './dto/schedule-query-dto';

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
  async findAll(@Query() query: ScheduleQueryDto) {
    return this.schedulesService.findAll(query);
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
}
