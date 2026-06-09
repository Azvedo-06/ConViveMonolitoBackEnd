import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/auth/decorators/public.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @Post()
  create(@Body() createEventDto: CreateEventDto, @Req() req) {
    return this.eventsService.create(createEventDto, req.user.userId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: any,
    @Req() req,
  ) {
    return this.eventsService.update(
      id,
      updateEventDto,
      req.user.userId,
      req.user.role,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.eventsService.remove(id, req.user.userId, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  joinEvent(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.eventsService.joinEvent(id, req.user.userId);
  }

  @Public()
  @Get(':id/participants')
  getParticipants(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.getParticipants(id);
  }

  @Public()
  @Get()
  findAll(@Query('city') city?: string) {
    return this.eventsService.findAll(city);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-events')
  findMyEvents(@Req() req) {
    return this.eventsService.findUserEvents(req.user.userId);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('image', {
      dest: './uploads',
    }),
  )
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.eventsService.uploadImage(id, file.filename);
  }
}
