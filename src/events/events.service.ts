import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Event } from './entity/event.model';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event)
    private readonly eventModel: typeof Event,
  ) {}

  async create(createEventDto: CreateEventDto, userId: number) {
    return this.eventModel.create({
      ...createEventDto,
      createdBy: userId,
    });
  }

  async findAll() {
    return this.eventModel.findAll();
  }

  async findOne(id: number) {
    return this.eventModel.findByPk(id);
  }
}