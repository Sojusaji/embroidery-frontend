import React, { useState, useMemo, lazy, Suspense } from 'react';
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

const CustomerDetailsModal = lazy(() => import('./CustomerDetailsModal'));

// Enhanced Mock Database with Addresses & Order History
const initialCustomersDb = [
  {
    id: 'CUST-01',
    name: 'Alina Starkov',
    email: 'alina@example.com',
    phone: '+91 98765 43210',
    place: 'Ketterdam',
    totalSpent: 4500,
    ordersCount: 12,
    joined: '2025-01-15',
    status: 'Active',
    shippingAddress: { street: '42 Sunken Harbor Street', city: 'Ketterdam', state: 'Kerch', pincode: '682001' },
    billingAddress: { street: '42 Sunken Harbor Street', city: 'Ketterdam', state: 'Kerch', pincode: '682001' },
    orderHistory: [
      { id: 'ORD-8821', date: '2026-03-10', items: 4, total: 1200, status: 'Delivered' },
      { id: 'ORD-7620', date: '2026-02-18', items: 2, total: 850, status: 'Delivered' },
      { id: 'ORD-6102', date: '2026-01-05', items: 6, total: 2450, status: 'Delivered' },
    ]
  },
  {
    id: 'CUST-02',
    name: 'Kaz Brekker',
    email: 'kaz@example.com',
    phone: '+91 98765 11223',
    place: 'Ravka',
    totalSpent: 3200,
    ordersCount: 8,
    joined: '2025-02-10',
    status: 'Active',
    shippingAddress: { street: '12 Crow Club Alley', city: 'Os Alta', state: 'Ravka', pincode: '682002' },
    billingAddress: { street: 'The Slat Main Office', city: 'Ketterdam', state: 'Kerch', pincode: '682001' },
    orderHistory: [
      { id: 'ORD-9104', date: '2026-03-12', items: 1, total: 1800, status: 'Processing' },
      { id: 'ORD-8112', date: '2026-02-01', items: 3, total: 1400, status: 'Delivered' },
    ]
  },
  {
    id: 'CUST-03',
    name: 'Inej Ghafa',
    email: 'inej@example.com',
    phone: '+91 98765 99887',
    place: 'Ketterdam',
    totalSpent: 1800,
    ordersCount: 5,
    joined: '2025-03-22',
    status: 'Active',
    shippingAddress: { street: '78 Wraith Way', city: 'Ketterdam', state: 'Kerch', pincode: '682003' },
    billingAddress: { street: '78 Wraith Way', city: 'Ketterdam', state: 'Kerch', pincode: '682003' },
    orderHistory: [
      { id: 'ORD-5401', date: '2026-02-25', items: 2, total: 900, status: 'Delivered' },
      { id: 'ORD-4310', date: '2026-01-14', items: 3, total: 900, status: 'Delivered' },
    ]
  },
  {
    id: 'CUST-04',
    name: 'Jesper Fahey',
    email: 'jesper@example.com',
    phone: '+91 98765 55443',
    place: 'Fjerda',
    totalSpent: 120,
    ordersCount: 2,
    joined: '2025-06-05',
    status: 'Blocked',
    shippingAddress: { street: '8 Gunslinger Ridge', city: 'Djerholm', state: 'Fjerda', pincode: '682004' },
    billingAddress: { street: '8 Gunslinger Ridge', city: 'Djerholm', state: 'Fjerda', pincode: '682004' },
    orderHistory: [
      { id: 'ORD-2100', date: '2025-11-20', items: 1, total: 120, status: 'Delivered' },
    ]
  },
  {
    id: 'CUST-05',
    name: 'Nina Zenik',
    email: 'nina@example.com',
    phone: '+91 98765 77665',
    place: 'Ravka',
    totalSpent: 890,
    ordersCount: 3,
    joined: '2025-08-11',
    status: 'Active',
    shippingAddress: { street: '104 Little Palace Road', city: 'Os Alta', state: 'Ravka', pincode: '682005' },
    billingAddress: { street: '104 Little Palace Road', city: 'Os Alta', state: 'Ravka', pincode: '682005' },
    orderHistory: [
      { id: 'ORD-3011', date: '2026-01-28', items: 5, total: 890, status: 'Delivered' },
    ]
  },
];

// Helper: Currency Formatter
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
};

const CustomersManager = () => {
  const [customers, setCustomers] = useState(initialCustomersDb);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('spent-desc');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Summary Metrics Calculation
  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0);
    const avgSpend = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
    return { totalCustomers, totalRevenue, avgSpend };
  }, [customers]);

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
        if (sortBy === 'newest') return new Date(b.joined) - new Date(a.joined);
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
  const handleToggleBlockStatus = (id) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'Blocked' ? 'Active' : 'Blocked' } : c))
    );
    if (selectedCustomer?.id === id) {
      setSelectedCustomer((prev) => ({ ...prev, status: prev.status === 'Blocked' ? 'Active' : 'Blocked' }));
    }
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm('Are you sure you want to delete this customer account? This action cannot be undone.')) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      setSelectedCustomer(null);
    }
  };

  const handleApplyDiscount = (customer) => {
    alert(`20% VIP Promo Code applied to ${customer.name}'s account.`);
  };

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
              key={customer.id}
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
                  <span className="text-[10px] text-gray-500">Joined {customer.joined}</span>
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
            onApplyDiscount={handleApplyDiscount}
          />
        </Suspense>
      )}
    </div>
  );
};

export default CustomersManager;