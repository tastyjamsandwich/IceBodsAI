import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import ProductCard from '../components/ProductCard'

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tier: string;
  rating: number;
  image: string;
  additionalInfo: string;
  review: string;
}

interface CategoryConfig {
  [category: string]: {
    maxProducts: number;
    priceRange: {
      min: number;
      max: number;
    };
  };
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryConfig, setCategoryConfig] = useState<CategoryConfig>({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

  useEffect(() => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));

    fetch('/api/category-config')
      .then(response => response.json())
      .then(data => setCategoryConfig(data))
      .catch(error => console.error('Error fetching category config:', error));
  }, []);

  const filteredProducts = products
    .filter(product => selectedCategory === 'All' || product.category === selectedCategory)
    .filter(product => product.price >= priceRange[0] && product.price <= priceRange[1])
    .slice(0, categoryConfig[selectedCategory]?.maxProducts || 10);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">IceBods Product Catalog</h1>

      <div className="w-full max-w-4xl mb-8">
        <div className="flex justify-between items-center mb-4">
          <Label htmlFor="category-select">Filter by Category:</Label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="All">All Categories</option>
            {Object.keys(categoryConfig).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <Label htmlFor="price-range">Price Range:</Label>
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-24"
            />
            <span>to</span>
            <Input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-24"
            />
          </div>
        </div>

        <div className="flex justify-between items-center bg-blue-100 p-2 rounded">
          {Object.entries(categoryConfig).map(([category, config]) => (
            <Button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setPriceRange([config.priceRange.min, config.priceRange.max]);
              }}
              variant={selectedCategory === category ? "default" : "outline"}
              className="text-xs"
            >
              {category}<br />£{config.priceRange.min}-{config.priceRange.max}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      <div className="mt-8">
        <Link href="/admin">
          <Button>Go to Admin Page</Button>
        </Link>
      </div>
    </main>
  )
}
