import { Entity, PrimaryGeneratedColumn, Column, TableInheritance } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  SUPERVISEUR = 'superviseur',
  TECHNICIEN = 'technicien',
}

@Entity('users')
@TableInheritance({ column: { type: 'enum', name: 'role', enum: UserRole } })
export class User {
  @PrimaryGeneratedColumn() 
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;
}
