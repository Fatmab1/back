// src/machine/service/machine.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from './machine.entity';
import { Workshop } from '../workshop/workshop.entity'; // Assurez-vous d'importer l'entité Workshop
import { CapteurService } from 'src/capteur/capteur.service';

@Injectable()
export class MachineService {
  constructor(
    @InjectRepository(Machine)
    private readonly machineRepository: Repository<Machine>,
    @InjectRepository(Workshop)
    private readonly workshopRepository: Repository<Workshop>, 
    private capteurservice : CapteurService // Injecte le repository Workshop
  ) {}

  async deleteLinked(id_workshop: number): Promise<{ deletedCount: number }> {
    try {
      // Find all machines in this workshop
      const machines = await this.machineRepository.find({
        where: { workshop: { id_workshop } },
        relations: ['capteurs'] 
      });
  
      if (machines.length === 0) {
        return { deletedCount: 0 };
      }
  
      let totalDeleted = 0;
  
      // Delete all sensors for each machine
      for (const machine of machines) {
        if (machine.id_machine) {
          const result = await this.capteurservice.deleteLinked(machine.id_machine);
          totalDeleted += result.deletedCount || 0;
          this.remove(machine.id_machine)
        }
      }
  
      return { deletedCount: totalDeleted };
    } catch (error) {
      console.error(`Error deleting linked machines for workshop ${id_workshop}:`, error);
      throw new InternalServerErrorException('Failed to delete linked machines and sensors');
    }
  }
  
  async delete(key: string): Promise<any> {
    try {
      if (!key) {
        throw new BadRequestException('Machine name is required');
      }
  
      // Find machine with its relations
      const machine = await this.machineRepository.findOne({
        where: { nom: key },
        relations: ['workshop', 'capteurs']
      });
  
      // if (!machine) {
      //   throw new NotFoundException(`Machine with name ${key} not found`);
      // }
  
      // Delete all associated sensors first
      if (machine?.id_machine) {
        await this.capteurservice.delete(machine.nom);
      }
  
      // Delete the machine
      const deleteResult = await this.machineRepository.delete({ nom: key });
  
      if (deleteResult.affected === 0) {
        throw new NotFoundException(`Machine with name ${key} could not be deleted`);
      }
      if(machine && machine.id_machine){
        return { id: machine.id_machine, deleted: true };
      }

    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error(`Error deleting machine ${key}:`, error);
      throw new InternalServerErrorException('Failed to delete machine');
    }
  }


    // Créer une machine
    async create(nom: string, id_workshop: number): Promise<Machine> {
      const workshop = await this.workshopRepository.findOne({ where: { id_workshop } });
      if (!workshop) {
        throw new NotFoundException(`Workshop avec ID ${id_workshop} non trouvé`);
      }
  
      const machine = this.machineRepository.create({
        nom,
        workshop: workshop,  // Associe la machine au workshop via la relation
      });
  
      return this.machineRepository.save(machine);
    }
  // Récupérer toutes les machines
  async findAll(): Promise<Machine[]> {
    return this.machineRepository.find({ relations: ['workshop'] });
  }

  // Récupérer une machine par son ID
  async findOne(id: number): Promise<Machine> {
    const machine = await this.machineRepository.findOne({
      where: { id_machine: id },
      relations: ['workshop'],
    });

    if (!machine) {
      throw new NotFoundException(`Machine avec ID ${id} non trouvée`);
    }

    return machine;
  }

  // Mettre à jour une machine
  async update(id: number, nom: string, id_workshop: number): Promise<Machine> {
    const machine = await this.findOne(id);

    const workshop = await this.workshopRepository.findOne({ where: { id_workshop } });
    if (!workshop) {
      throw new NotFoundException(`Workshop avec ID ${id_workshop} non trouvé`);
    }

    machine.nom = nom;
    machine.workshop = workshop;

    return this.machineRepository.save(machine);
  }

  // Supprimer une machine
  async remove(id: number): Promise<void> {
    const machine = await this.findOne(id);
    await this.machineRepository.remove(machine);
  }


  // get Machines by workshopId
  async getMachines(id: number): Promise<any> {
      const machines = await this.machineRepository.find({
        where: { workshop: { id_workshop: id } }, 
      });
  
      if (machines.length === 0) {
        return []
      }
      
      let result : any = []
      for(let i = 0 ; i <machines.length;i++){
        let r = await this.capteurservice.getCapteurs(machines[i].id_machine);
        if(r.length==0){
          r=[]
        }
        let s = {
          machine :(machines[i].nom),
          capteurs :r
        }
        result.push(s)
      }
      return result
    }

  async getIdByName(label : string){
        try {
          const machine = await this.machineRepository.findOne({where:{nom:label}})
          if(machine){
            return machine.id_machine;
          }
          return null
            } catch (error) {
              throw new NotFoundException('Error to get id by name');
            }
    
  }
}
