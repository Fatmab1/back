import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachineController } from './machine.controller';
import { MachineService } from './machine.service';
import { Machine } from './machine.entity';
import { Workshop } from '../workshop/workshop.entity'; // Ensure this is imported
import { WorkshopModule } from '../workshop/workshop.module';
import { CapteurModule } from 'src/capteur/capteur.module';

@Module({
  imports: [TypeOrmModule.forFeature([Machine, Workshop]), CapteurModule], 
  controllers: [MachineController],
  providers: [MachineService],
  exports: [MachineService],
})
export class MachineModule {}