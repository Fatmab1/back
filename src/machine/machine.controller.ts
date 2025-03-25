import { 
    Controller, Post, Body, Get, Param, Put, Delete, NotFoundException 
  } from '@nestjs/common';
  import { MachineService } from './machine.service';
  import { Machine } from './machine.entity';
  
  @Controller('machines')
  export class MachineController {
    constructor(private readonly machineService: MachineService) {}
  
    // Créer une machine
    @Post()
    async create(@Body() body: { nom: string; id_workshop: number }): Promise<Machine> {
      return await this.machineService.create(body.nom, body.id_workshop);
    }
  
    // Récupérer toutes les machines
    @Get()
    async findAll(): Promise<Machine[]> {
      return await this.machineService.findAll();
    }
  
    // Récupérer une machine par ID
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Machine> {
      const machine = await this.machineService.findOne(id);
      if (!machine) {
        throw new NotFoundException(`Machine avec ID ${id} non trouvée`);
      }
      return machine;
    }
  
    // Mettre à jour une machine
    @Put(':id')
    async update(
      @Param('id') id: number,
      @Body() body: { nom: string; id_workshop: number },
    ): Promise<Machine> {
      return await this.machineService.update(id, body.nom, body.id_workshop);
    }
  
    // Supprimer une machine
    @Delete(':id')
    async remove(@Param('id') id: number): Promise<{ message: string }> {
      await this.machineService.remove(id);
      return { message: `Machine avec ID ${id} supprimée avec succès` };
    }

      // get Machines by workshopId
      @Get(':idWorkshop')
      getMachines(@Param('idWorkshop') idWorkshop: number): Promise<any> {
        return this.machineService.getMachines(idWorkshop);
      }
  }
  