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
import { Info } from 'lucide-react'
import * as XLSX from 'xlsx'

interface ExcelHandlerProps {
onImport: (data: any[]) => void
data: any[]
}

export function ExcelHandler({ onImport, data }: ExcelHandlerProps) {
const [file, setFile] = useState<File | null>(null)

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    setFile(e.target.files[0])
  }
}

const handleImport = () => {
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const json = XLSX.utils.sheet_to_json(worksheet)
      onImport(json)
    }
    reader.readAsArrayBuffer(file)
  }
}

const handleExport = () => {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')
  XLSX.writeFile(workbook, 'back_office_data.xlsx')
}

return (
  <div className="flex flex-col space-y-4">
    <div className="flex items-center space-x-2">
      <Input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <Button onClick={handleImport} disabled={!file}>Import</Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Info className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Excel Import Instructions</DialogTitle>
            <DialogDescription>
              <p>Your Excel file should include the following columns in this order:</p>
              <table className="min-w-full bg-white border border-gray-300 mt-4">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Column</th>
                    <th className="border border-gray-300 px-4 py-2">Description</th>
                    <th className="border border-gray-300 px-4 py-2">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Name</td>
                    <td className="border border-gray-300 px-4 py-2">Product name</td>
                    <td className="border border-gray-300 px-4 py-2">Cryotherapy Chamber Pro</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Description</td>
                    <td className="border border-gray-300 px-4 py-2">Short product description</td>
                    <td className="border border-gray-300 px-4 py-2">Advanced cryotherapy chamber for full-body treatment</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Price</td>
                    <td className="border border-gray-300 px-4 py-2">Product price (numeric)</td>
                    <td className="border border-gray-300 px-4 py-2">5999.99</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Rating</td>
                    <td className="border border-gray-300 px-4 py-2">Product rating (1-5)</td>
                    <td className="border border-gray-300 px-4 py-2">4</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Category</td>
                    <td className="border border-gray-300 px-4 py-2">Product category</td>
                    <td className="border border-gray-300 px-4 py-2">cryotherapy</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Tier</td>
                    <td className="border border-gray-300 px-4 py-2">Product tier (basic, midtier, luxury)</td>
                    <td className="border border-gray-300 px-4 py-2">luxury</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Image URL</td>
                    <td className="border border-gray-300 px-4 py-2">URL of the product image</td>
                    <td className="border border-gray-300 px-4 py-2">https://example.com/images/cryo-chamber.jpg</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Overview</td>
                    <td className="border border-gray-300 px-4 py-2">Detailed product overview</td>
                    <td className="border border-gray-300 px-4 py-2">State-of-the-art cryotherapy chamber designed for professional use...</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Dimensions</td>
                    <td className="border border-gray-300 px-4 py-2">Product dimensions</td>
                    <td className="border border-gray-300 px-4 py-2">2.5m x 1.5m x 2.2m</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Delivery Time</td>
                    <td className="border border-gray-300 px-4 py-2">Estimated delivery time</td>
                    <td className="border border-gray-300 px-4 py-2">2-3 weeks</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Review</td>
                    <td className="border border-gray-300 px-4 py-2">Product review or testimonial</td>
                    <td className="border border-gray-300 px-4 py-2">This cryotherapy chamber has revolutionized our clinic's recovery treatments...</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">External URL (optional)</td>
                    <td className="border border-gray-300 px-4 py-2">URL for external product page</td>
                    <td className="border border-gray-300 px-4 py-2">https://external-store.com/cryo-chamber-pro</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-4">Ensure that the data types match the expected format for each field. The 'External URL' field is optional and can be left blank if not applicable.</p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
    <Button onClick={handleExport}>Export to Excel</Button>
  </div>
)
}
