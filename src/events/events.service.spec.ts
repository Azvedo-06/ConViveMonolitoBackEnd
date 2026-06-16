import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getModelToken } from '@nestjs/sequelize';
import { Event } from './entity/event.model';
import { EventParticipant } from './entity/event-participant.model';
import { ChatMessage } from './entity/chat-message.model';

describe('EventsService', () => {
  let service: EventsService;

  const mockEventModel = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  };

  const mockParticipantModel = {
    count: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockChatMessageModel = {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getModelToken(Event),
          useValue: mockEventModel,
        },
        {
          provide: getModelToken(EventParticipant),
          useValue: mockParticipantModel,
        },
        {
          provide: getModelToken(ChatMessage),
          useValue: mockChatMessageModel,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
