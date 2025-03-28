// src/machine/service/machine.service.ts
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

  async delete(key: string): Promise<any> {
    try {
      const deleteResult = await this.machineRepository.delete({
        nom:key
      });
  
      if (deleteResult.affected === 0) {
        throw new NotFoundException(`Machine with Key ${key} not found`);
      }
  
      return deleteResult;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete Machine ');
    }
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

      getIdByName=async(label : string)=>{
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
