import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TripService } from '../trip.service';
import { Trip } from '../schema/trip.schema';
import { CreateTripDto } from '../dto/create-trip.dto';
import { UpdateTripDto } from '../dto/update-trip.dto';
import { ApiFeatures } from '../../common/utils/ApiFeatures';

// Mock ApiFeatures
jest.mock('../../common/utils/ApiFeatures');

describe('TripService', () => {
  let service: TripService;
  let model: Model<Trip>;

  const mockTrip = {
    _id: '69428d401fe607c92cae8bb0',
    departureStation: 'cairo',
    arrivalStation: 'suez',
    tripDate: new Date('2026-01-01T00:00:00.000Z'),
    departureTime: '01:00',
    arrivalTime: '02:00',
    duration: 1,
    totalSeats: 100,
    remainingSeats: 99,
    price: 150,
    isActive: true,
    createdAt: new Date('2025-12-17T11:00:16.452Z'),
    updatedAt: new Date('2025-12-17T11:00:16.452Z'),
    route: 'cairo → suez',
    formattedDuration: '1h',
    id: '69428d401fe607c92cae8bb0'
  };

  const mockTripModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripService,
        {
          provide: getModelToken(Trip.name),
          useValue: mockTripModel
        }
      ]
    }).compile();

    service = module.get<TripService>(TripService);
    model = module.get<Model<Trip>>(getModelToken(Trip.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTrip', () => {
    it('should create a new trip successfully', async () => {
      const createTripDto: CreateTripDto = {
        departureStation: 'cairo',
        arrivalStation: 'suez',
        tripDate: new Date('2026-01-01T00:00:00.000Z'),
        departureTime: '01:00',
        arrivalTime: '02:00',
        duration: 1,
        totalSeats: 100,
        price: 150
      };

      mockTripModel.create.mockResolvedValue(mockTrip);

      const result = await service.createTrip(createTripDto);

      expect(result).toEqual(mockTrip);
      expect(mockTripModel.create).toHaveBeenCalledWith(createTripDto);
      expect(mockTripModel.create).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException if trip creation fails', async () => {
      const createTripDto: CreateTripDto = {
        departureStation: 'cairo',
        arrivalStation: 'suez',
        tripDate: new Date('2026-01-01T00:00:00.000Z'),
        departureTime: '01:00',
        arrivalTime: '02:00',
        duration: 1,
        totalSeats: 100,
        price: 150
      };

      mockTripModel.create.mockResolvedValue(null);

      await expect(service.createTrip(createTripDto)).rejects.toThrow(BadRequestException);
      await expect(service.createTrip(createTripDto)).rejects.toThrow('Failed to create trip');
    });

    it('should propagate database errors', async () => {
      const createTripDto: CreateTripDto = {
        departureStation: 'cairo',
        arrivalStation: 'suez',
        tripDate: new Date('2026-01-01T00:00:00.000Z'),
        departureTime: '01:00',
        arrivalTime: '02:00',
        duration: 1,
        totalSeats: 100,
        price: 150
      };

      const dbError = new Error('Database connection failed');
      mockTripModel.create.mockRejectedValue(dbError);

      await expect(service.createTrip(createTripDto)).rejects.toThrow(dbError);
    });
  });

  describe('findAll', () => {
    it('should return trips with pagination', async () => {
      const query = { page: 1, limit: 10 };
      const mockTrips = [mockTrip];
      const mockPagination = {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1
      };

      const mockApiFeatures = {
        filter: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limitFields: jest.fn().mockReturnThis(),
        search: jest.fn().mockReturnThis(),
        paginateWithMeta: jest.fn().mockResolvedValue(mockPagination),
        getQuery: jest.fn().mockResolvedValue(mockTrips)
      };

      (ApiFeatures as jest.Mock).mockImplementation(() => mockApiFeatures);
      mockTripModel.find.mockReturnValue({});

      const result = await service.findAll(query);

      expect(result).toEqual({
        pagination: mockPagination,
        tripList: mockTrips
      });
      expect(ApiFeatures).toHaveBeenCalledWith(mockTripModel.find(), query);
      expect(mockApiFeatures.filter).toHaveBeenCalled();
      expect(mockApiFeatures.sort).toHaveBeenCalled();
      expect(mockApiFeatures.limitFields).toHaveBeenCalled();
      expect(mockApiFeatures.search).toHaveBeenCalledWith(['departureStation', 'arrivalStation']);
      expect(mockApiFeatures.paginateWithMeta).toHaveBeenCalledWith(mockTripModel);
      expect(mockApiFeatures.getQuery).toHaveBeenCalled();
    });

    it('should handle empty query parameters', async () => {
      const query = {};
      const mockTrips = [mockTrip];
      const mockPagination = {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1
      };

      const mockApiFeatures = {
        filter: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limitFields: jest.fn().mockReturnThis(),
        search: jest.fn().mockReturnThis(),
        paginateWithMeta: jest.fn().mockResolvedValue(mockPagination),
        getQuery: jest.fn().mockResolvedValue(mockTrips)
      };

      (ApiFeatures as jest.Mock).mockImplementation(() => mockApiFeatures);
      mockTripModel.find.mockReturnValue({});

      const result = await service.findAll(query);

      expect(result).toEqual({
        pagination: mockPagination,
        tripList: mockTrips
      });
    });

    it('should return empty array when no trips found', async () => {
      const query = { page: 1, limit: 10 };
      const mockPagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      };

      const mockApiFeatures = {
        filter: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limitFields: jest.fn().mockReturnThis(),
        search: jest.fn().mockReturnThis(),
        paginateWithMeta: jest.fn().mockResolvedValue(mockPagination),
        getQuery: jest.fn().mockResolvedValue([])
      };

      (ApiFeatures as jest.Mock).mockImplementation(() => mockApiFeatures);
      mockTripModel.find.mockReturnValue({});

      const result = await service.findAll(query);

      expect(result).toEqual({
        pagination: mockPagination,
        tripList: []
      });
    });

    it('should handle query with filters', async () => {
      const query = {
        page: 1,
        limit: 10,
        departureStation: 'cairo',
        arrivalStation: 'suez'
      };
      const mockTrips = [mockTrip];
      const mockPagination = {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1
      };

      const mockApiFeatures = {
        filter: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limitFields: jest.fn().mockReturnThis(),
        search: jest.fn().mockReturnThis(),
        paginateWithMeta: jest.fn().mockResolvedValue(mockPagination),
        getQuery: jest.fn().mockResolvedValue(mockTrips)
      };

      (ApiFeatures as jest.Mock).mockImplementation(() => mockApiFeatures);
      mockTripModel.find.mockReturnValue({});

      const result = await service.findAll(query);

      expect(result.tripList).toEqual(mockTrips);
      expect(result.pagination).toEqual(mockPagination);
    });
  });

  describe('findOne', () => {
    it('should return a trip by id', async () => {
      const id = '69428d401fe607c92cae8bb0';
      mockTripModel.findById.mockResolvedValue(mockTrip);

      const result = await service.findOne(id);

      expect(result).toEqual(mockTrip);
      expect(mockTripModel.findById).toHaveBeenCalledWith(id);
      expect(mockTripModel.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if trip not found', async () => {
      const id = 'nonexistent-id';
      mockTripModel.findById.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(id)).rejects.toThrow(`Trip with ID ${id} not found`);
      expect(mockTripModel.findById).toHaveBeenCalledWith(id);
    });

    it('should propagate database errors', async () => {
      const id = '69428d401fe607c92cae8bb0';
      const dbError = new Error('Database error');
      mockTripModel.findById.mockRejectedValue(dbError);

      await expect(service.findOne(id)).rejects.toThrow(dbError);
    });
  });

  describe('update', () => {
    it('should update a trip successfully', async () => {
      const id = '69428d401fe607c92cae8bb0';
      const updateTripDto: UpdateTripDto = {
        price: 200,
        isActive: false
      };
      const updatedTrip = { ...mockTrip, ...updateTripDto };

      mockTripModel.findByIdAndUpdate.mockResolvedValue(updatedTrip);

      const result = await service.update(id, updateTripDto);

      expect(result).toEqual(updatedTrip);
      expect(mockTripModel.findByIdAndUpdate).toHaveBeenCalledWith(id, updateTripDto, { new: true });
      expect(mockTripModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if trip not found', async () => {
      const id = 'nonexistent-id';
      const updateTripDto: UpdateTripDto = {
        price: 200
      };

      mockTripModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(service.update(id, updateTripDto)).rejects.toThrow(NotFoundException);
      await expect(service.update(id, updateTripDto)).rejects.toThrow(`Trip with ID ${id} not found`);
    });

    it('should update remaining seats', async () => {
      const id = '69428d401fe607c92cae8bb0';
      const updateTripDto: UpdateTripDto = {
        remainingSeats: 95
      };
      const updatedTrip = { ...mockTrip, remainingSeats: 95 };

      mockTripModel.findByIdAndUpdate.mockResolvedValue(updatedTrip);

      const result = await service.update(id, updateTripDto);

      expect(result.remainingSeats).toBe(95);
      expect(mockTripModel.findByIdAndUpdate).toHaveBeenCalledWith(id, updateTripDto, { new: true });
    });

    it('should propagate database errors', async () => {
      const id = '69428d401fe607c92cae8bb0';
      const updateTripDto: UpdateTripDto = { price: 200 };
      const dbError = new Error('Database error');

      mockTripModel.findByIdAndUpdate.mockRejectedValue(dbError);

      await expect(service.update(id, updateTripDto)).rejects.toThrow(dbError);
    });
  });

  describe('removeTrip', () => {
    it('should delete a trip successfully', async () => {
      const id = '69428d401fe607c92cae8bb0';
      mockTripModel.findByIdAndDelete.mockResolvedValue(mockTrip);

      const result = await service.removeTrip(id);

      expect(result).toEqual({
        success: true,
        message: 'Trip deleted successfully'
      });
      expect(mockTripModel.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(mockTripModel.findByIdAndDelete).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if trip not found', async () => {
      const id = 'nonexistent-id';
      mockTripModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.removeTrip(id)).rejects.toThrow(NotFoundException);
      await expect(service.removeTrip(id)).rejects.toThrow(`Trip with ID ${id} not found`);
      expect(mockTripModel.findByIdAndDelete).toHaveBeenCalledWith(id);
    });

    it('should propagate database errors', async () => {
      const id = '69428d401fe607c92cae8bb0';
      const dbError = new Error('Database error');
      mockTripModel.findByIdAndDelete.mockRejectedValue(dbError);

      await expect(service.removeTrip(id)).rejects.toThrow(dbError);
    });
  });
});
