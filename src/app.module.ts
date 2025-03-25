import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { FactoryModule } from './factory/factory.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MachineModule } from './machine/machine.module';
import { CapteurModule } from './capteur/capteur.module';
import { ElementModule } from './element/element.module';
import { AttributModule } from './attribut/attribut.module';
import { WorkshopModule } from './workshop/workshop.module';
import { UsineModule } from './usine/usine.module';
import { UniteFabricationModule } from './unite-fabrication/unite-fabrication.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { TestModule } from './test/test.module';
import { TreeModule } from './tree/tree.module';

@Module({
  imports: [
    ConfigModule.forRoot(),  // ✅ Charge les variables d’environnement depuis .env

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
    }),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_key', // ✅ Clé secrète sécurisée
      signOptions: { expiresIn: '1h' },
    }),

    FactoryModule,
    MachineModule,
    CapteurModule,
    ElementModule,
    AttributModule,
    WorkshopModule,
    UsineModule,
    UniteFabricationModule,
    AuthModule,
    UsersModule,
    TestModule,
    TreeModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
