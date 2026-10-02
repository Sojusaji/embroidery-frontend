import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getProductImageUrl } from '../../utils/productUtils';


const ProductCard = ({ product, index }) => {
 console.log('products we recieved:',product);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative flex flex-col h-full"
    >
      <Link to={`/product/${product._id || product.id}`} className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl glass-panel p-2 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/20 bg-white/5 border-white/5">
          <div className="relative h-full w-full overflow-hidden rounded-2xl bg-black/20">
            {/* Discount Badge - Sleek Frosted Glass Style */}
            {product.comparePrice && product.comparePrice > product.price && (
              <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full shadow-lg">
                {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
              </div>
            )}
            <img
              src={getProductImageUrl(product)}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110  "
            />
            {/* Subtle overlay for image protection/focus */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          </div>
        </div>

        {/* Product Details - Always Visible */}
        <div className="mt-4 px-2 flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-gray-200 font-bold text-lg group-hover:text-white transition-colors line-clamp-1">
              {product.name}
            </h3>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-auto pt-1">
            {/* Pricing Group (Current Price, Compare Price, and Badge) */}
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                ${product.price}
              </span>

              {/* Compare Price & Discount Badge */}
              {product.comparePrice && product.comparePrice > product.price && (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    ${product.comparePrice}
                  </span>

                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
