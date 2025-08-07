
import React, { useState, useMemo } from 'react';
import { CsvData } from './types';
import FileDropzone from './components/FileDropzone';
import DataTable from './components/DataTable';
import Pagination from './components/Pagination';
import { TableIcon } from './components/icons/TableIcon';
import SummaryView from './components/SummaryView';
import SearchBar from './components/SearchBar';
import Fuse from 'fuse.js';

const ITEMS_PER_PAGE = 20;

const App: React.FC = () => {
  const [data, setData] = useState<CsvData | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [fileName, setFileName] = useState<string>('');
  const [delimiter, setDelimiter] = useState<string>('|');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchColumn, setSearchColumn] = useState<string>('');

  const handleFileParsed = (parsedData: CsvData, parsedHeaders: string[], name: string) => {
    setData(parsedData);
    setHeaders(parsedHeaders);
    setFileName(name);
    setCurrentPage(1);
    setError(null);
  };

  const handleError = (message: string) => {
    setError(message);
    setData(null);
    setHeaders([]);
    setFileName('');
  };

  const handleReset = () => {
    setData(null);
    setHeaders([]);
    setFileName('');
    setError(null);
    setCurrentPage(1);
  };

  const handleSearch = (query: string, column: string) => {
    setSearchQuery(query);
    setSearchColumn(column);
    setCurrentPage(1);
  };

  const { totalPages, currentData } = useMemo(() => {
    if (!data) {
      return { totalPages: 0, currentData: [] };
    }

    const filteredData = searchQuery
      ? new Fuse(data, {
          keys: [searchColumn || headers[0]],
          threshold: 0.3,
        })
          .search(searchQuery)
          .map((result) => result.item)
      : data;


    const totalP = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentD = filteredData.slice(startIndex, endIndex);
    return { totalPages: totalP, currentData: currentD };
  }, [data, currentPage, searchQuery, searchColumn, headers]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-900">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            CSV Data Visualizer
          </h1>
          {/* <p className="mt-2 text-lg text-slate-400">
            Upload your CSV file to instantly view and paginate through your data.
          </p> */}
        </header>

        <main className="bg-slate-800/50 rounded-2xl shadow-2xl shadow-cyan-500/10 backdrop-blur-sm border border-slate-700">
          {!data ? (
            <div className="p-8">
              <SummaryView recordCount={0} columnCount={0} />
              <div className="mb-4 flex justify-center">
                <select
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value)}
                  className="bg-slate-700 text-white rounded-md p-2"
                >
                  <option value="|">Pipe</option>
                  <option value=",">Comma</option>
                  <option value=";">Semicolon</option>
                  <option value="\t">Tab</option>
                </select>
              </div>
              <FileDropzone onFileParsed={handleFileParsed} onError={handleError} delimiter={delimiter} />
              {error && (
                <div className="mt-6 text-center text-red-400 bg-red-900/50 p-3 rounded-lg border border-red-700">
                  <p><strong>Error:</strong> {error}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <div className="flex items-center gap-3">
                  <TableIcon className="w-8 h-8 text-cyan-400" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">{fileName}</h2>
                    <SummaryView recordCount={data.length} columnCount={headers.length} />
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 w-full sm:w-auto"
                >
                  Clear
                </button>
              </div>
              <div className="mb-4">
                <SearchBar headers={headers} onSearch={handleSearch} />
              </div>
              <div className="overflow-x-auto max-h-[60vh] rounded-lg border border-slate-700">
                 <DataTable headers={headers} data={currentData} searchQuery={searchQuery} searchColumn={searchColumn} />
              </div>
              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}
        </main>
        
        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p>Powered by Electron, React & Tailwind CSS.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;


