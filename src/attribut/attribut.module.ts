// src/attribut/attribut.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributController } from './attribut.controller';
import { AttributService } from './attribut.service';
import { Attribut } from './attribut.entity';
import { ElementModule } from '../element/element.module';
import { Element} from '../element/element.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attribut,Element]),ElementModule],
  controllers: [AttributController],
  providers: [AttributService],
})
export class AttributModule {}
