import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import Link from 'next/link'
import ProductManagement from '../components/ProductManagement'

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

interface Category {
  id: string;
  name: string;
  maxProducts: number;
  priceRange: {
    min: number;
    max: number;
  };
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    maxProducts: 10,
    priceRange: { min: 0, max: 1000 }
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({ title: "Error", description: "Failed to load products", variant: "destructive" });
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({ title: "Error", description: "Failed to load categories", variant: "destructive" });
    }
  };

  const handleAddProduct = async (product: Partial<Product>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error('Failed to add product');
      toast({ title: "Success", description: "Product added successfully" });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({ title: "Error", description: "Failed to add product", variant: "destructive" });
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error('Failed to update product');
      toast({ title: "Success", description: "Product updated successfully" });
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({ title: "Error", description: "Failed to update product", variant: "destructive" });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete product');
      toast({ title: "Success", description: "Product deleted successfully" });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/categories', {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory || newCategory),
      });
      if (!response.ok) throw new Error('Failed to save category');
      toast({ title: "Success", description: `Category ${editingCategory ? 'updated' : 'added'} successfully` });
      fetchCategories();
      setEditingCategory(null);
      setNewCategory({ name: '', maxProducts: 10, priceRange: { min: 0, max: 1000 } });
    } catch (error) {
      console.error('Error saving category:', error);
      toast({ title: "Error", description: "Failed to save category", variant: "destructive" });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete category');
      toast({ title: "Success", description: "Category deleted successfully" });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({ title: "Error", description: "Failed to delete category", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Link href="/">
        <Button className="mb-4">Back to Home</Button>
      </Link>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="products">Manage Products</TabsTrigger>
          <TabsTrigger value="categories">Manage Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductManagement
            products={products}
            categories={categories.map(c => c.name)}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
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
                      <TableCell>£{category.priceRange.min} - £{category.priceRange.max}</TableCell>
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
  );
}
