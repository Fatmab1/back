import { Entity, PrimaryGeneratedColumn, Column,JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Usine } from '../usine/usine.entity';
import { Workshop } from '../workshop/workshop.entity';

@Entity()
export class UniteFabrication {
  @PrimaryGeneratedColumn()
  id_uniteF: number;

  @Column()
  nom: string;

  @ManyToOne(() => Usine, (usine) => usine.uniteFabrications)
  @JoinColumn({ name: 'id_usine' })
  usine: Usine;

  @OneToMany(() => Workshop, (workshop) => workshop.uniteFabrication)
  workshops: Workshop[];
}
