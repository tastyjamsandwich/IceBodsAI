import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const CategorySchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  maxProducts: z.number().int().positive(),
  minPrice: z.number().nonnegative(),
  maxPrice: z.number().positive(),
})

const CategoryConfigSchema = z.record(CategorySchema)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.DEBUG_MODE === 'true') {
    console.log(`API route called: ${req.method} ${req.url}`)
    console.log('Request body:', req.body)
  }

  try {
    switch (req.method) {
      case 'GET':
        const categories = await prisma.category.findMany()
        if (process.env.DEBUG_MODE === 'true') {
          console.log('Categories fetched:', categories.length)
        }
        const configObject = categories.reduce((acc, category) => {
          acc[category.name] = {
            id: category.id,
            name: category.name,
            maxProducts: category.maxProducts,
            minPrice: category.minPrice,
            maxPrice: category.maxPrice,
          }
          return acc
        }, {} as Record<string, typeof CategorySchema._type>)
        res.status(200).json(configObject)
        break

      case 'POST':
        const validatedConfigs = CategoryConfigSchema.parse(req.body)
        const updatedConfigs = await Promise.all(
          Object.entries(validatedConfigs).map(async ([name, config]) => {
            return prisma.category.upsert({
              where: { name },
              update: {
                maxProducts: config.maxProducts,
                minPrice: config.minPrice,
                maxPrice: config.maxPrice,
              },
              create: {
                name,
                maxProducts: config.maxProducts,
                minPrice: config.minPrice,
                maxPrice: config.maxPrice,
              },
            })
          })
        )
        if (process.env.DEBUG_MODE === 'true') {
          console.log('Categories updated:', updatedConfigs.length)
        }
        res.status(200).json(updatedConfigs)
        break

      case 'PUT':
        const updatedCategory = CategorySchema.parse(req.body)
        const updated = await prisma.category.update({
          where: { id: updatedCategory.id },
          data: {
            name: updatedCategory.name,
            maxProducts: updatedCategory.maxProducts,
            minPrice: updatedCategory.minPrice,
            maxPrice: updatedCategory.maxPrice,
          },
        })
        if (process.env.DEBUG_MODE === 'true') {
          console.log('Category updated:', updated.id)
        }
        res.status(200).json(updated)
        break

      case 'DELETE':
        const { id } = req.query
        await prisma.category.delete({
          where: { id: id as string }
        })
        if (process.env.DEBUG_MODE === 'true') {
          console.log('Category deleted:', id)
        }
        res.status(204).end()
        break

      default:
        if (process.env.DEBUG_MODE === 'true') {
          console.log('Method not allowed:', req.method)
        }
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('API error:', error)
    res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) })
  } finally {
    await prisma.$disconnect()
  }
}
