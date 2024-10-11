import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ExcelHandler } from '../components/ExcelHandler'
import ProductCard from '../components/ProductCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Product {
  id: string;
  category: string;
  // Add other product properties here
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        const uniqueCategories = ['All', ...Array.from(new Set(data.map((product: Product) => product.category)))];
        setCategories(uniqueCategories);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter((product: Product) => product.category === selectedCategory);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">IceBods Product Catalog</h1>

      <Tabs defaultValue="products" className="w-full max-w-4xl">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="upload">Upload Excel</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <div className="mb-4">
            <Label htmlFor="category-select">Filter by Category:</Label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="ml-2 p-2 border rounded"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product: Product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="upload">
          <div className="mt-4">
            <Label htmlFor="file">Upload Excel File</Label>
            <Input id="file" type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
            {file && <ExcelHandler file={file} />}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Link href="/admin">
          <Button>Go to Admin Page</Button>
        </Link>
      </div>
    </main>
  )
}
