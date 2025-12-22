import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Post()
  @Public()
  async create(@Body() createStationDto: CreateStationDto) {
    return this.stationsService.createStation(createStationDto);
  }

  @Get()
  @Public()
  async findAll() {
    return this.stationsService.findAll();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return this.stationsService.findOne(id);
  }

  @Patch(':id')
  @Public()
  async update(@Param('id') id: string, @Body() updateStationDto: UpdateStationDto) {
    return this.stationsService.updateStation(id, updateStationDto);
  }

  @Delete(':id')
  @Public()
  async remove(@Param('id') id: string) {
    return this.stationsService.removeStation(id);
  }
}
