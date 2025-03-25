import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attribut } from './attribut.entity';
import { Element } from '../element/element.entity';  // Assurez-vous d'importer l'entité Element

@Injectable()
export class AttributService {
  constructor(
    @InjectRepository(Attribut)
    private readonly attributRepository: Repository<Attribut>,
    @InjectRepository(Element)
    private readonly elementRepository: Repository<Element>,  // Injecte le repository Element
  ) {}

  // Créer un attribut
  async create(
    unit: string,
    ucl: number,
    wcl: number,
    target: number,
    lwl: number,
    cwl: number,
    id_element: number,  // Ajoutez le paramètre id_element pour lier l'attribut à un élément
  ): Promise<Attribut> {
    // Vérifie si l'élément existe
    const element = await this.elementRepository.findOne({ where: { id_element: id_element } });
    if (!element) {
      throw new NotFoundException(`Élément avec ID ${id_element} non trouvé`);
    }

    const attribut = this.attributRepository.create({
      Unit: unit,
      UCL: ucl,
      WCL: wcl,
      Target: target,
      LWL: lwl,
      CWL: cwl,
      element: element,  // Associe l'attribut à l'élément via la relation
    });

    return this.attributRepository.save(attribut);
  }

  // Récupérer tous les attributs
  async findAll(): Promise<Attribut[]> {
    return this.attributRepository.find({ relations: ['element'] });  // Charge aussi l'élément lié
  }

  // Récupérer un attribut par son ID
  async findOne(id: number): Promise<Attribut> {
    const attribut = await this.attributRepository.findOne({
      where: { id_attribut: id },
      relations: ['element'],  // Charge aussi l'élément lié
    });

    if (!attribut) {
      throw new NotFoundException(`Attribut avec ID ${id} non trouvé`);
    }

    return attribut;
  }

  // Mettre à jour un attribut
  async update(
    id: number,
    unit: string,
    id_element: number,  // Ajoutez le paramètre id_element pour la mise à jour
  ): Promise<Attribut> {
    const attribut = await this.findOne(id);

    // Vérifie si l'élément existe
    const element = await this.elementRepository.findOne({ where: { id_element: id_element } });
    if (!element) {
      throw new NotFoundException(`Élément avec ID ${id_element} non trouvé`);
    }

    // Met à jour l'attribut
    attribut.Unit = unit;
    attribut.element = element;  // Met à jour l'élément lié

    return this.attributRepository.save(attribut);
  }

  // Supprimer un attribut
  async remove(id: number): Promise<void> {
    const attribut = await this.findOne(id);
    await this.attributRepository.remove(attribut);
  }
}
