import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  price: string;
  rating: string;
  category: string;
  tier: string;
  image: string;
}

export default function ExcelHandler() {
  const [excelData, setExcelData] = useState<Product[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const sheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(sheet) as Product[]
          setExcelData(jsonData)
          setError(null)
        } catch (err) {
          console.error('Error parsing Excel file:', err)
          setError('Failed to parse Excel file. Please check the file format.')
        }
      }
      reader.onerror = (err) => {
        console.error('Error reading file:', err)
        setError('Failed to read the file. Please try again.')
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const handleUpload = async () => {
    setIsUploading(true)
    setUploadStatus(null)
    setError(null)
    try {
      const response = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products: excelData }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to upload products')
      }
      const result = await response.json()
      setUploadStatus(`Successfully uploaded ${result.count} products`)
      setExcelData([])
    } catch (error) {
      console.error('Error uploading products:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setIsUploading(false)
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
          <Input
            id="excel-file"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
          {excelData.length > 0 && (
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload Products'}
            </Button>
          )}
          {uploadStatus && <p className="text-green-600">{uploadStatus}</p>}
          {error && <p className="text-red-600">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
