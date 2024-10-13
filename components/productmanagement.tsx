import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

interface ProductManagementProps {
  products: Product[];
  categories: string[];
  onAddProduct: (product: Partial<Product>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export default function ProductManagement({ products, categories, onAddProduct, onUpdateProduct, onDeleteProduct }: ProductManagementProps) {
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdateProduct(editingProduct);
      setEditingProduct(null);
    } else {
      onAddProduct(newProduct);
      setNewProduct({});
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={editingProduct?.name || newProduct.name || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={editingProduct?.description || newProduct.description || ''}
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
            value={editingProduct?.price || newProduct.price || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            value={editingProduct?.category || newProduct.category || ''}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="tier">Tier</Label>
          <Input
            id="tier"
            name="tier"
            value={editingProduct?.tier || newProduct.tier || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="rating">Rating</Label>
          <Input
            id="rating"
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={editingProduct?.rating || newProduct.rating || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            name="image"
            value={editingProduct?.image || newProduct.image || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="additionalInfo">Additional Info</Label>
          <Textarea
            id="additionalInfo"
            name="additionalInfo"
            value={editingProduct?.additionalInfo || newProduct.additionalInfo || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="review">Review</Label>
          <Textarea
            id="review"
            name="review"
            value={editingProduct?.review || newProduct.review || ''}
            onChange={handleInputChange}
          />
        </div>
        <Button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</Button>
        {editingProduct && (
          <Button type="button" variant="outline" onClick={() => setEditingProduct(null)}>Cancel Edit</Button>
        )}
      </form>

      <h2 className="text-2xl font-bold mb-4">Product List</h2>
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
              <TableCell>£{product.price.toFixed(2)}</TableCell>
              <TableCell>
                <Button onClick={() => setEditingProduct(product)} className="mr-2">Edit</Button>
                <Button variant="destructive" onClick={() => onDeleteProduct(product.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
