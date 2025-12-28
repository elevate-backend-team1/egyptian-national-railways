import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Schedule } from './schema/schedule.schema';
import { Model, Types } from 'mongoose';
import { Train } from '../train/schema/train.schema';
import { ApiResponses } from 'src/common/dto/response.dto';
import { Route } from '../routes/schema/route.schema';
import { ApiFeatures } from 'src/common/utils/api-features';
import { PaginatedResponse } from 'src/common/interfaces/pagination.interface';
import { ScheduleQueryDto } from './dto/schedule-query-dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
    @InjectModel(Train.name) private trainModel: Model<Train>,
    @InjectModel(Route.name) private routeModel: Model<Route>
  ) {}

  async createSchedule(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    // check train exist
    const train = await this.trainModel.findById(createScheduleDto.trainId);
    if (!train) {
      throw new NotFoundException(`Train with ID ${createScheduleDto.trainId} not found`);
    }
    // check route exist
    const route = await this.routeModel.findById(createScheduleDto.routeId);
    if (!route) {
      throw new NotFoundException(`Route with ID ${createScheduleDto.routeId} not found`);
    }

    const newSchedule = await this.scheduleModel.create({
      ...createScheduleDto,
      routeId: new Types.ObjectId(createScheduleDto.routeId),
      trainId: new Types.ObjectId(createScheduleDto.trainId)
    });

    if (!newSchedule) {
      throw new BadRequestException('Failed to create schedule');
    }

    return newSchedule;
  }

  async findAll(query: ScheduleQueryDto): Promise<PaginatedResponse<Schedule>> {
    const apiFeatures = new ApiFeatures(this.scheduleModel, query, {
      searchFields: ['departureTime', 'arrivalTime', 'status_en', 'status_ar'],
      defaultSort: 'date departureTime',
      defaultLimit: 10,
      maxLimit: 100,
      dateField: 'date', // Specify the date field for fromDate/toDate filtering
      populateFields: []
    });

    return apiFeatures.applyFeatures().execute();
  }

  async findOne(id: string): Promise<Schedule> {
    const schedule = await this.scheduleModel.findById(id);
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return schedule;
  }

  async updateSchedule(id: string, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
    const updatedSchedule = await this.scheduleModel.findByIdAndUpdate(id, updateScheduleDto, { new: true });
    if (!updatedSchedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return updatedSchedule;
  }

  async removeSchedule(id: string): Promise<ApiResponses<void>> {
    const schedule = await this.scheduleModel.findByIdAndDelete(id);
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return ApiResponses.success('Schedule deleted successfully');
  }
}
