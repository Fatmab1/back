// src/workshop/service/workshop.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workshop } from './workshop.entity';
import { UniteFabrication } from '../unite-fabrication/unite-fabrication.entity'; // Import de l'entité UniteFabrication
import { MachineService } from 'src/machine/machine.service';

@Injectable()
export class WorkshopService {
  constructor(
    @InjectRepository(Workshop)
    private readonly workshopRepository: Repository<Workshop>,
    @InjectRepository(UniteFabrication)
    private readonly uniteFabricationRepository: Repository<UniteFabrication>,
    private machineservice :MachineService // Injecte le repository UniteFabrication
  ) {}



  async delete(key: string): Promise<{ id: number, deleted: true }> {
    try {
      if (!key) {
        throw new BadRequestException('Workshop name is required');
      }
  
      // Find workshop with relations
      const workshop = await this.workshopRepository.findOne({
        where: { nom: key },
        relations: ['machines', 'uniteFabrication']
      });
  
      if (!workshop) {
        throw new NotFoundException(`Workshop with name ${key} not found`);
      }
  
      // Delete all linked machines and their sensors
      if (workshop.id_workshop) {
        const deleteResult = await this.machineservice.deleteLinked(workshop.id_workshop);
        console.log(`Deleted ${deleteResult.deletedCount} machines from workshop ${key}`);
      }
  
      // Delete the workshop
      const deleteWorkshopResult = await this.workshopRepository.delete({ nom: key });
  
      if (deleteWorkshopResult.affected === 0) {
        throw new NotFoundException(`Workshop with name ${key} could not be deleted`);
      }
  
      return { id: workshop.id_workshop, deleted: true };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error(`Error deleting workshop ${key}:`, error);
      throw new InternalServerErrorException('Failed to delete workshop');
    }
  }
  
  async deleteLinked(id_uniteF: number): Promise<{ deletedCount: number }> {
    try {
      // Find all workshops in this fabrication unit
      const workshops = await this.workshopRepository.find({
        where: { uniteFabrication: { id_uniteF } },
        relations: ['machines']
      });
  
      if (workshops.length === 0) {
        return { deletedCount: 0 };
      }
  
      let totalDeleted = 0;
  
      // Delete all machines in each workshop
      for (const workshop of workshops) {
        if (workshop.id_workshop) {
           await this.machineservice.deleteLinked(workshop.id_workshop);
          // Delete the workshop itself
          await this.remove(workshop.id_workshop)
        }
      }
  
      return { deletedCount: totalDeleted };
    } catch (error) {
      console.error(`Error deleting linked workshops for unit ${id_uniteF}:`, error);
      throw new InternalServerErrorException('Failed to delete linked workshops and machines');
    }
  }


  // Créer un workshop
  async create(nom: string, id_uniteF: number): Promise<Workshop> {
      // Vérifie que l'unité de fabrication existe
      const uniteFabrication = await this.uniteFabricationRepository.findOne({ where: { id_uniteF: id_uniteF } });
      if (!uniteFabrication) {
        throw new NotFoundException(`Unité de fabrication avec ID ${id_uniteF} non trouvée`);
      }
  
      const workshop = this.workshopRepository.create({
        nom,
        uniteFabrication: uniteFabrication,  // Associe le workshop à l'unité de fabrication via la relation
      });
  
      return this.workshopRepository.save(workshop);
  }

  // Récupérer tous les workshops
  async findAll(): Promise<Workshop[]> {
    return this.workshopRepository.find({ relations: ['uniteFabrication'] });  // Utilise 'uniteFabrication' en camelCase
  }

  // Récupérer un workshop par son ID
  async findOne(id: number): Promise<Workshop> {
    const workshop = await this.workshopRepository.findOne({
      where: { id_workshop: id },
      relations: ['uniteFabrication'],  // Utilise 'uniteFabrication' en camelCase
    });

    if (!workshop) {
      throw new NotFoundException(`Workshop avec ID ${id} non trouvé`);
    }

    return workshop;
  }

  // Mettre à jour un workshop
  async update(id: number, nom: string, id_unite_fabrication: number): Promise<Workshop> {
    const workshop = await this.findOne(id);

    // Vérifie que l'unité de fabrication existe
    const uniteFabrication = await this.uniteFabricationRepository.findOne({ where: { id_uniteF: id_unite_fabrication } });
    if (!uniteFabrication) {
      throw new NotFoundException(`Unité de fabrication avec ID ${id_unite_fabrication} non trouvée`);
    }

    workshop.nom = nom;
    workshop.uniteFabrication = uniteFabrication;  // Utilise 'uniteFabrication' en camelCase

    return this.workshopRepository.save(workshop);
  }

  // Supprimer un workshop
  async remove(id: number): Promise<void> {
    const workshop = await this.findOne(id);
    await this.workshopRepository.remove(workshop);
  }


  // get workshops by uniteFabricationId
  async getWorshops(id: number): Promise<any> {
        
        const worshops = await this.workshopRepository.find({
          where: { uniteFabrication: { id_uniteF: id } }, 
        });
        
        
        if (worshops.length === 0) {
          return []
        }
        let result : any = []
        for(let i = 0 ; i <worshops.length;i++){
          let r = await this.machineservice.getMachines(worshops[i].id_workshop);
          if(r.length==0){
            r=[]
          }
          let s ={
            workshop : worshops[i].nom,
            machines:r
          }
          result.push(s)
        }
        return result
    
      }

  async getIdByName(label : string){
        try {
          const workshop = await this.workshopRepository.findOne({where:{nom:label}})
          if(workshop){
            return workshop.id_workshop;
          }
          return null
            } catch (error) {
              throw new NotFoundException('Error to get id by name');
            }
    
      }
}
