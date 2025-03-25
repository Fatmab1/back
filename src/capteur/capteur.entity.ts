import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Machine } from '../machine/machine.entity';
import { Element } from '../element/element.entity';

@Entity()
export class Capteur {
  @PrimaryGeneratedColumn()
  id_sensor: number;

  @Column()
  type: string;

  // Relation Many-to-One avec Machine
  @ManyToOne(() => Machine, (machine) => machine.capteurs)
  @JoinColumn({ name: 'id_machine' })  // Définir explicitement la colonne de jointure
  machine: Machine;

  // Relation One-to-Many avec Element
  @OneToMany(() => Element, (element) => element.capteur)
  elements: Element[];
}
