// src/capteur/capteur.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CapteurController } from './capteur.controller';
import { CapteurService } from './capteur.service';
import { Capteur } from './capteur.entity';
import { Machine } from '../machine/machine.entity'  // Import du MachineModule

@Module({
  imports: [TypeOrmModule.forFeature([Capteur,Machine])],
  controllers: [CapteurController],
  providers: [CapteurService],
  exports:[CapteurService]
})
export class CapteurModule {}
