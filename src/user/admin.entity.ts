import { ChildEntity } from 'typeorm';
import { User, UserRole } from './user.entity';

@ChildEntity(UserRole.ADMIN)
export class Admin extends User {}
