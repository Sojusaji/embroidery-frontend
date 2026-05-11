import React, { useState } from 'react';
import { Shield, UserPlus, Trash2, Mail, User, Key, AlertCircle, Loader2 } from 'lucide-react';
import { useAdmins, useCreateAdmin, useDeleteAdmin } from '../../hook/useAdmins';

const AdminManager = () => {
  const { data: fetchedAdmins, isLoading: loading, isError: fetchError, error: fetchErrorMsg } = useAdmins();
  const createAdminMutation = useCreateAdmin();
  const deleteAdminMutation = useDeleteAdmin();

  const admins = fetchedAdmins?.data || [];
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    gmail: '',
    password: '',
    role: 'admin'
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const data = await createAdminMutation.mutateAsync(formData);
      if (data.status === 'success' || data._id) { // Checking if successful response
        setSuccess('Admin added successfully');
        setShowAddForm(false);
        setFormData({ username: '', gmail: '', password: '', role: 'admin' });
      } else {
        setError(data.message || 'Failed to add admin');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Network error. Failed to add admin.');
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;
    
    try {
      await deleteAdminMutation.mutateAsync(id);
      setSuccess('Admin deleted successfully');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Network error. Failed to delete admin.');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">Admin Management</h1>
          <p className="text-gray-400 mt-2">Manage privileged users and roles for the dashboard.</p>
        </div>
        
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-lg hover:bg-primary/30 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          <span>{showAddForm ? 'Cancel' : 'Add New Admin'}</span>
        </button>
      </div>

      {(error || fetchError) && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span>{error || fetchErrorMsg?.message || 'Error fetching admins'}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-emerald-900/20 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center gap-3">
          <Shield className="w-5 h-5" />
          <span>{success}</span>
        </div>
      )}

      {showAddForm && (
        <div className="mb-8 glass-panel p-8 bg-black/40 border-white/5 animate-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold text-white mb-6">Create New Admin Account</h2>
          <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400 ml-1">Username</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="e.g. jdoe"
                  className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400 ml-1">Gmail Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="email" 
                  name="gmail"
                  required
                  value={formData.gmail}
                  onChange={handleInputChange}
                  placeholder="e.g. user@gmail.com"
                  className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400 ml-1">Password</label>
              <div className="relative">
                <Key className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="password" 
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400 ml-1">Role</label>
              <select 
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
              >
                <option value="admin">Admin</option>
                <option value="superAdmin">Super Admin</option>
              </select>
            </div>
            <div className="md:col-span-2 mt-4">
              <button 
                type="submit"
                className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-primary/90 transition-all duration-300"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
          <p>Loading administrators...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {admins.map(adminUser => (
            <div key={adminUser._id} className="glass-panel p-6 bg-black/30 border-white/5 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-2 h-full ${adminUser.role === 'superAdmin' ? 'bg-primary' : 'bg-blue-500'}`} />
              
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${adminUser.role === 'superAdmin' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'}`}>
                  {adminUser.username.charAt(0).toUpperCase()}
                </div>
                <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-full ${adminUser.role === 'superAdmin' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'}`}>
                  {adminUser.role}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{adminUser.username}</h3>
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" />
                {adminUser.gmail}
              </p>
              
              <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                  Created {new Date(adminUser.createdAt).toLocaleDateString()}
                </div>
                
                {adminUser.role !== 'superAdmin' && (
                  <button 
                    onClick={() => handleDeleteAdmin(adminUser._id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    title="Delete Admin"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && admins.length === 0 && (
        <div className="text-center py-12 text-gray-500 glass-panel bg-black/20 border-white/5">
          No administrators found.
        </div>
      )}
    </div>
  );
};

export default AdminManager;
