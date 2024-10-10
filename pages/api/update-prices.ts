import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Fetch all products
    const products = await prisma.product.findMany()

    // Update prices (this is a simplified example)
    for (const product of products) {
      const newPrice = product.price * 1.1 // Increase price by 10%
      await prisma.product.update({
        where: { id: product.id },
        data: { price: newPrice },
      })
    }

    res.status(200).json({ message: 'Prices updated successfully' })
  } catch (error) {
    console.error('Error updating prices:', error)
    res.status(500).json({ message: 'Error updating prices', error: (error as Error).message })
  } finally {
    await prisma.$disconnect()
  }
}
