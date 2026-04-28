import React, { useState } from 'react';
import { Upload, Plus, Image as ImageIcon, ShoppingCart, TrendingUp, DollarSign, Users } from 'lucide-react';
import Footer from '../components/layout/Footer';
import AdminSidebar from '../components/admin/AdminSidebar';
import StatCard from '../components/admin/StatCard';
import AnalyticsCharts from '../components/admin/AnalyticsCharts';
import TopCustomersList from '../components/admin/TopCustomersList';

// Phase 2 Components
import OrdersManager from '../components/admin/OrdersManager';
import CustomersManager from '../components/admin/CustomersManager';
import SettingsManager from '../components/admin/SettingsManager';
import AdminManager from '../components/admin/AdminManager';
// import { useAdminAuth } from '../context/AdminAuthContext';
import{useAuth} from "../hook/useAuth"

const AdminDashboard = () => {
  const { data:admin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Existing Product Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Embroidery'
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleProductChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      let imageUrl = '';
      
      // 1. Upload the image first if there is one
      if (file) {
        const uploadData = new FormData();
        uploadData.append('image', file);
        
        const uploadRes = await fetch('/api/products/upload', {
          method: 'POST',
          body: uploadData
        });
        
        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadResult.message || 'Image upload failed');
        imageUrl = uploadResult.imageUrl;
      }
      
      // 2. Submit the product
      const productRes = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl
        })
      });
      
      if (!productRes.ok) {
        throw new Error('Failed to create product');
      }

      setMessage('Product added to database successfully!');
      setFormData({ name: '', description: '', price: '', category: 'Embroidery' });
      setFile(null);
      setPreview(null);
      
    } catch (err) {
      setMessage(err.message || 'Error uploading product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-[72px]">
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
          {activeTab === 'products' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8 flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-wide">Manage Products</h1>
                  <p className="text-gray-400 mt-2">Add new embroidery designs or stitching services to your catalog.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Form */}
                <div className="glass-panel p-6 bg-surface/50 border-white/5">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Plus className="text-primary w-5 h-5" /> Add New Design
                  </h2>
                  
                  {message && <div className="p-3 bg-green-900/50 text-green-400 rounded-lg mb-6">{message}</div>}

                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Product Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleProductChange}
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 block mb-1">Price ($)</label>
                        <input 
                          type="number" 
                          name="price" 
                          value={formData.price} 
                          onChange={handleProductChange}
                          required
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 block mb-1">Category</label>
                        <select 
                          name="category" 
                          value={formData.category} 
                          onChange={handleProductChange}
                          className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none"
                        >
                          <option>Embroidery</option>
                          <option>Stitching</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Description</label>
                      <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleProductChange}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white min-h-[100px] outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Upload High-Res Photo</label>
                      <label className="border-2 border-dashed border-white/10 hover:border-primary transition-colors bg-black/30 rounded-lg flex flex-col items-center justify-center py-8 cursor-pointer group">
                        <Upload className="w-8 h-8 text-gray-500 group-hover:text-primary mb-2 transition-colors" />
                        <span className="text-sm text-gray-400">Click to browse or drag file here</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg mt-6 transition-all active:scale-95"
                    >
                      {loading ? 'Publishing...' : 'Publish to Store'}
                    </button>
                  </form>
                </div>
                
                {/* Live Preview */}
                <div className="glass-panel p-6 bg-black/20 border-white/5 border-dashed border">
                  <h2 className="text-xl font-bold mb-6 text-gray-400">Live Card Preview</h2>
                  <div className="max-w-[300px] mx-auto opacity-70 hover:opacity-100 transition-opacity">
                    <div className="overflow-hidden rounded-2xl glass-panel p-2">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-subtle flex-center">
                        {preview ? (
                          <img src={preview} alt="preview" className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="w-12 h-12 text-gray-600" />
                        )}
                      </div>
                      <div className="mt-4 p-2">
                        <h3 className="text-white font-semibold truncate">{formData.name || 'Product Name'}</h3>
                        <p className="text-primary font-medium mt-1">${formData.price || '0.00'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

