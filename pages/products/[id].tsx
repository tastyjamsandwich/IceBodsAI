import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  tier: string;
  image: string;
  additionalInfo: string;
  review: string;
}

export default function ProductPage() {
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (id) {
      fetch(`/api/products/${id}`)
        .then(response => response.json())
        .then(data => setProduct(data))
        .catch(error => console.error('Error fetching product:', error))
    }
  }, [id])

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/">
        <Button className="mb-4">Back to Products</Button>
      </Link>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative h-96 w-full">
          <Image
            src={product.image || "/placeholder.svg?height=384&width=384"}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <Star className="h-5 w-5 text-yellow-500 mr-1" />
            <span className="text-lg font-semibold">{product.rating}/5.0</span>
          </div>
          <p className="text-xl font-bold text-blue-600 mb-4">£{product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="text-sm text-gray-500 mb-4">
            <p>Category: {product.category}</p>
            <p>Tier: {product.tier}</p>
          </div>
          <Button className="w-full mb-4">Add to Cart</Button>
          <Tabs defaultValue="info" className="mt-8">
            <TabsList className="w-full grid grid-cols-2 gap-2">
              <TabsTrigger value="info" className="w-full">Additional Info</TabsTrigger>
              <TabsTrigger value="review" className="w-full">Review</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="mt-4">
              <p className="text-gray-600">{product.additionalInfo}</p>
            </TabsContent>
            <TabsContent value="review" className="mt-4">
              <p className="text-gray-600">{product.review}</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
