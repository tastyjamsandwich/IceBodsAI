import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const product = await prisma.product.findUnique({
        where: { id: String(id) },
      })
      if (product) {
        res.status(200).json(product)
      } else {
        res.status(404).json({ message: 'Product not found' })
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product', error: (error as Error).message })
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedProduct = await prisma.product.update({
        where: { id: String(id) },
        data: req.body,
      })
      res.status(200).json(updatedProduct)
    } catch (error) {
      res.status(500).json({ message: 'Error updating product', error: (error as Error).message })
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.product.delete({
        where: { id: String(id) },
      })
      res.status(204).end()
    } catch (error) {
      res.status(500).json({ message: 'Error deleting product', error: (error as Error).message })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
