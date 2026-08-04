import React from 'react';
import { Package } from 'lucide-react';
import { getProductImageUrl } from './productUtils';

export const renderProductThumbnail = (product, dimensions) => (
  <div className={`${dimensions} rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0`}>
    {product.image ? (
      <img src={getProductImageUrl(product)} alt={product?.name || ''} className="w-full h-full object-cover" />
    ) : (
      <Package className="w-5 h-5 text-gray-500" />
    )}
  </div>
);

export const renderStockBadge = (stock, isMobile = false) => {
  const sizeClasses = isMobile ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1";
  if (stock === 0) {
    return <span className={`${sizeClasses} text-red-400 font-medium bg-red-500/10 border border-red-500/20 rounded-md`}>Out of Stock</span>;
  }
  if (stock <= 5) {
    return <span className={`${sizeClasses} text-amber-400 font-medium bg-amber-500/10 border border-amber-500/20 rounded-md`}>Low {isMobile ? '' : `Stock`} ({stock})</span>;
  }
  return <span className={`${sizeClasses} text-green-400 font-medium bg-green-500/10 border border-green-500/20 rounded-md`}>In Stock ({stock})</span>;
};