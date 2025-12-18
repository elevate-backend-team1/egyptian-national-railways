// src/passengers/passengers.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { PassengersService } from './passenger.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { CurrentUser } from 'src/common/decorators/current.user.decorator';
@Controller('passengers')
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @Post()
  create(@CurrentUser() userId: string, @Body() dto: CreatePassengerDto) {
    return this.passengersService.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser() userId: string) {
    return this.passengersService.findAll(userId);
  }

  @Get(':id')
  findOne(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.passengersService.findOne(userId, id);
  }

  @Patch(':id')
  update(@CurrentUser() userId: string, @Param('id') id: string, @Body() dto: UpdatePassengerDto) {
    return this.passengersService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.passengersService.remove(userId, id);
  }
}
