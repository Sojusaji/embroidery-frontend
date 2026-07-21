import React, { useState, useEffect } from 'react';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { Upload, Plus, Image as ImageIcon, ShoppingCart, TrendingUp, DollarSign, Users, X, ZoomIn } from 'lucide-react';
import Footer from '../components/layout/Footer';
import AdminSidebar from '../components/admin/AdminSidebar';
import StatCard from '../components/admin/StatCard';
import AnalyticsCharts from '../components/admin/AnalyticsCharts';
import TopCustomersList from '../components/admin/TopCustomersList';
import { toast } from "react-hot-toast";

// Phase 2 Components
import { logError } from "../utils/logger.js";
import OrdersManager from '../components/admin/orders/OrdersManager.jsx';
import CustomersManager from '../components/admin/CustomersManager';
import SettingsManager from '../components/admin/SettingsManager';
import AdminManager from '../components/admin/AdminManager';
import ProductInventoryTable from '../components/admin/ProductInventoryTable';
import TrashBinManager from '../components/admin/TrashBinManager';
import { useUploadImage, useCreateProduct } from '../hook/useProducts';
import { useUserAuth } from '../hook/auth/useUserAuth.js';

const INITIAL_FORM_STATE = {
  name: '',
  description: '',
  price: '',
  comparePrice: '',
  sku: '',
  totalStock: '',
  category: 'embroidery',
  status: 'active',
  tags: '',
  isFeatured: false,
};

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user: admin } = useUserAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [productView, setProductView] = useState('catalog');

  const uploadImageMutation = useUploadImage();
  const createProductMutation = useCreateProduct();

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const loading = uploadImageMutation.isPending || createProductMutation.isPending;

  // Cleanup Object URL on unmount or preview change to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Please select a valid image file (PNG, JPG, WEBP).');
      e.target.value = '';
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error('Image size must be under 5MB.');
      e.target.value = '';
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setFile(null);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const numericPrice = parseFloat(formData.price);
    const numericComparePrice = formData.comparePrice ? parseFloat(formData.comparePrice) : null;
    const numericStock = parseInt(formData.totalStock, 10);

    if (isNaN(numericPrice) || numericPrice < 0) {
      toast.error('Please enter a valid price.');
      return;
    }

    if (numericComparePrice !== null && numericComparePrice <= numericPrice) {
      toast.error('Compare-at price must be higher than the regular selling price.');
      return;
    }

    try {
      let imageUrl = '';
      let sha = undefined;
      let filePath = undefined;

      if (file) {
        const uploadResult = await uploadImageMutation.mutateAsync({
          file,
          category: formData.category || 'embroidery',
        });

        imageUrl = uploadResult?.data?.imageUrl || '';
        sha = uploadResult?.data?.sha;
        filePath = uploadResult?.data?.filePath;
      }

      const parsedTags = formData.tags
        ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [];

      const productPayload = {
        ...formData,
        price: numericPrice,
        comparePrice: numericComparePrice,
        totalStock: isNaN(numericStock) ? 0 : numericStock,
        tags: parsedTags,
        image: imageUrl,
        sha: sha,
        imagefilePath: filePath,
      };

      await createProductMutation.mutateAsync(productPayload);

      const successMsg = formData.status === 'draft'
        ? 'Product saved as a draft! 📝'
        : 'Product published to store successfully! 🎉';

      toast.success(successMsg);

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setFormData(INITIAL_FORM_STATE);
      setFile(null);
      setPreview(null);

    } catch (err) {
      logError('AdminDashboard_ProductUpload_error', err);
      const serverMessage = err?.response?.data?.message || err?.message || 'Failed to save product. Please try again.';
      toast.error(serverMessage);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 lg:h-full">
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        plugins={[Zoom]}
        slides={[{ src: preview }]}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
      />
      <div className="flex-1 flex flex-col lg:flex-row container mx-auto px-2 sm:px-4 max-w-7xl gap-4 lg:gap-8 min-h-0 lg:overflow-hidden">
        
        {/* Sidebar Nav */}
        <aside className="z-20 w-full lg:w-64 shrink-0 lg:h-full lg:overflow-y-auto overscroll-contain py-2 lg:py-4">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 lg:h-full lg:overflow-y-auto overscroll-contain py-2 lg:py-4 lg:pr-2 flex flex-col justify-between">
          <div className="flex-1">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 lg:mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
                    {admin?.role === 'superAdmin' ? 'Super Admin' : 'Admin'} Dashboard
                  </h1>
                  <p className="text-gray-400 text-sm sm:text-base mt-1 sm:mt-2">Welcome back, {admin?.username}. Here is what's happening today.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                  <StatCard title="Total Revenue" value="$24,500" icon={DollarSign} trend="up" trendValue="12.5%" delay={0} />
                  <StatCard title="Total Orders" value="450" icon={ShoppingCart} trend="up" trendValue="8.2%" delay={0.1} />
                  <StatCard title="Profit Margin" value="68%" icon={TrendingUp} trend="up" trendValue="2.4%" delay={0.2} />
                  <StatCard title="Total Customers" value="1,240" icon={Users} trend="down" trendValue="1.5%" delay={0.3} />
                </div>

                <AnalyticsCharts />

                <div className="mt-8">
                  <TopCustomersList />
                </div>
              </div>
            )}

            {/* MANAGE PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {productView === 'catalog' ? (
                  <>
                    <div className="mb-6 flex justify-between items-center">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">Manage Products</h1>
                        <p className="text-gray-400 text-sm sm:text-base mt-1">Add new embroidery designs, stitching services, or ornaments to your catalog.</p>
                      </div>
                    </div>

                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                      
                      {/* FORM SECTION */}
                      <div className="lg:col-span-7 glass-panel p-4 sm:p-6 bg-surface/50 border-white/5 w-full">
                        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2 text-white">
                          <Plus className="text-primary w-5 h-5" /> Add New Product
                        </h2>

                        <form onSubmit={handleProductSubmit} className="space-y-5">

                          {/* Section 1: Basic Information */}
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="product-name" className="text-xs sm:text-sm text-gray-400 block mb-1">
                                Product Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                id="product-name"
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleProductChange}
                                disabled={loading}
                                required
                                className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 disabled:opacity-50"
                                placeholder="e.g. Floral Embroidery Saree"
                              />
                            </div>
                            <div>
                              <label htmlFor="product-description" className="text-xs sm:text-sm text-gray-400 block mb-1">
                                Description
                              </label>
                              <textarea
                                id="product-description"
                                name="description"
                                value={formData.description || ''}
                                onChange={handleProductChange}
                                disabled={loading}
                                className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white min-h-[90px] sm:min-h-[100px] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 disabled:opacity-50"
                                placeholder="Describe the material, design, and features..."
                              />
                            </div>
                          </div>

                          <hr className="border-white/5" />

                          {/* Section 2: Pricing & Inventory */}
                          <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <label htmlFor="product-price" className="text-xs sm:text-sm text-gray-400 block mb-1">
                                Price ($) <span className="text-red-500">*</span>
                              </label>
                              <input
                                id="product-price"
                                type="number"
                                step="0.01"
                                min="0"
                                name="price"
                                value={formData.price || ''}
                                onChange={handleProductChange}
                                disabled={loading}
                                required
                                placeholder="0.00"
                                className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 disabled:opacity-50"
                              />
                            </div>

                            <div>
                              <label htmlFor="product-comparePrice" className="text-xs sm:text-sm text-gray-400 block mb-1">
                                Compare Price ($)
                              </label>
                              <input
                                id="product-comparePrice"
                                type="number"
                                step="0.01"
                                min="0"
                                name="comparePrice"
                                value={formData.comparePrice || ''}
                                onChange={handleProductChange}
                                disabled={loading}
                                placeholder="0.00"
                                className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 disabled:opacity-50"
                              />
                            </div>

                            <div>
                              <label htmlFor="product-sku" className="text-xs sm:text-sm text-gray-400 block mb-1">
                                SKU
                              </label>
                              <input
                                id="product-sku"
                                type="text"
                                name="sku"
                                value={formData.sku || ''}
                                onChange={handleProductChange}
                                disabled={loading}
                                placeholder="EMB-001"
                                className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 disabled:opacity-50"
                              />
                            </div>

                            <div>
                              <label htmlFor="product-totalStock" className="text-xs sm:text-sm text-gray-400 block mb-1">
                                Stock <span className="text-red-500">*</span>
                              </label>
                              <input
                                id="product-totalStock"
                                type="number"
                                name="totalStock"
                                min="0"
                                value={formData.totalStock ?? ''}
                                onChange={handleProductChange}
                                disabled={loading}
                                required
                                placeholder="0"
                                className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 disabled:opacity-50"
                              />
                            </div>
                          </div>

                          <hr className="border-white/5" />

                          {/* Section 3: Categories & Metadata */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="product-category" className="text-xs sm:text-sm text-gray-400 block mb-1">
                                Category <span className="text-red-500">*</span>
                              </label>
                              <select
                                id="product-category"
                                name="category"
                                value={formData.category || 'embroidery'}
                                onChange={handleProductChange}
                                disabled={loading}
                                className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 cursor-pointer disabled:opacity-50"
                              >
                                <option value="embroidery">Embroidery</option>
                                <option value="stitching">Stitching</option>
                                <option value="rolled-gold-ornaments">Rolled Gold Ornaments</option>
                              </select>
                            </div>

                            <div>
                              <label htmlFor="product-status" className="text-xs sm:text-sm text-gray-400 block mb-1">
                                Status
                              </label>
                              <select
                                id="product-status"
                                name="status"
                                value={formData.status || 'active'}
                                onChange={handleProductChange}
                                disabled={loading}
                                className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 cursor-pointer disabled:opacity-50"
                              >
                                <option value="active">Active (Visible)</option>
                                <option value="draft">Draft (Hidden)</option>
                              </select>
                            </div>

                            <div className="sm:col-span-2">
                              <label htmlFor="product-tags" className="text-xs sm:text-sm text-gray-400 block mb-1">
                                Tags / Material (Comma separated)
                              </label>
                              <input
                                id="product-tags"
                                type="text"
                                name="tags"
                                value={formData.tags || ''}
                                onChange={handleProductChange}
                                disabled={loading}
                                placeholder="Cotton, Hand-stitched, 18k Gold"
                                className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 disabled:opacity-50"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-3 bg-black/20 p-3 sm:p-4 rounded-xl border border-white/5">
                            <input
                              type="checkbox"
                              id="isFeatured"
                              name="isFeatured"
                              checked={Boolean(formData.isFeatured)}
                              onChange={handleProductChange}
                              disabled={loading}
                              className="w-4 h-4 sm:w-5 sm:h-5 accent-primary cursor-pointer rounded disabled:opacity-50"
                            />
                            <label htmlFor="isFeatured" className="text-xs sm:text-sm text-gray-300 cursor-pointer select-none">
                              Feature this product on the homepage
                            </label>
                          </div>

                          {/* Section 4: Image Upload */}
                          <div>
                            <label className="text-xs sm:text-sm text-gray-400 block mb-1">Upload Photo</label>
                            <label
                              htmlFor="product-image"
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (e.dataTransfer.files?.length) {
                                  handleFileChange({ target: { files: e.dataTransfer.files } });
                                }
                              }}
                              className="border-2 border-dashed border-white/10 hover:border-primary transition-colors bg-black/30 rounded-xl flex flex-col items-center justify-center py-6 sm:py-8 cursor-pointer group px-4 text-center"
                            >
                              <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 group-hover:text-primary mb-2 transition-colors" />
                              <span className="text-xs sm:text-sm text-gray-400">
                                Tap to upload photo <span className="hidden sm:inline">or drag & drop file here</span>
                              </span>
                              <span className="text-[10px] sm:text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</span>
                              <input
                                id="product-image"
                                type="file"
                                name="image"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={loading}
                              />
                            </label>
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl mt-6 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base"
                          >
                            {loading ? (
                              <>
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Processing...</span>
                              </>
                            ) : formData.status === 'draft' ? (
                              'Save as Draft'
                            ) : (
                              'Publish to Store'
                            )}
                          </button>
                        </form>
                      </div>

                      {/* LIVE PREVIEW SECTION */}
                      <div className="lg:col-span-5 w-full glass-panel p-4 sm:p-6 bg-black/20 border-white/5 border-dashed border lg:sticky lg:top-6">
                        <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-400">Live Card Preview</h2>
                        <div className="max-w-[280px] sm:max-w-[320px] mx-auto opacity-90 hover:opacity-100 transition-opacity">
                          <div className="overflow-hidden rounded-2xl glass-panel p-2 bg-surface/80 shadow-2xl relative">

                            {Boolean(formData.isFeatured) && (
                              <div className="absolute top-4 left-4 z-20 bg-yellow-500 text-black text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                Featured
                              </div>
                            )}

                            {formData.totalStock !== '' && Number(formData.totalStock) === 0 && (
                              <div className="absolute top-4 right-4 z-20 bg-red-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-lg">
                                Out of Stock
                              </div>
                            )}

                            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-subtle flex items-center justify-center bg-black/40">
                              {preview ? (
                                <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsOpen && setIsOpen(true)}>
                                  <img src={preview} alt="Live Preview" className="w-full h-full object-cover touch-none transition-transform duration-500 group-hover:scale-105" />
                                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-[10px] text-white/90 flex items-center gap-1"><ZoomIn size={12} /> Fullscreen</p>
                                  </div>
                                  <button
                                    type="button"
                                    aria-label="Remove image"
                                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                    className="absolute top-3 right-3 z-30 bg-black/60 hover:bg-red-500 text-white rounded-full p-2 backdrop-blur-md hover:scale-110 active:scale-95 transition-all"
                                  >
                                    <X size={16} strokeWidth={3} />
                                  </button>
                                </div>
                              ) : (
                                <ImageIcon className="w-12 h-12 text-gray-600" />
                              )}
                            </div>

                            <div className="mt-4 p-2 sm:p-3">
                              <div className="flex justify-between items-start gap-2">
                                <h3 className="text-white font-semibold line-clamp-1">{formData.name || 'Product Name'}</h3>
                                <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-1 rounded-md capitalize whitespace-nowrap">
                                  {formData.category ? formData.category.replace('-', ' ') : 'Category'}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 mt-2">
                                <p className="text-primary font-bold text-base sm:text-lg">
                                  ${formData.price ? Number(formData.price).toFixed(2) : '0.00'}
                                </p>
                                {formData.comparePrice && Number(formData.comparePrice) > Number(formData.price) && (
                                  <p className="text-gray-500 text-xs sm:text-sm line-through">
                                    ${Number(formData.comparePrice).toFixed(2)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="mt-8 sm:mt-12 overflow-x-auto">
                      <ProductInventoryTable onViewTrash={() => setProductView('trash')} />
                    </div>
                  </>
                ) : (
                  <TrashBinManager onBackToInventory={() => setProductView('catalog')} />
                )}
              </div>
            )}

            {activeTab === 'orders' && <OrdersManager />}
            {activeTab === 'customers' && <CustomersManager />}
            {activeTab === 'settings' && <SettingsManager />}
            {activeTab === 'admin-management' && <AdminManager />}

          </div>

          <Footer className="mt-8 sm:mt-12 shrink-0 pt-6 sm:pt-8 border-t border-white/5" />
        </section>

      </div>
    </div>
  );
};

export default AdminDashboard;