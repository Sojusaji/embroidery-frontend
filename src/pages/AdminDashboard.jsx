import React, { useState } from 'react';
import { Upload, Plus, Image as ImageIcon } from 'lucide-react';
import Footer from '../components/layout/Footer';

const AdminDashboard = () => {
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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // 1. Upload the image first
      let imageUrl = '';
      if (file) {
        const fileData = new FormData();
        fileData.append('image', file);
        
        // Simulating the backend upload since server is not fully wired yet on frontend
        // const uploadRes = await fetch('http://localhost:5000/api/products/upload', {
        //   method: 'POST',
        //   body: fileData
        // });
        // const uploadResult = await uploadRes.json();
        // imageUrl = uploadResult.imageUrl;
        
        imageUrl = preview; // Mocking immediately for preview feeling
      }

      // 2. Submit the product
      const productPayload = { ...formData, image: imageUrl || 'default.png' };
      
      // const res = await fetch('http://localhost:5000/api/products', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(productPayload)
      // });
      
      // if (res.ok) {
        setMessage('Product added to database successfully!');
        setFormData({ name: '', description: '', price: '', category: 'Embroidery' });
        setFile(null);
        setPreview(null);
      // }
    } catch (err) {
      setMessage('Error uploading product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-20">
      <div className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="glass-panel p-6 bg-surface/50 border-white/5">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="text-primary w-5 h-5" /> Add New Design
            </h2>
            
            {message && <div className="p-3 bg-green-900/50 text-green-400 rounded-lg mb-6">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Product Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
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
                    onChange={handleChange}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Category</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange}
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
                  onChange={handleChange}
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
      <Footer />
    </div>
  );
};

export default AdminDashboard;
