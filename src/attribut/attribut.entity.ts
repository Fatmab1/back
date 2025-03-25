import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Element } from '../element/element.entity';

@Entity()
export class Attribut {
  @PrimaryGeneratedColumn()
  id_attribut: number;

  @Column({ nullable: true })
  Unit: string;

  @Column('float', { nullable: true })
  UCL: number;

  @Column('float', { nullable: true })
  WCL: number;

  @Column('float', { nullable: true })
  Target: number;

  @Column('float', { nullable: true })
  LWL: number;

  @Column('float', { nullable: true })
  CWL: number;

  // Relation ManyToOne avec Element
  @ManyToOne(() => Element, (element) => element.attributs)
  @JoinColumn({ name: 'id_element' })  // Nom de la colonne de la clé étrangère
  element: Element;
}
