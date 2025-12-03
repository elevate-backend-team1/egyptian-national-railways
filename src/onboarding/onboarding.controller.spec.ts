
import { Test, TestingModule } from '@nestjs/testing';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { Onboarding } from './schemas/onboarding.schema';

describe('OnboardingController', () => {
  let controller: OnboardingController;
  let service: OnboardingService;

  const mockOnboardingItem: Onboarding = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Welcome to Egyptian National Railways',
    description: 'Your gateway to comfortable and affordable travel across Egypt.',
    imageUrl: '/images/onboarding/welcome.png',
    language: 'en',
    order: 1,
  } as Onboarding;

  const mockService = {
    create: jest.fn().mockResolvedValue(mockOnboardingItem),
    findAll: jest.fn().mockResolvedValue([mockOnboardingItem]),
    seedInitialData: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnboardingController],
      providers: [
        {
          provide: OnboardingService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<OnboardingController>(OnboardingController);
    service = module.get<OnboardingService>(OnboardingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new onboarding item', async () => {
      const createOnboardingDto = {
        title: 'Welcome to Egyptian National Railways',
        description: 'Your gateway to comfortable and affordable travel across Egypt.',
        imageUrl: '/images/onboarding/welcome.png',
        language: 'en',
        order: 1,
      };

      const result = await controller.create(createOnboardingDto);

      expect(service.create).toHaveBeenCalledWith(createOnboardingDto);
      expect(result).toEqual(mockOnboardingItem);
    });
  });

  describe('findAll', () => {
    it('should return an array of onboarding items', async () => {
      const result = await controller.findAll('en');

      expect(service.findAll).toHaveBeenCalledWith('en');
      expect(result).toEqual([mockOnboardingItem]);
    });

    it('should use "en" as default language when none is provided', async () => {
      await controller.findAll('');

      expect(service.findAll).toHaveBeenCalledWith('en');
    });
  });

  describe('seedData', () => {
    it('should seed initial data', async () => {
      const result = await controller.seedData();

      expect(service.seedInitialData).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Onboarding data seeded successfully' });
    });
  });
});
