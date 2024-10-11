import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from 'lucide-react'

interface ProductCardProps {
  name: string
  description: string
  price: number
  rating: number
  category: string
  tier: string
  image: string
}

export function ProductCard({ name, description, price, rating, category, tier, image }: ProductCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0">
        <img src={image} alt={name} className="w-full h-48 object-cover rounded-t-lg" />
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold">{name}</h3>
          <span className="text-sm font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded">{tier}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">${price.toFixed(2)}</span>
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-primary mr-1" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>
        <span className="inline-block mt-2 text-sm border border-primary text-primary px-2 py-1 rounded">{category}</span>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  )
}
