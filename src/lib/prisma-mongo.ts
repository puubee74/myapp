import { PrismaClient as MongoClient } from '../../prisma/generated/mongo'

const globalForMongo = globalThis as unknown as { prismaMongo?: MongoClient }

export const prismaMongo =
  globalForMongo.prismaMongo ?? new MongoClient()

if (process.env.NODE_ENV !== 'production') globalForMongo.prismaMongo = prismaMongo
