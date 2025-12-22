import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Train } from './schema/train.schema';
import { Model } from 'mongoose';
import { ApiResponses } from 'src/common/dto/response.dto';
import { QueryTrainDto } from './dto/query-train.dto';
import { ApiFeatures } from 'src/common/utils/ApiFeatures';
import { PaginatedResponse, PaginationMetadata } from 'src/common/interfaces/pagination.interface';

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

  async findAll(queryDto: QueryTrainDto): Promise<PaginatedResponse<Train>> {
    const features = new ApiFeatures(this.trainModel.find(), queryDto)
      .paginate()
      .filter()
      .sort()
      .limitFields()
      .search(['trainName', 'trainNumber']);

    const pagination: PaginationMetadata = await features.paginateWithMeta(this.trainModel);

    const trains = await features.getQuery();

    return { pagination, data: trains };
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
}
