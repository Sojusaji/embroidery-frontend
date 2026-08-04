import React, { useState } from 'react';
import { Trash2, Edit2, Package, AlertTriangle, Loader2 } from 'lucide-react';
import { useGetProducts, useGetTrashedProducts, useDeleteAProduct } from '../../../hook/useProducts';
import { logError } from '../../../utils/logger';
import { getCategoryLabel } from '../../../utils/productUtils';
import { renderProductThumbnail, renderStockBadge } from '../../../utils/productCardShared';
import SwipeableItem from "../../../utils/SwipeableItem";
import { toast } from 'react-hot-toast';

const ProductInventoryTable = ({ onViewTrash, onEditProduct }) => {
  const { data: products = [], isLoading, isError } = useGetProducts();
  const { data: trashedResponse } = useGetTrashedProducts();
  const deleteMutation = useDeleteAProduct();

  const [deletingProductId, setDeletingProductId] = useState(null);

  const trashedItems = Array.isArray(trashedResponse)
    ? trashedResponse
    : trashedResponse?.data || [];

  const handleConfirmDelete = async (product) => {
    const productId = product._id || product.id;
    try {
      await deleteMutation.mutateAsync(productId);
      toast.success(`"${product.name}" moved to Trash Bin.`);
      setDeletingProductId(null);
    } catch (error) {
      logError('ProductInventoryTable_Delete', error);
      setDeletingProductId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="glass-panel bg-surface/30 border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm">Loading catalog records...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass-panel bg-red-950/20 border border-red-500/10 rounded-2xl p-8 text-center text-red-400">
        <p>Could not load inventory items. Please check database connection.</p>
      </div>
    );
  }

  const renderActionButtons = (product, productId) => (
    <div className='flex items-center justify-end gap-2'>
      <button
        type="button"
        onClick={() => onEditProduct(product)}
        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
        title="Edit product"
      >
        <Edit2 size={16} />
      </button>
      <button
        type="button"
        onClick={() => setDeletingProductId(productId)}
        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
        title="Delete product"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  const renderInlineConfirmation = (product) => (
    <div className="flex items-center justify-between flex-wrap gap-3 w-full">
      <div className="flex items-center gap-2 text-red-300">
        <AlertTriangle size={16} className="shrink-0" />
        <span className="text-xs font-medium">
          Send <strong className="text-white">"{product.name}"</strong> to trash?
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setDeletingProductId(null)}
          className="px-3 py-1.5 text-xs text-gray-300 hover:text-white bg-white/5 rounded-lg transition-all"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => handleConfirmDelete(product)}
          disabled={deleteMutation.isPending}
          className="px-3 py-1.5 text-xs text-white bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-all flex items-center gap-1"
        >
          {deleteMutation.isPending ? 'Moving...' : 'Confirm'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="glass-panel bg-surface/30 border border-white/5 rounded-2xl p-4 sm:p-6 overflow-hidden relative">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Package className="text-primary w-5 h-5" />
          <h2 className="text-lg sm:text-xl font-bold text-white">Product Inventory</h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={onViewTrash}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all text-gray-300 hover:text-white"
          >
            <Trash2 size={14} className="text-amber-500" />
            <span>Trash Bin</span>
            {trashedItems.length > 0 && (
              <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                {trashedItems.length}
              </span>
            )}
          </button>

          <span className="text-xs bg-white/10 text-gray-300 px-3 py-2 rounded-xl font-medium">
            Total: {products.length}
          </span>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm">No products added yet.</div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto w-full rounded-xl border border-white/5 bg-black/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <th className="py-4 px-5">Product Details</th>
                  <th className="py-4 px-5">Category</th>
                  <th className="py-4 px-5">Price</th>
                  <th className="py-4 px-5">Stock Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm text-gray-200">
                {products.map((product) => {
                  const productId = product._id || product.id;
                  const isConfirming = deletingProductId === productId;
                  return (
                    <tr key={productId} className="hover:bg-white/[0.01] transition-colors group">
                      {isConfirming ? (
                        <td colSpan="5" className="py-3 px-5 bg-red-500/10 border-y border-red-500/20 animate-in fade-in duration-150">
                          {renderInlineConfirmation(product)}
                        </td>
                      ) : (
                        <>
                          <td className="py-4 px-5 flex items-center gap-3">
                            {renderProductThumbnail(product, "w-12 h-12")}
                            <span className="font-medium text-white max-w-[220px] truncate block">
                              {product.name}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            <span className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-gray-300 font-medium">
                              {getCategoryLabel(product.category)}
                            </span>
                          </td>
                          <td className="py-4 px-5 font-semibold text-white">
                            ${Number(product.price || 0).toFixed(2)}
                          </td>
                          <td className="py-4 px-5">
                            {renderStockBadge(product.totalStock, false)}
                          </td>
                          <td className="py-4 px-5 text-right">
                            {renderActionButtons(product, productId)}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE SWIPEABLE CARD VIEW */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {products.map((product) => {
              const productId = product._id || product.id;
              const isConfirming = deletingProductId === productId;
              return (
                <SwipeableItem
                  key={productId}
                  leftAction={{
                    width: 140,
                    node: (
                      <button
                        onClick={() => onEditProduct(product)}
                        className="absolute w-full left-0 top-0 bottom-0 bg-blue-600 flex items-center pl-10 text-white text-lg font-semibold rounded-r-2xl gap-2 overflow-hidden"
                      >
                        <Edit2 size={18} />
                        <span>Edit</span>
                      </button>
                    )
                  }}
                  rightAction={{
                    width: 140,
                    node: (
                      <button
                        onClick={() => setDeletingProductId(productId)}
                        className="absolute w-full right-0 top-0 bottom-0 bg-red-600 flex items-center justify-end pr-6 text-white text-lg font-semibold rounded-r-2xl gap-2 overflow-hidden"
                      >
                        <Trash2 size={18} />
                        <span>Delete</span>
                      </button>
                    )
                  }}
                  isConfirming={isConfirming}
                >
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
                    {isConfirming ? (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 animate-in fade-in duration-150">
                        {renderInlineConfirmation(product)}
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {renderProductThumbnail(product, "w-14 h-14")}
                            <div>
                              <h3 className="font-semibold text-white text-sm line-clamp-1">{product.name}</h3>
                              <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-gray-300 inline-block mt-1">
                                {getCategoryLabel(product.category)}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-primary font-bold text-base">
                              ${Number(product.price || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <div>{renderStockBadge(product.totalStock, true)}</div>
                          <span className="text-[10px] text-gray-500">Swipe left/right</span>
                        </div>
                      </>
                    )}
                  </div>
                </SwipeableItem>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
export default ProductInventoryTable;