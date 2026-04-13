import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { cn } from '../../utils/cn';

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl glass-panel p-2 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/20 bg-white/5 border-white/5">
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-black/20">
          <img 
            src={product.image} 
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Subtle overlay for image protection/focus */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick Add Corner Button (Always visible on mobile, hover on desktop) */}
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            className={cn(
              "absolute bottom-4 right-4 w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg",
              "md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300",
              "active:bg-primary-dark"
            )}
            title="Add to Cart"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
      
      {/* Product Details - Always Visible */}
      <div className="mt-4 px-2 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-gray-200 font-bold text-lg group-hover:text-white transition-colors line-clamp-1">
            {product.name}
          </h3>
          <span className="text-sm px-2 py-0.5 rounded-md bg-white/5 text-gray-400 group-hover:text-gray-300">
            {product.category}
          </span>
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <p className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
            ${product.price}
          </p>
          
          {/* Mobile-visible text button */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            className="md:hidden flex items-center gap-2 text-primary font-bold text-sm tracking-wide uppercase hover:text-white transition-colors"
          >
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
