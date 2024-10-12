import { NextApiRequest, NextApiResponse } from 'next'

export function withErrorHandler(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res)
    } catch (error) {
      console.error('API error:', error)
      res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : String(error) })
    }
  }
}
