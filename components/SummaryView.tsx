import React from 'react';

interface SummaryViewProps {
  recordCount: number;
  columnCount: number;
  className?: string;
}

const SummaryView: React.FC<SummaryViewProps> = ({ recordCount, columnCount, className = '' }) => {
  return (
    <div className={`flex justify-center gap-4 ${className}`}>
      <div className="bg-slate-700 p-4 rounded-lg text-center">
        <p className="text-slate-400 text-sm">Total Records</p>
        <p className="text-white text-2xl font-bold">{recordCount}</p>
      </div>
      <div className="bg-slate-700 p-4 rounded-lg text-center">
        <p className="text-slate-400 text-sm">Total Columns</p>
        <p className="text-white text-2xl font-bold">{columnCount}</p>
      </div>
    </div>
  );
};

export default SummaryView;