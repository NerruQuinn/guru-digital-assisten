import React from 'react';

// Base Shimmer wrapper
export const SkeletonBase: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ lines = 1, className = '' }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase key={i} className={`h-4 w-${i === lines - 1 && lines > 1 ? '2/3' : 'full'} ${className}`} />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 h-[100px] flex items-center justify-between">
      <div className="flex-1 space-y-3">
        <SkeletonBase className="h-3 w-20" />
        <SkeletonBase className="h-6 w-16" />
      </div>
      <SkeletonBase className="w-12 h-12 rounded-xl shrink-0" />
    </div>
  );
};

export const SkeletonRow: React.FC<{ columns?: number }> = ({ columns = 4 }) => {
  return (
    <tr className="border-b border-slate-100">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <SkeletonBase className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
};

export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <SkeletonBase className="h-8 w-64 rounded-lg" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/80">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <SkeletonBase className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <SkeletonRow key={i} columns={columns} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
