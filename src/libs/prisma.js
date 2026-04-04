import { PrismaClient } from '../../generated/prisma'
import dotenv from 'dotenv'

dotenv.config()

export const prisma = new PrismaClient()
