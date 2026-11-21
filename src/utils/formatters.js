/**
 * Calculates stock status and badge presentation
 * @param {number} quantity
 * @returns {{ label: string, status: 'available'|'low'|'out', color: string, bg: string, border: string }}
 */
export function getStockStatus(quantity) {
  const qty = Number(quantity) || 0;
  if (qty > 10) {
    return {
      status: 'available',
      label: 'In Stock',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotClass: 'bg-emerald-500',
      textClass: 'text-emerald-700'
    };
  }
  if (qty >= 1 && qty <= 10) {
    return {
      status: 'low',
      label: `Low Stock (${qty} left)`,
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      dotClass: 'bg-amber-500',
      textClass: 'text-amber-700'
    };
  }
  return {
    status: 'out',
    label: 'Out of Stock',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClass: 'bg-rose-500',
    textClass: 'text-rose-700'
  };
}

/**
 * Format currency
 * @param {number} amount
 * @param {string} currencySymbol
 * @returns {string}
 */
export function formatCurrency(amount, currencySymbol = '$') {
  if (amount === null || amount === undefined || isNaN(amount)) return `${currencySymbol}0.00`;
  return `${currencySymbol}${Number(amount).toFixed(2)}`;
}

/**
 * Format relative time (e.g., "Updated 10 mins ago")
 * @param {Date|string|number} timestamp
 * @returns {string}
 */
export function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Recently';

  let date;
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else {
    date = new Date(timestamp);
  }

  if (isNaN(date.getTime())) return 'Recently';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins} min${mins > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  if (days < 30) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Standard Medicine Categories
 */
export const MEDICINE_CATEGORIES = [
  'All',
  'Pain Relief & Analgesics',
  'Antibiotics & Antimicrobial',
  'Respiratory & Cold/Flu',
  'Cardiovascular & Blood Pressure',
  'Diabetes & Endocrine',
  'Gastrointestinal & Digestive',
  'Vitamins & Supplements',
  'Allergy & Antihistamines',
  'Dermatology & Skin Care',
  'First Aid & Emergency',
  'Eye & Ear Care'
];
