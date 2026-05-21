import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('PrismaService');

  constructor() {
    super({
      log: ['warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      this.logger.log('Connecting to database...');
      await this.$connect();
      this.logger.log('Database connection successful');

      const tablesCheck = await this.$queryRaw`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
      `;
      const tableCount = (tablesCheck as any[]).length;
      this.logger.log(`Database has ${tableCount} tables`);

      if (tableCount === 0) {
        this.logger.warn('No tables found in database. Run Prisma migrations before using the API.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error('Database connection failed:', message);
      this.logger.error('Ensure DATABASE_URL is correct and migrations have been applied.');
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
