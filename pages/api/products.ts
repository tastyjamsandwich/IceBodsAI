import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`API route called: ${req.method} ${req.url}`)
  console.log('Request body:', req.body)

  try {
    if (req.method === 'GET') {
      const products = await prisma.product.findMany()
      console.log('Products fetched:', products.length)
      res.status(200).json(products)
    } else if (req.method === 'POST') {
      const product = await prisma.product.create({
        data: req.body,
      })
      console.log('Product created:', product.id)
      res.status(201).json(product)
    } else if (req.method === 'PUT') {
      const { id, ...data } = req.body
      const updatedProduct = await prisma.product.update({
        where: { id },
        data,
      })
      console.log('Product updated:', updatedProduct.id)
      res.status(200).json(updatedProduct)
    } else {
      console.log('Method not allowed:', req.method)
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
