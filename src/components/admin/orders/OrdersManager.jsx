import React, { useState } from 'react';
import { Search, X, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

import OrderStats from './OrderStatus';
import OrderTableRow from './OrderTableRow';
import OrderDetailsModal from './OrderDetailsModal';

const mockOrdersDb = [
  {
    id: '#ORD-001',
    customer: 'Alina Starkov',
    email: 'alina@ravka.com',
    phone: '+91 98765 43210',
    address: 'Sun Palace, Os Alta, Ravka - 682001',
    date: '2026-04-20',
    total: 1250,
    status: 'Processing',
    paymentStatus: 'Paid',
    items: [{ name: 'Floral Embroidery A', qty: 5, price: 250 }],
  },
  {
    id: '#ORD-002',
    customer: 'Kaz Brekker',
    email: 'kaz@crowclub.com',
    phone: '+91 98765 11223',
    address: 'The Crow Club, Ketterdam - 682002',
    date: '2026-04-19',
    total: 3200,
    status: 'Shipped',
    paymentStatus: 'Paid',
    items: [{ name: 'Stitched Kurti B', qty: 10, price: 320 }],
  },
  {
    id: '#ORD-003',
    customer: 'Inej Ghafa',
    email: 'inej@wraith.com',
    phone: '+91 98765 99887',
    address: 'Slat District, Ketterdam - 682003',
    date: '2026-04-18',
    total: 450,
    status: 'Delivered',
    paymentStatus: 'Paid',
    items: [{ name: 'Rose Embroidery C', qty: 8, price: 56.25 }],
  },
  {
    id: '#ORD-004',
    customer: 'Jesper Fahey',
    email: 'jesper@sharpshooter.com',
    phone: '+91 98765 55443',
    address: 'University Quarter, Ketterdam - 682004',
    date: '2026-04-18',
    total: 120,
    status: 'Pending',
    paymentStatus: 'Unpaid',
    items: [{ name: 'Silver Drop Earrings', qty: 1, price: 120 }],
  },
  {
    id: '#ORD-005',
    customer: 'Nina Zenik',
    email: 'nina@waffles.com',
    phone: '+91 98765 77665',
    address: 'Little Palace, Os Alta - 682005',
    date: '2026-04-17',
    total: 890,
    status: 'Processing',
    paymentStatus: 'Paid',
    items: [{ name: 'Stitched Gown A', qty: 2, price: 445 }],
  },
];

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const OrdersManager = () => {
  const [orders, setOrders] = useState(mockOrdersDb);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeModalOrder, setActiveModalOrder] = useState(null);

  // Status Badge Styling Helper
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Processing':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Shipped':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  // Filter Logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      selectedStatus === 'All' || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );

    if (activeModalOrder && activeModalOrder.id === id) {
      setActiveModalOrder((prev) => ({ ...prev, status: newStatus }));
    }

    toast.success(`Order ${id} status updated to ${newStatus}`);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 pb-12">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Orders Management
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            View, track, and update customer fulfillment statuses.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search ID, customer, item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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

      {/* Quick Summary Pill Bar */}
      <OrderStats orders={orders} />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['All', ...STATUS_OPTIONS].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedStatus === status
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-black/30 text-gray-400 hover:text-white hover:bg-white/5 border border-white/5'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="glass-panel bg-surface/50 border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider border-b border-white/5">
                <th className="py-3.5 px-4 sm:px-6 font-semibold">Order ID</th>
                <th className="py-3.5 px-4 sm:px-6 font-semibold">Customer</th>
                <th className="py-3.5 px-4 sm:px-6 font-semibold">Date</th>
                <th className="py-3.5 px-4 sm:px-6 font-semibold">Total</th>
                <th className="py-3.5 px-4 sm:px-6 font-semibold">Status</th>
                <th className="py-3.5 px-4 sm:px-6 font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <OrderTableRow
                    key={order.id}
                    order={order}
                    statusOptions={STATUS_OPTIONS}
                    getStatusBadgeClass={getStatusBadgeClass}
                    onViewDetails={setActiveModalOrder}
                    onUpdateStatus={updateStatus}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    No orders found matching your search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal - FIX: Only mount when an order is selected */}
      {activeModalOrder && (
        <OrderDetailsModal
          order={activeModalOrder}
          statusOptions={STATUS_OPTIONS}
          onClose={() => setActiveModalOrder(null)}
          onUpdateStatus={updateStatus}
        />
      )}
    </div>
  );
};

export default OrdersManager;