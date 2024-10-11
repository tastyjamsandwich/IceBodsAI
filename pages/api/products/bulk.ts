import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { products } = req.body

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Invalid products data' })
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
        additionalInfo: product.additionalInfo || '',
        review: product.review || ''
      })),
    })

    res.status(200).json({ message: `${createdProducts.count} products created successfully` })
  } catch (error) {
    console.error('Error creating products:', error)
    res.status(500).json({ 
      message: 'Error creating products', 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    })
  }
}
