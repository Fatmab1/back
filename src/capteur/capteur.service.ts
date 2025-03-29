// src/capteur/service/capteur.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Capteur } from './capteur.entity';
import { Machine } from '../machine/machine.entity';  // Assurez-vous d'importer l'entité Machine

@Injectable()
export class CapteurService {
  constructor(
    @InjectRepository(Capteur)
    private readonly capteurRepository: Repository<Capteur>,
    @InjectRepository(Machine)
    private readonly machineRepository: Repository<Machine>,  // Injecte le repository Machine
  ) {}

  async deleteLinked(id_machine: number): Promise<{ deletedCount: number }> {
    try {
      // Verify machine exists first
      const machineExists = await this.machineRepository.exist({ where: { id_machine } });
      if (!machineExists) {
        throw new NotFoundException(`Machine with ID ${id_machine} not found`);
      }

      const deleteResult = await this.capteurRepository.delete({
        machine: { id_machine }
      });

      return { deletedCount: deleteResult.affected || 0 };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Error deleting sensors for machine ${id_machine}:`, error);
      throw new InternalServerErrorException('Failed to delete linked sensors');
    }
  }

  async delete(key: string): Promise<{ deleted: boolean }> {
    try {
      if (!key ) {
        throw new BadRequestException('Invalid sensor ID');
      }

      const deleteResult = await this.capteurRepository.delete(key);

      if (deleteResult.affected === 0) {
        throw new NotFoundException(`Sensor with ID ${key} not found`);
      }

      return { deleted: true };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error(`Error deleting sensor ${key}:`, error);
      throw new InternalServerErrorException('Failed to delete sensor');
    }
  }

  // ... [keep your other methods unchanged but consider similar error handling improvements]

  /**
   * Alternative: Delete sensor by ID with entity loading first
   * (Provides better type safety and hooks into entity lifecycle)
   */
  async remove(id: number): Promise<{ id: number, deleted: true }> {
    const sensor = await this.capteurRepository.findOne({ 
      where: { id_sensor: id },
      relations: ['machine'] 
    });
    

    if (!sensor) {
      throw new NotFoundException(`Sensor with ID ${id} not found`);
    }

    await this.capteurRepository.remove(sensor);
    return { id, deleted: true };
  }

  // Créer un capteur
  async create(type: string, id_machine: number): Promise<Capteur> {
    // Vérifie si la machine existe
    const machine = await this.machineRepository.findOne({ where: { id_machine } });
    if (!machine) {
      throw new NotFoundException(`Machine avec ID ${id_machine} non trouvée`);
    }

    const capteur = this.capteurRepository.create({
      type,  // Associe le type au capteur
      machine,  // Associe le capteur à la machine via la relation
    });

    return this.capteurRepository.save(capteur);
  }

  // Récupérer tous les capteurs
  async findAll(): Promise<Capteur[]> {
    return this.capteurRepository.find({ relations: ['machine'] });  // Charge aussi la machine liée
  }

  // Récupérer un capteur par son ID
  async findOne(id: number): Promise<Capteur> {
    const capteur = await this.capteurRepository.findOne({
      where: { id_sensor: id },
      relations: ['machine'],  // Charge aussi la machine liée
    });

    if (!capteur) {
      throw new NotFoundException(`Capteur avec ID ${id} non trouvé`);
    }

    return capteur;
  }

  // Mettre à jour un capteur
  async update(id: number, type: string, id_machine: number): Promise<Capteur> {
    const capteur = await this.findOne(id);

    // Vérifie si la machine existe
    const machine = await this.machineRepository.findOne({ where: { id_machine } });
    if (!machine) {
      throw new NotFoundException(`Machine avec ID ${id_machine} non trouvée`);
    }

    // Met à jour le capteur
    capteur.type = type;  // Modifie le champ type
    capteur.machine = machine;  // Modifie la machine associée

    return this.capteurRepository.save(capteur);
  }
  // Get all Capteurs by machine ID
  async getCapteurs(id: number): Promise<any> {
    const capteurs = await this.capteurRepository.find({
      where: { machine: { id_machine: id } }, 
    });
    
    if (capteurs.length === 0) {
      return []
    }


    return capteurs;
  }

}
