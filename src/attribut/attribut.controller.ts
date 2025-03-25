import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { AttributService } from './attribut.service';
import { Attribut } from './attribut.entity';

@Controller('attributs')
export class AttributController {
  constructor(private readonly attributService: AttributService) {}

  // Créer un attribut
  @Post()
create(@Body() body: {
  unit: string;
  ucl: number;
  wcl: number;
  target: number;
  lwl: number;
  cwl: number;
  id_element: number;  // Ajout du paramètre id_element dans le body
}): Promise<Attribut> {
  return this.attributService.create(
    body.unit,
    body.ucl,
    body.wcl,
    body.target,
    body.lwl,
    body.cwl,
    body.id_element,  // Passer id_element au service
  );
}


  // Récupérer tous les attributs
  @Get()
  findAll(): Promise<Attribut[]> {
    return this.attributService.findAll();
  }

  // Récupérer un attribut par son ID
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Attribut> {
    return this.attributService.findOne(id);
  }

  // Mettre à jour un attribut
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() body: {
      unit: string;
      id_element: number;  // Ajout du paramètre id_element dans le body
    },
  ): Promise<Attribut> {
    return this.attributService.update(id, body.unit, body.id_element);  // Passer l'id_element au service
  }

  // Supprimer un attribut
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.attributService.remove(id);
  }
}
