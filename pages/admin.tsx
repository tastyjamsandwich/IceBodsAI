import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

interface CategoryConfig {
  [category: string]: {
    maxProducts: number;
    priceRange: {
      min: number;
      max: number;
    };
  };
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categoryConfig, setCategoryConfig] = useState<CategoryConfig>({});

  const fetchData = async () => {
    try {
      const [productsResponse, categoryConfigResponse] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/category-config')
      ]);
      
      if (productsResponse.ok && categoryConfigResponse.ok) {
        const [productsData, categoryConfigData] = await Promise.all([
          productsResponse.json(),
          categoryConfigResponse.json()
        ]);
        
        setProducts(productsData);
        setCategoryConfig(categoryConfigData);
      } else {
        console.error('Error fetching data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const response = await fetch('/api/products', {
        method: editingProduct.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });
      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(prev => 
          editingProduct.id 
            ? prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
            : [...prev, updatedProduct]
        );
        setEditingProduct(null);
        fetchData(); // Refresh the product list
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/category-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryConfig),
      });
      if (response.ok) {
        alert('Category configuration saved successfully');
        fetchData(); // Refresh the category config
      }
    } catch (error) {
      console.error('Error saving category config:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Link href="/">
        <Button className="mb-4">Back to Home</Button>
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct?.id ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleProductSubmit} className="space-y-4">
            {['name', 'description', 'price', 'category', 'tier', 'rating', 'image', 'additionalInfo', 'review'].map((field) => (
              <div key={field}>
                <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                {field === 'description' || field === 'additionalInfo' || field === 'review' ? (
                  <Textarea
                    id={field}
                    name={field}
                    value={editingProduct?.[field as keyof Product] || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev!, [field]: e.target.value }))}
                    required
                  />
                ) : (
                  <Input
                    id={field}
                    name={field}
                    type={field === 'price' || field === 'rating' ? 'number' : 'text'}
                    value={editingProduct?.[field as keyof Product] || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev!, [field]: e.target.value }))}
                    required
                  />
                )}
              </div>
            ))}
            <Button type="submit">{editingProduct?.id ? 'Update' : 'Add'} Product</Button>
            {editingProduct?.id && (
              <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>Cancel Edit</Button>
            )}
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Category Configuration</h2>
          <form onSubmit={handleConfigSubmit} className="space-y-4">
            {Object.entries(categoryConfig).map(([category, config]) => (
              <div key={category} className="border p-4 rounded">
                <h3 className="font-semibold mb-2">{category}</h3>
                <div className="space-y-2">
                  <Label htmlFor={`${category}-max`}>Max Products</Label>
                  <Input
                    id={`${category}-max`}
                    type="number"
                    value={config.maxProducts}
                    onChange={(e) => setCategoryConfig(prev => ({
                      ...prev,
                      [category]: { ...prev[category], maxProducts: parseInt(e.target.value) }
                    }))}
                  />
                  <Label htmlFor={`${category}-min`}>Min Price</Label>
                  <Input
                    id={`${category}-min`}
                    type="number"
                    value={config.priceRange.min}
                    onChange={(e) => setCategoryConfig(prev => ({
                      ...prev,
                      [category]: { 
                        ...prev[category], 
                        priceRange: { ...prev[category].priceRange, min: parseInt(e.target.value) }
                      }
                    }))}
                  />
                  <Label htmlFor={`${category}-max`}>Max Price</Label>
                  <Input
                    id={`${category}-max`}
                    type="number"
                    value={config.priceRange.max}
                    onChange={(e) => setCategoryConfig(prev => ({
                      ...prev,
                      [category]: { 
                        ...prev[category], 
                        priceRange: { ...prev[category].priceRange, max: parseInt(e.target.value) }
                      }
                    }))}
                  />
                </div>
              </div>
            ))}
            <Button type="submit">Save Category Configuration</Button>
          </form>
        </div>
      </div>

      <h2 className="text-xl font-semibold my-4">Product List</h2>
      <div className="space-y-4">
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p>Price: £{product.price}</p>
              <p>Category: {product.category}</p>
            </div>
            <Button onClick={() => setEditingProduct(product)}>Edit</Button>
          </div>
        ))}
      </div>
    </div>
  )
}
