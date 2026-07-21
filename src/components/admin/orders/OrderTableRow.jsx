import React from 'react';
import { Eye } from 'lucide-react';

const OrderTableRow = ({
  order,
  statusOptions,
  getStatusBadgeClass,
  onViewDetails,
  onUpdateStatus,
}) => {
  return (
    <tr className="hover:bg-white/[0.02] transition-colors group">
      {/* Order ID & Items Preview */}
      <td className="py-4 px-4 sm:px-6">
        <span className="text-primary font-bold">{order.id}</span>
        <p className="text-[11px] text-gray-400 truncate max-w-[180px] mt-0.5">
          {order.items.map((i) => `${i.name} (x${i.qty})`).join(', ')}
        </p>
      </td>

      {/* Customer */}
      <td className="py-4 px-4 sm:px-6">
        <p className="text-white font-medium">{order.customer}</p>
        <p className="text-[11px] text-gray-500">{order.email}</p>
      </td>

      {/* Date */}
      <td className="py-4 px-4 sm:px-6 text-gray-400 whitespace-nowrap">
        {order.date}
      </td>

      {/* Total & Payment Pill */}
      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
        <p className="text-emerald-400 font-bold">${order.total.toFixed(2)}</p>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded ${
            order.paymentStatus === 'Paid'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400'
          }`}
        >
          {order.paymentStatus}
        </span>
      </td>

      {/* Status Badge */}
      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${getStatusBadgeClass(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </td>

      {/* Actions */}
      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-2">
          {/* Quick View Button */}
          <button
            onClick={() => onViewDetails(order)}
            className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            title="View Order Details"
          >
            <Eye size={15} />
          </button>

          {/* Status Select */}
          <select
            value={order.status}
            onChange={(e) => onUpdateStatus(order.id, e.target.value)}
            className="bg-black/60 border border-white/10 text-xs text-gray-300 rounded-lg px-2 py-1.5 outline-none focus:border-primary cursor-pointer transition-colors"
          >
            {statusOptions.map((st) => (
              <option key={st} value={st} className="bg-neutral-900 text-white">
                {st}
              </option>
            ))}
          </select>
        </div>
      </td>
    </tr>
  );
};

export default OrderTableRow;