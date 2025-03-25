import { Module } from "@nestjs/common";
import { UsersService } from "../user/user.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from "./admin.entity";
import { User } from '../user/user.entity';
import { Technicien } from "./technicien.entity";
import { Superviseur } from "./superviseur.entity";
import { UsersController } from "./user.controller";

@Module({
    imports: [TypeOrmModule.forFeature([User,Technicien,Superviseur,Admin])],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {} // Ajoute cette ligne si elle manque
