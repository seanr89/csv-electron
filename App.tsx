
import React, { useState } from 'react';
import { CsvData } from './types';
import FileDropzone from './components/FileDropzone';
import DataTable from './components/DataTable';
import Pagination from './components/Pagination';
import { TableIcon } from './components/icons/TableIcon';
import SummaryView from './components/SummaryView';
import SearchBar from './components/SearchBar';

// Increased per request - user wanted 5000-10000
const ITEMS_PER_PAGE = 5000;

const App: React.FC = () => {
  const [data, setData] = useState<CsvData | null>(null); // Current page data
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [fileName, setFileName] = useState<string>('');
  const [delimiter, setDelimiter] = useState<string>('|');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchColumn, setSearchColumn] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadPage = async (page: number) => {
    setIsLoading(true);
    try {
      const pageData = await window.csv.getPage(page, ITEMS_PER_PAGE);
      setData(pageData);
      setCurrentPage(page);
    } catch (err: any) {
      setError('Failed to load page: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelected = async (path: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Parse file in main process
      // delimiter is passed to main process
      const result = await window.csv.parseFile(path, delimiter);
      setHeaders(result.headers);
      setTotalRecords(result.totalRows);
      setTotalPages(Math.ceil(result.totalRows / ITEMS_PER_PAGE));
      setFileName(name);

      // Load first page
      await loadPage(1);
    } catch (err: any) {
      setError('Failed to parse file: ' + err.message);
      setData(null);
      setHeaders([]);
      setFileName('');
    } finally {
      setIsLoading(false);
    }
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
    setTotalPages(0);
    setTotalRecords(0);
    setSearchQuery('');
    setSearchColumn('');
    // TODO: Reset backend state? We rely on new file load to reset activeSearchQuery.
    // If we want to clear search in backend, we should call search('', '').
    window.csv.search('', '').catch(() => { });
  };

  const handleSearch = async (query: string, column: string) => {
    setSearchQuery(query);
    setSearchColumn(column);
    setIsLoading(true);
    try {
      const result = await window.csv.search(query, column);
      setTotalRecords(result.totalCount);
      setTotalPages(Math.ceil(result.totalCount / ITEMS_PER_PAGE));
      setCurrentPage(1); // Reset to page 1 on new search

      // Load first page of results
      const pageData = await window.csv.getPage(1, ITEMS_PER_PAGE);
      setData(pageData);

    } catch (err: any) {
      setError('Search failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadPage(page);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-900">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            CSV Data Visualizer
          </h1>
        </header>

        <main className="bg-slate-800/50 rounded-2xl shadow-2xl shadow-cyan-500/10 backdrop-blur-sm border border-slate-700">
          {!data && !isLoading && !fileName ? (
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
              <FileDropzone onFileSelected={handleFileSelected} onError={handleError} />
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
                    <SummaryView recordCount={totalRecords} columnCount={headers.length} />
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

              {isLoading ? (
                <div className="text-center text-cyan-400 py-10">Loading...</div>
              ) : (
                <>
                  <div className="overflow-x-auto max-h-[60vh] rounded-lg border border-slate-700">
                    <DataTable headers={headers} data={data || []} searchQuery={searchQuery} searchColumn={searchColumn} />
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
                </>
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
