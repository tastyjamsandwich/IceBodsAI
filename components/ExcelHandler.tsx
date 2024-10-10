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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(sheet) as Product[]
        setExcelData(jsonData)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const handleUpload = async () => {
    setIsUploading(true)
    setUploadStatus(null)
    try {
      const response = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products: excelData }),
      })
      if (!response.ok) {
        throw new Error('Failed to upload products')
      }
      const result = await response.json()
      setUploadStatus(`Successfully uploaded ${result.count} products`)
      setExcelData([])
    } catch (error) {
      setUploadStatus('Failed to upload products')
      console.error('Error uploading products:', error)
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
          {uploadStatus && <p>{uploadStatus}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
