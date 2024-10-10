import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

function generateRandomProduct() {
  const names = ['Ice Cream', 'Popsicle', 'Frozen Yogurt', 'Gelato', 'Sorbet', 'Ice Lolly', 'Frozen Custard', 'Sherbet']
  const descriptions = ['Creamy and delicious', 'Refreshing treat', 'Smooth and flavorful', 'Rich and indulgent', 'Light and fruity']
  const tiers = ['Basic', 'Premium', 'Deluxe', 'Ultimate']

  return {
    name: names[Math.floor(Math.random() * names.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    price: parseFloat((Math.random() * 10 + 1).toFixed(2)),
    tier: tiers[Math.floor(Math.random() * tiers.length)],
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const count = parseInt(req.body.count) || 10 // Default to 10 if not specified

      const products = []
      for (let i = 0; i < count; i++) {
        const product = generateRandomProduct()
        const createdProduct = await prisma.product.create({
          data: product,
        })
        products.push(createdProduct)
      }

      res.status(200).json({ message: `${count} products generated successfully`, products })
    } catch (error) {
      res.status(500).json({ message: 'Error generating products', error })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
