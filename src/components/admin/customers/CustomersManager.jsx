import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useFetchCutomerData } from "../../../hook/admin/useCustomerManagement"
import {
  Search,
  X,
  Mail,
  MapPin,
  ShoppingBag,
  DollarSign,
  Users,
  Award,
  ArrowUpDown,
  ChevronRight,
} from 'lucide-react';
import { LoadingSpinner } from "../../../utils/LoadingSpinner";
import { formatDate } from "../../../utils/formateDate.js";
import { useBlockCustomer, useDeleteCustomer } from "../../../hook/admin/useCustomerManagement.js";

const CustomerDetailsModal = lazy(() => import('./CustomerDetailsModal'));


const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
};

const CustomersManager = () => {

  const { data, isFetching: customerDataLoading, isError: cutomerDataError } = useFetchCutomerData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('spent-desc');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  console.log('seleted Customer data:', selectedCustomer);

  const { mutateAsync: blockCustomer, isPending: blocking, isError: blockingError } = useBlockCustomer();
  const { mutateAsync: deleteCustomer, isPending: deleting, isError: deletingError } = useDeleteCustomer();

  const customers = useMemo(() => {
    return Array.isArray(data) ? data : data?.users || [];
  }, [data]);
  console.log("customers data:", customers);

  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0);
    const avgSpend = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
    return { totalCustomers, totalRevenue, avgSpend };
  }, [customers]);

  console.log('stats values:', stats);
  // Filter & Search Logic
  const filteredCustomers = useMemo(() => {
    return customers
      .filter((c) => {
        const query = searchTerm.toLowerCase();
        return (
          c.name?.toLowerCase().includes(query) ||
          c.email?.toLowerCase().includes(query) ||
          c.place?.toLowerCase().includes(query) ||
          c.id?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'spent-desc') return (b.totalSpent || 0) - (a.totalSpent || 0);
        if (sortBy === 'spent-asc') return (a.totalSpent || 0) - (b.totalSpent || 0);
        if (sortBy === 'orders-desc') return (b.ordersCount || 0) - (a.ordersCount || 0);
        if (sortBy === 'newest') {
          const dateA = a.joined ? new Date(a.joined) : 0;
          const dateB = b.joined ? new Date(b.joined) : 0;
          return dateB - dateA;
        }
        return 0;
      });
  }, [customers, searchTerm, sortBy]);

  // VIP / Tier Badge Helper
  const getCustomerBadge = (spent, status) => {
    if (status === 'Blocked') return { label: 'Blocked', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
    if (spent >= 3000) return { label: 'VIP Spender', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    if (spent >= 1000) return { label: 'Regular', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    return { label: 'New Member', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
  };

  // Admin Actions
  const handleToggleBlockStatus = async (id) => {
    await blockCustomer(id);

  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer account? This action cannot be undone.')) {
      await deleteCustomer(id);
      setSelectedCustomer(null);
    }
  };

  const handleApplyDiscount = (customer) => {
    alert(`20% VIP Promo Code applied to ${customer.name}'s account.`);
  };

  if (customerDataLoading) {
    return <LoadingSpinner value={customerDataLoading} message="Loading customers data" />
  }

  if (cutomerDataError) {
    return <p className="text-red-400 text-center py-10">Failed to load customer data.</p>;
  }


  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">Customer Directory</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Manage customer profiles, order histories, and account status.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, email, place, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-9 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            aria-label="Search customers"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-black/30 border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Total Customers</p>
            <p className="text-xl font-bold text-white mt-1">{stats.totalCustomers}</p>
          </div>
          <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-black/30 border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Lifetime Revenue</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">{formatCurrency(stats.totalRevenue)}</p>
          </div>
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="bg-black/30 border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Avg Revenue / Customer</p>
            <p className="text-xl font-bold text-blue-400 mt-1">{formatCurrency(stats.avgSpend)}</p>
          </div>
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
            <Award size={20} />
          </div>
        </div>
      </div>

      {/* Controls & Sorting */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-gray-400">
          Showing <span className="text-white font-semibold">{filteredCustomers.length}</span> customers
        </p>
        <div className="flex items-center gap-2">
          <ArrowUpDown size={14} className="text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-black/40 border border-white/10 text-xs text-white rounded-lg px-3 py-1.5 outline-none focus:border-primary cursor-pointer"
          >
            <option value="spent-desc">Highest Lifetime Spend</option>
            <option value="spent-asc">Lowest Lifetime Spend</option>
            <option value="orders-desc">Most Orders</option>
            <option value="newest">Recently Joined</option>
          </select>
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => {
          const badge = getCustomerBadge(customer.totalSpent, customer.status);
          return (
            <div
              key={customer._id}
              onClick={() => setSelectedCustomer(customer)}
              className="glass-panel p-5 bg-black/30 border border-white/5 hover:border-primary/40 transition-all rounded-2xl group flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-primary/20 text-primary border border-primary/20 flex items-center justify-center text-lg font-bold shrink-0">
                      {customer.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{customer.id}</span>
                      <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                        {customer.name}
                      </h3>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Contact Brief */}
                <div className="space-y-2 text-xs text-gray-400 bg-black/20 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 truncate">
                    <Mail size={14} className="text-gray-500 shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-500 shrink-0" />
                    <span>{customer.place}</span>
                  </div>
                </div>
              </div>

              {/* Order Stats & Footer */}
              <div className="mt-5 pt-4 border-t border-white/10 space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-[11px] text-gray-500">Total Orders</p>
                    <p className="text-white font-semibold flex items-center gap-1 mt-0.5">
                      <ShoppingBag size={12} className="text-primary" /> {customer.ordersCount || 0} orders
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-gray-500">Lifetime Value</p>
                    <p className="text-emerald-400 font-bold mt-0.5">{formatCurrency(customer.totalSpent)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-gray-500">Joined {formatDate(customer.joined)}</span>
                  <button className="inline-flex items-center gap-1 text-xs text-primary group-hover:translate-x-1 transition-transform font-medium">
                    View Details <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 text-gray-500 glass-panel bg-black/20 border-white/5 rounded-2xl">
          <p className="text-sm">No customers found matching "{searchTerm}"</p>
        </div>
      )}

      {/* Customer Details CRM Modal */}
      {selectedCustomer && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />}>
          <CustomerDetailsModal
            customer={selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
            onBlock={handleToggleBlockStatus}
            onDelete={handleDeleteCustomer}
            deleting={deleting}
            blocking={blocking}
            onApplyDiscount={handleApplyDiscount}
          />
        </Suspense>
      )}
    </div>
  );
};

export default CustomersManager;