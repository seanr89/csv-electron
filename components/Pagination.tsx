
import React from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    onPageChange(currentPage + 1);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full text-slate-400">
      <div className="mb-2 sm:mb-0">
        Page <span className="font-bold text-white">{currentPage}</span> of <span className="font-bold text-white">{totalPages}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="
            flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md
            bg-slate-700 hover:bg-slate-600 text-white
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200
          "
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="
            flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md
            bg-slate-700 hover:bg-slate-600 text-white
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200
          "
        >
          Next
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
