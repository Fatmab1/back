import { Module } from '@nestjs/common';
import { FactoryController } from './factory.controller';
import { FactoryService } from './factory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usine } from '../usine/usine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usine])],
  controllers: [FactoryController],
  providers: [FactoryService],
})
export class FactoryModule {}
