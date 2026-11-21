import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Trash2, AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, medicine, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  if (!medicine) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm(medicine.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Medicine" maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-rose-900">Are you sure you want to delete this medicine?</p>
            <p className="mt-0.5 text-rose-700">
              <strong>{medicine.name}</strong> will be permanently removed from your pharmacy's live inventory and will no longer show in customer search results.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{deleting ? 'Deleting...' : 'Delete Medicine'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
