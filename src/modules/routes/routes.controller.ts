import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  @Public()
  async create(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.createRoute(createRouteDto);
  }

  @Get()
  @Public()
  async findAll() {
    return this.routesService.findAll();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }

  @Patch(':id')
  @Public()
  async update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routesService.updateRoute(id, updateRouteDto);
  }

  @Delete(':id')
  @Public()
  async remove(@Param('id') id: string) {
    return this.routesService.removeRoute(id);
  }
}
