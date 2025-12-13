import { Test, TestingModule } from '@nestjs/testing';
import { OnboardingService } from './onboarding.service';
import { getModelToken } from '@nestjs/mongoose';
import { Onboarding } from './schemas/onboarding.schema';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';

describe('OnboardingService', () => {
  let service: OnboardingService;

  const mockOnboardingItem: Onboarding = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Welcome to Egyptian National Railways',
    description: 'Your gateway to comfortable and affordable travel across Egypt.',
    imageUrl: '/images/onboarding/welcome.png',
    language: 'en'
  } as Onboarding;

  const mockModel = {
    constructor: jest.fn().mockImplementation((dto: CreateOnboardingDto) => ({
      ...dto,
      save: jest.fn().mockResolvedValue(mockOnboardingItem)
    })),

    create: jest.fn().mockResolvedValue(mockOnboardingItem),

    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockOnboardingItem])
    }),

    countDocuments: jest.fn().mockResolvedValue(0),
    insertMany: jest.fn().mockResolvedValue([mockOnboardingItem])
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OnboardingService,
        {
          provide: getModelToken(Onboarding.name),
          useValue: mockModel
        }
      ]
    }).compile();

    service = module.get<OnboardingService>(OnboardingService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new onboarding item', async () => {
      const mockCreateDto = {
        title: 'Welcome to Egyptian National Railways',
        description: 'Your gateway to comfortable and affordable travel across Egypt.',
        imageUrl: '/images/onboarding/welcome.png',
        language: 'en'
      };

      const mockOnboardingItem = { ...mockCreateDto };

      mockModel.create.mockResolvedValue(mockOnboardingItem);

      const result = await service.create(mockCreateDto);

      expect(mockModel.create).toHaveBeenCalledWith(mockCreateDto);
      expect(result).toEqual(mockOnboardingItem);
    });
  });

  describe('findAll()', () => {
    it('should return all onboarding items for a given language', async () => {
      const result = await service.findAll('en');

      expect(mockModel.find).toHaveBeenCalledWith({ language: 'en' });
      expect(result).toEqual([mockOnboardingItem]);
    });
  });

  describe('findByLanguage()', () => {
    it('should return onboarding items by language', async () => {
      const result = await service.findByLanguage('en');

      expect(mockModel.find).toHaveBeenCalledWith({ language: 'en' });
      expect(result).toEqual([mockOnboardingItem]);
    });
  });
});
