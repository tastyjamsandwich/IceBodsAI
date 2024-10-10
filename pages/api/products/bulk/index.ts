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
      res.status(500).json({ message: 'Error creating products', error: (error as Error).message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
