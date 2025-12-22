import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Route } from './schema/route.schema';
import { Model } from 'mongoose';
import { Train } from '../train/schema/train.schema';
import { ApiResponses } from 'src/common/dto/response.dto';

@Injectable()
export class RoutesService {
  constructor(
    @InjectModel(Route.name) private routeModel: Model<Route>,
    @InjectModel(Train.name) private trainModel: Model<Train>
  ) {}

  async createRoute(createRouteDto: CreateRouteDto): Promise<Route> {
    const train = await this.trainModel.findById(createRouteDto.trainId);
    if (!train) {
      throw new NotFoundException(`Train with ID ${createRouteDto.trainId} not found`);
    }
    // check if route with same name exists
    const existingRoute = await this.routeModel.findOne({ routeName: createRouteDto.routeName });
    if (existingRoute) {
      throw new BadRequestException('Route with this name already exists');
    }

    const newRoute = await this.routeModel.create(createRouteDto);
    if (!newRoute) {
      throw new BadRequestException('Failed to create route');
    }
    return newRoute;
  }

  async findAll(): Promise<Route[]> {
    const routes = await this.routeModel.find();
    if (!routes || routes.length === 0) {
      throw new NotFoundException('No routes found');
    }
    return routes;
  }

  async findOne(id: string): Promise<Route> {
    const route = await this.routeModel.findById(id);
    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
    return route;
  }

  async updateRoute(id: string, updateRouteDto: UpdateRouteDto): Promise<Route> {
    const updatedRoute = await this.routeModel.findByIdAndUpdate(id, updateRouteDto, { new: true });
    if (!updatedRoute) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
    return updatedRoute;
  }

  async removeRoute(id: string): Promise<ApiResponses<void>> {
    const route = await this.routeModel.findByIdAndDelete(id);
    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
    return ApiResponses.success('Route deleted successfully');
  }
}
