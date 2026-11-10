import React, { useState } from 'react';
import { useFetchAllOrders, useFetchOrdersCount, useUpdateOrderStatus } from "../../../hook/admin/useOrdersManagement.js";
import { Search, X, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

import OrderStats from './OrderStatus';
import OrderTableRow from './OrderTableRow';
import OrderDetailsModal from './OrderDetailsModal';


const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const OrdersManager = () => {
  // const [orders, setOrders] = useState(mockOrdersDb);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeModalOrder, setActiveModalOrder] = useState(null);

  const queryStatus = selectedStatus === 'All' ? undefined : selectedStatus.toLowerCase();
  console.log('queryStatus:', queryStatus);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isOrderLoading,
    isError: isOrderLoadingError,
    error,

  } = useFetchAllOrders(queryStatus);

  const { mutateAsync: updateStatus, isLoading, isError } = useUpdateOrderStatus();
  console.log('isOrderLoading:', isOrderLoading);
  const { data: counts, isLoading: isCountLoading, isError: isCountError } = useFetchOrdersCount();
  console.log('orders count:', counts);
  // if (isLoading) return <LoadingSpinner value={isLoading} message={"Loading orders..."} />;
  // if (isError) return <div className="p-6 text-red-500">Error: {error.message}</div>;


  const orders = data?.pages.flatMap((page) => page.orders) || [];
  console.log('ordersd:', orders);
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
      order?.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order?.billingAddress?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order?.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus =
      selectedStatus === 'All' || order.orderStatus === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = async (orderId, currentStatus, newStatus) => {
    console.log("order status updation funciton called:", orderId, currentStatus, newStatus);
    try {
      await updateStatus({ orderId, currentStatus, newStatus });
    } catch (error) {

      if (activeModalOrder && activeModalOrder.id === orderId) {
        setActiveModalOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }

      toast.success(`Order ${orderId} status updated to ${newStatus}`);
    }

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
      <OrderStats counts={counts} isLoading={isCountLoading} />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['All', ...STATUS_OPTIONS].map((status) => (
          console.log('status option status:', status),
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${selectedStatus === status
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
              {
                isOrderLoading
                  ?
                  <tr>
                    <td colSpan="3" className="py-12 text-center text-gray-500">
                      Orders are loading...
                    </td>
                  </tr>
                  : filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <OrderTableRow
                        key={order.id}
                        order={order}
                        statusOptions={STATUS_OPTIONS}
                        getStatusBadgeClass={getStatusBadgeClass}
                        onViewDetails={setActiveModalOrder}
                        onUpdateStatus={updateOrderStatus}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-12 text-center text-gray-500">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        No orders found matching your search or filter.
                      </td>
                    </tr>
                  )
              }
            </tbody>
          </table>
        </div>


        {/* Professional Load More / Cursor Pagination Footer */}
        {hasNextPage && (
          <div className="p-4 sm:p-6 border-t border-white/5 flex items-center justify-center bg-white/[0.01]">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 shadow-sm"
            >
              {isFetchingNextPage ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-45" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading more orders...
                </>
              ) : (
                "Show More Orders"
              )}
            </button>
          </div>
        )}
      </div>
      {/* Order Details Modal - FIX: Only mount when an order is selected */}


      {
        activeModalOrder && (
          <OrderDetailsModal
            order={activeModalOrder}
            statusOptions={STATUS_OPTIONS}
            onClose={() => setActiveModalOrder(null)}
            onUpdateStatus={updateOrderStatus}
          />
        )
      }
    </div >
  );
};

export default OrdersManager;