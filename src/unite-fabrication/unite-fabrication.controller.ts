import { 
    Controller, Post, Body, Get, Param, Put, Delete, NotFoundException 
  } from '@nestjs/common';
  import { UniteFabricationService } from './unite-fabrication.service';
  import { UniteFabrication } from './unite-fabrication.entity';
  
  @Controller('unites-fabrication')
  export class UniteFabricationController {
    constructor(private readonly uniteFabricationService: UniteFabricationService) {}
  
    // Créer une unité de fabrication
    @Post()
    async create(@Body() body: { nom: string; id_usine: number }): Promise<UniteFabrication> {
      return await this.uniteFabricationService.create(body.nom, body.id_usine);
    }
  
    // Récupérer toutes les unités de fabrication
    @Get()
    async findAll(): Promise<UniteFabrication[]> {
      return await this.uniteFabricationService.findAll();
    }
  
    // Récupérer une unité de fabrication par ID
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<UniteFabrication> {
      const uniteFabrication = await this.uniteFabricationService.findOne(id);
      if (!uniteFabrication) {
        throw new NotFoundException(`Unité de fabrication avec ID ${id} non trouvée`);
      }
      return uniteFabrication;
    }
  
    // Mettre à jour une unité de fabrication
    @Put(':id')
    async update(
      @Param('id') id: number,
      @Body() body: { nom: string; id_usine: number },
    ): Promise<UniteFabrication> {
      return await this.uniteFabricationService.update(id, body.nom, body.id_usine);
    }
  
    // Supprimer une unité de fabrication
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<{ message: string }> {
      await this.uniteFabricationService.remove(id);
      return { message: `Unité de fabrication avec ID ${id} supprimée avec succès` };
    }

            // get unite fabrication by usineId
            @Get(':usineId')
            getWorkshops(@Param('usineId') usineId: number): Promise<any> {
              return this.uniteFabricationService.getUniteFabrication(usineId);
            }
  }
  