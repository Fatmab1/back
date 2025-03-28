// src/capteur/service/capteur.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
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

  // Supprimer un capteur
  async remove(id: number): Promise<void> {
    const capteur = await this.findOne(id);
    await this.capteurRepository.remove(capteur);
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
