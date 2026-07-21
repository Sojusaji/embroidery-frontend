import React from 'react';
import { LayoutDashboard, Package, Users, Settings, LogOut, ShoppingCart, Shield } from 'lucide-react';
import { useUserLogout } from "../../hook/auth/userAuth.js"
import { useUserAuth } from '../../hook/auth/useUserAuth.js';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { user: admin } = useUserAuth;
  const logoutMutation = useUserLogout();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'products', label: 'Manage Products', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Add Admin Management if superAdmin
  if (admin?.role === 'superAdmin') {
    navItems.push({ id: 'admin-management', label: 'Admins', icon: Shield });
  }

  return (
    <div className="w-full lg:w-64 glass-panel bg-black/40 lg:border-r border-b lg:border-b-0 border-white/5 lg:h-[calc(100vh-80px)] lg:sticky top-20 flex lg:flex-col pt-4 lg:pt-8 pb-4 overflow-x-auto hide-scrollbar z-20">
      <div className="px-6 mb-8 hidden lg:block">
        <h2 className="text-xl font-bold text-white tracking-wider flex items-center gap-2">
          <span className="text-primary">{admin?.role === 'superAdmin' ? 'Super' : 'Admin'}</span> Panel
        </h2>
      </div>

      <nav className="flex lg:flex-col gap-2 px-4 whitespace-nowrap lg:space-y-2 min-w-max">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-2.5 lg:py-3 rounded-xl transition-all duration-300 ${isActive
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              <span className="font-medium text-sm lg:text-base">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 mt-auto hidden lg:block">
        <button
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl transition-colors border border-transparent disabled:opacity-50"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

