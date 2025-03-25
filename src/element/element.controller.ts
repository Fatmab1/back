// src/element/controller/element.controller.ts
import { Controller, Post, Body, Get, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { ElementService } from './element.service';
import { Element } from './element.entity';

@Controller('elements')
export class ElementController {
  constructor(private readonly elementService: ElementService) {}

  // Créer un élément
  @Post()
  async create(
    @Body() body: { nom: string; id_sensor: number },
  ): Promise<Element> {
    return this.elementService.create(body.nom, body.id_sensor);
  }

  // Récupérer tous les éléments
  @Get()
  async findAll(): Promise<Element[]> {
    return this.elementService.findAll();
  }

  // Récupérer un élément par ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Element> {
    return this.elementService.findOne(id);
  }

  // Mettre à jour un élément
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: { nom: string; id_sensor: number },  // Tu reçois 'id_sensor' ici
  ): Promise<Element> {
    return this.elementService.update(id, body.nom, body.id_sensor); // Passe 'id_sensor' à la méthode du service
  }

  // Supprimer un élément
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.elementService.remove(id);
  }
}
