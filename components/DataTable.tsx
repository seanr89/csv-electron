
import React from 'react';
import { CsvData } from '../types';

interface DataTableProps {
  headers: string[];
  data: CsvData;
  searchQuery: string;
  searchColumn: string;
}

const DataTable: React.FC<DataTableProps> = ({ headers, data, searchQuery, searchColumn }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400">
        No data to display for the current selection.
      </div>
    );
  }

  const getHighlightedText = (text: string, query: string) => {
    if (!query || !text) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="bg-yellow-400 text-black">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <table className="w-full text-sm text-left text-slate-300">
      <thead className="text-xs text-cyan-300 uppercase bg-slate-800 sticky top-0">
        <tr>
          {headers.map((header) => (
            <th key={header} scope="col" className="px-6 py-3 whitespace-nowrap">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className="border-b border-slate-700 bg-slate-900/50 hover:bg-slate-700/50 transition-colors duration-150"
          >
            {headers.map((header, colIndex) => (
              <td key={`${rowIndex}-${colIndex}`} className="px-6 py-4 whitespace-nowrap">
                {header === searchColumn
                  ? getHighlightedText(row[header], searchQuery)
                  : row[header]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
