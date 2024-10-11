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
    <Card className="w-full max-w-sm overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden">
          <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
          <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
            {tier}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold text-primary mb-2 truncate">{name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-primary">${price.toFixed(2)}</span>
          <div className="flex items-center bg-secondary text-secondary-foreground rounded-full px-2 py-1">
            <Star className="w-4 h-4 fill-current mr-1" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
        <span className="inline-block text-xs font-medium bg-accent text-accent-foreground px-2 py-1 rounded-full">
          {category}
        </span>
      </CardContent>
      <CardFooter className="p-4 bg-secondary">
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
