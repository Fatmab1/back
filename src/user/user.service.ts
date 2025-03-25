import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User,UserRole } from './user.entity';
import { Technicien } from './technicien.entity';
import { Admin } from './admin.entity';
import { Superviseur } from './superviseur.entity'
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  
  ) {}


  async create(userData: Partial<User>): Promise<User> {
    console.log('📌 Création de l\'utilisateur:', userData.email, 'avec le rôle', userData.role);

    // Vérifier si un mot de passe est fourni
    if (userData.password && typeof userData.password === 'string') {
        if (userData.password.startsWith('$2b$10$')) {
            console.log('✅ Le mot de passe est déjà haché, insertion directe.');
        } else {
            console.log('🔒 Hachage du mot de passe...');
            userData.password = await bcrypt.hash(userData.password, 10);
        }
    } else {
        console.warn('⚠️ Aucun mot de passe fourni ou format incorrect.');
    }

    const newUser = this.userRepository.create(userData);
    console.log('💾 Données avant insertion:', newUser);

    return await this.userRepository.save(newUser);
}



  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }
  async findUserByName(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: email.toLowerCase() } // 🔥 Assure la cohérence de la recherche
    });
  }
  
  async findOne(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateData: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, updateData);
    return this.userRepository.findOneBy({id});
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
