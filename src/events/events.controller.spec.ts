import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

import { EventsGateway } from './events.gateway';

describe('EventsController', () => {
  let controller: EventsController;

  const mockEventsService = {
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    joinEvent: jest.fn(),
    getParticipants: jest.fn(),
    findAll: jest.fn(),
    findUserEvents: jest.fn(),
    findOne: jest.fn(),
    uploadImage: jest.fn(),
    getMessagesForEvent: jest.fn(),
    sendMessageToEvent: jest.fn(),
  };

  const mockEventsGateway = {
    server: {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
        {
          provide: EventsGateway,
          useValue: mockEventsGateway,
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

