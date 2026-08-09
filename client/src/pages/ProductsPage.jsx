import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import AddProductModal from '../components/AddProductModal';
import DeleteModal from '../components/DeleteModal';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/products';
      if (activeTab === 'published') url += '?published=true';
      if (activeTab === 'unpublished') url += '?published=false';
      const res = await API.get(url);
      setProducts(res.data.products);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [activeTab]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await API.delete(`/products/${deleteProduct._id}`);
      toast.success('Product Deleted Successfully');
      setDeleteProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete product');
    } finally {
      setDeleteLoading(false);
    }
  };

  const isEmpty = !loading && products.length === 0;

  const EmptyState = ({ title, subtitle }) => (
    <div className="flex flex-col items-center justify-center min-h-[55vh]">
      <div className="grid grid-cols-2 gap-1.5 mb-5">
        {[0,1,2].map(i => (
          <div key={i} className="w-8 h-8 border-2 border-[#1e3a8a] rounded-lg"></div>
        ))}
        <div className="w-8 h-8 border-2 border-[#1e3a8a] rounded-lg flex items-center justify-center">
          <Plus size={16} className="text-[#1e3a8a]" strokeWidth={2.5} />
        </div>
      </div>
      <h2 className="text-lg font-semibold text-red-500 mb-2">{title}</h2>
      <p className="text-gray-400 text-sm text-center">{subtitle}</p>
      <button onClick={() => { setShowAddModal(true); setActiveTab('all'); }} className="btn-primary px-8 py-3 mt-6">
        Add Products
      </button>
    </div>
  );

  return (
    <div className="min-h-full p-4 sm:p-6">
      {(showAddModal || editProduct) && (
        <AddProductModal
          editProduct={editProduct}
          onClose={() => { setShowAddModal(false); setEditProduct(null); }}
          onSuccess={fetchProducts}
        />
      )}
      {deleteProduct && (
        <DeleteModal
          product={deleteProduct}
          onClose={() => setDeleteProduct(null)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}

     
      <div className="border-b border-gray-200 mb-6">
      <div className="flex   mb-2 overflow-x-auto">
        {[
          { key: 'all', label: 'All' },
          { key: 'published', label: 'Published' },
          { key: 'unpublished', label: 'Unpublished' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 px-3 sm:px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-[#1e3a8a] text-[#1e3a8a]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {tab.label}
          </button>
        ))} 
      </div>
        <div className="flex items-center justify-end mb-4">
      <button onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 text-[#1e3a8a] font-semibold text-sm hover:opacity-80 transition-opacity">
          <Plus size={16} />
          Add Products
        </button>
        </div>
        </div>

      {loading && (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e3a8a]"></div>
        </div>
      )}

      {!loading && isEmpty && activeTab === 'all' && (
        <EmptyState
          title="Feels a little empty over here..."
          subtitle={"You can create products without connecting store\nyou can add products to store anytime"}
        />
      )}
      {!loading && isEmpty && activeTab === 'published' && (
        <EmptyState
          title="No Published Products"
          subtitle={"Your Published Products will appear here\nCreate your first product to publish"}
        />
      )}
      {!loading && isEmpty && activeTab === 'unpublished' && (
        <EmptyState
          title="No Unpublished Products"
          subtitle={"Your Unpublished Products will appear here\nCreate your first product to publish"}
        />
      )}

      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {products.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={(p) => setEditProduct(p)}
              onDelete={(p) => setDeleteProduct(p)}
              onPublishToggle={fetchProducts}
            />
          ))}
        </div>
      )}
    </div>
  );
}