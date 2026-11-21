import React from 'react';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'Try adjusting your search criteria or filters.',
  actionLabel,
  onAction
}) {
  return (
    <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white/50">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 mb-4">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}
