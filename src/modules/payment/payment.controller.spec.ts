import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

describe('PaymentController', () => {
  let controller: PaymentController;
  let service: PaymentService;

  const mockPaymentService = {
    addCard: jest.fn(),
    listCards: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: mockPaymentService
        }
      ]
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('addCard should call service.addCard with userId + dto', async () => {
    const req = { user: { id: 'user123' } } as any;
    const dto = {
      cardholderName: 'Test User',
      cardNumber: '4111111111111111',
      expiryMonth: 12,
      expiryYear: 2030,
      cvv: '123'
    };

    mockPaymentService.addCard.mockResolvedValue('created-card');

    const result = await controller.addCard(req, dto);

    expect(service.addCard).toHaveBeenCalledWith('user123', dto);
    expect(result).toBe('created-card');
  });

  it('getMyCards should call service.listCards with userId', async () => {
    const req = { user: { id: 'user123' } } as any;
    const cards = [{ _id: '1' }];

    mockPaymentService.listCards.mockResolvedValue(cards);

    const result = await controller.getMyCards(req);

    expect(service.listCards).toHaveBeenCalledWith('user123');
    expect(result).toBe(cards);
  });
});
