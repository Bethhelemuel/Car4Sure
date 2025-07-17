import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ExtraTableViewsProps {
  columns: string[];
  datalist: Record<string, any>[];
  title?: string;
}

// Helper to load image as base64
const getBase64ImageFromURL = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = function (error) {
      reject(error);
    };
    img.src = url;
  });
};

const ExtraTableViews: React.FC<ExtraTableViewsProps> = ({ columns, datalist, title }) => {
  const handleExportCSV = () => {
    const csvContent =
      columns.join(',') +
      '\n' +
      datalist.map(row => columns.map(col => `"${String(row[col] ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', (title || 'table') + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    const doc = new jsPDF();
    // Add logo to top right
    try {
      const logoData = await getBase64ImageFromURL(process.env.PUBLIC_URL + '/logo.png');
      doc.addImage(logoData, 'PNG', 160, 8, 30, 15);
    } catch (e) {
      // If logo fails to load, continue without it
    }
    doc.text(title || 'Table', 14, 16);
    (doc as any).autoTable({
      head: [columns],
      body: datalist.map(row => columns.map(col => row[col] ?? '')),
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });
    doc.save((title || 'table') + '.pdf');
  };

  return (
    <>
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          className="px-3 py-1 rounded bg-primary text-white hover:bg-primary/90 focus:outline-none"
          onClick={handleExportPDF}
        >
          Export PDF
        </button>
        <button
          type="button"
          className="px-3 py-1 rounded bg-primary text-white hover:bg-primary/90 focus:outline-none"
          onClick={handleExportCSV}
        >
          Export CSV
        </button>
      </div>
  
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {datalist.length > 0 ? (
            datalist.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row[col] ?? ''}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default ExtraTableViews; 