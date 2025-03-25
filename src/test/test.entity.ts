import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tests')
export class Test {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
}
