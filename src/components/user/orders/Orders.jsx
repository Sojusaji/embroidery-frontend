import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, AlertCircle, Search, ShoppingBag, Layers, Image as ImageIcon } from 'lucide-react';
import { useFetchOrders } from '../../../hook/useOrders'

const Badge = ({ color = 'amber', children }) => {
  const styles = {
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    green: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    blue: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md ${styles[color]}`}>
      {children}
    </span>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-neutral-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export default function UserOrdersPage() {
  const { data: order, isLoading: orderLoading } = useFetchOrders();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  console.log('ordered data:', order);

  if (orderLoading) {
    return <p className='text-xs p-12 text-center text-neutral-500'>Loading your data....</p>
  }


  const filteredOrders = order.orders.filter(order => {
    const matchesFilter = filter === 'all' ||
      (filter === 'active' && order.orderStatus !== 'Delivered') ||
      (filter === 'completed' && order.orderStatus === 'Delivered');

    const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });
  console.log('filteredOrders is array :', typeof filteredOrders);
  console.log('filteredOrderes:', filteredOrders);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Orders & Purchases</h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">Track your cart checkouts and custom tailoring orders.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search order ID or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 bg-neutral-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          <div className="flex gap-1 p-1 bg-neutral-900 border border-white/10 rounded-xl">
            {['all', 'active', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-amber-500 text-black shadow-md font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Feed */}
      <div className="space-y-4">
        {filteredOrders.map(order => {
          const isActive = order.orderStatus !== 'Delivered';
          const isCartOrder = order.type === "cart";
          const totalItemsCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
          return (
            <Card key={order._id} className={`p-5 border-l-4 ${isActive ? 'border-l-amber-500' : 'border-l-emerald-500'}`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                {/* Left Side: Thumbnails + Order Info */}
                <div className="flex items-start gap-4 flex-1">

                  {/* Thumbnail Preview Box */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-neutral-950 rounded-xl border border-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {order.items[0]?.image ? (
                      <img
                        src={order.items[0].image}
                        alt={order.items[0].name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-neutral-600" />
                    )}

                    {/* If multiple items in a cart order, show count badge over thumbnail */}
                    {isCartOrder && order.items.length > 1 && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                        <span className="text-xs font-bold">+{order.items.length - 1}</span>
                        <span className="text-[9px] text-neutral-300 uppercase tracking-tighter">items</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-neutral-400">ID: {order._id}</span>
                      <Badge color={isActive ? 'amber' : 'green'}>{order.orderStatus}</Badge>
                      <Badge color={isCartOrder ? 'blue' : 'purple'}>
                        {isCartOrder ? <ShoppingBag className="w-3 h-3 inline mr-1" /> : <Layers className="w-3 h-3 inline mr-1" />}
                        {isCartOrder ? 'Cart Checkout' : 'Bespoke Order'}
                      </Badge>
                    </div>

                    {isCartOrder ? (
                      <div>
                        <p className="text-sm font-bold text-white leading-snug">
                          {order.items[0].name} {order.items.length > 1 ? `and ${order.items.length - 1} other item(s)` : ''}
                        </p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Total Quantity: <span className="text-neutral-200">{totalItemsCount}</span> &bull; Placed on {order.createdAt}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-bold text-white leading-snug">{order.items[0].name}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Est. Delivery: <span className="text-amber-300 font-medium">{order.estimatedDelivery}</span>
                        </p>
                      </div>
                    )}

                    {/* Progress Bar for Active Orders */}
                    {isActive && order.progress && (
                      <div className="space-y-1 pt-1 max-w-md">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-neutral-400">Production Progress</span>
                          <span className="text-amber-400 font-mono font-bold">{order.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" style={{ width: `${order.progress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Right Side: Total Price & Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-white/5">
                  <div className="text-left lg:text-right">
                    <p className="text-[11px] text-neutral-400 uppercase tracking-wider">Total Amount</p>
                    <p className="text-sm font-bold text-amber-300 font-mono">
                      {formatCurrency(order.totalAmount || order.items.reduce((s, i) => s + (i.price * i.quantity), 0))}
                    </p>
                  </div>

                  {!isActive && (
                    <button className="text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5 text-neutral-400" /> Invoice
                    </button>
                  )}
                </div>

              </div>
            </Card>
          );
        })}

        {filteredOrders.length === 0 && (
          <Card className="p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-neutral-500 mx-auto" />
            <p className="text-sm font-semibold text-neutral-300">No orders found</p>
            <p className="text-xs text-neutral-500">No purchases or stitching orders match your filters.</p>
          </Card>
        )}
      </div>
    </motion.div>
  );
}