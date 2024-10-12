import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const products = await prisma.product.findMany()
      res.status(200).json(products)
    } else if (req.method === 'POST') {
      const product = await prisma.product.create({
        data: req.body,
      })
      res.status(201).json(product)
    } else if (req.method === 'PUT') {
      const { id, ...data } = req.body
      const updatedProduct = await prisma.product.update({
        where: { id },
        data,
      })
      res.status(200).json(updatedProduct)
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT'])
      res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('API error:', error)
    res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) })
  } finally {
    await prisma.$disconnect()
  }
}
