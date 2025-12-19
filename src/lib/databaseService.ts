import { PrismaClient } from '@prisma/client';
import {
  DatabaseCategory,
  DatabaseMeal,
  DatabaseOrder,
  DatabaseOrderItem,
  DatabaseClient,
  CreateCategory,
  CreateMeal,
  CreateOrder,
  CreateClient,
  UpdateCategory,
  UpdateMeal,
  UpdateOrder,
  LocalizedCategory,
  LocalizedMeal,
  LocalizedOrder,
  Language,
  getLocalizedName,
  getLocalizedDescription
} from '../types/database';

// HARDCODED DATABASE URL FOR SIMPLICITY  
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://admin:admin123@localhost:5432/hantagam';

// Создаем единственный экземпляр Prisma Client
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL
      }
    },
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
