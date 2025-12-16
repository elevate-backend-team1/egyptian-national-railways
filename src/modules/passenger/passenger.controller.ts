// src/passengers/passengers.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { PassengersService } from './passenger.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
@Controller('passengers')
@UseGuards(JwtAuthGuard)
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreatePassengerDto) {
    return this.passengersService.create((req.user as any)._id, dto);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.passengersService.findAll((req.user as any)._id);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.passengersService.findOne((req.user as any)._id, id);
  }

  @Patch(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdatePassengerDto) {
    return this.passengersService.update((req.user as any)._id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.passengersService.remove((req.user as any)._id, id);
  }
}
