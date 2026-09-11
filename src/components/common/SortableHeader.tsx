import React from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

export type SortDirection = 'asc' | 'desc';

export interface SortableHeaderProps {
  label: string;
  field: string;
  currentSortField: string;
  currentSortDirection: SortDirection;
  onSort: (field: string) => void;
  align?: 'left' | 'center' | 'right';
  className?: string;
  id?: string;
}

export const SortableHeader: React.FC<SortableHeaderProps> = ({
  label,
  field,
  currentSortField,
  currentSortDirection,
  onSort,
  align = 'left',
  className = '',
  id
}) => {
  const isActive = currentSortField === field;

  const getAlignmentClass = () => {
    switch (align) {
      case 'right':
        return 'justify-end text-right';
      case 'center':
        return 'justify-center text-center';
      case 'left':
      default:
        return 'justify-start text-left';
    }
  };

  return (
    <th
      id={id}
      className={`py-3 px-4 select-none ${className}`}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className={`group inline-flex items-center gap-1.5 font-mono uppercase text-[10px] tracking-wider transition-colors cursor-pointer w-full focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded ${getAlignmentClass()} ${
          isActive
            ? 'text-emerald-600 dark:text-emerald-400 font-bold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
        }`}
        title={`Sort by ${label} (${isActive ? (currentSortDirection === 'asc' ? 'ascending - click for descending' : 'descending - click for ascending') : 'click to sort'})`}
      >
        <span>{label}</span>
        <span
          className={`shrink-0 p-0.5 rounded transition-transform ${
            isActive
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              : 'text-slate-400 opacity-50 group-hover:opacity-100'
          }`}
        >
          {isActive ? (
            currentSortDirection === 'asc' ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )
          ) : (
            <ArrowUpDown className="w-3 h-3" />
          )}
        </span>
      </button>
    </th>
  );
};
