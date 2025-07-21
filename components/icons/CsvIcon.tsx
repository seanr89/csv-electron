
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const CsvIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M12 18h-1" />
    <path d="M8 12h1" />
    <path d="M15 12h1" />
    <path d="M8 15h2" />
    <path d="M14 15h2" />
    <path d="M10 18h1" />
  </svg>
);
