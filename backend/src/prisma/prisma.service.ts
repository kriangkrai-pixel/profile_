import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: process.env.NODE_ENV === 'development' 
        ? ['error', 'warn'] 
        : ['error'],
      // Connection Pool Settings are set via DATABASE_URL query params
      // Example: ?connection_limit=20&pool_timeout=20&connect_timeout=10
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database connected');
    console.log('⚡ Connection pool ready');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

