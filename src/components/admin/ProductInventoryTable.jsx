// import React, { useState } from 'react';
// import {logError  } from "../../utils/logger";
// import { Trash2, Edit2, Package, AlertTriangle, Loader2 } from 'lucide-react';
// import { useGetProducts } from '../../hook/useProducts'; // Adjust path if needed

// const ProductInventoryTable = () => {
//   // 1. Grab actual live data, loading status, and errors from TanStack Query
//   const { data: products = [], isLoading, isError } = useGetProducts();

//   // Modal States
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [productToDelete, setProductToDelete] = useState(null);

//   const openDeleteModal = (product) => {
//     setProductToDelete(product);
//     setIsModalOpen(true);
//   };

//   const closeDeleteModal = () => {
//     setProductToDelete(null);
//     setIsModalOpen(false);
//   };

//   const handleConfirmDelete = async () => {
//     if (!productToDelete) return;
//     try {
//       // Execute your delete mutation here...
//       closeDeleteModal();
//     } catch (error) {
//       logError("ProductInventoryTable", error);
//     }
//   };

//   const getCategoryLabel = (category) => {
//     const labels = {
//       'embroidery': 'Embroidery',
//       'stitching': 'Stitching',
//       'rolled-gold-ornaments': 'Rolled Gold'
//     };
//     return labels[category] || category;
//   };

//   // 2. RENDER LOADING STATE
//   if (isLoading) {
//     return (
//       <div className="glass-panel bg-surface/30 border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 text-gray-400">
//         <Loader2 className="w-8 h-8 animate-spin text-primary" />
//         <p className="text-sm">Loading catalog records...</p>
//       </div>
//     );
//   }

//   // 3. RENDER ERROR STATE
//   if (isError) {
//     return (
//       <div className="glass-panel bg-red-950/20 border border-red-500/10 rounded-2xl p-8 text-center text-red-400">
//         <p>Could not load inventory items. Please check database connection.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="glass-panel bg-surface/30 border border-white/5 rounded-2xl p-6 overflow-hidden">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-2">
//           <Package className="text-primary w-5 h-5" />
//           <h2 className="text-xl font-bold text-white">Product Inventory</h2>
//         </div>
//         <span className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full font-medium">
//           Total Items: {products.length}
//         </span>
//       </div>

//       {products.length === 0 ? (
//         <div className="text-center py-12 text-gray-500 text-sm">No products added yet.</div>
//       ) : (
//         <div className="overflow-x-auto w-full rounded-xl border border-white/5 bg-black/20">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="border-b border-white/5 bg-white/[0.02] text-xs font-semibold uppercase tracking-wider text-gray-400">
//                 <th className="py-4 px-5">Product Details</th>
//                 <th className="py-4 px-5">Category</th>
//                 <th className="py-4 px-5">Price</th>
//                 <th className="py-4 px-5">Stock Status</th>
//                 <th className="py-4 px-5 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/5 text-sm text-gray-200">
//               {products.map((product) => (
//                 <tr key={product._id} className="hover:bg-white/[0.01] transition-colors group">
//                   <td className="py-4 px-5 flex items-center gap-3">
//                     <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
//                       {product.image ? (
//                         <img src={product.image} alt="" className="w-full h-full object-cover" />
//                       ) : (
//                         <Package className="w-5 h-5 text-gray-500" />
//                       )}
//                     </div>
//                     <span className="font-medium text-white max-w-[220px] truncate block">
//                       {product.name}
//                     </span>
//                   </td>

//                   <td className="py-4 px-5">
//                     <span className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-gray-300 font-medium">
//                       {getCategoryLabel(product.category)}
//                     </span>
//                   </td>

//                   <td className="py-4 px-5 font-semibold text-white">
//                     ${Number(product.price).toFixed(2)}
//                   </td>

//                   <td className="py-4 px-5">
//                     {product.totalStock === 0 ? (
//                       <span className="text-xs text-red-400 font-medium bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-md">Out of Stock</span>
//                     ) : product.totalStock <= 5 ? (
//                       <span className="text-xs text-amber-400 font-medium bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">Low Stock ({product.totalStock})</span>
//                     ) : (
//                       <span className="text-xs text-green-400 font-medium bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-md">In Stock ({product.totalStock})</span>
//                     )}
//                   </td>

