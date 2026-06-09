import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { City } from './entity/city.model';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';

@Module({
  imports: [SequelizeModule.forFeature([City])],
  controllers: [CitiesController],
  providers: [CitiesService],
  exports: [CitiesService],
})
export class CitiesModule {}
