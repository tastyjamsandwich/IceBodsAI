import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type ProductInput = {
  name: string
  description: string
  price: string
  rating: string
  category: string
  tier: string
  image: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const products: ProductInput[] = req.body.products

      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty product data' })
      }

      const createdProducts = await prisma.product.createMany({
        data: products.map((product) => ({
          name: product.name,
          description: product.description,
          price: parseFloat(product.price),
          rating: parseInt(product.rating),
          category: product.category,
          tier: product.tier,
          image: product.image,
        })),
      })

      res.status(200).json({ message: 'Products created successfully', count: createdProducts.count })
    } catch (error) {
      console.error('Error creating products:', error)
      res.status(500).json({ message: 'Error creating products', error: (error as Error).message })
    } finally {
      await prisma.$disconnect()
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
