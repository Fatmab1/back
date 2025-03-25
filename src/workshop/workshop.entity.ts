import { Entity, PrimaryGeneratedColumn, Column,JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UniteFabrication } from '../unite-fabrication/unite-fabrication.entity';
import { Machine } from '../machine/machine.entity';

@Entity()
export class Workshop {
  @PrimaryGeneratedColumn()
  id_workshop: number;

  @Column()
  nom: string;

  @ManyToOne(() => UniteFabrication, (uniteFabrication) => uniteFabrication.workshops)
  @JoinColumn({ name: 'id_uniteF' })
  uniteFabrication: UniteFabrication;
  

  @OneToMany(() => Machine, (machine) => machine.workshop)
  machines: Machine[];
}
