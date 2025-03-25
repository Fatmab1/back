import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/user.service';  // Assuming you have UsersService that interacts with your database
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, // Service to interact with user data
    private jwtService: JwtService, // JWT service to handle token creation
  ) {}

  // 🔹 Validate user credentials for login
  async validateUser(email: string, password: string): Promise<any> {
    console.log('🔍 Vérification de l\'utilisateur:', email);

    const user = await this.usersService.findUserByName(email); // Assumes UsersService has a method findUserByEmail
    console.log('👤 Utilisateur trouvé:', user);

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('🔑 Mot de passe valide ?', isPasswordValid);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }

    return user; // Return the user, without password
  }

  // 🔹 Login and generate JWT
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),  // Creates the JWT token
      role: user.role.toLowerCase(),
    };
  }

  // 🔹 Get user by ID
  async getUser(id: number) {
    console.log('🔍 Récupération de l\'utilisateur avec ID:', id);
    
    const user = await this.usersService.findOne(id); // Assumes UsersService has a method findOne
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    return user;
  }

  // 🔹 Get all users (optional)
  async getUsers() {
    return this.usersService.findAll();  // Assumes UsersService has a method findAll
  }
}
