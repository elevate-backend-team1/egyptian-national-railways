// src/passengers/passengers.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { PassengersService } from './passenger.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { AuthRequest } from 'src/common/interfaces/AuthRequest.interface';
@Controller('passengers')
@ApiTags('Passengers')
@ApiBearerAuth()
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @Post()
  create(@Req() req: AuthRequest, @Body() dto: CreatePassengerDto) {
    return this.passengersService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req: AuthRequest) {
    return this.passengersService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.passengersService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(@Req() req: AuthRequest, @Param('id') id: string, @Body() dto: UpdatePassengerDto) {
    return this.passengersService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.passengersService.remove(req.user.userId, id);
  }
}
