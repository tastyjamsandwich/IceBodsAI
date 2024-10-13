import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import Link from 'next/link'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  tier: string
  rating: number
  image: string
  additionalInfo: string
  review: string
}

interface Category {
  id: string
  name: string
  maxProducts: number
  priceRange: {
    min: number
    max: number
  }
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [newProduct, setNewProduct] = useState<Partial<Product>>({})
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    maxProducts: 10,
    priceRange: { min: 0, max: 1000 }
  })
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryConfig, setCategoryConfig] = useState<{[key: string]: Category}>({})

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({ title: "Error", description: "Failed to load products", variant: "destructive" })
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
      const configObj = data.reduce((acc: {[key: string]: Category}, cat: Category) => {
        acc[cat.name] = cat
        return acc
      }, {})
      setCategoryConfig(configObj)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast({ title: "Error", description: "Failed to load categories", variant: "destructive" })
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/products', {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct || newProduct),
      })
      if (!response.ok) throw new Error('Failed to save product')
      toast({ title: "Success", description: `Product ${editingProduct ? 'updated' : 'added'} successfully` })
      fetchProducts()
      setEditingProduct(null)
      setNewProduct({})
    } catch (error) {
      console.error('Error saving product:', error)
      toast({ title: "Error", description: "Failed to save product", variant: "destructive" })
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/categories', {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory || newCategory),
      })
      if (!response.ok) throw new Error('Failed to save category')
      toast({ title: "Success", description: `Category ${editingCategory ? 'updated' : 'added'} successfully` })
      fetchCategories()
      setEditingCategory(null)
      setNewCategory({ name: '', maxProducts: 10, priceRange: { min: 0, max: 1000 } })
    } catch (error) {
      console.error('Error saving category:', error)
      toast({ title: "Error", description: "Failed to save category", variant: "destructive" })
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete category')
      toast({ title: "Success", description: "Category deleted successfully" })
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      toast({ title: "Error", description: "Failed to delete category", variant: "destructive" })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Link href="/">
        <Button className="mb-4">Back to Home</Button>
      </Link>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="products">Add/Edit Products</TabsTrigger>
          <TabsTrigger value="categories">Category Configurations</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                {['name', 'description', 'price', 'category', 'tier', 'rating', 'image', 'additionalInfo', 'review'].map((field) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                    {field === 'description' || field === 'additionalInfo' || field === 'review' ? (
                      <Textarea
                        id={field}
                        name={field}
                        value={editingProduct?.[field as keyof Product] || newProduct[field as keyof Product] || ''}
                        onChange={(e) => editingProduct 
                          ? setEditingProduct({...editingProduct, [field]: e.target.value})
                          : setNewProduct({...newProduct, [field]: e.target.value})
                        }
                        required
                      />
                    ) : field === 'category' ? (
                      <select
                        id={field}
                        name={field}
                        value={editingProduct?.[field] || newProduct[field] || ''}
                        onChange={(e) => editingProduct
                          ? setEditingProduct({...editingProduct, [field]: e.target.value})
                          : setNewProduct({...newProduct, [field]: e.target.value})
                        }
                        required
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        id={field}
                        name={field}
                        type={field === 'price' || field === 'rating' ? 'number' : 'text'}
                        value={editingProduct?.[field as keyof Product] || newProduct[field as keyof Product] || ''}
                        onChange={(e) => editingProduct
                          ? setEditingProduct({...editingProduct, [field]: e.target.value})
                          : setNewProduct({...newProduct, [field]: e.target.value})
                        }
                        required
                      />
                    )}
                  </div>
                ))}
                <Button type="submit">{editingProduct ? 'Update' : 'Add'} Product</Button>
                {editingProduct && (
                  <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>Cancel Edit</Button>
                )}
              </form>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Product List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button onClick={() => setEditingProduct(product)} className="mr-2">Edit</Button>
                        <Button variant="destructive" onClick={() => {/* Implement delete functionality */}}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    name="name"
                    value={editingCategory?.name || newCategory.name}
                    onChange={(e) => editingCategory
                      ? setEditingCategory({...editingCategory, name: e.target.value})
                      : setNewCategory({...newCategory, name: e.target.value})
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxProducts">Max Products</Label>
                  <Input
                    id="maxProducts"
                    name="maxProducts"
                    type="number"
                    value={editingCategory?.maxProducts || newCategory.maxProducts}
                    onChange={(e) => editingCategory
                      ? setEditingCategory({...editingCategory, maxProducts: parseInt(e.target.value)})
                      : setNewCategory({...newCategory, maxProducts: parseInt(e.target.value)})
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minPrice">Min Price</Label>
                  <Input
                    id="minPrice"
                    name="minPrice"
                    type="number"
                    value={editingCategory?.priceRange.min || newCategory.priceRange?.min}
                    onChange={(e) => editingCategory
                      ? setEditingCategory({...editingCategory, priceRange: {...editingCategory.priceRange, min: parseInt(e.target.value)}})
                      : setNewCategory({...newCategory, priceRange: {...newCategory.priceRange!, min: parseInt(e.target.value)}})
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPrice">Max Price</Label>
                  <Input
                    id="maxPrice"
                    name="maxPrice"
                    type="number"
                    value={editingCategory?.priceRange.max || newCategory.priceRange?.max}
                    onChange={(e) => editingCategory
                      ? setEditingCategory({...editingCategory, priceRange: {...editingCategory.priceRange, max: parseInt(e.target.value)}})
                      : setNewCategory({...newCategory, priceRange: {...newCategory.priceRange!, max: parseInt(e.target.value)}})
                    }
                    required
                  />
                </div>
                <Button type="submit">{editingCategory ? 'Update' : 'Add'} Category</Button>
                {editingCategory && (
                  <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>Cancel Edit</Button>
                )}
              </form>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Category List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Max Products</TableHead>
                    <TableHead>Price Range</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.maxProducts}</TableCell>
                      <TableCell>${category.priceRange.min} - ${category.priceRange.max}</TableCell>
                      <TableCell>
                        <Button onClick={() => setEditingCategory(category)} className="mr-2">Edit</Button>
                        <Button variant="destructive" onClick={() => handleDeleteCategory(category.id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
