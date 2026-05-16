import { X } from 'lucide-react';

/**
 * DeleteModal component - Confirmation dialog for product deletion
 * @component
 * @param {Object} props
 * @param {Object} props.product - Product to be deleted
 * @param {Function} props.onClose - Callback to close modal
 * @param {Function} props.onConfirm - Callback to confirm deletion
 * @param {boolean} props.loading - Loading state during deletion
 * @returns {React.ReactElement} Delete confirmation modal UI
 */
export default function DeleteModal({ product, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Delete Product</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          Are you sure you really want to delete this Product{' '}
          <span className="font-semibold">"{product?.productName}"</span> ?
        </p>
        <div className="flex justify-end">
          <button onClick={onConfirm} disabled={loading}
            className="bg-[#1e3a8a] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#172554] transition-colors disabled:opacity-60 flex items-center gap-2">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Deleting...
              </>
            ) : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}