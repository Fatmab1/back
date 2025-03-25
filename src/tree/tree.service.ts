import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usine } from '../usine/usine.entity';

@Injectable()
export class TreeService {
  constructor(
    @InjectRepository(Usine)
    private readonly usineRepository: Repository<Usine>,
  ) {}

  async getTreeData() {
    const usines = await this.usineRepository.find({
      relations: [
        'uniteFabrications',
        'uniteFabrications.workshops',
        'uniteFabrications.workshops.machines',
        'uniteFabrications.workshops.machines.capteurs',
      ],
    });

    return usines.map((usine) => ({
      label: usine.nom,
      data: 'usine-${usine.id_usine}',
      children: usine.uniteFabrications.map((unite) => ({
        label: unite.nom,
        data: 'unite-${unite.id_uniteF}',
        children: unite.workshops.map((workshop) => ({
          label: workshop.nom,
          data: 'workshop-${workshop.id_workshop}',
          children: workshop.machines.map((machine) => ({
            label: machine.nom,
            data: 'machine-${machine.id_machine}',
            children: machine.capteurs.map((capteur) => ({
              label: capteur.type,
              data: 'capteur-${capteur.id_sensor}',
            })),
          })),
        })),
      })),
    }));
  }
}
