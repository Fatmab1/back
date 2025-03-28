// src/unite-fabrication/service/unite-fabrication.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

  async deleteLinked(id_usine: number): Promise<{ deletedCount: number }> {
    try {
      // Find all fabrication units in this factory
      const unites = await this.uniteFabricationRepository.find({
        where: { usine: { id_usine } },
        relations: ['workshops'] // Load workshops if needed
      });
  
      if (unites.length === 0) {
        return { deletedCount: 0 };
      }
  
      let totalDeleted = 0;
  
      // Delete all workshops for each fabrication unit
      for (const unite of unites) {
        if (unite.id_uniteF) {
          const result = await this.worshopsservice.deleteLinked(unite.id_uniteF);
          totalDeleted += result.deletedCount || 0;
          
          // Delete the fabrication unit itself
          await this.uniteFabricationRepository.delete({ id_uniteF: unite.id_uniteF });
          totalDeleted += 1; // Count the unit deletion
        }
      }
  
      return { deletedCount: totalDeleted };
    } catch (error) {
      console.error(`Error deleting linked units for factory ${id_usine}:`, error);
      throw new InternalServerErrorException('Failed to delete linked fabrication units and workshops');
    }
  }
  
  async delete(key: string): Promise<{ id: number, deleted: true }> {
    try {
      if (!key) {
        throw new BadRequestException('Fabrication unit name is required');
      }
  
      // Find unit with its relations
      const unite = await this.uniteFabricationRepository.findOne({
        where: { nom: key },
        relations: ['usine', 'workshops']
      });
  
      if (!unite) {
        throw new NotFoundException(`Fabrication unit with name ${key} not found`);
      }
  
      // Delete all associated workshops first
      if (unite.id_uniteF) {
        const deleteResult = await this.worshopsservice.deleteLinked(unite.id_uniteF);
        console.log(`Deleted ${deleteResult.deletedCount} workshops from unit ${key}`);
      }
  
      // Delete the fabrication unit
      const deleteUnitResult = await this.uniteFabricationRepository.delete({ nom: key });
  
      if (deleteUnitResult.affected === 0) {
        throw new NotFoundException(`Fabrication unit with name ${key} could not be deleted`);
      }
  
      return { id: unite.id_uniteF, deleted: true };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error(`Error deleting fabrication unit ${key}:`, error);
      throw new InternalServerErrorException('Failed to delete fabrication unit');
    }
  }

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
      
  
      // Check if there are no units found
      if (unites.length === 0) {
        return []
      }
  
      // Initialize an array to store the results
      let result: any[] = [];
  
      // Loop through each uniteFabrication and get the associated workshops
      for (let i = 0; i < unites.length; i++) {
        let r = await this.worshopsservice.getWorshops(unites[i].id_uniteF);  
        if(r.length==0){
          r=[]
        }
        let s ={
          uniteFabrications : unites[i].nom,
          workshops:r
        }
        result.push(s)
        
      }
  
      // Return the result array containing all workshops for the units
      return result;
    } catch (error) {
      // Catch any error and throw a NotFoundException with a custom message
      throw new NotFoundException('Erreur lors de la récupération des unités de fabrication');
    }
  }
  async getIdByName(label : string){
    try {
      const uniteFabrication = await this.uniteFabricationRepository.findOne({where:{nom:label}})
      if(uniteFabrication){
        return uniteFabrication.id_uniteF;
      }
      return null
        } catch (error) {
          throw new NotFoundException('Error to get id by name');
        }

  }
}
