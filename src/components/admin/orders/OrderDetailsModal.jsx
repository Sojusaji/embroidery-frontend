import React, { useEffect, useRef } from 'react';
import { X, User, Mail, Phone, MapPin } from 'lucide-react';

const OrderDetailsModal = ({ order, onClose, onUpdateStatus, statusOptions = [] }) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    // Lock background scroll
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // Auto-focus close button
    closeButtonRef.current?.focus();

    // Keydown accessibility handling
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();

      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!order) return null;

  return (
    /* STEP 4: Backdrop overlay with overflow safety fallback */
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto py-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* STEP 3: Use dvh for mobile address bar safety */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[85dvh] sm:max-h-[90dvh] overflow-hidden"
      >
        {/* STEP 2: shrink-0 keeps header fixed */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex justify-between items-center bg-black/20 shrink-0">
          <div>
            <h3 id="modal-title" className="text-base sm:text-lg font-bold text-white">
              Order Details <span className="text-primary font-bold">{order.id}</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-400">Placed on {order.date}</p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close details modal"
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: flex-1 + min-h-0 fixes mobile scroll collapse */}
        <div className="p-4 sm:p-6 overflow-y-auto min-h-0 flex-1 space-y-4 text-xs sm:text-sm overscroll-contain">
          {/* Customer Info */}
          <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-2">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Customer Information
            </p>
            <div className="flex items-center gap-2 text-white font-medium">
              <User size={14} className="text-primary shrink-0" /> {order.customer}
            </div>
            {order.email && (
              <div className="flex items-center gap-2 text-gray-300">
                <Mail size={14} className="text-gray-500 shrink-0" /> {order.email}
              </div>
            )}
            {order.phone && (
              <div className="flex items-center gap-2 text-gray-300">
                <Phone size={14} className="text-gray-500 shrink-0" /> {order.phone}
              </div>
            )}
            {order.address && (
              <div className="flex items-start gap-2 text-gray-300 pt-1">
                <MapPin size={14} className="text-gray-500 shrink-0 mt-0.5" />
                <span>{order.address}</span>
              </div>
            )}
          </div>

          {/* Items Breakdown */}
          {order.items && order.items.length > 0 && (
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Order Items
              </p>
              <div className="bg-black/30 rounded-xl border border-white/5 divide-y divide-white/5">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.qty} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-white font-bold">
                      ${(item.qty * item.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/30 p-3 rounded-xl border border-white/5">
              <p className="text-[11px] text-gray-400">Payment Status</p>
              <p className="text-sm font-bold text-emerald-400 mt-0.5">
                {order.paymentStatus || 'Paid'}
              </p>
            </div>
            <div className="bg-black/30 p-3 rounded-xl border border-white/5">
              <p className="text-[11px] text-gray-400">Fulfillment Status</p>
              <p className="text-sm font-bold text-primary mt-0.5">{order.status}</p>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-2 border-t border-white/10 text-base font-bold">
            <span className="text-white">Total Amount</span>
            <span className="text-emerald-400">${(order?.total ?? 0).toFixed(2)}</span>
          </div>
        </div>

        {/* STEP 2: shrink-0 keeps footer fixed */}
        <div className="p-4 bg-black/40 border-t border-white/10 flex justify-between items-center shrink-0">
          <label htmlFor="modal-status-select" className="text-xs text-gray-400">
            Update Status:
          </label>
          <select
            id="modal-status-select"
            value={order.status}
            onChange={(e) => onUpdateStatus(order.id, e.target.value)}
            className="bg-black border border-white/20 text-xs text-white rounded-lg px-3 py-1.5 outline-none focus:border-primary cursor-pointer"
          >
            {statusOptions.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;