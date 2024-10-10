import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExcelHandler } from '@/components/ExcelHandler'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  tier: string
}

export default function BackOffice() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const handleImport = (data: any[]) => {
    const formattedData = data.map((item, index) => ({
      id: item.id || `temp-id-${index}`,
      name: item.name || '',
      description: item.description || '',
      price: parseFloat(item.price) || 0,
      category: item.category || '',
      tier: item.tier || '',
    }))
    setProducts(formattedData)
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">IceBods Back Office</h1>
      
      <div className="mb-4">
        <ExcelHandler onImport={handleImport} data={products} />
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.tier}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                <Button variant="destructive" size="sm">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
