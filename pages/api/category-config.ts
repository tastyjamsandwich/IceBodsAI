import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`API route called: ${req.method} ${req.url}`)
  console.log('Request body:', req.body)

  try {
    if (req.method === 'GET') {
      const categoryConfigs = await prisma.categoryConfig.findMany()
      console.log('Category configs fetched:', categoryConfigs.length)
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
    } else if (req.method === 'POST') {
      const configs = req.body
      const updatedConfigs = await Promise.all(
        Object.entries(configs).map(async ([category, config]) => {
          const { maxProducts, priceRange } = config as { maxProducts: number; priceRange: { min: number; max: number } }
          return prisma.categoryConfig.upsert({
            where: { category },
            update: {
              maxProducts,
              minPrice: priceRange.min,
              maxPrice: priceRange.max,
            },
            create: {
              category,
              maxProducts,
              minPrice: priceRange.min,
              maxPrice: priceRange.max,
            },
          })
        })
      )
      console.log('Category configs updated:', updatedConfigs.length)
      res.status(200).json(updatedConfigs)
    } else {
      console.log('Method not allowed:', req.method)
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