//                   <td className="py-4 px-5 text-right">
//                     <div className="flex items-center justify-end gap-2">
//                       <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"><Edit2 size={16} /></button>
//                       <button onClick={() => openDeleteModal(product)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={16} /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
//           <div className="glass-panel w-full max-w-md bg-zinc-950 border border-white/10 p-6 rounded-2xl shadow-2xl">
//             <div className="flex items-center gap-3 text-red-400 mb-4">
//               <div className="p-2 bg-red-500/10 rounded-lg"><AlertTriangle size={24} /></div>
//               <h3 className="text-lg font-bold text-white">Confirm Product Deletion</h3>
//             </div>
//             <p className="text-sm text-gray-400 mb-6 leading-relaxed">
//               Are you sure you want to remove <span className="text-white font-semibold">"{productToDelete?.name}"</span>?
//             </p>
//             <div className="flex items-center justify-end gap-3">
//               <button onClick={closeDeleteModal} className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-white/5 rounded-xl transition-all">Cancel</button>
//               <button onClick={handleConfirmDelete} className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-all active:scale-95">Confirm Delete</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductInventoryTable;



// components/admin/ProductInventoryTable.jsx
import React, { useState } from 'react';
import { logError } from "../../utils/logger";
import { Trash2, Edit2, Package, AlertTriangle, Loader2 } from 'lucide-react';
import { useGetProducts, useGetTrashedProducts, useDeleteAProduct } from '../../hook/useProducts';
import { toast } from 'react-hot-toast';

const ProductInventoryTable = ({ onViewTrash }) => {
  const { data: products = [], isLoading, isError } = useGetProducts();
  const { data: trashedProducts = [] } = useGetTrashedProducts();
  const deleteMutation = useDeleteAProduct();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setProductToDelete(null);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteMutation.mutateAsync(productToDelete._id);
      toast.success(`"${productToDelete.name}" moved to Trash Bin.`);
      closeDeleteModal();
    } catch (error) {
      logError("ProductInventoryTable_Delete", error);
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'embroidery': 'Embroidery',
      'stitching': 'Stitching',
      'rolled-gold-ornaments': 'Rolled Gold'
    };
    return labels[category] || category;
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

  return (
    <div className="glass-panel bg-surface/30 border border-white/5 rounded-2xl p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Package className="text-primary w-5 h-5" />
          <h2 className="text-xl font-bold text-white">Product Inventory</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onViewTrash}
            className="flex items-center gap-2 px-4 py-2 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all text-gray-300 hover:text-white"
          >
            <Trash2 size={14} className="text-amber-500" />
            Trash Bin
            {trashedProducts.length > 0 && (
              <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                {trashedProducts.length}
              </span>
            )}
          </button>

          <span className="text-xs bg-white/10 text-gray-300 px-3 py-2 rounded-xl font-medium">
            Total Items: {products.length}
          </span>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm">No products added yet.</div>
      ) : (
        <div className="overflow-x-auto w-full rounded-xl border border-white/5 bg-black/20">
          <table aria-describedby="inventory-table-desc" className="w-full text-left border-collapse">
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
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="py-4 px-5 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                      {product.image ? (
                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
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
                    ${Number(product.price).toFixed(2)}
                  </td>

                  <td className="py-4 px-5">
                    {product.totalStock === 0 ? (
                      <span className="text-xs text-red-400 font-medium bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-md">Out of Stock</span>
                    ) : product.totalStock <= 5 ? (
                      <span className="text-xs text-amber-400 font-medium bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">Low Stock ({product.totalStock})</span>
                    ) : (
                      <span className="text-xs text-green-400 font-medium bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-md">In Stock ({product.totalStock})</span>
                    )}
                  </td>

                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"><Edit2 size={16} /></button>
                      <button onClick={() => openDeleteModal(product)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md bg-zinc-950 border border-white/10 p-6 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="p-2 bg-red-500/10 rounded-lg"><AlertTriangle size={24} /></div>
              <h3 className="text-lg font-bold text-white">Confirm Product Deletion</h3>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Are you sure you want to send <span className="text-white font-semibold">"{productToDelete?.name}"</span> to the trash repository?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={closeDeleteModal} className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-white/5 rounded-xl transition-all">Cancel</button>
              <button 
                onClick={handleConfirmDelete} 
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Moving...' : 'Move to Trash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInventoryTable;