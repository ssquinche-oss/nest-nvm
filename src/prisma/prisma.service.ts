import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private client?: PrismaClient;
  private pool?: pg.Pool;

  constructor() {
    if (process.env.USE_DB === 'true' && process.env.DATABASE_URL) {
      this.pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
      const adapter = new PrismaPg(this.pool);
      this.client = new PrismaClient({ adapter });
    }
  }

  get libro() {
    return this.client?.libro;
  }

  get isConnected(): boolean {
    return !!this.client;
  }

  async onModuleInit() {
    if (process.env.USE_DB === 'true' && this.client) {
      try {
        await this.client.$connect();
        this.logger.log('Conectado exitosamente a PostgreSQL con Prisma 7');
      } catch (err) {
        this.logger.error('No se pudo conectar a PostgreSQL', err);
      }
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.$disconnect();
    }
    if (this.pool) {
      await this.pool.end();
    }
  }
}
