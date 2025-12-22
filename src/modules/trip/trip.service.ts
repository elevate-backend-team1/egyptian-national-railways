import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trip } from './schema/trip.schema';
import { ApiResponses } from '../../common/dto/response.dto';
import { ApiFeatures } from '../../common/utils/ApiFeatures';
import { QueryTripDto } from './dto/query-trip.dto';
import { PaginatedResponse, PaginationMetadata } from '../../common/interfaces/pagination.interface';

@Injectable()
export class TripService {
  constructor(@InjectModel(Trip.name) private tripModel: Model<Trip>) {}

  // Create a new trip
  async createTrip(createTripDto: CreateTripDto): Promise<Trip> {
    const newTrip = await this.tripModel.create(createTripDto);
    if (!newTrip) {
      throw new BadRequestException('Failed to create trip');
    }
    return newTrip;
  }

  // Get trip list
  async findAll(query: QueryTripDto): Promise<PaginatedResponse<Trip>> {
    const features = new ApiFeatures(this.tripModel.find().populate('train'), query)
      .paginate()
      .filter()
      .sort()
      .limitFields()
      .search(['departureStation', 'arrivalStation']);

    // execute pagination with metadata
    const pagination: PaginationMetadata = await features.paginateWithMeta(this.tripModel);

    // build query
    const trips = await features.getQuery();

    return { pagination, data: trips };
  }

  // Get a specific trip by ID
  async findOne(id: string): Promise<Trip> {
    const trip = await this.tripModel.findById(id);
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }
    return trip;
  }

  // Update a trip by ID
  async update(id: string, updateTripDto: UpdateTripDto): Promise<Trip> {
    const updatedTrip = await this.tripModel.findByIdAndUpdate(id, updateTripDto, { new: true });
    if (!updatedTrip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }
    return updatedTrip;
  }

  // Delete a trip by ID
  async removeTrip(id: string): Promise<ApiResponses<void>> {
    const trip = await this.tripModel.findByIdAndDelete(id);
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }
    return ApiResponses.success('Trip deleted successfully');
  }
}
