import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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

@Module({
  imports: [
    // ConfigModule.forRoot(),  // ✅ Charge les variables d’environnement depuis .env

    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'postgres',
    //   database: 'postgres',
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   synchronize: true,
    //   autoLoadEntities: true,
    //   logging: true,




    // }),

    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', 'Hamza123****'),
        database: configService.get<string>('DB_DATABASE', 'fatma'),
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false), // Désactiver en production
        logging: configService.get<boolean>('DB_LOGGING', true),
        entities: [__dirname + '/**/*.entity{.ts,.js}'], // Correct pour charger les entités
        autoLoadEntities: true, // Active le chargement automatique
      }),
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
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
