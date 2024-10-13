import React from 'react';
import * as XLSX from 'xlsx';

interface ExcelHandlerProps {
  file: File;
}

export function ExcelHandler({ file }: ExcelHandlerProps) {
  const [data, setData] = React.useState<any[]>([]);

  React.useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const bstr = e.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      setData(data);
    };
    reader.readAsBinaryString(file);
  }, [file]);

  return (
    <div>
      <h2>Excel Data:</h2>
      <table>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {row.map((cell: any, cellIndex: number) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
