import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const products = req.body
      
      for (const product of products) {
        await prisma.product.create({
          data: {
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            rating: parseInt(product.rating),
            category: product.category,
            tier: product.tier,
            image: product.image,
            info: {
              overview: product.overview,
              dimensions: product.dimensions,
              deliveryTime: product.deliveryTime,
            },
            review: product.review,
            externalUrl: product.externalUrl,
          },
        })
      }

      res.status(200).json({ message: 'Products imported successfully' })
    } catch (error) {
      console.error('Error importing products:', error)
      res.status(500).json({ error: 'Failed to import products' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
