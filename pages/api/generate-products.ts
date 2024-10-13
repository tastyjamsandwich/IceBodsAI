import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    console.log('Generating products...')
    const { count = 10 } = req.body

    if (typeof count !== 'number' || count < 1 || count > 100) {
      return res.status(400).json({ message: 'Invalid count. Must be a number between 1 and 100.' })
    }

    const categories = await prisma.category.findMany({
      include: { priceRange: true }
    })

    if (categories.length === 0) {
      return res.status(400).json({ message: 'No categories found. Please create categories first.' })
    }

    const products = Array.from({ length: count }, () => {
      const category = categories[Math.floor(Math.random() * categories.length)]
      const price = Math.random() * (category.priceRange.max - category.priceRange.min) + category.priceRange.min
      
      return {
        name: `Product ${Math.random().toString(36).substring(7)}`,
        description: `Description for product ${Math.random().toString(36).substring(7)}`,
        price: parseFloat(price.toFixed(2)),
        rating: Math.floor(Math.random() * 5) + 1,
        category: category.name,
        tier: ['Basic', 'Premium', 'Luxury'][Math.floor(Math.random() * 3)],
        image: `https://picsum.photos/200/300?random=${Math.random()}`,
        additionalInfo: `Additional information about ${Math.random().toString(36).substring(7)}`,
        review: `This product is ${['amazing', 'great', 'good', 'okay', 'disappointing'][Math.floor(Math.random() * 5)]}. ${Math.random().toString(36).substring(7)}`,
      }
    })

    console.log('Products generated, attempting to save to database...')
    const createdProducts = await prisma.product.createMany({
      data: products,
    })

    console.log(`${createdProducts.count} products created successfully`)
    res.status(200).json({ message: `${createdProducts.count} products generated successfully` })
  } catch (error) {
    console.error('Error generating products:', error)
    res.status(500).json({ 
      message: 'Error generating products', 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    })
  }
}
