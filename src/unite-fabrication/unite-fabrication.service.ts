// src/unite-fabrication/service/unite-fabrication.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UniteFabrication } from './unite-fabrication.entity';
import { Usine } from '../usine/usine.entity';  // Relation avec l'entité Usine
import { WorkshopService } from 'src/workshop/workshop.service';

@Injectable()
export class UniteFabricationService {
  constructor(
    @InjectRepository(UniteFabrication)
    private readonly uniteFabricationRepository: Repository<UniteFabrication>,
    @InjectRepository(Usine)
    private readonly usineRepository: Repository<Usine>,  // Injecte le repository Usine
    private worshopsservice : WorkshopService
  ) {}

  // Créer une unité de fabrication
  async create(nom: string, id_usine: number): Promise<UniteFabrication> {
    const usine = await this.usineRepository.findOne({ where: { id_usine } });
    if (!usine) {
      throw new NotFoundException(`Usine avec ID ${id_usine} non trouvée`);
    }

    const uniteFabrication = this.uniteFabricationRepository.create({
      nom,
      usine: usine,  // Associe l'unité de fabrication à l'usine via la relation
    });

    return this.uniteFabricationRepository.save(uniteFabrication);
  }

  // Récupérer toutes les unités de fabrication
  async findAll(): Promise<UniteFabrication[]> {
    return this.uniteFabricationRepository.find({ relations: ['usine'] });
  }

  // Récupérer une unité de fabrication par son ID
  async findOne(id: number): Promise<UniteFabrication> {
    const uniteFabrication = await this.uniteFabricationRepository.findOne({
      where: { id_uniteF: id },
      relations: ['usine'],
    });

    if (!uniteFabrication) {
      throw new NotFoundException(`Unité de fabrication avec ID ${id} non trouvée`);
    }

    return uniteFabrication;
  }

  // Mettre à jour une unité de fabrication
  async update(id: number, nom: string, id_usine: number): Promise<UniteFabrication> {
    const uniteFabrication = await this.findOne(id);

    const usine = await this.usineRepository.findOne({ where: { id_usine } });
    if (!usine) {
      throw new NotFoundException(`Usine avec ID ${id_usine} non trouvée`);
    }

    uniteFabrication.nom = nom;
    uniteFabrication.usine = usine;

    return this.uniteFabricationRepository.save(uniteFabrication);
  }

  // Supprimer une unité de fabrication
  async remove(id: number): Promise<void> {
    const uniteFabrication = await this.findOne(id);
    await this.uniteFabricationRepository.remove(uniteFabrication);
  }


  // get unite fabrication by usineId
  // 3-for every uniteFabrication we get workshops

  async getUniteFabrication(id: number): Promise<any> {
    try {
      
      // Retrieve all units for the specified usine (factory)
      const unites = await this.uniteFabricationRepository.find({
        where: { usine: { id_usine: id } },
      });
      console.log("unites",unites);
      
  
      // Check if there are no units found
      if (unites.length === 0) {
        throw new NotFoundException(`Aucun unite de fabrication trouvé pour l'usine avec ID ${id}`);
      }
  
      // Initialize an array to store the results
      let result: any[] = [];
  
      // Loop through each uniteFabrication and get the associated workshops
      for (let i = 0; i < unites.length; i++) {
        const workshops = await this.worshopsservice.getWorshops(unites[i].id_uniteF);
        if (workshops) {
          result.push(workshops);
        }
        console.log("workshops",workshops);
        
      }
  
      // Return the result array containing all workshops for the units
      return result;
    } catch (error) {
      // Catch any error and throw a NotFoundException with a custom message
      throw new NotFoundException('Erreur lors de la récupération des unités de fabrication');
    }
  }
  
}
