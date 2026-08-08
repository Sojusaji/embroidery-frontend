import { motion } from 'framer-motion';

const ProductCardSkeleton = ({ index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative flex flex-col h-full animate-pulse"
    >
      {/* Image Container Placeholder */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl glass-panel p-2 bg-white/5 border-white/5">
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white/10" />
      </div>

      {/* Product Details Placeholder */}
      <div className="mt-4 px-2 flex flex-col">
        {/* Title and Category Row */}
        <div className="flex justify-between items-start mb-2">
          {/* Title line skeleton */}
          <div className="h-5 bg-white/10 rounded-md w-3/5" />
          {/* Category badge skeleton */}
          <div className="h-5 bg-white/10 rounded-md w-1/4" />
        </div>

        {/* Price Row */}
        <div className="flex justify-between items-center mt-2">
          {/* Price skeleton */}
          <div className="h-7 bg-white/10 rounded-md w-1/3" />
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCardSkeleton;