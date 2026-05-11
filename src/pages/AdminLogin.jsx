import React, { useState } from 'react';
import { useAdminLogin } from "../hook/useAdminLogin"
import { Lock, Mail, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');



  const { mutate: loginAdmin, isLoading } = useAdminLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    loginAdmin({ email: gmail, password });

  };


  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary/20 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto p-8 glass-panel animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/20 text-primary mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider font-heading">
            Admin Access
          </h1>
          <p className="text-gray-400 mt-2">Secure access to the management dashboard</p>
        </div>


        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Gmail Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                placeholder="Enter your @gmail.com"
              />
            </div>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg mt-4 transition-all active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-70 disabled:active:scale-100"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
            {!isLoading && (
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
