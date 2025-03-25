// src/workshop/controller/workshop.controller.ts
import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { WorkshopService } from './workshop.service';
import { Workshop } from './workshop.entity';

@Controller('workshops')
export class WorkshopController {
  constructor(private readonly workshopService: WorkshopService) {}

  @Post()
  create(@Body() body: { nom: string; id_uniteF: number }): Promise<Workshop> {
    return this.workshopService.create(body.nom, body.id_uniteF);
  }
  @Get()
  findAll(): Promise<Workshop[]> {
    return this.workshopService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Workshop> {
    const workshop = await this.workshopService.findOne(id);
    if (!workshop) {
      throw new NotFoundException(`Workshop with ID ${id} not found`);
    }
    return workshop;
  }


        // get worshops by UniteFabricationId
        @Get(':idUniteFabrication')
        getWorkshops(@Param('idUniteFabrication') idUniteFabrication: number): Promise<any> {
          return this.workshopService.getWorshops(idUniteFabrication);
        }
}
