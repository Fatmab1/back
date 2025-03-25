// src/element/element.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElementController } from './element.controller';
import { ElementService } from './element.service';
import { Element } from './element.entity';
import { CapteurModule } from '../capteur/capteur.module'; 
import { Capteur} from '../capteur/capteur.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Element,Capteur]),CapteurModule],
  controllers: [ElementController],
  providers: [ElementService],
})
export class ElementModule {}
