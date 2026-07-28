import React, { useState } from 'react';
import { RotateCcw, Trash2, AlertTriangle, Package, Loader2, ArrowLeft, Search } from 'lucide-react';
import { useGetTrashedProducts, useRestoreProduct, usePurgeProduct } from '../../../hook/useProducts';
import { logError } from '../../../utils/logger';
import { getCategoryLabel } from '../../../utils/productUtils';
import { toast } from 'react-hot-toast';

const TrashBinManager = ({ onBackToInventory }) => {
  const { data: trashedResponse, isLoading, isError } = useGetTrashedProducts();

  const restoreMutation = useRestoreProduct();
  const purgeMutation = usePurgeProduct();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purgeTarget, setPurgeTarget] = useState(null);

  const rawProductsArray = Array.isArray(trashedResponse)
    ? trashedResponse
    : trashedResponse?.data || [];
  const totalTrashedCount = rawProductsArray.length;

  const filteredProducts = rawProductsArray.filter((product) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const nameMatch = product?.name?.toLowerCase().includes(query);
    const categoryMatch = getCategoryLabel(product?.category).toLowerCase().includes(query);
    const skuMatch = product?.sku?.toLowerCase().includes(query);
    return nameMatch || categoryMatch || skuMatch;
  });

  const openPurgeModal = (target) => {
    setPurgeTarget(target);
    setIsModalOpen(true);
  };

  const closePurgeModal = () => {
    setPurgeTarget(null);
    setIsModalOpen(false);
  };

  const handleRestore = async (product) => {
    try {
      await restoreMutation.mutateAsync(product._id || product.id);
      toast.success(`"${product.name}" restored to live catalog! 🚀`);
    } catch (error) {
      logError('TrashBinManager_Restore', error);
      toast.error('Failed to restore product.');
    }
  };

  const handleConfirmPurge = async () => {
    try {
      if (purgeTarget === 'all') {
        await purgeMutation.mutateAsync(undefined);
        toast.success('Trash repository cleared permanently.');
      } else if (purgeTarget) {
        await purgeMutation.mutateAsync(purgeTarget._id || purgeTarget.id);
        toast.success(`"${purgeTarget.name}" permanently deleted.`);
      }
      closePurgeModal();
    } catch (error) {
      logError('TrashBinManager_Purge', error);
      toast.error('Fatal error during deletion process.');
    }
  };

  const getDaysUntilDeletion = (deletedAt) => {
    if (!deletedAt) return 30;
    const deletedDate = new Date(deletedAt).getTime();
    if (isNaN(deletedDate)) return 30;
    const now = new Date().getTime();
    const diffDays = Math.floor((now - deletedDate) / (1000 * 60 * 60 * 24));
    const remaining = 30 - diffDays;
    return remaining > 0 ? remaining : 0;
  };

  if (isLoading) {
    return (
      <div className="glass-panel bg-surface/30 border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-sm">Loading archived records...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='grid grid-row-2 gap-2'>
         <button
            type="button"
            onClick={onBackToInventory}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors w-fit"
          >
            <ArrowLeft size={14} /> Back to Live Inventory
          </button>
        <div className="glass-panel bg-red-950/20 border border-red-500/10 rounded-2xl p-8 text-center text-red-400">
          <p>Could not access the trash repository. Please check connection logs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel bg-surface/30 border border-white/5 rounded-2xl p-6 overflow-hidden">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 border-b border-white/5 pb-6">
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onBackToInventory}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors w-fit"
          >
            <ArrowLeft size={14} /> Back to Live Inventory
          </button>
          <div className="flex items-center gap-2 mt-1">
            <Trash2 className="text-amber-500 w-5 h-5" />
            <h2 className="text-xl font-bold text-white">Archived Trash Bin</h2>
            <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-medium ml-2">
              {totalTrashedCount} Items Pending Purge
            </span>
          </div>
          <p className="text-sm sm:text-xs text-gray-300 antialiased max-w-xl leading-relaxed">
            Items placed here are hidden from the store. They will be <strong className="text-semibold text-gray-300">permanently deleted automatically after 30 days</strong> via automated cron-cleanup scripts.
          </p>
        </div>

        {totalTrashedCount > 0 && (
          <button
            type="button"
            onClick={() => openPurgeModal('all')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm bg-red-600/10 hover:bg-red-600 border border-red-500/20 hover:border-red-600 text-red-400 hover:text-white rounded-xl font-semibold transition-all active:scale-95 self-start sm:self-center"
          >
            <Trash2 size={16} />
            Empty Trash Bin
          </button>
        )}
      </div>

      {totalTrashedCount > 0 && (
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search archived product names, categories, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-black/20 text-white placeholder-gray-500 border border-white/5 rounded-xl focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
          />
        </div>
      )}

      {totalTrashedCount === 0 ? (
        <div className="text-center py-16 text-gray-500 text-sm flex flex-col items-center justify-center gap-3 bg-black/10 rounded-xl border border-white/[0.02]">
          <div className="p-3 bg-white/5 rounded-full text-gray-600">
            <Trash2 size={24} />
          </div>
          <p>The trash bin is currently completely clean.</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm bg-black/10 rounded-xl border border-white/[0.02]">
          <p>No archived items match your search term "{searchQuery}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const productId = product._id || product.id;
            const daysLeft = getDaysUntilDeletion(product.deletedAt);

            const isRestoringThisProduct = restoreMutation.isPending && restoreMutation.variables === productId;
            const isPurgingThisProduct = purgeMutation.isPending && purgeMutation.variables === productId;

            return (
              <div key={productId} className="group relative flex flex-col justify-between border border-white/5 bg-black/20 hover:bg-white/[0.01] rounded-xl p-4 transition-all duration-300">
                <div className="flex gap-4 items-start">
                  <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                    {product.image ? (
                      <img src={product.image} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                    ) : (
                      <Package className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-xs px-2 py-0.5 w-fit rounded-md bg-white/5 border border-white/5 text-gray-400 font-medium">
                      {getCategoryLabel(product.category)}
                    </span>
                    <h3 className="font-semibold text-white text-sm truncate pr-2 mt-1">{product.name}</h3>
                    <span className="text-xs text-gray-400">
                      Original Price: <span className="text-white font-medium">${Number(product.price || 0).toFixed(2)}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/5 text-xs">
                  <span className={`font-medium px-2 py-0.5 rounded ${daysLeft <= 7 ? 'text-red-400 bg-red-500/5 border border-red-500/10 animate-pulse' : 'text-amber-400 bg-amber-500/5'}`}>
                    {daysLeft === 0 ? 'Purging tonight' : `${daysLeft} days remaining`}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleRestore(product)}
                      disabled={isRestoringThisProduct || isPurgingThisProduct}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-gray-400 hover:text-green-400 bg-white/5 hover:bg-green-500/10 rounded-lg transition-all border border-transparent hover:border-green-500/20 disabled:opacity-40"
                    >
                      {isRestoringThisProduct ? (
                        <Loader2 size={14} className="animate-spin text-green-400" />
                      ) : (
                        <RotateCcw size={14} />
                      )}
                      <span className="text-[11px] font-medium">
                        {isRestoringThisProduct ? 'Restoring...' : 'Restore'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openPurgeModal(product)}
                      disabled={isRestoringThisProduct || isPurgingThisProduct}
                      className="p-1.5 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-lg transition-all border border-transparent hover:border-red-500/20 disabled:opacity-40"
                      title="Permanently purge product"
                    >
                      {isPurgingThisProduct ? (
                        <Loader2 size={14} className="animate-spin text-red-400" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md bg-zinc-950 border border-red-500/20 p-6 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <div className="p-2 bg-red-500/10 rounded-lg"><AlertTriangle size={24} /></div>
              <h3 className="text-lg font-bold text-white">
                {purgeTarget === 'all' ? 'Confirm Total Trash Purge' : 'Confirm Permanent Deletion'}
              </h3>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              {purgeTarget === 'all' ? (
                <span>Are you certain you want to <span className="text-red-400 font-semibold uppercase">permanently wipe all trash items</span>? This completely removes database configurations and deletes file cloud assets on GitHub. <strong className="text-gray-200">This cannot be undone.</strong></span>
              ) : (
                <span>Are you sure you want to permanently destroy <span className="text-white font-semibold">"{purgeTarget?.name}"</span>? This bypasses safety countdown windows, immediately purging database items and cloud image paths.</span>
              )}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closePurgeModal}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-white/5 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPurge}
                disabled={purgeMutation.isPending}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50"
              >
                {purgeMutation.isPending ? 'Purging...' : 'Permanently Purge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrashBinManager;