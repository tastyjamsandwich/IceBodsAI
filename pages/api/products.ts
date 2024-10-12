import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const debugLog = (message: string, data?: any) => {
    if (process.env.DEBUG_MODE === 'true') {
      console.log(`[${new Date().toISOString()}] ${message}`, data ? data : '')
    }
  }

  debugLog(`API route called: ${req.method} ${req.url}`)
  debugLog('Request body:', req.body)

  try {
    switch (req.method) {
      case 'GET':
        const products = await prisma.product.findMany({
          orderBy: { createdAt: 'desc' }
        })
        debugLog('Products fetched:', products.length)
        res.status(200).json(products)
        break

      case 'POST':
        const product = await prisma.product.create({
          data: req.body,
        })
        debugLog('Product created:', product.id)
        res.status(201).json(product)
        break

      case 'PUT':
        const { id, ...data } = req.body
        const updatedProduct = await prisma.product.update({
          where: { id },
          data,
        })
        debugLog('Product updated:', updatedProduct.id)
        res.status(200).json(updatedProduct)
        break

      default:
        debugLog('Method not allowed:', req.method)
        res.setHeader('Allow', ['GET', 'POST', 'PUT'])
        res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }
  } catch (error) {
    console.error('API error:', error)
    let errorMessage = 'Internal Server Error'
    let errorDetails = ''

    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack || ''
    } else if (typeof error === 'string') {
      errorDetails = error
    }

    debugLog('Error in API route:', { errorMessage, errorDetails })

    res.status(500).json({ 
      error: errorMessage, 
      details: errorDetails,
      timestamp: new Date().toISOString(),
      route: req.url,
      method: req.method
    })
  } finally {
    await prisma.$disconnect()
  }
}
