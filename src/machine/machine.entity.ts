import { Entity, PrimaryGeneratedColumn, Column,JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Workshop } from '../workshop/workshop.entity';
import { Capteur } from '../capteur/capteur.entity';

@Entity()
export class Machine {
  @PrimaryGeneratedColumn()
  id_machine: number;

  @Column()
  nom: string;

  @ManyToOne(() => Workshop, (workshop) => workshop.machines)
  @JoinColumn({ name: 'id_workshop' })
  workshop: Workshop;

  @OneToMany(() => Capteur, (capteur) => capteur.machine)
  capteurs: Capteur[];
}
