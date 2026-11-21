import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm animate-pulse">
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-slate-200 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
          <div className="h-3 bg-slate-100 rounded w-1/3" />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 bg-slate-200 rounded w-20" />
        <div className="h-8 bg-slate-200 rounded-lg w-28" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-32" /></td>
      <td className="py-4 px-4"><div className="h-4 bg-slate-100 rounded w-24" /></td>
      <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-16" /></td>
      <td className="py-4 px-4"><div className="h-5 bg-slate-200 rounded-full w-20" /></td>
      <td className="py-4 px-4"><div className="h-4 bg-slate-100 rounded w-20" /></td>
      <td className="py-4 px-4 text-right"><div className="h-8 bg-slate-200 rounded w-16 ml-auto" /></td>
    </tr>
  );
}
