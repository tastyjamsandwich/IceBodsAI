import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const products = await prisma.product.findMany()
      res.status(200).json(products)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' })
    }
  } else if (req.method === 'POST') {
    try {
      const product = await prisma.product.create({ data: req.body })
      res.status(201).json(product)
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
