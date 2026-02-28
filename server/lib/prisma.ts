import { PrismaClient } from '../../prisma/client/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import 'dotenv/config'

const adapter = new PrismaMariaDb({
  host: import.meta.env.DATABASE_HOST,
  user: import.meta.env.DATABASE_USER,
  password: import.meta.env.DATABASE_PASSWORD,
  database: import.meta.env.DATABASE_NAME,
  port: parseInt(import.meta.env.DATABASE_PORT || '3306'),
  connectionLimit: 5,
})

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })
if (import.meta.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
