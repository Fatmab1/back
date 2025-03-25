import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsineService } from './usine.service';
import { Usine } from './usine.entity';
import { InitializeData } from './dto/initializeData.dto';

@Controller('usines')
export class UsineController {
  constructor(private readonly usineService: UsineService) {}

  @Post()
  create(@Body() body: { nom: string }): Promise<Usine> {
    return this.usineService.create(body.nom);
  }

  @Get()
  findAll(): Promise<Usine[]> {
    return this.usineService.findAll();
  }


  // getInitializeData

  @Get('initialize')
  getInitializeData(): Promise<any> {
    return this.usineService.getInitializeData();
  }
}
