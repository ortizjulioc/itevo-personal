import React from 'react';

interface SkeletonProps {
    rows?: number;
    columns?: string[];
}
 interface GenericSkeletonProps {
  lines?: number;
  withHeader?: boolean;
  className?: string;
}

const TableSkeleton: React.FC<SkeletonProps> = ({ rows = 5, columns = [] }) => {
    return (
        <div className="col-span-2 w-full table-responsive mb-5 panel p-0 border-0 overflow-hidden">
            <table className="table-hover">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column}</th>
                        ))}
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex} className="animate-pulse">
                            {columns.map((_, colIndex) => (
                                <td key={colIndex}>
                                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                                </td>
                            ))}
                            <td>
                                <div className="flex gap-2 justify-end">
                                    <div className="h-8 w-8 bg-gray-300 rounded-lg"></div>
                                    <div className="h-8 w-8 bg-gray-300 rounded-lg"></div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export const GenericSkeleton: React.FC<GenericSkeletonProps> = ({ lines = 3, withHeader = true, className = '' }) => {
  return (
    <div className={`animate-pulse rounded-lg shadow p-4 bg-white dark:bg-[#1E1E2D] ${className}`}>
      {withHeader && (
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
      )}
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
      ))}
    </div>
  );
};

export default TableSkeleton;
