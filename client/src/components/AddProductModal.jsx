import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const PRODUCT_TYPES = ['Foods', 'Electronics', 'Clothes', 'Beauty Products', 'Others'];

export default function AddProductModal({ onClose, onSuccess, editProduct = null }) {
  const [form, setForm] = useState({
    productName: editProduct?.productName || '',
    productType: editProduct?.productType || '',
    quantityStock: editProduct?.quantityStock || '',
    mrp: editProduct?.mrp || '',
    sellingPrice: editProduct?.sellingPrice || '',
    brandName: editProduct?.brandName || '',
    exchangeEligibility: editProduct?.exchangeEligibility || 'Yes',
  });
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState(editProduct?.images || []);
  const [removedImages, setRemovedImages] = useState([]);
  const [typeOpen, setTypeOpen] = useState(false);
  const [eligibilityOpen, setEligibilityOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const validate = () => {
    const newErrors = {};
    if (!form.productName.trim()) newErrors.productName = 'Please enter product name';
    if (!form.productType) newErrors.productType = 'Please select product type';
    if (!form.quantityStock) newErrors.quantityStock = 'Please enter quantity stock';
    if (!form.mrp) newErrors.mrp = 'Please enter MRP';
    if (!form.sellingPrice) newErrors.sellingPrice = 'Please enter selling price';
    if (!form.brandName.trim()) newErrors.brandName = 'Please enter brand name';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
    setImages(prev => [...prev, ...previews]);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));

      if (editProduct) {
        if (removedImages.length > 0) formData.append('removedImages', JSON.stringify(removedImages));
        images.forEach(img => formData.append('newImages', img.file));
        await API.put(`/products/${editProduct._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated successfully');
      } else {
        images.forEach(img => formData.append('images', img.file));
        await API.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product added Successfully');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const totalImages = existingImages.length + images.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Product Name */}
          <div>
            <label className="label">Product Name</label>
            <input type="text" placeholder="Enter product name"
              className={`input-field ${errors.productName ? 'input-error' : ''}`}
              value={form.productName}
              onChange={e => { setForm({...form, productName: e.target.value}); setErrors({...errors, productName: ''}); }}
            />
            {errors.productName && <p className="mt-1 text-xs text-red-500">{errors.productName}</p>}
          </div>

          {/* Product Type */}
          <div className="relative">
            <label className="label">Product Type</label>
            <button type="button" onClick={() => { setTypeOpen(!typeOpen); setEligibilityOpen(false); }}
              className={`input-field flex items-center justify-between ${errors.productType ? 'input-error' : ''}`}>
              <span className={form.productType ? 'text-gray-800' : 'text-gray-400'}>
                {form.productType || 'Select product type'}
              </span>
              <svg className={`w-4 h-4 text-gray-500 transition-transform ${typeOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {typeOpen && (
              <div className="absolute z-20 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 overflow-hidden">
                {PRODUCT_TYPES.map((type, i) => (
                  <button key={type} type="button"
                    onClick={() => { setForm({...form, productType: type}); setTypeOpen(false); setErrors({...errors, productType: ''}); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors
                      ${i === 0 ? 'bg-gray-50' : ''} ${form.productType === type ? 'text-[#1e3a8a] font-medium' : 'text-gray-700'}`}>
                    {type}
                  </button>
                ))}
              </div>
            )}
            {errors.productType && <p className="mt-1 text-xs text-red-500">{errors.productType}</p>}
          </div>

          {/* Quantity Stock */}
          <div>
            <label className="label">Quantity Stock</label>
            <input type="number" placeholder="Total numbers of Stock available"
              className={`input-field ${errors.quantityStock ? 'input-error' : ''}`}
              value={form.quantityStock}
              onChange={e => { setForm({...form, quantityStock: e.target.value}); setErrors({...errors, quantityStock: ''}); }}
            />
            {errors.quantityStock && <p className="mt-1 text-xs text-red-500">{errors.quantityStock}</p>}
          </div>

          {/* MRP */}
          <div>
            <label className="label">MRP</label>
            <input type="number" placeholder="Total numbers of Stock available"
              className={`input-field ${errors.mrp ? 'input-error' : ''}`}
              value={form.mrp}
              onChange={e => { setForm({...form, mrp: e.target.value}); setErrors({...errors, mrp: ''}); }}
            />
            {errors.mrp && <p className="mt-1 text-xs text-red-500">{errors.mrp}</p>}
          </div>

          {/* Selling Price */}
          <div>
            <label className="label">Selling Price</label>
            <input type="number" placeholder="Total numbers of Stock available"
              className={`input-field ${errors.sellingPrice ? 'input-error' : ''}`}
              value={form.sellingPrice}
              onChange={e => { setForm({...form, sellingPrice: e.target.value}); setErrors({...errors, sellingPrice: ''}); }}
            />
            {errors.sellingPrice && <p className="mt-1 text-xs text-red-500">{errors.sellingPrice}</p>}
          </div>

          {/* Brand Name */}
          <div>
            <label className="label">Brand Name</label>
            <input type="text" placeholder="Enter brand name"
              className={`input-field ${errors.brandName ? 'input-error' : ''}`}
              value={form.brandName}
              onChange={e => { setForm({...form, brandName: e.target.value}); setErrors({...errors, brandName: ''}); }}
            />
            {errors.brandName && <p className="mt-1 text-xs text-red-500">{errors.brandName}</p>}
          </div>

          {/* Upload Images */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0">Upload Product Images</label>
              {totalImages > 0 && (
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-[#1e3a8a] font-medium hover:underline">
                  Add More Photos
                </button>
              )}
            </div>
            {totalImages === 0 ? (
              <div onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-[#1e3a8a] transition-colors">
                <p className="text-gray-400 text-sm">Enter Description</p>
                <p className="text-[#1e3a8a] font-semibold text-sm mt-1">Browse</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg">
                {existingImages.map((imgPath) => (
                  <div key={imgPath} className="relative group">
                    <img src={`http://localhost:5000${imgPath}`} alt="product"
                      className="w-16 h-16 object-cover rounded-lg" />
                    <button onClick={() => {
                        setExistingImages(prev => prev.filter(img => img !== imgPath));
                        setRemovedImages(prev => [...prev, imgPath]);
                      }}
                      className="absolute -top-1.5 -right-1.5 bg-white rounded-full shadow p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={12} className="text-gray-600" />
                    </button>
                  </div>
                ))}
                {images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img.preview} alt="preview" className="w-16 h-16 object-cover rounded-lg" />
                    <button onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute -top-1.5 -right-1.5 bg-white rounded-full shadow p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={12} className="text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageSelect} />
          </div>

          {/* Exchange Eligibility */}
          <div className="relative">
            <label className="label">Exchange or return eligibility</label>
            <button type="button" onClick={() => { setEligibilityOpen(!eligibilityOpen); setTypeOpen(false); }}
              className="input-field flex items-center justify-between">
              <span className="text-gray-800">{form.exchangeEligibility}</span>
              <svg className={`w-4 h-4 text-gray-500 transition-transform ${eligibilityOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {eligibilityOpen && (
              <div className="absolute z-20 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 overflow-hidden">
                {['Yes', 'No'].map(option => (
                  <button key={option} type="button"
                    onClick={() => { setForm({...form, exchangeEligibility: option}); setEligibilityOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors
                      ${form.exchangeEligibility === option ? 'bg-gray-50 text-[#1e3a8a] font-medium' : 'text-gray-700'}`}>
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-gray-100">
          <button onClick={handleSubmit} disabled={loading} className="btn-primary px-8">
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {editProduct ? 'Updating...' : 'Creating...'}
              </span>
            ) : editProduct ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}