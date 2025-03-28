import { Controller, Post, Body, Get, BadRequestException, InternalServerErrorException, NotFoundException, HttpException } from '@nestjs/common';
import { UsineService } from './usine.service';
import { Usine } from './usine.entity';
import { InitializeData } from './dto/initializeData.dto';
import { WorkshopService } from 'src/workshop/workshop.service';
import { MachineService } from 'src/machine/machine.service';
import { CapteurService } from 'src/capteur/capteur.service';
import { UniteFabricationService } from 'src/unite-fabrication/unite-fabrication.service';

@Controller('usines')
export class UsineController {
  constructor(
    private readonly usineService: UsineService,
    private readonly uniteFabricationService: UniteFabricationService,
    private readonly worshopService: WorkshopService,
    private readonly machineService: MachineService,
    private readonly capteurService: CapteurService
  
  ) {}

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
  async getInitializeData(): Promise<any> {
    return await this.usineService.getInitializeData();
  }

  
  @Post('addNode')
  async addNode(
    @Body() body: { 
      parentNode: { label: string }, 
      name: string, 
      type: string, 
      parentType: string 
    }): Promise<any> {
    try {
      console.log('Received node data:', body);
      
      // Validate input
      if (!body.name || !body.type || !body.parentType || !body.parentNode?.label) {
        throw new BadRequestException('Données invalides pour l\'ajout du nœud');
      }
  
      // Determine the appropriate service method based on parent type
      switch (body.parentType) {
        case 'Usine': {
          const id = await this.usineService.getIdByName(body.parentNode.label);
          if (id == null) {
            throw new NotFoundException('Usine non trouvée');
          }
          return this.uniteFabricationService.create(body.name, id);
        }
          
        case 'Unité de Fabrication': {
          const id = await this.uniteFabricationService.getIdByName(body.parentNode.label);
          if (id == null) {
            throw new NotFoundException('Unité de Fabrication non trouvée');
          }
          return this.worshopService.create(body.name, id);
        }
          
        case 'Atelier': {
          const id = await this.worshopService.getIdByName(body.parentNode.label);
          if (id == null) {
            throw new NotFoundException('Atelier non trouvé');
          }
          return this.machineService.create(body.name, id);
        }
          
        case 'Machine': {
          const id = await this.machineService.getIdByName(body.parentNode.label);
          if (id == null) {
            throw new NotFoundException('Machine non trouvée');
          }
          return this.capteurService.create(body.name, id);
        }
          
        default:
          throw new BadRequestException('Type de nœud parent non reconnu');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du nœud:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Impossible d\'ajouter le nœud');
    }
  }
}
