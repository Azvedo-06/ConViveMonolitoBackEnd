import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { EventsModule } from '../events/events.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [EventsModule, ConfigModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
