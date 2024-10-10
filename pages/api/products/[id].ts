import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid product ID' })
  }

  switch (req.method) {
    case 'GET':
      try {
        const product = await prisma.product.findUnique({
          where: { id: id }
        })
        if (product) {
          res.status(200).json(product)
        } else {
          res.status(404).json({ error: 'Product not found' })
        }
      } catch (error) {
        res.status(500).json({ error: 'Error retrieving product' })
      }
      break

    case 'PUT':
      try {
        const updatedProduct = await prisma.product.update({
          where: { id: id },
          data: req.body
        })
        res.status(200).json(updatedProduct)
      } catch (error) {
        res.status(500).json({ error: 'Error updating product' })
      }
      break

    case 'DELETE':
      try {
        await prisma.product.delete({
          where: { id: id }
        })
        res.status(204).end()
      } catch (error) {
        res.status(500).json({ error: 'Error deleting product' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
