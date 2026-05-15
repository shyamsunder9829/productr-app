import { useState } from 'react';
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const getImageSrc = (imagePath) => {
  if (!imagePath) return '';
  if (/^https?:\/\//i.test(imagePath) || /^\/\//.test(imagePath)) {
    return imagePath;
  }
  const base = (API.defaults.baseURL || 'http://localhost:5000').replace(/\/api\/?$/i, '').replace(/\/+$/g, '');
  if (imagePath.startsWith('/')) {
    return `${base}${imagePath}`;
  }
  return `${base}/${imagePath}`;
};

export default function ProductCard({ product, onEdit, onDelete, onPublishToggle }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [publishLoading, setPublishLoading] = useState(false);
  const [failedImageIndexes, setFailedImageIndexes] = useState([]);
  const images = product.images || [];

  const handleImageError = (index) => {
    setFailedImageIndexes(prev => {
      const next = [...new Set([...prev, index])];
      if (images.length > 1) {
        const nextIndex = (index + 1) % images.length;
        if (!next.includes(nextIndex)) {
          setCurrentImage(nextIndex);
        }
      }
      return next;
    });
  };

  const handleImageNavigation = (newIndex) => {
    setCurrentImage(newIndex);
    setFailedImageIndexes([]);
  };

  const handlePublishToggle = async () => {
    setPublishLoading(true);
    try {
      await API.patch(`/products/${product._id}/publish`);
      onPublishToggle();
    } catch (err) {
      toast.error('Failed to update publish status');
    } finally {
      setPublishLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
      {/* Image area */}
      <div className="relative bg-gray-50 h-48 flex items-center justify-center">
        {images.length > 0 && !failedImageIndexes.includes(currentImage) ? (
          <img
            src={getImageSrc(images[currentImage])}
            alt={product.productName}
            className="h-full w-full object-contain p-4"
            onError={() => handleImageError(currentImage)} />
        ) : (
          <div className="flex flex-col items-center text-gray-300">
            <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs mt-1">No image</p>
          </div>
        )}
        {images.length > 1 && (
          <>
            <button onClick={() => handleImageNavigation((currentImage - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white">
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => handleImageNavigation((currentImage + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white">
              <ChevronRight size={14} />
            </button>
          </>
        )}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button key={i} onClick={() => handleImageNavigation(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentImage ? 'bg-red-500' : 'bg-gray-300'}`} />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-4 pt-3 pb-2 flex-1">
        <h3 className="font-semibold text-gray-900 text-sm mb-2">{product.productName}</h3>
        <div className="space-y-0.5">
          {[
            ['Product type -', product.productType],
            ['Quantity Stock -', product.quantityStock],
            ['MRP-', `₹ ${product.mrp}`],
            ['Selling Price -', `₹ ${product.sellingPrice}`],
            ['Brand Name -', product.brandName, true],
            ['Total Number of images -', product.images?.length || 0],
            ['Exchange Eligibility -', product.exchangeEligibility],
          ].map(([label, value, bold]) => (
            <div key={label} className="flex items-center justify-between text-xs">
              <span className="text-gray-400">{label}</span>
              <span className={bold ? 'font-semibold text-gray-800' : 'text-gray-700'}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 flex items-center gap-2">
        <button onClick={handlePublishToggle} disabled={publishLoading}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 ${
            product.isPublished ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-[#1e3a8a] text-white hover:bg-[#172554]'
          }`}>
          {publishLoading ? '...' : product.isPublished ? 'Unpublish' : 'Publish'}
        </button>
        <button onClick={() => onEdit(product)}
          className="flex-1 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
          Edit
        </button>
        <button onClick={() => onDelete(product)}
          className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}