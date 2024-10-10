import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        externalUrl: {
          not: null
        }
      }
    })

    for (const product of products) {
      if (product.externalUrl) {
        const response = await fetch(product.externalUrl)
        const data = await response.text()
        
        // Simple regex to find a price in the format $XX.XX
        const priceMatch = data.match(/\$(\d+\.\d{2})/)
        
        if (priceMatch && priceMatch[1]) {
          const price = parseFloat(priceMatch[1])
          await prisma.product.update({
            where: { id: product.id },
            data: { price: price }
          })
        }
      }
    }

    res.status(200).json({ message: 'Prices updated successfully' })
  } catch (error) {
    console.error('Error updating prices:', error)
    res.status(500).json({ message: 'Error updating prices' })
  }
}
