import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { ApiResponses } from 'src/common/dto/response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Station } from './schema/stations.schema';

@Injectable()
export class StationsService {
  constructor(@InjectModel(Station.name) private readonly stationModel: Model<Station>) {}

  async createStation(createStationDto: CreateStationDto): Promise<Station> {
    // check if station exist
    const existingStation = await this.stationModel.findOne({ code: createStationDto.code });
    if (existingStation) {
      throw new BadRequestException('Station with this code already exist');
    }

    const newStation = await this.stationModel.create(createStationDto);
    if (!newStation) {
      throw new BadRequestException('Failed to create station');
    }
    return newStation;
  }

  async findAll(): Promise<Station[]> {
    const stations = await this.stationModel.find();
    if (!stations || stations.length === 0) {
      throw new NotFoundException('No stations found');
    }
    return stations;
  }

  async findOne(id: string): Promise<Station> {
    const station = await this.stationModel.findById(id);
    if (!station) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }
    return station;
  }

  async updateStation(id: string, updateStationDto: UpdateStationDto): Promise<Station> {
    const updatedStation = await this.stationModel.findByIdAndUpdate(id, updateStationDto, { new: true });
    if (!updatedStation) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }
    return updatedStation;
  }

  async removeStation(id: string): Promise<ApiResponses<void>> {
    const station = await this.stationModel.findByIdAndDelete(id);
    if (!station) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }
    return ApiResponses.success('Station deleted successfully');
  }
}
