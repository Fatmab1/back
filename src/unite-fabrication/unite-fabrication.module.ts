// src/unite_fabrication/unite_fabrication.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniteFabricationController } from './unite-fabrication.controller';
import { UniteFabricationService } from './unite-fabrication.service';
import { UniteFabrication } from './unite-fabrication.entity';
import { Usine } from '../usine/usine.entity'; 
import { WorkshopModule } from 'src/workshop/workshop.module';

@Module({
  imports: [TypeOrmModule.forFeature([UniteFabrication,Usine]),WorkshopModule],
  controllers: [UniteFabricationController],
  providers: [UniteFabricationService],
  exports:[UniteFabricationService]
})
export class UniteFabricationModule {}
