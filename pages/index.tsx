import React, { useEffect, useState } from 'react'
import { ProductCard } from '../components/ProductCard'
import Link from 'next/link'
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

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Ice Bods Product Showcase</h1>
        <Link href="/back-office-login">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Back Office
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  )
}
