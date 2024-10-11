import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import * as XLSX from 'xlsx'

interface Product {
  name: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  tier: string;
  image: string;
  additionalInfo: string;
  review: string;
}

export function ExcelHandler() {
  const [products, setProducts] = useState<Product[]>([])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (evt) => {
        if (evt.target) {
          const bstr = evt.target.result
          const wb = XLSX.read(bstr, { type: 'binary' })
          const wsname = wb.SheetNames[0]
          const ws = wb.Sheets[wsname]
          const data = XLSX.utils.sheet_to_json(ws) as Product[]
          setProducts(data)
        }
      }
      reader.readAsBinaryString(file)
    }
  }

  const handleUpload = async () => {
    try {
      const response = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products }),
      })
      if (!response.ok) {
        throw new Error('Failed to upload products')
      }
      alert('Products uploaded successfully!')
    } catch (error) {
      console.error('Error uploading products:', error)
      alert('Failed to upload products. Please try again.')
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Upload Excel</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Excel File</DialogTitle>
          <DialogDescription>
            Upload an Excel file containing product information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
          {products.length > 0 && (
            <Button onClick={handleUpload}>Upload {products.length} Products</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
