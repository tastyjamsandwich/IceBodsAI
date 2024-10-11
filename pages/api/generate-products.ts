import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    console.log('Generating products...')
    const { count = 10 } = req.body

    const products = Array.from({ length: count }, () => ({
      name: `Product ${Math.random().toString(36).substring(7)}`,
      description: `Description for product ${Math.random().toString(36).substring(7)}`,
      price: parseFloat((Math.random() * 100).toFixed(2)),
      rating: Math.floor(Math.random() * 5) + 1,
      category: ['Electronics', 'Clothing', 'Books', 'Home'][Math.floor(Math.random() * 4)],
      tier: ['Basic', 'Premium', 'Luxury'][Math.floor(Math.random() * 3)],
      image: `https://picsum.photos/200/300?random=${Math.random()}`,
    }))

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
