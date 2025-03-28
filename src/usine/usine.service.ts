import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usine } from './usine.entity';
import { NotFoundError, throwError } from 'rxjs';
import { UniteFabricationService } from 'src/unite-fabrication/unite-fabrication.service';
import { UsineDto } from './dto/usine.dto';
import { log } from 'util';

@Injectable()
export class UsineService {
  constructor(
    @InjectRepository(Usine)
    private readonly usineRepository: Repository<Usine>,
    private uniteFabrication : UniteFabricationService
  ) {}

  async create(nom: string): Promise<Usine> {
    const usine = this.usineRepository.create({ nom });
    return this.usineRepository.save(usine);
  }

  async findAll(): Promise<Usine[]> {
    return this.usineRepository.find();
  }

  async delete(key: string): Promise<any> {
    try {
      const r =await this.usineRepository.findOneBy({
        nom:key  
      })
      if(r){
      await this.uniteFabrication.deleteLinked(r?.id_usine)
      }
      const deleteResult = await this.usineRepository.delete({
        nom:key
      });

  
      if (deleteResult.affected === 0) {
        return null
      }
      
  
      return deleteResult;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete usine');
    }
  }



  // 1-get usine information
  // 2-for every factory we get uniteFabrication
  // 3-for every uniteFabrication we get workshops
  // 4-for every workshops we get machine
  // 5-for every machine we get capteur
  getInitializeData = async (): Promise<any> => {
    
    try {
      // Initialize an empty result array
      const result: any[] = [];
  
      // 1. Get usine information
      const usineData = await this.usineRepository.find();
      
      // Check if usineData is empty
      if (!usineData || usineData.length === 0) {
        return null;
      }
  
      // 2. For every factory, get uniteFabrication
      for (let i = 0; i < usineData.length; i++) {
        let r = await this.uniteFabrication.getUniteFabrication(usineData[i].id_usine);
        if(r.length==0){
          r=[]
        }
        const s ={
          usine : usineData[i].nom,
          uniteFabrications : r
        }
          result.push(s);
      }
      

      
      return result;
      
    } catch (error) {
      throw new NotFoundException('Error to initialize data');
    }
  }

  getIdByName=async(label : string)=>{
    try {
      const usine = await this.usineRepository.findOne({where:{nom:label}})
      if(usine){
        return usine.id_usine;
      }
      return null
        } catch (error) {
          throw new NotFoundException('Error to get id by name');
        }

  }

  


}
