import React, { useEffect, useState } from 'react'
import { ProductCard } from '../components/ProductCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

interface Product {
  id: string
  name: string
  description: string
  price: number
  rating: number
  category: string
  tier: string
  image: string
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        setProducts(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching products:', error)
        setError('Failed to load products. Please try again later.')
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const generateProducts = async () => {
    try {
      const response = await fetch('/api/generate-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: 10 }),
      })
      if (!response.ok) {
        throw new Error('Failed to generate products')
      }
      const data = await response.json()
      console.log(data.message)
      // Refetch products after generation
      const productsResponse = await fetch('/api/products')
      if (!productsResponse.ok) {
        throw new Error('Failed to fetch products after generation')
      }
      const productsData = await productsResponse.json()
      setProducts(productsData)
    } catch (error) {
      console.error('Error generating products:', error)
      setError('Failed to generate products. Please try again later.')
    }
  }

  const tiers = ['Basic', 'Premium', 'Luxury']

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8 bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-6 text-center text-primary">Ice Bods Product Showcase</h1>
      <div className="flex justify-center mb-8">
        <Button onClick={generateProducts} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Generate Products
        </Button>
      </div>
      <Tabs defaultValue="Basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          {tiers.map((tier) => (
            <TabsTrigger 
              key={tier} 
              value={tier}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {tier}
            </TabsTrigger>
          ))}
        </TabsList>
        {tiers.map((tier) => (
          <TabsContent key={tier} value={tier}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((product) => product.tier === tier)
                .map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
