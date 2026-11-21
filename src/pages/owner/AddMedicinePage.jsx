import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { MEDICINE_CATEGORIES } from '../../utils/formatters';
import StockBadge from '../../components/common/StockBadge';
import { Plus, Check, ArrowLeft, AlertCircle } from 'lucide-react';

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1550572017-ed24058f9640?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
];

export default function AddMedicinePage() {
  const navigate = useNavigate();
  const { userPharmacy, currentUser } = useAuth();
  const { createMedicine } = useData();

  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    brand: '',
    category: 'Pain Relief & Analgesics',
    description: '',
    image: SAMPLE_IMAGES[0],
    manufacturer: '',
    price: '',
    quantity: '30',
    expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
    dosageForm: 'Capsule (30 capsules)',
    prescriptionRequired: false
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
    if (!formData.genericName.trim()) newErrors.genericName = 'Generic chemical name is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand name is required';
    if (!formData.manufacturer.trim()) newErrors.manufacturer = 'Manufacturer name is required';
    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = 'Please provide a valid price';
    }
    if (formData.quantity === '' || isNaN(formData.quantity) || Number(formData.quantity) < 0) {
      newErrors.quantity = 'Please provide a valid stock quantity';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valErrors = validate();
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setSubmitting(true);
    try {
      await createMedicine({
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
        pharmacyId: userPharmacy?.id,
        ownerId: currentUser?.uid
      });
      navigate('/owner/manage-medicines');
    } catch (err) {
      setErrors({ form: err.message || 'Failed to add medicine' });
    } finally {
      setSubmitting(false);
    }
  };

  const parsedQty = parseInt(formData.quantity, 10) || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Add New Medicine to Pharmacy
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Register new pharmaceutical inventory for {userPharmacy?.name}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/owner/manage-medicines')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {errors.form && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Stock Calculation Preview Banner */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div>
              <span className="text-xs font-bold text-slate-700 block">Automatic Stock Categorization</span>
              <span className="text-[11px] text-slate-500">
                Quantity enters database with live patient availability status:
              </span>
            </div>
            <StockBadge quantity={parsedQty} size="lg" />
          </div>

          {/* Form Fields Section 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Medicine Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Amoxicillin 500mg"
                value={formData.name}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Generic / Active Ingredient *
              </label>
              <input
                type="text"
                name="genericName"
                required
                placeholder="e.g. Amoxicillin Trihydrate"
                value={formData.genericName}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              {errors.genericName && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.genericName}</p>
              )}
            </div>
          </div>

          {/* Form Fields Section 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Brand Name *
              </label>
              <input
                type="text"
                name="brand"
                required
                placeholder="e.g. Amoxil / Augmentin"
                value={formData.brand}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              {errors.brand && <p className="text-[11px] text-rose-600 mt-1">{errors.brand}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 bg-white"
              >
                {MEDICINE_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Fields Section 3: Price, Quantity & Expiry */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Price ($ USD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                required
                placeholder="18.50"
                value={formData.price}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              {errors.price && <p className="text-[11px] text-rose-600 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Initial Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                name="quantity"
                required
                placeholder="25"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              {errors.quantity && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.quantity}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Expiry Date *
              </label>
              <input
                type="date"
                name="expiryDate"
                required
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Form Fields Section 4: Manufacturer & Dosage Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Manufacturer *
              </label>
              <input
                type="text"
                name="manufacturer"
                required
                placeholder="e.g. Pfizer, GSK, Teva"
                value={formData.manufacturer}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              {errors.manufacturer && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.manufacturer}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Dosage Form / Packaging
              </label>
              <input
                type="text"
                name="dosageForm"
                placeholder="e.g. Capsule (30 capsules), Bottle 200ml"
                value={formData.dosageForm}
                onChange={handleChange}
                className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Image URL with samples */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Medicine Image URL
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="flex-1 text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <img
                src={formData.image}
                alt="Preview"
                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-slate-400">Sample product photos:</span>
              {SAMPLE_IMAGES.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, image: img }))}
                  className="w-6 h-6 rounded-md overflow-hidden border hover:border-brand-500"
                >
                  <img src={img} alt={`Sample ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Description & Medical Instructions
            </label>
            <textarea
              name="description"
              rows="3"
              placeholder="Clinical indication, precautions, recommended intake..."
              value={formData.description}
              onChange={handleChange}
              className="w-full text-xs rounded-xl border border-slate-300 p-2.5 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Prescription Required */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="prescriptionRequired"
              name="prescriptionRequired"
              checked={formData.prescriptionRequired}
              onChange={handleChange}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
            />
            <label htmlFor="prescriptionRequired" className="text-xs font-semibold text-slate-700">
              Prescription Required (Doctor prescription must be presented by patient)
            </label>
          </div>

          {/* Submit CTA */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/owner/manage-medicines')}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-600/20 transition disabled:opacity-50"
            >
              {submitting ? 'Saving to Database...' : 'Save & Publish to Inventory'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
