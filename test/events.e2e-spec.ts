import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { getModelToken } from '@nestjs/sequelize';
import { Event } from '../src/events/entity/event.model';
import { EventParticipant } from '../src/events/entity/event-participant.model';
import { ChatMessage } from '../src/events/entity/chat-message.model';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../src/auth/guards/roles.guard';
import { Sequelize } from 'sequelize-typescript';

describe('Events (e2e)', () => {
  let app: INestApplication<App>;

  jest.spyOn(JwtAuthGuard.prototype, 'canActivate').mockImplementation((context: any) => {
    const req = context.switchToHttp().getRequest();
    req.user = { userId: 1, role: 'ORGANIZER' };
    return true;
  });

  jest.spyOn(RolesGuard.prototype, 'canActivate').mockReturnValue(true);

  const mockEvents = [
    {
      id: 1,
      title: 'Workshop de Reciclagem Comunitária',
      description: 'Aprenda a reciclar materiais e ajudar o meio ambiente.',
      location: 'Centro Comunitário Vila Verde',
      date: new Date('2026-12-01T14:00:00.000Z'),
      type: 'COMMUNITY',
      price: null,
      maxParticipants: 50,
      createdBy: 1,
      category: 'eventos',
      city: 'campo-mourao',
    },
  ];

  const mockEventModel = {
    findAll: jest.fn().mockResolvedValue(mockEvents),
    findOne: jest.fn().mockImplementation(({ where }) => {
      if (where && where.location === 'existing-loc' && where.date === 'existing-date') {
        return Promise.resolve(mockEvents[0]);
      }
      return Promise.resolve(null);
    }),
    findByPk: jest.fn().mockResolvedValue(mockEvents[0]),
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 2, ...dto })),
  };

  const mockParticipantModel = {
    count: jest.fn().mockResolvedValue(5),
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({ eventId: 1, userId: 1 }),
  };

  const mockChatMessageModel = {
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({ id: 1, message: 'Olá!' }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getModelToken(Event))
      .useValue(mockEventModel)
      .overrideProvider(getModelToken(EventParticipant))
      .useValue(mockParticipantModel)
      .overrideProvider(getModelToken(ChatMessage))
      .useValue(mockChatMessageModel)
      .overrideProvider(Sequelize)
      .useValue({
        transaction: jest.fn(),
        close: jest.fn().mockResolvedValue(null),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /events (Obter todos os eventos)', () => {
    return request(app.getHttpServer())
      .get('/events')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body[0].title).toBe('Workshop de Reciclagem Comunitária');
      });
  });

  it('GET /events/:id (Obter evento específico)', () => {
    return request(app.getHttpServer())
      .get('/events/1')
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(1);
        expect(res.body.title).toBe('Workshop de Reciclagem Comunitária');
      });
  });

  it('POST /events (Criar um novo evento)', () => {
    const newEvent = {
      title: 'Encontro de Plantio Urbano',
      description: 'Mutirão para plantar árvores na praça principal.',
      location: 'Praça das Flores',
      date: '2026-10-15T09:00:00.000Z',
      type: 'COMMUNITY',
      category: 'atividades',
      city: 'campo-mourao',
    };

    return request(app.getHttpServer())
      .post('/events')
      .send(newEvent)
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toBe('Evento criado com sucesso');
        expect(res.body.data.id).toBeDefined();
        expect(res.body.data.title).toBe('Encontro de Plantio Urbano');
      });
  });
});
