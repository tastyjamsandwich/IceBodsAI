import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Delete all existing products
    await prisma.product.deleteMany()

    // Fetch all categories
    const categories = await prisma.category.findMany()

    if (categories.length === 0) {
      return res.status(400).json({ message: 'No categories found' })
    }

    const generatedProducts = []

    for (const category of categories) {
      const numProducts = Math.floor(Math.random() * (category.maxProducts - 1)) + 1
      
      for (let i = 0; i < numProducts; i++) {
        const price = Math.random() * (category.maxPrice - category.minPrice) + category.minPrice
        
        const product = await prisma.product.create({
          data: {
            name: `${category.name} Product ${i + 1}`,
            description: `A great ${category.name} product`,
            price: parseFloat(price.toFixed(2)),
            categoryId: category.id,
            tier: ['Basic', 'Premium', 'Deluxe'][Math.floor(Math.random() * 3)],
            rating: parseFloat((Math.random() * 5).toFixed(1)),
            image: '/placeholder.svg',
            additionalInfo: 'Some additional information',
            review: 'A customer review',
          },
        })
        
        generatedProducts.push(product)
      }
    }

    res.status(200).json({ message: 'Products generated successfully', products: generatedProducts })
  } catch (error) {
    console.error('Error generating products:', error)
    res.status(500).json({ message: 'Error generating products', error: error instanceof Error ? error.message : String(error) })
  } finally {
    await prisma.$disconnect()
  }
}
