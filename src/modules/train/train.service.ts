import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { CarDto } from './dto/car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Train } from './schema/train.schema';
import { Model } from 'mongoose';
import { ApiResponses } from '../../common/dto/response.dto';

@Injectable()
export class TrainService {
  constructor(@InjectModel(Train.name) private trainModel: Model<Train>) {}

  async createTrain(createTrainDto: CreateTrainDto): Promise<Train> {
    // check if train exists
    const existTrain = await this.trainModel.findOne({ trainNumber: createTrainDto.trainNumber });
    if (existTrain) {
      throw new BadRequestException('Train with this number already exists');
    }

    const newTrain = await this.trainModel.create(createTrainDto);
    if (!newTrain) {
      throw new BadRequestException('Failed to create train');
    }
    return newTrain;
  }

  async findAll(): Promise<Train[]> {
    const trainList = await this.trainModel.find();
    if (!trainList || trainList.length === 0) {
      throw new NotFoundException('No trains found');
    }
    return trainList;
  }

  async findOne(id: string): Promise<Train> {
    const train = await this.trainModel.findById(id);
    if (!train) {
      throw new NotFoundException(`Train with ID ${id} not found`);
    }
    return train;
  }

  async updateTrain(id: string, updateTrainDto: UpdateTrainDto): Promise<Train> {
    const updatedTrain = await this.trainModel.findByIdAndUpdate(id, updateTrainDto, { new: true });
    if (!updatedTrain) {
      throw new NotFoundException(`Train with ID ${id} not found`);
    }
    return updatedTrain;
  }

  async removeTrain(id: string): Promise<ApiResponses<void>> {
    const train = await this.trainModel.findByIdAndDelete(id);
    if (!train) {
      throw new NotFoundException(`Train with ID ${id} not found`);
    }
    return ApiResponses.success('Train deleted successfully');
  }

  async addCar(trainId: string, carDto: CarDto): Promise<Train> {
    const train = await this.trainModel.findById(trainId);
    if (!train) {
      throw new NotFoundException(`Train with ID ${trainId} not found`);
    }

    // Check if car with this number already exists in the train
    const carExists = train.cars.some((car) => car.carNumber === carDto.carNumber);
    if (carExists) {
      throw new BadRequestException(`Car with number ${carDto.carNumber} already exists in this train`);
    }

    // Add the new car
    train.cars.push({
      carNumber: carDto.carNumber,
      class: carDto.class,
      totalSeats: carDto.totalSeats,
      unavailableSeats: carDto.unavailableSeats || []
    });

    return await train.save();
  }

  async updateCar(trainId: string, carNumber: number, updateCarDto: UpdateCarDto): Promise<Train> {
    const train = await this.trainModel.findById(trainId);
    if (!train) {
      throw new NotFoundException(`Train with ID ${trainId} not found`);
    }

    // Find the car by number
    const carIndex = train.cars.findIndex((car) => car.carNumber === carNumber);
    if (carIndex === -1) {
      throw new NotFoundException(`Car with number ${carNumber} not found in this train`);
    }

    // Update the car properties
    if (updateCarDto.totalSeats !== undefined) {
      train.cars[carIndex].totalSeats = updateCarDto.totalSeats;
    }
    if (updateCarDto.class !== undefined) {
      train.cars[carIndex].class = updateCarDto.class;
    }
    if (updateCarDto.unavailableSeats !== undefined) {
      train.cars[carIndex].unavailableSeats = updateCarDto.unavailableSeats;
    }

    return await train.save();
  }

  async removeCar(trainId: string, carNumber: number): Promise<Train> {
    const train = await this.trainModel.findById(trainId);
    if (!train) {
      throw new NotFoundException(`Train with ID ${trainId} not found`);
    }

    // Check if the train has at least 2 cars (can't remove the last one)
    if (train.cars.length <= 1) {
      throw new BadRequestException('Cannot remove the last car from a train');
    }

    // Find and remove the car
    const carIndex = train.cars.findIndex((car) => car.carNumber === carNumber);
    if (carIndex === -1) {
      throw new NotFoundException(`Car with number ${carNumber} not found in this train`);
    }

    train.cars.splice(carIndex, 1);
    return await train.save();
  }
}
