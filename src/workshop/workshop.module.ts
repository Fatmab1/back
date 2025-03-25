// src/workshop/workshop.module.ts
import { Module } from '@nestjs/common';
import { WorkshopService } from './workshop.service';
import { WorkshopController } from './workshop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workshop } from './workshop.entity';
import { UniteFabrication} from '../unite-fabrication/unite-fabrication.entity';  // Import du MachineModule
import { MachineModule } from 'src/machine/machine.module';

@Module({
  imports: [TypeOrmModule.forFeature([Workshop,UniteFabrication]),MachineModule],
  providers: [WorkshopService],
  controllers: [WorkshopController],
  exports: [WorkshopService]
})
export class WorkshopModule {}
