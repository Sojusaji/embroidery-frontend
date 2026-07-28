import React, { useState } from 'react';
import { Save, Bell, Shield, Store, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';

const SettingsManager = () => {
  // 1. Controlled Form State
  const [formData, setFormData] = useState({
    storeName: 'Lush Embroidery',
    supportEmail: 'support@lushembroidery.com',
    storeDescription: 'Premium hand-stitched embroidery and custom clothing.',
    currency: 'INR',
    timezone: 'UTC+5:30 (India Standard Time)',
    emailAlerts: true,
    dailySummary: true,
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' }); // 'success' | 'error'

  // 2. Generic Input Handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 3. Validation & Submit Handler
  const handleSave = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    // Basic Validation
    if (!formData.storeName.trim()) {
      setStatus({ type: 'error', message: 'Store Name is required.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.supportEmail)) {
      setStatus({ type: 'error', message: 'Please enter a valid support email address.' });
      return;
    }

    setLoading(true);

    try {
      // Simulate API Call (Replace with real Axios/Fetch endpoint)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStatus({ type: 'success', message: 'Settings updated successfully!' });
      setTimeout(() => setStatus({ type: null, message: '' }), 4000);
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to save settings. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl pb-12">
      <form onSubmit={handleSave}>
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">Store Settings</h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Manage your store preferences and administrative controls.</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-all shrink-0 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Feedback Banners */}
        {status.message && (
          <div
            className={`mb-6 p-4 rounded-xl border text-sm flex items-center gap-3 ${
              status.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{status.message}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Store Profile Section */}
          <div className="glass-panel p-6 bg-black/30 border border-white/5 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Store className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-white">Store Profile</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="storeName" className="text-xs font-medium text-gray-400 block mb-2">
                  Store Name *
                </label>
                <input
                  id="storeName"
                  name="storeName"
                  type="text"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Enter store name"
                />
              </div>

              <div>
                <label htmlFor="supportEmail" className="text-xs font-medium text-gray-400 block mb-2">
                  Support Email *
                </label>
                <input
                  id="supportEmail"
                  name="supportEmail"
                  type="email"
                  value={formData.supportEmail}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="support@domain.com"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="storeDescription" className="text-xs font-medium text-gray-400 block mb-2">
                  Store Description
                </label>
                <textarea
                  id="storeDescription"
                  name="storeDescription"
                  value={formData.storeDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  placeholder="Brief description of your business..."
                />
              </div>
            </div>
          </div>

          {/* Regional Settings */}
          <div className="glass-panel p-6 bg-black/30 border border-white/5 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-white">Regional Settings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="currency" className="text-xs font-medium text-gray-400 block mb-2">
                  Default Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                >
                  <option value="INR" className="bg-neutral-900">INR (₹)</option>
                  <option value="USD" className="bg-neutral-900">USD ($)</option>
                  <option value="EUR" className="bg-neutral-900">EUR (€)</option>
                  <option value="GBP" className="bg-neutral-900">GBP (£)</option>
                </select>
              </div>

              <div>
                <label htmlFor="timezone" className="text-xs font-medium text-gray-400 block mb-2">
                  Timezone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                >
                  <option value="UTC+5:30 (India Standard Time)" className="bg-neutral-900">UTC+5:30 (India Standard Time)</option>
                  <option value="UTC-5 (Eastern Time)" className="bg-neutral-900">UTC-5 (Eastern Time)</option>
                  <option value="UTC+0 (London)" className="bg-neutral-900">UTC+0 (London)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="glass-panel p-6 bg-black/30 border border-white/5 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-white">Notifications</h2>
            </div>
            <div className="space-y-4">
              <label htmlFor="emailAlerts" className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors">
                  Email alerts for new orders
                </span>
                <div className="relative">
                  <input
                    id="emailAlerts"
                    name="emailAlerts"
                    type="checkbox"
                    checked={formData.emailAlerts}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </label>

              <label htmlFor="dailySummary" className="flex items-center justify-between cursor-pointer group pt-2 border-t border-white/5">
                <span className="text-xs sm:text-sm text-gray-300 group-hover:text-white transition-colors">
                  Daily sales summary email
                </span>
                <div className="relative">
                  <input
                    id="dailySummary"
                    name="dailySummary"
                    type="checkbox"
                    checked={formData.dailySummary}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SettingsManager;
