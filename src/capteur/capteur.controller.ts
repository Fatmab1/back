// src/capteur/controller/capteur.controller.ts
import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { CapteurService } from './capteur.service';
import { Capteur } from './capteur.entity';
import { CapteurDto } from './dto/Capteur.dto';

@Controller('capteurs')
export class CapteurController {
  constructor(private readonly capteurService: CapteurService) {}

  // Créer un capteur
  @Post()
  create(@Body() body: { type: string; id_machine: number }): Promise<Capteur> {
    return this.capteurService.create(body.type, body.id_machine);
  }

  // Récupérer tous les capteurs
  @Get()
  findAll(): Promise<Capteur[]> {
    return this.capteurService.findAll();
  }

  // Récupérer un capteur par son ID
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Capteur> {
    return this.capteurService.findOne(id);
  }

  // Mettre à jour un capteur
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: { type: string; id_machine: number },  // Ajoute id_machine dans le body
  ): Promise<Capteur> {
    return this.capteurService.update(id, body.type, body.id_machine);  // Passe id_machine dans la méthode service
  }

  // Supprimer un capteur
  @Delete(':id')
  remove(@Param('id') id: number): Promise<any> {
    return this.capteurService.remove(id);
  }


  // get capteurs by machineid
  @Get(':idMachine')
  getCapteurs(@Param('idMachine') idMachine: number): Promise<CapteurDto[]> {
    return this.capteurService.getCapteurs(idMachine);
  }


}
