import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Event } from './entity/event.model';
import { CreateEventDto } from './dto/create-event.dto';
import { EventParticipant } from './entity/event-participant.model';
import { User } from 'src/users/entity/user.model';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event)
    private readonly eventModel: typeof Event,

    @InjectModel(EventParticipant)
    private readonly participantModel: typeof EventParticipant,
  ) {}

  async create(createEventDto: CreateEventDto, userId: number) {
    return this.eventModel.create({
      ...createEventDto,
      createdBy: userId,
    });
  }

  async findAll() {
    return this.eventModel.findAll(
      {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        } 
      }
    );
  }

  async findOne(id: number) {
    return this.eventModel.findByPk(id);
  }

  async joinEvent(eventId: number, userId: number) {
    const event = await this.eventModel.findByPk(eventId);

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    const participantsCount = await this.participantModel.count({
      where: {
        eventId,
      },
    });

    if (event.maxParticipants && participantsCount >= event.maxParticipants) {
      throw new BadRequestException('Evento lotado');
    }

    const alreadyParticipant = await this.participantModel.findOne({
      where: {
        eventId,
        userId,
      },
    });

    if (alreadyParticipant) {
      throw new BadRequestException('Usuário já participa deste evento');
    }

    return this.participantModel.create({
      eventId,
      userId,
    });
  }

  async getParticipants(eventId: number) {
    const event = await this.eventModel.findByPk(eventId, {
      include: [
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'name', 'email'],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    return event.participants;
  }
}
