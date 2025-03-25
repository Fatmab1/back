import { Controller, Post, UseGuards, Request, Body, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard'; // Import the JWT Auth Guard
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  // 🔹 Fetch all users (protected by JwtAuthGuard)
  @UseGuards(JwtAuthGuard) // This guard ensures only authenticated users can access
  @Get('users')
  async getUsers() {
    const users = await this.usersService.findAll(); // Get all users from the usersService
    return users;
  }

  // 🔹 Enregistrement d'un nouvel utilisateur avec email, mot de passe et rôle
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    console.log('📌 Création d\'un nouvel utilisateur:', registerDto.email, 'avec le rôle', registerDto.role);

    // 🔹 Vérifier si le rôle fourni est valide
    const role = registerDto.role as UserRole;
    if (!Object.values(UserRole).includes(role)) {
      throw new Error(`Le rôle "${registerDto.role}" n'est pas valide. Rôles acceptés: ${Object.values(UserRole).join(', ')}`);
    }

    // 🔥 Vérifier que le mot de passe est bien fourni
    if (!registerDto.password || registerDto.password.trim() === '') {
      throw new Error('❌ Le mot de passe ne peut pas être vide ou invalide.');
    }

    console.log('🔑 Mot de passe reçu AVANT hashage:', registerDto.password);

    // 🔹 Hacher le mot de passe avant de l'enregistrer
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    console.log('🔑 Hash généré:', hashedPassword);

    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword, // ✅ Stocke un mot de passe sécurisé
      role: role, // ✅ Convertit `string` en `UserRole`
    });

    console.log('✅ Utilisateur enregistré avec succès:', user);
    return { message: 'Utilisateur créé avec succès', user };
  }

  // 🔹 Connexion d'un utilisateur avec seulement email et mot de passe
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    console.log('📥 Requête reçue pour login:', req.body);
    console.log('📥 Utilisateur authentifié via LocalAuthGuard:', req.user);

    if (!req.user) {
      throw new UnauthorizedException('❌ Échec de l\'authentification.');
    }

    return this.authService.login(req.user);
  }
}
