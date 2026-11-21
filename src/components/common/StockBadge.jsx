import React from 'react';
import { getStockStatus } from '../../utils/formatters';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function StockBadge({ quantity, showIcon = true, size = 'sm' }) {
  const { status, label, badgeClass } = getStockStatus(quantity);

  const getIcon = () => {
    if (!showIcon) return null;
    const iconSize = size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5';
    if (status === 'available') {
      return <CheckCircle2 className={`${iconSize} text-emerald-600 mr-1.5 shrink-0`} />;
    }
    if (status === 'low') {
      return <AlertTriangle className={`${iconSize} text-amber-600 mr-1.5 shrink-0`} />;
    }
    return <XCircle className={`${iconSize} text-rose-600 mr-1.5 shrink-0`} />;
  };

  const sizeClasses =
    size === 'lg'
      ? 'px-3 py-1.5 text-xs font-semibold'
      : size === 'xs'
      ? 'px-2 py-0.5 text-[11px] font-medium'
      : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm ${badgeClass} ${sizeClasses}`}
    >
      {getIcon()}
      {label}
    </span>
  );
}
