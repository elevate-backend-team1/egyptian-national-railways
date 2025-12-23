// import { Test, TestingModule } from '@nestjs/testing';
// import { TripController } from '../trip.controller';
// import { TripService } from '../trip.service';
// import { CreateTripDto } from '../dto/create-trip.dto';
// import { UpdateTripDto } from '../dto/update-trip.dto';
// import { Trip } from '../schema/trip.schema';
// import { ApiResponses } from 'src/common/dto/response.dto';

// describe('TripController', () => {
//   let controller: TripController;
//   let service: TripService;

//   const mockTrip: Trip = {
//     _id: '69428d401fe607c92cae8bb0',
//     departureStation: 'cairo',
//     arrivalStation: 'alex',
//     tripDate: new Date('2026-01-01T00:00:00.000Z'),
//     departureTime: '01:00',
//     arrivalTime: '02:00',
//     duration: 1,
//     totalSeats: 100,
//     remainingSeats: 99,
//     price: 150,
//     isActive: true,
//     createdAt: new Date('2025-12-17T11:00:16.452Z'),
//     updatedAt: new Date('2025-12-17T11:00:16.452Z'),
//     route: 'cairo → alex',
//     formattedDuration: '1h',
//     id: '69428d401fe607c92cae8bb0'
//   } as Trip;

//   const mockTripService = {
//     createTrip: jest.fn(),
//     findAll: jest.fn(),
//     findOne: jest.fn(),
//     update: jest.fn(),
//     removeTrip: jest.fn()
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [TripController],
//       providers: [
//         {
//           provide: TripService,
//           useValue: mockTripService
//         }
//       ]
//     }).compile();

//     controller = module.get<TripController>(TripController);
//     service = module.get<TripService>(TripService);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   describe('create', () => {
//     it('should create a new trip', async () => {
//       const createTripDto: CreateTripDto = {
//         departureStation: 'cairo',
//         arrivalStation: 'alex',
//         tripDate: new Date('2026-01-01T00:00:00.000Z'),
//         departureTime: '01:00',
//         arrivalTime: '02:00',
//         duration: 1,
//         totalSeats: 100,
//         price: 150
//       };

//       mockTripService.createTrip.mockResolvedValue(mockTrip);

//       const result = await controller.create(createTripDto);

//       expect(result).toEqual(mockTrip);
//       expect(service.createTrip).toHaveBeenCalledWith(createTripDto);
//       expect(service.createTrip).toHaveBeenCalledTimes(1);
//     });

//     it('should throw an error if service fails', async () => {
//       const createTripDto: CreateTripDto = {
//         departureStation: 'cairo',
//         arrivalStation: 'alex',
//         tripDate: new Date('2026-01-01T00:00:00.000Z'),
//         departureTime: '01:00',
//         arrivalTime: '02:00',
//         duration: 1,
//         totalSeats: 100,
//         price: 150
//       };

//       const error = new Error('Failed to create trip');
//       mockTripService.createTrip.mockRejectedValue(error);

//       await expect(controller.create(createTripDto)).rejects.toThrow(error);
//       expect(service.createTrip).toHaveBeenCalledWith(createTripDto);
//     });
//   });

//   describe('findAll', () => {
//     it('should return a list of trips with pagination', async () => {
//       const query = { page: 1, limit: 10 };
//       const mockResponse = {
//         pagination: {
//           page: 1,
//           limit: 10,
//           total: 1,
//           totalPages: 1
//         },
//         tripList: [mockTrip]
//       };

//       mockTripService.findAll.mockResolvedValue(mockResponse);

//       const result = await controller.findAll(query);

//       expect(result).toEqual(mockResponse);
//       expect(service.findAll).toHaveBeenCalledWith(query);
//       expect(service.findAll).toHaveBeenCalledTimes(1);
//     });

//     it('should return trips without query parameters', async () => {
//       const mockResponse = {
//         pagination: {
//           page: 1,
//           limit: 10,
//           total: 1,
//           totalPages: 1
//         },
//         tripList: [mockTrip]
//       };

//       mockTripService.findAll.mockResolvedValue(mockResponse);

//       const result = await controller.findAll({});

//       expect(result).toEqual(mockResponse);
//       expect(service.findAll).toHaveBeenCalledWith({});
//     });

