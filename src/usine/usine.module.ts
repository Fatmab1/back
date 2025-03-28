import { Module } from '@nestjs/common';
import { UsineService } from './usine.service';
import { UsineController } from './usine.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usine } from './usine.entity';
import { UniteFabricationModule } from 'src/unite-fabrication/unite-fabrication.module';
import { WorkshopModule } from 'src/workshop/workshop.module';
import { MachineModule } from 'src/machine/machine.module';
import { CapteurModule } from 'src/capteur/capteur.module';

@Module({
  imports: [
    UniteFabricationModule,
    WorkshopModule,
    MachineModule,
    CapteurModule,
    TypeOrmModule.forFeature([Usine])],
  providers: [UsineService],
  controllers: [UsineController],
  exports:[UsineService]
})
export class UsineModule {}
