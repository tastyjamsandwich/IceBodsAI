import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const categoryConfigs = await prisma.categoryConfig.findMany()
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
    } catch (error) {
      console.error('Error fetching category configurations:', error)
      res.status(500).json({ error: 'Failed to fetch category configurations' })
    }
  } else if (req.method === 'POST') {
    try {
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
      res.status(200).json(updatedConfigs)
    } catch (error) {
      console.error('Error updating category configurations:', error)
      res.status(500).json({ error: 'Failed to update category configurations' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
