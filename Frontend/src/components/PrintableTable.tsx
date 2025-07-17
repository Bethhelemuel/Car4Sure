// src/components/PrintableTable.tsx
import React from 'react';

interface PrintableTableProps {
  columns: string[];
  data: any[][];
  title?: string;
}

export const PrintableTable: React.FC<PrintableTableProps> = ({ columns, data, title }) => {
  return (
    <div className="printable-table-container p-6">
      {title && <h1 className="text-2xl font-bold mb-4">{title}</h1>}
      <table className="min-w-full divide-y divide-gray-200 print:table print:table-auto print:w-full">
        <thead className="bg-gray-50 print:bg-gray-100">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:text-sm print:font-semibold print:text-black"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 print:bg-white">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="print:break-inside-avoid">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 print:text-xs print:text-black"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                No data available for printing.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};