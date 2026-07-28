import React, { useState, } from 'react';
import { ShoppingCart, TrendingUp, DollarSign, Users } from 'lucide-react';
import Footer from '../components/layout/Footer';
import AdminSidebar from '../components/admin/AdminSidebar';
import StatCard from '../components/admin/overview/StatCard.jsx';
import AnalyticsCharts from '../components/admin/overview/AnalyticsCharts.jsx';
import TopCustomersList from '../components/admin/overview/TopCustomersList.jsx';


// Phase 2 Components
import OrdersManager from '../components/admin/orders/OrdersManager.jsx';
import CustomersManager from '../components/admin/customers/CustomersManager';
import SettingsManager from '../components/admin/settings/SettingsManager';
import AdminManager from '../components/admin/AdminManager';
import { useUserAuth } from '../hook/auth/useUserAuth.js';
import { ProductManager } from "../components/admin/products/ProductManager.jsx"


const AdminDashboard = () => {
  const { user: admin } = useUserAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [productView, setProductView] = useState('catalog');

  return (
    <div className="flex-1 flex flex-col min-h-0 lg:h-full">
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
                  <TopCustomersList setActiveTab={setActiveTab}/>
                </div>
              </div>
            )}

            {/* MANAGE PRODUCTS TAB */}
            {activeTab === 'products' && <ProductManager />}
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