
import React, { useState, useCallback, useRef } from 'react';
import { CsvData } from '../types';
import { CsvIcon } from './icons/CsvIcon';

interface FileDropzoneProps {
  onFileParsed: (data: CsvData, headers: string[], fileName: string) => void;
  onError: (message: string) => void;
  delimiter: string;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileParsed, onError, delimiter }) => {
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

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        
        if (lines.length < 2) {
          throw new Error('CSV file must have a header row and at least one data row.');
        }

        const headers = lines[0].split(delimiter).map(h => h.trim());
        const data = lines.slice(1).map(line => {
          const values = line.split(delimiter);
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index]?.trim() || '';
            return obj;
          }, {} as Record<string, string>);
        });
        onFileParsed(data, headers, file.name);
      } catch (e) {
        if (e instanceof Error) {
            onError(`Failed to parse file: ${e.message}`);
        } else {
            onError('An unknown error occurred during file parsing.');
        }
      }
    };
    reader.onerror = () => {
      onError('Failed to read the file.');
    };
    reader.readAsText(file);
  }, [onFileParsed, onError, delimiter]);

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
