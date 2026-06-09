import React, { useState } from 'react';
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
import OrdersManager from '../components/admin/OrdersManager';
import CustomersManager from '../components/admin/CustomersManager';
import SettingsManager from '../components/admin/SettingsManager';
import AdminManager from '../components/admin/AdminManager';
import ProductInventoryTable from '../components/admin/ProductInventoryTable';
import TrashBinManager from '../components/admin/TrashBinManager'; 
import { useAuth } from "../hook/useAuth";
import { useUploadImage, useCreateProduct } from '../hook/useProducts';
const AdminDashboard = () => {
  // 2. Add state for lightbox
  const [isOpen, setIsOpen] = useState(false);


  const { data: admin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const [productView, setProductView] = useState('catalog'); // 'catalog' or 'trash'

  const uploadImageMutation = useUploadImage();
  const createProductMutation = useCreateProduct();

  // Existing Product Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Embroidery',
    totalStock: 0
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const loading = uploadImageMutation.isPending || createProductMutation.isPending;

  const handleProductChange = (e) => {
    console.log('haldeProductChange value e & e.target.value:', e, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleFileChange = (e) => {
    console.log("E", e);
    const selectedFile = e.target.files[0];

    if (selectedFile) {

      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = '';
      let sha = undefined;
      let filePath = undefined;

      // 1. Upload the image first if there is one
      if (file) {
        const uploadResult = await uploadImageMutation.mutateAsync({
          file,
          category: formData.category
        });

        console.log("backend-data:", uploadResult.data);
        ({ imageUrl, sha, filePath } = uploadResult.data);
        console.log('imageUrl:', imageUrl);
      }

      // 2. Submit the product
      await createProductMutation.mutateAsync({
        ...formData,
        image: imageUrl,
        sha: sha,
        imagefilePath: filePath,
      });

      toast.success("Product added to inventory successfully! 🎉");

     
      if (preview) {
        URL.revokeObjectURL(preview);
      }

    
      setFormData({ name: '', description: '', price: '', category: '', totalStock: 0 });
      setFile(null);
      setPreview(null);

    } catch (err) {
      logError('AdminDashboard_ProductUpload_error', err);
    }
  }

  const removeImage = () => {
    setPreview(null);
    setFile(null);
  }
  return (

    <div className="min-h-screen bg-background flex flex-col">
      {/* for live preview  */}

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        plugins={[Zoom]}
        slides={[{ src: preview }]} // Pass your preview image here
        render={{
          buttonPrev: () => null, // Hide nav buttons since it's a single image
          buttonNext: () => null,
        }}
      />
      <div className="flex-1 flex flex-col lg:flex-row container mx-auto px-4 max-w-7xl gap-6 lg:gap-8 overflow-hidden">
        {/* Sidebar Nav */}
        <div className="z-20 relative w-full lg:w-auto mt-4 lg:mt-0 lg:block -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide shrink-0">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 py-8 relative">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-wide">
                  {admin?.role === 'superAdmin' ? 'Super Admin' : 'Admin'} Dashboard
                </h1>
                <p className="text-gray-400 mt-2">Welcome back, {admin?.username}. Here is what's happening today.</p>
              </div>


              {/* High-level metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Revenue" value="$24,500" icon={DollarSign} trend="up" trendValue="12.5%" delay={0} />
                <StatCard title="Total Orders" value="450" icon={ShoppingCart} trend="up" trendValue="8.2%" delay={0.1} />
                <StatCard title="Profit Margin" value="68%" icon={TrendingUp} trend="up" trendValue="2.4%" delay={0.2} />
                <StatCard title="Total Customers" value="1,240" icon={Users} trend="down" trendValue="1.5%" delay={0.3} />
              </div>

              {/* Detailed Charts */}

              <AnalyticsCharts />



              {/* Top Customers Section */}
              <div className="mt-8">
                <TopCustomersList />
              </div>
            </div>
          )}

          {/* MANAGE PRODUCTS TAB */}
         {/* 3. CONDITIONAL SUB-VIEW FILTERING WITHIN PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {productView === 'catalog' ? (
                <>
                  <div className="mb-8 flex justify-between items-center">
                    <div>
                      <h1 className="text-3xl font-bold text-white tracking-wide">Manage Products</h1>
                      <p className="text-gray-400 mt-2">Add new embroidery designs or stitching services and rolled gold ornaments to your catalog.</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="glass-panel p-6 bg-surface/50 border-white/5">
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Plus className="text-primary w-5 h-5" /> Add New Design or Product
                      </h2>
                      <form onSubmit={handleProductSubmit} className="space-y-4">
                        <div>
                          <label className="text-sm text-gray-400 block mb-1">Product Name</label>
                          <input type="text" name="name" value={formData.name} onChange={handleProductChange} required className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          <div className="col-span-1 md:col-span-3">
                            <label className="text-sm text-gray-400 block mb-1">Price ($)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleProductChange} required className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300" />
                          </div>
                          <div className="col-span-1 md:col-span-5">
                            <label className="text-sm text-gray-400 block mb-1">Category</label>
                            <select name="category" value={formData.category} onChange={handleProductChange} className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-4 py-2.5 text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 cursor-pointer">
                              <option value="embroidery">Embroidery</option>
                              <option value="stitching">Stitching</option>
                              <option value="rolled-gold-ornaments">Rolled Gold Ornaments</option>
                            </select>
                          </div>
                          <div className="col-span-1 md:col-span-4">
                            <label className="text-sm text-gray-400 block mb-1">Available Stock</label>
                            <input type="number" name="totalStock" min="0" value={formData.totalStock || ''} onChange={handleProductChange} required placeholder="0" className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300" />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 block mb-1">Description</label>
                          <textarea name="description" value={formData.description} onChange={handleProductChange} className="w-full bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-4 py-2.5 text-white min-h-[100px] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 block mb-1">Upload High-Res Photo</label>
                          <label className="border-2 border-dashed border-white/10 hover:border-primary transition-colors bg-black/30 rounded-lg flex flex-col items-center justify-center py-8 cursor-pointer group">
                            <Upload className="w-8 h-8 text-gray-500 group-hover:text-primary mb-2 transition-colors" />
                            <span className="text-sm text-gray-400">Click to browse or drag file here</span>
                            <input type="file" name='image' className="hidden" accept="image/*" onChange={handleFileChange} />
                          </label>
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg mt-6 transition-all active:scale-95">{loading ? 'Publishing...' : 'Publish to Store'}</button>
                      </form>
                    </div>

                    <div className="glass-panel p-6 bg-black/20 border-white/5 border-dashed border">
                      <h2 className="text-xl font-bold mb-6 text-gray-400">Live Card Preview</h2>
                      <div className="max-w-[300px] mx-auto opacity-70 hover:opacity-100 transition-opacity">
                        <div className="overflow-hidden rounded-2xl glass-panel p-2">
                          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-subtle flex-center">
                            {preview ? (
                              <div className="relative w-full h-full" onClick={() => setIsOpen(true)}>
                                <img src={preview} alt="Live Preview" className="w-full h-full object-contain touch-none" />
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full pointer-events-none">
                                  <p className="text-[10px] text-white/70 flex items-center gap-1"><ZoomIn size={12} /> Click to Fullscreen</p>
                                </div>
                                <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(); }} className="absolute top-3 right-3 z-30 bg-white text-red-500 rounded-full p-2 shadow-xl hover:scale-110 active:scale-95 transition-all">
                                  <X size={20} strokeWidth={3} />
                                </button>
                              </div>
                            ) : ( <ImageIcon className="w-12 h-12 text-gray-600" /> )}
                          </div>
                          <div className="mt-4 p-2">
                            <h3 className="text-white font-semibold truncate">{formData.name || 'Product Name'}</h3>
                            <p className="text-primary font-medium mt-1">${formData.price || '0.00'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12">
                    {/* TRIGGER SUB-VIEW POP ACTION */}
                    <ProductInventoryTable onViewTrash={() => setProductView('trash')} />
                  </div>
                </>
              ) : (
                <TrashBinManager onBackToInventory={() => setProductView('catalog')} />
              )}
            </div>
          )}

          {/* Phase 2 Functionality Tabs */}
          {activeTab === 'orders' && <OrdersManager />}
          {activeTab === 'customers' && <CustomersManager />}
          {activeTab === 'settings' && <SettingsManager />}
          {activeTab === 'admin-management' && <AdminManager />}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;

