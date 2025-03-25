// src/element/service/element.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Element } from './element.entity';  // Assurez-vous d'importer l'entité appropriée
import { Capteur } from '../capteur/capteur.entity';  // Assurez-vous d'importer l'entité Capteur

@Injectable()
export class ElementService {
  constructor(
    @InjectRepository(Element)
    private readonly elementRepository: Repository<Element>,
    @InjectRepository(Capteur)
    private readonly capteurRepository: Repository<Capteur>,  // Injecte le repository Capteur
  ) {}

  // Créer un élément
  async create(nom: string, id_sensor: number): Promise<Element> {
    // Vérifie si le capteur existe
    const capteur = await this.capteurRepository.findOne({ where: { id_sensor } });
    if (!capteur) {
      throw new NotFoundException(`Capteur avec ID ${id_sensor} non trouvé`);
    }

    const element = this.elementRepository.create({
      nom,
      capteur: capteur,  // Associe l'élément au capteur via la relation
    });

    return this.elementRepository.save(element);
  }

  // Récupérer tous les éléments
  async findAll(): Promise<Element[]> {
    return this.elementRepository.find({ relations: ['capteur'] });  // Charge aussi le capteur lié
  }

  // Récupérer un élément par son ID
  async findOne(id: number): Promise<Element> {
    const element = await this.elementRepository.findOne({
      where: { id_element: id },
      relations: ['capteur'],  // Charge aussi le capteur lié
    });

    if (!element) {
      throw new NotFoundException(`Élément avec ID ${id} non trouvé`);
    }

    return element;
  }

  // Mettre à jour un élément
  async update(id: number, nom: string, id_sensor: number): Promise<Element> {
    const element = await this.findOne(id);

    // Vérifie si le capteur existe
    const capteur = await this.capteurRepository.findOne({ where: { id_sensor } });
    if (!capteur) {
      throw new NotFoundException(`Capteur avec ID ${id_sensor} non trouvé`);
    }

    // Met à jour l'élément
    element.nom = nom;
    element.capteur = capteur;

    return this.elementRepository.save(element);
  }

  // Supprimer un élément
  async remove(id: number): Promise<void> {
    const element = await this.findOne(id);
    await this.elementRepository.remove(element);
  }
}
