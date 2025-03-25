import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Active CORS pour permettre l'accès depuis Angular (localhost:4200)
  app.enableCors({
    origin: 'http://localhost:4200', // Autorise uniquement Angular en local
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true // Permet d'envoyer les cookies et headers d'authentification
  });

  await app.listen(3000);
  console.log('🚀 Serveur NestJS démarré sur http://localhost:3000');
}
bootstrap();
