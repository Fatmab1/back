import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UniteFabrication } from '../unite-fabrication/unite-fabrication.entity';

@Entity()
export class Usine {
  @PrimaryGeneratedColumn()
  id_usine: number;

  @Column()
  nom: string;

  @OneToMany(() => UniteFabrication, (uniteFabrication) => uniteFabrication.usine)
  uniteFabrications: UniteFabrication[];
}
