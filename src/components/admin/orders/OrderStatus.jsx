import React from 'react';
import { Package, Clock, Truck, CheckCircle2, ShipIcon, Loader2 } from 'lucide-react';

const OrderStats = ({ counts, isLoading }) => {

  const totalOrders = counts?.ordersCount?.total || 0;
  const pendingCount = counts?.ordersCount?.pending || 0;
  const processingCount = counts?.ordersCount?.processing || 0;
  const deliveredCount = counts?.ordersCount?.delivered || 0;
  const shippedCount = counts?.ordersCount?.shipped || 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Package size={18} />
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-gray-400">Total Orders</p>
          {
            isLoading ? (
              <Loader2 size={16} className="animate-spin text-gray-400 mt-1" />
            ) :
              <p className="text-sm sm:text-base font-bold text-white">{totalOrders}</p>
          }
        </div>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
          <Clock size={18} />
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-gray-400">Pending</p>{
            isLoading ? (
              <Loader2 size={16} className="animate-spin text-gray-400 mt-1" />
            ) :
              <p className="text-sm sm:text-base font-bold text-white">{pendingCount}</p>}
        </div>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
          <Truck size={18} />
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-gray-400">Processing</p>{
            isLoading ? (
              <Loader2 size={16} className="animate-spin text-gray-400 mt-1" />
            ) :
              <p className="text-sm sm:text-base font-bold text-white">{processingCount}</p>}
        </div>
      </div>


      <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
          <ShipIcon size={18} />
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-gray-400">Shipped</p>{
            isLoading ? (
              <Loader2 size={16} className="animate-spin text-gray-400 mt-1" />
            ) :
              <p className="text-sm sm:text-base font-bold text-white">{shippedCount}</p>}
        </div>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 size={18} />
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-gray-400">Delivered</p>{
            isLoading ? (
              <Loader2 size={16} className="animate-spin text-gray-400 mt-1" />
            ) :
              <p className="text-sm sm:text-base font-bold text-white">{deliveredCount}</p>}
        </div>
      </div>
    </div >
  );
};

export default OrderStats;