import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreeService } from './tree.service';
import { TreeController } from './tree.controller';
import { Usine } from '../usine/usine.entity';
import { UniteFabrication } from '../unite-fabrication/unite-fabrication.entity';
import { Workshop } from '../workshop/workshop.entity';
import { Machine } from '../machine/machine.entity';
import { Capteur } from '../capteur/capteur.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usine, UniteFabrication, Workshop, Machine, Capteur])],
  controllers: [TreeController],
  providers: [TreeService],
})
export class TreeModule {}
