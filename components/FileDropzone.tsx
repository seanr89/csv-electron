
import React, { useState, useCallback, useRef } from 'react';
import { CsvIcon } from './icons/CsvIcon';

interface FileDropzoneProps {
  onFileSelected: (path: string, name: string) => void;
  onError: (message: string) => void;
  // delimiter is not used here anymore, handled by parent during parsing call
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileSelected, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file) {
      onError('No file selected.');
      return;
    }
    if (!file.name.toLowerCase().endsWith('.csv')) {
      onError('Invalid file type. Please upload a .csv file.');
      return;
    }

    // In Electron, we must use the exposed webUtils API to get the path
    // because standard File.path is restricted in context-isolated environments.
    let filePath = '';

    // Try using the bridge first (Electron)
    if (window.csv && window.csv.getPathForFile) {
      try {
        filePath = window.csv.getPathForFile(file);
      } catch (e) {
        console.error("Error getting path via bridge:", e);
      }
    }

    // Fallback if bridge failed or not available (e.g. strict sandbox or old electron or dev mode issue)
    if (!filePath) {
      filePath = (file as any).path;
    }

    if (!filePath) {
      onError('Could not determine file path. Please ensure you are running the app in Electron mode (npm run start or npm run dist).');
      return;
    }

    onFileSelected(filePath, file.name);

  }, [onFileSelected, onError]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`
        w-full p-10 border-2 border-dashed rounded-xl transition-all duration-300
        flex flex-col items-center justify-center text-center
        ${isDragging ? 'border-cyan-400 bg-slate-700/50 scale-105' : 'border-slate-600 hover:border-slate-500'}
      `}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileSelect}
      />
      <CsvIcon className="w-20 h-20 mb-4 text-slate-500 transition-colors" />
      <p className="text-xl font-semibold text-slate-300">
        Drag & drop your CSV file here
      </p>
      <p className="text-slate-400 mt-1">or</p>
      <button
        onClick={onButtonClick}
        className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
      >
        Select File
      </button>
    </div>
  );
};

export default FileDropzone;
