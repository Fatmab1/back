import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usine } from '../usine/usine.entity';

@Injectable()
export class FactoryService {
  constructor(
    @InjectRepository(Usine)
    private readonly usineRepository: Repository<Usine>,
  ) {}

  async getFullTree() {
    const usines = await this.usineRepository.find({
      relations: [
        'uniteFabrications',
        'uniteFabrications.workshops',
        'uniteFabrications.workshops.machines',
        'uniteFabrications.workshops.machines.capteurs',
      ],
    });

    return usines.map(usine => ({
      label: usine.nom,
      data: { id: usine.id_usine, type: 'usine' },
      children: usine.uniteFabrications.map(unite => ({
        label: unite.nom,
        data: { id: unite.id_uniteF, type: 'unite' },
        children: unite.workshops.map(workshop => ({
          label: workshop.nom,
          data: { id: workshop.id_workshop, type: 'workshop' },
          children: workshop.machines.map(machine => ({
            label: machine.nom,
            data: { id: machine.id_machine, type: 'machine' },
            children: machine.capteurs.map(capteur => ({
              label: capteur.type,
              data: { id: capteur.id_sensor, type: 'capteur' },
            })),
          })),
        })),
      })),
    }));
  }
}
