import React from 'react'
import ProductCard from './ProductCard'

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  category?: {
    name: string;
    minPrice?: number;
    maxPrice?: number;
  };
  tier: string;
  image: string;
  additionalInfo: string;
  review: string;
}

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          description={product.description}
          price={product.price}
          rating={product.rating}
          category={product.category}
          tier={product.tier}
          image={product.image}
          additionalInfo={product.additionalInfo}
          review={product.review}
        />
      ))}
    </div>
  )
}
