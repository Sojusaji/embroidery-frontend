import { useEffect, useCallback } from "react";
import {
  X,
  Mail,
  Phone,
  Tag,
  Trash2,
  CheckCircle2,
  Clock,
  Ban,
  Building,
  CreditCard
} from 'lucide-react';

// Helper: Currency Formatter
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
};

const CustomerDetailsModal = ({ customer, onClose, onBlock, onDelete, onApplyDiscount }) => {

  const handleCloseModal = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleCloseModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCloseModal]);

  if (!customer) return null;

  const isBlocked = customer.status === 'Blocked';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={handleCloseModal}
    >
      <div
        className="bg-neutral-900 border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-auto text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-6 border-b border-white/10 flex items-start justify-between bg-black/40">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 text-primary flex items-center justify-center text-2xl font-bold">
              {customer.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{customer.name}</h2>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    isBlocked
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  {customer.status || 'Active'}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{customer.id} • Joined {customer.joined}</p>
            </div>
          </div>

          <button
            onClick={handleCloseModal}
            className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 bg-black/30 p-4 rounded-xl border border-white/5">
            <div>
              <p className="text-[11px] text-gray-400">Total Spent</p>
              <p className="text-lg font-bold text-emerald-400">{formatCurrency(customer.totalSpent)}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Total Orders</p>
              <p className="text-lg font-bold text-white">{customer.ordersCount || 0}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Location</p>
              <p className="text-sm font-semibold text-gray-200 truncate">{customer.place}</p>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`mailto:${customer.email}`}
                className="flex items-center gap-3 p-3 bg-black/20 hover:bg-black/40 border border-white/5 rounded-xl text-xs transition-colors"
              >
                <Mail size={16} className="text-primary" />
                <span className="truncate">{customer.email}</span>
              </a>
              <a
                href={`tel:${customer.phone}`}
                className="flex items-center gap-3 p-3 bg-black/20 hover:bg-black/40 border border-white/5 rounded-xl text-xs transition-colors"
              >
                <Phone size={16} className="text-emerald-400" />
                <span>{customer.phone || 'No phone recorded'}</span>
              </a>
            </div>
          </div>

          {/* Address Cards (Shipping & Billing) */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Addresses</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Shipping Address */}
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-primary text-xs font-medium mb-1">
                  <Building size={14} /> Shipping Address
                </div>
                <p className="text-xs text-white font-medium">{customer.shippingAddress?.street}</p>
                <p className="text-xs text-gray-400">
                  {customer.shippingAddress?.city}, {customer.shippingAddress?.state} - {customer.shippingAddress?.pincode}
                </p>
              </div>

              {/* Billing Address */}
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-1">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-medium mb-1">
                  <CreditCard size={14} /> Billing Address
                </div>
                <p className="text-xs text-white font-medium">{customer.billingAddress?.street}</p>
                <p className="text-xs text-gray-400">
                  {customer.billingAddress?.city}, {customer.billingAddress?.state} - {customer.billingAddress?.pincode}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Order History</h3>
            {customer.orderHistory && customer.orderHistory.length > 0 ? (
              <div className="border border-white/5 rounded-xl overflow-hidden bg-black/20">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-gray-400 border-b border-white/5">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {customer.orderHistory.map((ord) => (
                      <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-mono font-medium text-white">{ord.id}</td>
                        <td className="p-3 text-gray-400">{ord.date}</td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${
                              ord.status === 'Delivered'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}
                          >
                            {ord.status === 'Delivered' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-3 text-right font-medium text-white">{formatCurrency(ord.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-gray-500 bg-black/20 p-4 rounded-xl text-center">No order history available.</p>
            )}
          </div>

          {/* Quick Admin Actions Zone */}
          <div className="pt-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">CRM Actions</h3>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onApplyDiscount(customer)}
                className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-medium transition-colors"
              >
                <Tag size={14} /> Assign Promo Code
              </button>

              <button
                onClick={() => onBlock(customer.id)}
                className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2 border rounded-xl text-xs font-medium transition-colors ${
                  isBlocked
                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/20'
                }`}
              >
                <Ban size={14} /> {isBlocked ? 'Unblock Account' : 'Block Account'}
              </button>

              <button
                onClick={() => onDelete(customer.id)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-medium transition-colors"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;