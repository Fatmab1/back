import { Entity, PrimaryGeneratedColumn, Column,JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Capteur } from '../capteur/capteur.entity';
import { Attribut } from '../attribut/attribut.entity';

@Entity()
export class Element {
  @PrimaryGeneratedColumn()
  id_element: number;

  @Column()
  nom: string;

  @ManyToOne(() => Capteur, (capteur) => capteur.elements)
  @JoinColumn({ name: 'id_sensor' })
  capteur: Capteur;

  @OneToMany(() => Attribut, (attribut) => attribut.element)
  attributs: Attribut[];
}
