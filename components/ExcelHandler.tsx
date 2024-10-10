import React, { useState } from 'react'
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
import { Info } from 'lucide-react'

interface ExcelHandlerProps {
  onImport: (data: any[]) => void
  data: any[]
}

export const ExcelHandler: React.FC<ExcelHandlerProps> = ({ onImport, data }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const jsonData = parseCSV(text)
        onImport(jsonData)
      }
      reader.readAsText(file)
    }
  }

  const parseCSV = (text: string) => {
    const lines = text.split('\n')
    const headers = lines[0].split(',').map(header => header.trim())
    return lines.slice(1).map(line => {
      const values = line.split(',')
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index]?.trim() || ''
        return obj
      }, {} as Record<string, string>)
    }).filter(row => Object.values(row).some(value => value !== ''))
  }

  const handleExport = () => {
    if (data.length === 0) {
      alert('No data to export')
      return
    }

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'export.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="max-w-sm"
      />
      <Button onClick={handleExport} disabled={data.length === 0}>Export</Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger onClick={() => setIsDialogOpen(true)}>
          <Button variant="outline" size="icon">
            <Info className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>CSV Handler Information</DialogTitle>
            <DialogDescription>
              This component allows you to import and export CSV files.
              <ul className="list-disc list-inside mt-2">
                <li>For importing, please ensure your CSV file has headers in the first row.</li>
                <li>The import function will parse the CSV and convert it to JSON format.</li>
                <li>The export function will create a CSV file with the current data.</li>
                <li>Empty rows in the imported CSV will be automatically removed.</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
