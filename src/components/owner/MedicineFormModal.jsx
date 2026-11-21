import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import StockBadge from '../common/StockBadge';
import { MEDICINE_CATEGORIES } from '../../utils/formatters';
import { AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';

const SAMPLE_MEDICINE_IMAGES = [
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1550572017-ed24058f9640?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
];

export default function MedicineFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  pharmacyId,
  ownerId
}) {
  const isEditing = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    brand: '',
    category: 'Pain Relief & Analgesics',
    description: '',
    image: SAMPLE_MEDICINE_IMAGES[0],
    manufacturer: '',
    price: '',
    quantity: '20',
    expiryDate: '',
    dosageForm: 'Tablet (20 tablets)',
    prescriptionRequired: false
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        genericName: initialData.genericName || '',
        brand: initialData.brand || '',
        category: initialData.category || 'Pain Relief & Analgesics',
        description: initialData.description || '',
        image: initialData.image || SAMPLE_MEDICINE_IMAGES[0],
        manufacturer: initialData.manufacturer || '',
        price: initialData.price !== undefined ? String(initialData.price) : '',
        quantity: initialData.quantity !== undefined ? String(initialData.quantity) : '0',
        expiryDate: initialData.expiryDate || '',
        dosageForm: initialData.dosageForm || 'Tablet',
        prescriptionRequired: Boolean(initialData.prescriptionRequired)
      });
    } else {
      setFormData({
        name: '',
        genericName: '',
        brand: '',
        category: 'Pain Relief & Analgesics',
        description: '',
        image: SAMPLE_MEDICINE_IMAGES[0],
        manufacturer: '',
        price: '',
        quantity: '25',
        expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
        dosageForm: 'Capsule (30 capsules)',
        prescriptionRequired: false
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Medicine name is required';
    if (!formData.genericName.trim()) newErrors.genericName = 'Generic / active ingredient name is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.manufacturer.trim()) newErrors.manufacturer = 'Manufacturer name is required';
    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = 'Please enter a valid price (greater than or equal to 0)';
    }
    if (formData.quantity === '' || isNaN(formData.quantity) || Number(formData.quantity) < 0) {
      newErrors.quantity = 'Please enter a valid quantity (0 or greater)';
    }
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
        pharmacyId: pharmacyId || initialData?.pharmacyId,
        ownerId: ownerId || initialData?.ownerId
      };
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save medicine' });
    } finally {
      setSubmitting(false);
    }
  };

  const parsedQty = parseInt(formData.quantity, 10) || 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Medicine Information' : 'Add New Medicine to Inventory'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Live Stock Status Indicator banner */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="text-xs">
            <span className="font-semibold text-slate-700">Calculated Stock Status:</span>
            <p className="text-[11px] text-slate-400">
              (Available &gt; 10 | Low 1–10 | Out = 0)
            </p>
          </div>
          <StockBadge quantity={parsedQty} size="lg" />
        </div>

        {/* Grid 1: Name & Generic Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Medicine Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Amoxicillin 500mg"
              value={formData.name}
              onChange={handleChange}
              className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                errors.name
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:border-brand-500 focus:ring-brand-500'
              }`}
            />
            {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Generic Name *
            </label>
            <input
              type="text"
              name="genericName"
              placeholder="e.g. Amoxicillin Trihydrate"
              value={formData.genericName}
              onChange={handleChange}
              className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                errors.genericName
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500'
                  : 'border-slate-300 focus:border-brand-500 focus:ring-brand-500'
              }`}
            />
            {errors.genericName && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.genericName}</p>
            )}
          </div>
        </div>

        {/* Grid 2: Brand & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Brand Name *
            </label>
            <input
              type="text"
              name="brand"
              placeholder="e.g. Amoxil, Augmentin"
              value={formData.brand}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            {errors.brand && <p className="text-[11px] text-rose-600 mt-1">{errors.brand}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
            >
              {MEDICINE_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid 3: Price, Quantity & Expiry */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Price ($ USD) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="price"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
              className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                errors.price
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500'
                  : 'border-slate-300 focus:border-brand-500 focus:ring-brand-500'
              }`}
            />
            {errors.price && <p className="text-[11px] text-rose-600 mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Stock Quantity *
            </label>
            <input
              type="number"
              min="0"
              name="quantity"
              placeholder="0"
              value={formData.quantity}
              onChange={handleChange}
              className={`w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                errors.quantity
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500'
                  : 'border-slate-300 focus:border-brand-500 focus:ring-brand-500'
              }`}
            />
            {errors.quantity && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.quantity}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Expiry Date *
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            {errors.expiryDate && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.expiryDate}</p>
            )}
          </div>
        </div>

        {/* Grid 4: Manufacturer & Dosage Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Manufacturer *
            </label>
            <input
              type="text"
              name="manufacturer"
              placeholder="e.g. Pfizer, GSK, Teva"
              value={formData.manufacturer}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            {errors.manufacturer && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.manufacturer}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Dosage Form & Pack Size
            </label>
            <input
              type="text"
              name="dosageForm"
              placeholder="e.g. Capsule (30 capsules), Syrup 100ml"
              value={formData.dosageForm}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Image URL with preset selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Medicine Image URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              name="image"
              placeholder="https://..."
              value={formData.image}
              onChange={handleChange}
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <img
              src={formData.image || SAMPLE_MEDICINE_IMAGES[0]}
              alt="Preview"
              className="w-9 h-9 rounded-lg object-cover border border-slate-200"
              onError={(e) => {
                e.target.src = SAMPLE_MEDICINE_IMAGES[0];
              }}
            />
          </div>
          {/* Quick presets */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] text-slate-400 font-medium">Sample photos:</span>
            {SAMPLE_MEDICINE_IMAGES.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, image: imgUrl }))}
                className="w-6 h-6 rounded-md overflow-hidden border hover:border-brand-500 transition"
              >
                <img src={imgUrl} alt={`Sample ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Description & Usage Directions
          </label>
          <textarea
            name="description"
            rows="2"
            placeholder="Indications, dosage warnings, storage instructions..."
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        {/* Prescription Required Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="prescriptionRequired"
            name="prescriptionRequired"
            checked={formData.prescriptionRequired}
            onChange={handleChange}
            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
          />
          <label htmlFor="prescriptionRequired" className="text-xs font-medium text-slate-700">
            Prescription Required (Rx badge will be displayed to patients)
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition disabled:opacity-50"
          >
            {submitting ? 'Saving...' : isEditing ? 'Update Medicine' : 'Add to Inventory'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
