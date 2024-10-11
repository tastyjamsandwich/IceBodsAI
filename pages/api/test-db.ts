import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Attempt to query the database
    const count = await prisma.product.count()
    res.status(200).json({ message: 'Database connection successful', productCount: count })
  } catch (error) {
    console.error('Database connection error:', error)
    res.status(500).json({ 
      message: 'Error connecting to the database', 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    })
  }
}
