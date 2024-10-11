import { useState, useEffect } from 'react'
import { Product } from '@prisma/client'
import { Button } from "@/components/ui/button"

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to fetch products. Please try again.')
    }
  }

  const generateProducts = async () => {
    setIsLoading(true)
    setError(null)
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
      await fetchProducts() // Refresh the product list
    } catch (error) {
      console.error('Error generating products:', error)
      setError('Failed to generate products. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">IceBods Products</h1>
      <Button onClick={generateProducts} disabled={isLoading} className="mb-4">
        {isLoading ? 'Generating...' : 'Generate Random Products'}
      </Button>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {products.length === 0 ? (
        <p>No products available. Generate some products to get started!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-lg font-bold mb-2">${product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Category: {product.category}</p>
              <p className="text-sm text-gray-500">Tier: {product.tier}</p>
              <p className="text-sm text-gray-500">Rating: {product.rating}/5</p>
              {product.image && (
                <img src={product.image} alt={product.name} className="mt-2 w-full h-40 object-cover rounded" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