//     it('should handle query with filters', async () => {
//       const query = {
//         page: 1,
//         limit: 10,
//         departureStation: 'cairo',
//         arrivalStation: 'alex',
//         tripDate: '2026-01-01'
//       };
//       const mockResponse = {
//         pagination: {
//           page: 1,
//           limit: 10,
//           total: 1,
//           totalPages: 1
//         },
//         tripList: [mockTrip]
//       };

//       mockTripService.findAll.mockResolvedValue(mockResponse);

//       const result = await controller.findAll(query);

//       expect(result).toEqual(mockResponse);
//       expect(service.findAll).toHaveBeenCalledWith(query);
//     });

//     it('should throw an error if service fails', async () => {
//       const error = new Error('Failed to fetch trips');
//       mockTripService.findAll.mockRejectedValue(error);

//       await expect(controller.findAll({})).rejects.toThrow(error);
//     });
//   });

//   describe('findOne', () => {
//     it('should return a single trip by id', async () => {
//       const id = '69428d401fe607c92cae8bb0';
//       mockTripService.findOne.mockResolvedValue(mockTrip);

//       const result = await controller.findOne(id);

//       expect(result).toEqual(mockTrip);
//       expect(service.findOne).toHaveBeenCalledWith(id);
//       expect(service.findOne).toHaveBeenCalledTimes(1);
//     });

//     it('should throw an error if trip not found', async () => {
//       const id = 'nonexistent-id';
//       const error = new Error('Trip not found');
//       mockTripService.findOne.mockRejectedValue(error);

//       await expect(controller.findOne(id)).rejects.toThrow(error);
//       expect(service.findOne).toHaveBeenCalledWith(id);
//     });
//   });

//   describe('update', () => {
//     it('should update a trip', async () => {
//       const id = '69428d401fe607c92cae8bb0';
//       const updateTripDto: UpdateTripDto = {
//         price: 200,
//         isActive: false
//       };
//       const updatedTrip = { ...mockTrip, price: 200, isActive: false };

//       mockTripService.update.mockResolvedValue(updatedTrip);

//       const result = await controller.update(id, updateTripDto);

//       expect(result).toEqual(updatedTrip);
//       expect(service.update).toHaveBeenCalledWith(id, updateTripDto);
//       expect(service.update).toHaveBeenCalledTimes(1);
//     });

//     it('should update remaining seats', async () => {
//       const id = '69428d401fe607c92cae8bb0';
//       const updateTripDto: UpdateTripDto = {
//         remainingSeats: 98
//       };
//       const updatedTrip = { ...mockTrip, remainingSeats: 98 };

//       mockTripService.update.mockResolvedValue(updatedTrip);

//       const result = await controller.update(id, updateTripDto);

//       expect(result).toEqual(updatedTrip);
//       expect(result.remainingSeats).toBe(98);
//       expect(service.update).toHaveBeenCalledWith(id, updateTripDto);
//     });

//     it('should throw an error if update fails', async () => {
//       const id = 'nonexistent-id';
//       const updateTripDto: UpdateTripDto = {
//         price: 200
//       };
//       const error = new Error('Failed to update trip');
//       mockTripService.update.mockRejectedValue(error);

//       await expect(controller.update(id, updateTripDto)).rejects.toThrow(error);
//       expect(service.update).toHaveBeenCalledWith(id, updateTripDto);
//     });
//   });

//   describe('remove', () => {
//     it('should delete a trip', async () => {
//       const id = '69428d401fe607c92cae8bb0';
//       const mockResponse: ApiResponses<void> = {
//         success: true,
//         message: 'Trip deleted successfully'
//       };

//       mockTripService.removeTrip.mockResolvedValue(mockResponse);

//       const result = await controller.remove(id);

//       expect(result).toEqual(mockResponse);
//       expect(service.removeTrip).toHaveBeenCalledWith(id);
//       expect(service.removeTrip).toHaveBeenCalledTimes(1);
//     });

//     it('should throw an error if deletion fails', async () => {
//       const id = 'nonexistent-id';
//       const error = new Error('Failed to delete trip');
//       mockTripService.removeTrip.mockRejectedValue(error);

//       await expect(controller.remove(id)).rejects.toThrow(error);
//       expect(service.removeTrip).toHaveBeenCalledWith(id);
//     });
//   });
// });
