// src/passengers/passengers.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PassengersService } from './passenger.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
// import { AuthGuard } from '../auth/auth.guard';

@Controller('passengers')
// @UseGuards(AuthGuard)
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @Post()
  create(@Req() req, @Body() dto: CreatePassengerDto) {
    return this.passengersService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.passengersService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.passengersService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdatePassengerDto,
  ) {
    return this.passengersService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.passengersService.remove(req.user.id, id);
  }
}
