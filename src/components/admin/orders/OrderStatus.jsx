import React from 'react';
import { Package, Clock, Truck, CheckCircle2 } from 'lucide-react';

const OrderStats = ({ orders }) => {
  const totalOrders = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const processingCount = orders.filter((o) => o.status === 'Processing').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Package size={18} />
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-gray-400">Total Orders</p>
          <p className="text-sm sm:text-base font-bold text-white">{totalOrders}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
          <Clock size={18} />
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-gray-400">Pending</p>
          <p className="text-sm sm:text-base font-bold text-white">{pendingCount}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
          <Truck size={18} />
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-gray-400">Processing</p>
          <p className="text-sm sm:text-base font-bold text-white">{processingCount}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 size={18} />
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-gray-400">Delivered</p>
          <p className="text-sm sm:text-base font-bold text-white">{deliveredCount}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;