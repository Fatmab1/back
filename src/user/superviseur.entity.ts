import { ChildEntity } from 'typeorm';
import { User, UserRole } from './user.entity';

@ChildEntity(UserRole.SUPERVISEUR)
export class Superviseur extends User {}
