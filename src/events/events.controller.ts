import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createEventDto: CreateEventDto, @Req() req) {
    return this.eventsService.create(createEventDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  joinEvent(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.eventsService.joinEvent(id, req.user.userId);
  }

  @Get(':id/participants')
  getParticipants(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.getParticipants(id);
  } 
  
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }
}
