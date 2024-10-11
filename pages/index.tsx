import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface Product {
  id: string
  name: string
  description: string
  price: number
  rating: number
  category: string
  tier: string
  image: string
  additionalInfo: string
  review: string
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products/bulk')
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.details || `HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
        setError(error instanceof Error ? error.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error}</p>
        <p>Please try again later or contact support if the problem persists.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">IceBods Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.tier}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{product.description}</p>
              <p className="font-bold mt-2">Price: ${product.price.toFixed(2)}</p>
              <p>Rating: {product.rating}/5</p>
              <p>Category: {product.category}</p>
            </CardContent>
            <CardFooter>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Show More</AccordionTrigger>
                  <AccordionContent>
                    <h4 className="font-semibold">Additional Info:</h4>
                    <p>{product.additionalInfo}</p>
                    <h4 className="font-semibold mt-2">Review:</h4>
                    <p>{product.review}</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
