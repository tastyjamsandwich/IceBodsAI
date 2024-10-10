import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  try {
    switch (req.method) {
      case 'GET':
        const product = await prisma.product.findUnique({
          where: { id: String(id) },
        })
        if (product) {
          res.status(200).json(product)
        } else {
          res.status(404).json({ message: 'Product not found' })
        }
        break

      case 'PUT':
        const updatedProduct = await prisma.product.update({
          where: { id: String(id) },
          data: req.body,
        })
        res.status(200).json(updatedProduct)
        break

      case 'DELETE':
        await prisma.product.delete({
          where: { id: String(id) },
        })
        res.status(204).end()
        break

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error('Error handling product request:', error)
    res.status(500).json({ message: 'Internal server error', error: (error as Error).message })
  } finally {
    await prisma.$disconnect()
  }
}
