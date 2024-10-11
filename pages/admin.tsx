import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

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

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});

  useEffect(() => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        const addedProduct = await response.json();
        setProducts(prev => [...prev, addedProduct]);
        setNewProduct({});
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Link href="/">
        <Button className="mb-4">Back to Home</Button>
      </Link>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">Add New Product</h2>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={newProduct.name || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            value={newProduct.description || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={newProduct.price || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            value={newProduct.category || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button type="submit">Add Product</Button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Product List</h2>
      <div className="space-y-4">
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded">
            <h3 className="font-bold">{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: £{product.price}</p>
            <p>Category: {product.category}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
