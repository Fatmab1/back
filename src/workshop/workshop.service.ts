// src/workshop/service/workshop.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

  async delete(key: string): Promise<any> {
    try {
      const deleteResult = await this.workshopRepository.delete({
        nom:key
      });
  
      if (deleteResult.affected === 0) {
        throw new NotFoundException(`workshop with Key ${key} not found`);
      }
  
      return deleteResult;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete workshop ');
    }
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

      getIdByName=async(label : string)=>{
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
