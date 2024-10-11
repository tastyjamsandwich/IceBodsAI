import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { products } = req.body

      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: 'Invalid products data' })
      }

      const createdProducts = await prisma.product.createMany({
        data: products.map((product) => ({
          name: product.name,
          description: product.description,
          price: parseFloat(product.price),
          tier: product.tier,
          additionalInfo: product.additionalInfo || '',
          review: product.review || ''
        })),
      })

      res.status(200).json({ message: `${createdProducts.count} products created successfully` })
    } catch (error) {
      console.error('Error creating products:', error)
      res.status(500).json({ 
        error: 'Failed to create products', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
    }
  } else if (req.method === 'GET') {
    try {
      const products = await prisma.product.findMany()
      res.status(200).json(products)
    } catch (error) {
      console.error('Error fetching products:', error)
      res.status(500).json({ 
        error: 'Failed to fetch products', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
