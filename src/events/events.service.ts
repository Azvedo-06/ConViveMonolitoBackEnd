import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Event } from './entity/event.model';
import { CreateEventDto } from './dto/create-event.dto';
import { EventParticipant } from './entity/event-participant.model';
import { User } from 'src/users/entity/user.model';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event)
    private readonly eventModel: typeof Event,

    @InjectModel(EventParticipant)
    private readonly participantModel: typeof EventParticipant,
  ) {}

  async create(createEventDto: CreateEventDto, userId: number) {
    const eventDate = new Date(createEventDto.date);

    if (eventDate < new Date()) {
      throw new BadRequestException('Não é possível criar eventos no passado');
    }

    const existingEvent = await this.eventModel.findOne({
      where: {
        location: createEventDto.location,
        date: createEventDto.date,
      },
    });

    if (existingEvent) {
      throw new BadRequestException(
        'Já existe um evento neste local nesta data e horário',
      );
    }

    const event = await this.eventModel.create({
      ...createEventDto,
      createdBy: userId,
    });

    return {
      message: 'Evento criado com sucesso',
      data: event,
    };
  }

  async findAll(city?: string) {
    const whereClause = city ? { city } : {};
    return this.eventModel.findAll({
      where: whereClause,
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email', 'phone'],
        },
      ],
    });
  }

  async findOne(id: number) {
    return this.eventModel.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email', 'phone'],
        },
      ],
    });
  }

  async update(id: number, updateEventDto: any, userId: number, userRole: Role) {
    const event = await this.eventModel.findByPk(id);
    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    if (userRole !== Role.ADMIN && event.createdBy !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para editar este evento',
      );
    }

    if (updateEventDto.date) {
      const eventDate = new Date(updateEventDto.date);
      if (eventDate < new Date()) {
        throw new BadRequestException(
          'Não é possível definir a data do evento no passado',
        );
      }
    }

    await event.update(updateEventDto);
    return {
      message: 'Evento atualizado com sucesso',
      data: event,
    };
  }

  async remove(id: number, userId: number, userRole: Role) {
    const event = await this.eventModel.findByPk(id);
    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    if (userRole !== Role.ADMIN && event.createdBy !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para excluir este evento',
      );
    }

    await event.destroy();
    return {
      message: 'Evento excluído com sucesso',
    };
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

    const participation = await this.participantModel.create({
      eventId,
      userId,
    });
    return {
      message: 'Participação realizada com sucesso',
      data: participation,
    };
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

  async uploadImage(eventId: number, filename: string): Promise<any> {
    const event = await this.eventModel.findByPk(eventId);

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    event.imageUrl = `/uploads/${filename}`;

    await event.save();

    return {
      message: 'Imagem enviada com sucesso',
      imageUrl: event.imageUrl,
    };
  }
}
