import { SequelizeModule } from '@nestjs/sequelize';
import { Event } from './entity/event.model';
import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventParticipant } from './entity/event-participant.model';
import { ChatMessage } from './entity/chat-message.model';

@Module({
  imports: [SequelizeModule.forFeature([Event, EventParticipant, ChatMessage])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}