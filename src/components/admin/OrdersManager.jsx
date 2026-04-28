import React, { useState } from 'react';
import { Package, Search, ChevronDown, Check, X } from 'lucide-react';

const mockOrdersDb = [
  { id: '#ORD-001', customer: 'Alina Starkov', date: '2026-04-20', total: 1250, status: 'Processing', items: 'Floral Embroidery A (x5)' },
  { id: '#ORD-002', customer: 'Kaz Brekker', date: '2026-04-19', total: 3200, status: 'Shipped', items: 'Stitched Kurti B (x10)' },
  { id: '#ORD-003', customer: 'Inej Ghafa', date: '2026-04-18', total: 450, status: 'Delivered', items: 'Rose Embroidery C (x8)' },
  { id: '#ORD-004', customer: 'Jesper Fahey', date: '2026-04-18', total: 120, status: 'Pending', items: 'Silver Drop Earrings (x1)' },
  { id: '#ORD-005', customer: 'Nina Zenik', date: '2026-04-17', total: 890, status: 'Processing', items: 'Stitched Gown A (x2)' },
];

const OrdersManager = () => {
  const [orders, setOrders] = useState(mockOrdersDb);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(
    order => order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
             order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateStatus = (id, newStatus) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">Orders Management</h1>
          <p className="text-gray-400 mt-2">View, search, and update customer order statuses.</p>
        </div>
        
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search orders..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
      </div>

      <div className="glass-panel bg-black/30 border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-sm border-b border-white/5">
                <th className="py-4 px-6 font-medium">Order ID</th>
                <th className="py-4 px-6 font-medium">Customer</th>
                <th className="py-4 px-6 font-medium">Items</th>
                <th className="py-4 px-6 font-medium">Date</th>
                <th className="py-4 px-6 font-medium">Total</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-6 text-primary font-medium">{order.id}</td>
                  <td className="py-4 px-6 text-white">{order.customer}</td>
                  <td className="py-4 px-6 text-gray-300 text-sm">{order.items}</td>
                  <td className="py-4 px-6 text-gray-400">{order.date}</td>
                  <td className="py-4 px-6 text-emerald-400 font-medium">${order.total}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      order.status === 'Processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                      order.status === 'Shipped' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                     <select 
                        className="bg-black border border-white/10 text-xs text-gray-300 rounded px-2 py-1 outline-none focus:border-primary"
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                     >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                     </select>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">No orders found matching "{searchTerm}"</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersManager;
