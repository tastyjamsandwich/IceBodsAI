import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const CategoryConfigSchema = z.record(z.object({
  maxProducts: z.number().int().positive(),
  priceRange: z.object({
    min: z.number().nonnegative(),
    max: z.number().positive(),
  }),
}))

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.DEBUG_MODE === 'true') {
    console.log(`API route called: ${req.method} ${req.url}`)
    console.log('Request body:', req.body)
  }

  try {
    switch (req.method) {
      case 'GET':
        const categoryConfigs = await prisma.categoryConfig.findMany()
        if (process.env.DEBUG_MODE === 'true') {
          console.log('Category configs fetched:', categoryConfigs.length)
        }
        const configObject = categoryConfigs.reduce((acc, config) => {
          acc[config.category] = {
            maxProducts: config.maxProducts,
            priceRange: {
              min: config.minPrice,
              max: config.maxPrice,
            },
          }
          return acc
        }, {} as Record<string, { maxProducts: number; priceRange: { min: number; max: number } }>)
        res.status(200).json(configObject)
        break

      case 'POST':
        const validatedConfigs = CategoryConfigSchema.parse(req.body)
        const updatedConfigs = await Promise.all(
          Object.entries(validatedConfigs).map(async ([category, config]) => {
            return prisma.categoryConfig.upsert({
              where: { category },
              update: {
                maxProducts: config.maxProducts,
                minPrice: config.priceRange.min,
                maxPrice: config.priceRange.max,
              },
              create: {
                category,
                maxProducts: config.maxProducts,
                minPrice: config.priceRange.min,
                maxPrice: config.priceRange.max,
              },
            })
          })
        )
        if (process.env.DEBUG_MODE === 'true') {
          console.log('Category configs updated:', updatedConfigs.length)
        }
        res.status(200).json(updatedConfigs)
        break

      default:
        if (process.env.DEBUG_MODE === 'true') {
          console.log('Method not allowed:', req.method)
        }
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('API error:', error)
    res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) })
  } finally {
    await prisma.$disconnect()
  }
}
