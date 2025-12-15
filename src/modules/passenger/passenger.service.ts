// src/passengers/passengers.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Passenger, PassengerDocument } from './schemas/passenger.schema';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';

@Injectable()
export class PassengersService {
  constructor(
    @InjectModel(Passenger.name)
    private passengerModel: Model<PassengerDocument>,
  ) {}

  create(userId: string, dto: CreatePassengerDto) {
    return this.passengerModel.create({
      ...dto,
      userId: new Types.ObjectId(userId),
    });
  }

  findAll(userId: string) {
    return this.passengerModel.find({ userId }).lean();
  }

  async findOne(userId: string, passengerId: string) {
    const passenger = await this.passengerModel.findOne({
      _id: passengerId,
      userId,
    });

    if (!passenger) {
      throw new NotFoundException('Passenger not found');
    }

    return passenger;
  }

  async update(
    userId: string,
    passengerId: string,
    dto: UpdatePassengerDto,
  ) {
    const passenger = await this.passengerModel.findOneAndUpdate(
      { _id: passengerId, userId },
      dto,
      { new: true },
    );

    if (!passenger) {
      throw new NotFoundException('Passenger not found');
    }

    return passenger;
  }

  async remove(userId: string, passengerId: string) {
    const passenger = await this.passengerModel.findOneAndDelete({
      _id: passengerId,
      userId,
    });

    if (!passenger) {
      throw new NotFoundException('Passenger not found');
    }

    return { message: 'Passenger deleted successfully' };
  }
}
