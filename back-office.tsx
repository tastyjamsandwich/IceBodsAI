import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

interface Product {
  id: string
  name: string
  description: string
  price: number
  tier: string
  additionalInfo: string
  review: string
  category: string
}

export default function BackOffice() {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState<Partial<Product>>({})
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: value })
    } else {
      setNewProduct({ ...newProduct, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      if (editingProduct) {
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct),
        })
        if (!response.ok) throw new Error('Failed to update product')
        const updatedProduct = await response.json()
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p))
        toast({
          title: "Success",
          description: "Product updated successfully.",
        })
      } else {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct),
        })
        if (!response.ok) throw new Error('Failed to add product')
        const addedProduct = await response.json()
        setProducts([...products, addedProduct])
        toast({
          title: "Success",
          description: "Product added successfully.",
        })
      }
      setIsDialogOpen(false)
      setEditingProduct(null)
      setNewProduct({})
    } catch (error) {
      console.error('Error submitting product:', error)
      setError('Failed to save product. Please try again.')
      toast({
        title: "Error",
        description: `Failed to ${editingProduct ? 'update' : 'add'} product. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete product')
      setProducts(products.filter(p => p.id !== id))
      toast({
        title: "Success",
        description: "Product deleted successfully.",
      })
    } catch (error) {
      console.error('Error deleting product:', error)
      setError('Failed to delete product. Please try again.')
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingProduct(null)
    setNewProduct({})
    setError(null)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Back Office</h1>
      <Button onClick={() => setIsDialogOpen(true)} className="mb-4">Add New Product</Button>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.tier}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(product)} className="mr-2 bg-blue-500 text-white hover:bg-blue-600">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(product.id)} variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Edit the product details below.' : 'Enter the details of the new product.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {['name', 'description', 'price', 'tier', 'category', 'additionalInfo', 'review'].map((field) => (
                <div key={field} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={field} className="text-right">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                  {field === 'additionalInfo' || field === 'review' ? (
                    <Textarea
                      id={field}
                      name={field}
                      value={editingProduct?.[field as keyof Product] || newProduct[field as keyof Product] || ''}
                      onChange={handleInputChange}
                      className="col-span-3 text-black bg-white"
                    />
                  ) : (
                    <Input
                      id={field}
                      name={field}
                      type={field === 'price' ? 'number' : 'text'}
                      value={editingProduct?.[field as keyof Product] || newProduct[field as keyof Product] || ''}
                      onChange={handleInputChange}
                      className="col-span-3 text-black bg-white"
                    />
                  )}
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="submit">{editingProduct ? 'Update' : 'Add'} Product</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
