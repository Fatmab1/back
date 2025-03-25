import { Module } from '@nestjs/common';
import { UsineService } from './usine.service';
import { UsineController } from './usine.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usine } from './usine.entity';
import { UniteFabricationModule } from 'src/unite-fabrication/unite-fabrication.module';

@Module({
  imports: [UniteFabricationModule,TypeOrmModule.forFeature([Usine])],
  providers: [UsineService],
  controllers: [UsineController],
  exports:[UsineService]
})
export class UsineModule {}
