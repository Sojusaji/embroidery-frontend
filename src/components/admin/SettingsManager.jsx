import React, { useState } from 'react';
import { Save, Bell, Shield, Store, Globe } from 'lucide-react';

const SettingsManager = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">Store Settings</h1>
          <p className="text-gray-400 mt-2">Manage your store preferences and administrative controls.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-500/20 text-emerald-400 border border-green-500/30 rounded-lg flex items-center gap-2">
          Settings updated successfully!
        </div>
      )}

      <div className="space-y-6">
        {/* Store Details */}
        <div className="glass-panel p-6 bg-black/30 border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <Store className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-white">Store Profile</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Store Name</label>
              <input type="text" defaultValue="Lush Embroidery" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Support Email</label>
              <input type="email" defaultValue="support@lushembroidery.com" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-400 block mb-2">Store Description</label>
              <textarea defaultValue="Premium hand-stitched embroidery and custom clothing." className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary min-h-[80px]" />
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="glass-panel p-6 bg-black/30 border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-white">Regional</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Currency</label>
              <select className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Timezone</label>
              <select className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary">
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC+0 (London)</option>
                <option>UTC+5:30 (India Standard Time)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-panel p-6 bg-black/30 border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-white">Notifications</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </div>
              <span className="text-gray-300 group-hover:text-white transition-colors">Email alerts for new orders</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </div>
              <span className="text-gray-300 group-hover:text-white transition-colors">Daily sales summary</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
