import React from 'react';

const ProductCardSkeleton = ({ index = 0 }) => {
  return (
    <div 
      className="group relative flex flex-col h-full animate-pulse"
      // 🌟 Wave effect: Each card starts its pulse 120ms after the previous one
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* Image Container Placeholder */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl glass-panel p-2 bg-white/10 border border-white/10 shadow-lg">
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white/10 flex items-center justify-center">
          <div 
            className="w-10 h-10 rounded-full bg-white/10 animate-ping opacity-25" 
            style={{ animationDelay: `${index * 120}ms` }}
          />
        </div>
      </div>

      {/* Product Details Placeholder */}
      <div className="mt-4 px-2 flex flex-col space-y-3">
        <div className="flex justify-between items-center gap-2">
          <div className="h-5 bg-white/20 rounded-md w-3/5" />
          <div className="h-5 bg-white/20 rounded-full w-1/4" />
        </div>

        <div className="flex justify-between items-center pt-1">
          <div className="h-7 bg-primary/30 rounded-lg w-1/3" />
          <div className="h-6 bg-white/15 rounded-md w-1/4" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;