import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Event } from './entity/event.model';
import { CreateEventDto } from './dto/create-event.dto';
import { EventParticipant } from './entity/event-participant.model';
import { ChatMessage } from './entity/chat-message.model';
import { User } from '../users/entity/user.model';
import { Role } from '../auth/enums/role.enum';
import { LockedLogger } from '../common/locked-logger';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  constructor(
    @InjectModel(Event)
    private readonly eventModel: typeof Event,

    @InjectModel(EventParticipant)
    private readonly participantModel: typeof EventParticipant,

    @InjectModel(ChatMessage)
    private readonly chatMessageModel: typeof ChatMessage,
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

    this.logger.log(`Evento criado: ${event.title} (ID: ${event.id})`);
    
    await LockedLogger.log(`Novo evento criado: "${event.title}" por Usuário ID ${userId}`);

    return {
      message: 'Evento criado com sucesso',
      data: event,
    };
  }

  async findAll(city?: string) {
    const whereClause = city ? { city } : {};

    this.logger.log(`Buscando eventos${city ? ` na cidade de ${city}` : ''}`);

    return this.eventModel.findAll({
      where: whereClause,
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: [
            'id',
            'name',
            'email',
            'phone',
            'linkedin',
            'instagram',
            'youtube',
          ],
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
          attributes: [
            'id',
            'name',
            'email',
            'phone',
            'linkedin',
            'instagram',
            'youtube',
          ],
        },
      ],
    });
  }

  async update(
    id: number,
    updateEventDto: any,
    userId: number,
    userRole: Role,
  ) {
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

    this.logger.log(`Evento atualizado: ${event.title} (ID: ${event.id})`);

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

    this.logger.log(`Evento excluído: ${event.title} (ID: ${event.id})`);

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
      this.logger.warn(
        `Usuário ${userId} tentou entrar novamente no evento ${eventId}`,
      );

      throw new BadRequestException('Usuário já participa deste evento');
    }

    const participation = await this.participantModel.create({
      eventId,
      userId,
    });

    this.logger.log(`Usuário ${userId} entrou no evento ${eventId}`);

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

  async findUserEvents(userId: number) {
    const created = await this.eventModel.findAll({
      where: { createdBy: userId },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: [
            'id',
            'name',
            'email',
            'phone',
            'linkedin',
            'instagram',
            'youtube',
          ],
        },
      ],
    });

    const joined = await this.eventModel.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: [
            'id',
            'name',
            'email',
            'phone',
            'linkedin',
            'instagram',
            'youtube',
          ],
        },
        {
          model: User,
          as: 'participants',
          where: { id: userId },
          attributes: [],
          through: { attributes: [] },
        },
      ],
    });

    this.logger.log(`Usuário ${userId} tem ${created.length} eventos criados e ${joined.length} eventos participando`);

    return {
      created,
      joined,
    };
  }

  async getMessagesForEvent(eventId: number, userId: number, userRole: Role) {
    const event = await this.eventModel.findByPk(eventId);
    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    const isCreator = event.createdBy === userId;
    const isAdmin = userRole === Role.ADMIN;
    let isParticipant = false;

    if (!isCreator && !isAdmin) {
      const participant = await this.participantModel.findOne({
        where: { eventId, userId },
      });
      isParticipant = !!participant;
    }

    if (!isCreator && !isAdmin && !isParticipant) {
      throw new ForbiddenException(
        'Você precisa participar do evento para ver as mensagens.',
      );
    }

    return this.chatMessageModel.findAll({
      where: { eventId },
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'role', 'phone', 'linkedin', 'instagram', 'youtube'],
        },
      ],
    });
  }

  async sendMessageToEvent(
    eventId: number,
    userId: number,
    userRole: Role,
    messageContent: string,
  ) {
    const event = await this.eventModel.findByPk(eventId);
    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    const isCreator = event.createdBy === userId;
    const isAdmin = userRole === Role.ADMIN;
    let isParticipant = false;

    if (!isCreator && !isAdmin) {
      const participant = await this.participantModel.findOne({
        where: { eventId, userId },
      });
      isParticipant = !!participant;
    }

    if (!isCreator && !isAdmin && !isParticipant) {
      throw new ForbiddenException(
        'Você precisa participar do evento para enviar mensagens.',
      );
    }

    const message = await this.chatMessageModel.create({
      eventId,
      userId,
      message: messageContent,
    });

    return this.chatMessageModel.findByPk(message.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'role', 'phone', 'linkedin', 'instagram', 'youtube'],
        },
      ],
    });
  }
}

