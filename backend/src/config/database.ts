import { PrismaClient } from '../../../node_modules/.prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = new PrismaClient() as PrismaClient;

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL connected successfully via Prisma');

    // Test the connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection test passed');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log('🔌 PostgreSQL connection closed');
  } catch (error) {
    console.error('❌ Error disconnecting from database:', error);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});

export { prisma };
