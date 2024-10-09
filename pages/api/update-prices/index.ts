import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import cheerio from 'cheerio'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
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
          const response = await axios.get(product.externalUrl)
          const $ = cheerio.load(response.data)
          const price = $('span.price').text().replace('$', '')
          
          if (price) {
            await prisma.product.update({
              where: { id: product.id },
              data: { price: parseFloat(price) }
            })
          }
        }
      }

      res.status(200).json({ message: 'Prices updated successfully' })
    } catch (error) {
      console.error('Error updating prices:', error)
      res.status(500).json({ error: 'Failed to update prices' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
