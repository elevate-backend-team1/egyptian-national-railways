import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { SearchTripsDto } from './dto/search-trips.dto';
import { TripResultDto, CarAvailabilityDto } from './dto/trip-result.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Schedule, ScheduleDocument } from './schema/schedule.schema';
import { Model, Types } from 'mongoose';
import { Train, TrainDocument } from '../train/schema/train.schema';
import { ApiResponses } from 'src/common/dto/response.dto';
import { Route, RouteDocument } from '../routes/schema/route.schema';
import { ticketStatus } from '../ticket/enums/status.enum';
import { AggregatedRoute } from './interface/aggregate.interface';
import { Ticket, TicketDocument } from '../ticket/schema';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(Schedule.name)
    private readonly scheduleModel: Model<ScheduleDocument>,

    @InjectModel(Train.name)
    private readonly trainModel: Model<TrainDocument>,

    @InjectModel(Route.name)
    private readonly routeModel: Model<RouteDocument>,

    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<TicketDocument>
  ) {}

  async createSchedule(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const train = await this.trainModel.findById(createScheduleDto.trainId);
    if (!train) {
      throw new NotFoundException(`Train with ID ${createScheduleDto.trainId} not found`);
    }

    const route = await this.routeModel.findById(createScheduleDto.routeId);
    if (!route) {
      throw new NotFoundException(`Route with ID ${createScheduleDto.routeId} not found`);
    }

    const newSchedule = await this.scheduleModel.create(createScheduleDto);
    if (!newSchedule) {
      throw new BadRequestException('Failed to create schedule');
    }
    return newSchedule;
  }

  async findAll(): Promise<Schedule[]> {
    const schedules = await this.scheduleModel.find();
    if (!schedules || schedules.length === 0) {
      throw new NotFoundException('No schedules found');
    }
    return schedules;
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

  async searchTrips(searchDto: SearchTripsDto): Promise<TripResultDto[]> {
    const { fromStationId, toStationId, date, class: travelClass } = searchDto;

    const routes = await this.findValidRoutes(fromStationId, toStationId);
    if (!routes.length) return [];

    const schedules = await this.findSchedules(
      routes.map((r) => r._id),
      date
    );
    if (!schedules.length) return [];

    const results: TripResultDto[] = [];

    for (const schedule of schedules) {
      const train = await this.trainModel.findById(schedule.trainId);
      if (!train || !train.isActive) continue;

      const route = routes.find((r) => r._id.toString() === schedule.routeId.toString());
      if (!route) continue;

      let cars = train.cars;
      if (travelClass) {
        cars = cars.filter((car) => car.class === travelClass);
      }
      if (!cars.length) continue;

      const tickets = await this.ticketModel.find({
        scheduleId: schedule._id,
        status: { $ne: ticketStatus.CANCELLED }
      });

      const bookedSeatsMap = this.buildBookedSeatsMap(tickets, route.fromStationStopOrder, route.toStationStopOrder);

      const carAvailability = this.calculateCarAvailability(cars, bookedSeatsMap);

      if (!carAvailability.some((c) => c.availableSeats > 0)) continue;

      results.push({
        scheduleId: schedule._id.toString(),
        trainId: train._id.toString(),
        trainNumber: train.trainNumber,
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        durationMinutes: schedule.durationMinutes,
        cars: carAvailability
      });
    }

    return results;
  }

  private async findValidRoutes(fromStationId: string, toStationId: string): Promise<AggregatedRoute[]> {
    return this.routeModel.aggregate<AggregatedRoute>([
      {
        $match: {
          $or: [
            {
              startStationId: new Types.ObjectId(fromStationId),
              endStationId: new Types.ObjectId(toStationId)
            },
            {
              'staionLists.stationId': {
                $all: [new Types.ObjectId(fromStationId), new Types.ObjectId(toStationId)]
              }
            }
          ]
        }
      },
      {
        $addFields: {
          fromStationOrder: {
            $cond: [
              { $eq: ['$startStationId', new Types.ObjectId(fromStationId)] },
              0,
              {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: '$staionLists',
                      cond: {
                        $eq: ['$$this.stationId', new Types.ObjectId(fromStationId)]
                      }
                    }
                  },
                  0
                ]
              }
            ]
          },
          toStationOrder: {
            $cond: [
              { $eq: ['$endStationId', new Types.ObjectId(toStationId)] },
              1000,
              {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: '$staionLists',
                      cond: {
                        $eq: ['$$this.stationId', new Types.ObjectId(toStationId)]
                      }
                    }
                  },
                  0
                ]
              }
            ]
          }
        }
      },
      {
        $addFields: {
          fromStationStopOrder: {
            $cond: [{ $eq: ['$fromStationOrder', 0] }, 0, '$fromStationOrder.stopOrder']
          },
          toStationStopOrder: {
            $cond: [{ $eq: ['$toStationOrder', 1000] }, 1000, '$toStationOrder.stopOrder']
          }
        }
      },
      {
        $match: {
          $expr: {
            $lt: ['$fromStationStopOrder', '$toStationStopOrder']
          }
        }
      }
    ]);
  }

  private async findSchedules(routeIds: Types.ObjectId[], date: string) {
    return this.scheduleModel.find({
      routeId: { $in: routeIds },
      date,
      isActive: true,
      status_en: { $ne: 'cancelled' }
    });
  }

  private buildBookedSeatsMap(
    tickets: TicketDocument[],
    searchFromOrder: number,
    searchToOrder: number
  ): Map<string, Set<number>> {
    const map = new Map<string, Set<number>>();

    for (const ticket of tickets) {
      const isOverlapping = ticket.fromOrder < searchToOrder && ticket.toOrder > searchFromOrder;

      if (!isOverlapping) continue;

      const key = `${ticket.carNumber}-${ticket.class}`;

      if (!map.has(key)) {
        map.set(key, new Set<number>());
      }

      map.get(key)!.add(ticket.seatNumber);
    }

    return map;
  }

  private calculateCarAvailability(
    cars: TrainDocument['cars'],
    bookedSeatsMap: Map<string, Set<number>>
  ): CarAvailabilityDto[] {
    return cars.map((car) => {
      const maintenanceSeats = car.unavailableSeats || [];
      const bookedSeats = bookedSeatsMap.get(`${car.carNumber}-${car.class}`) || new Set<number>();

      const allSeats = Array.from({ length: car.totalSeats }, (_, i) => i + 1);

      const availableSeatNumbers = allSeats.filter(
        (seat) => !maintenanceSeats.includes(seat) && !bookedSeats.has(seat)
      );

      return {
        carNumber: car.carNumber,
        class: car.class,
        totalSeats: car.totalSeats,
        availableSeats: availableSeatNumbers.length,
        availableSeatNumbers
      };
    });
  }
}
