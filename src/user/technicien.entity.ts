import { ChildEntity } from 'typeorm';
import { User, UserRole } from './user.entity';

@ChildEntity(UserRole.TECHNICIEN)
export class Technicien extends User {}
