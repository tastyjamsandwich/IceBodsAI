import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid product ID' })
  }

  if (req.method === 'GET') {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
      })
      if (product) {
        res.status(200).json(product)
      } else {
        res.status(404).json({ error: 'Product not found' })
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      res.status(500).json({ 
        error: 'Failed to fetch product', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, description, price, tier, additionalInfo, review } = req.body
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          name,
          description,
          price: parseFloat(price),
          tier,
          additionalInfo,
          review
        },
      })
      res.status(200).json(updatedProduct)
    } catch (error) {
      console.error('Error updating product:', error)
      res.status(500).json({ 
        error: 'Failed to update product', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.product.delete({
        where: { id },
      })
      res.status(204).end()
    } catch (error) {
      console.error('Error deleting product:', error)
      res.status(500).json({ 
        error: 'Failed to delete product', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
