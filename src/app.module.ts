import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { LibrosModule } from './libros/libros.module';

@Module({
  imports: [PrismaModule, LibrosModule],
})
export class AppModule {}
