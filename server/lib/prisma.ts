import { PrismaClient } from '../../prisma/client/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

const config = useRuntimeConfig()

const adapter = new PrismaMariaDb({
  ...config.database,
  connectionLimit: 5,
})

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })
if (import.meta.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
