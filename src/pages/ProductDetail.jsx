import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { DUMMY_PRODUCTS } from '../utils/dummyData';
import { useCart } from '../context/CartContext';
import Footer from '../components/layout/Footer';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const product = DUMMY_PRODUCTS.find(p => p.id === parseInt(id));

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Bespoke Platform`;
    } else {
      document.title = `Product Not Found | Bespoke Platform`;
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-white mb-4">Product Not Found</h1>
        <Link to="/shop" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>
    );
  }

  const handleBuyNow = () => {
    addToCart(product);
    toast.success('Added to cart! Proceed to checkout in your cart.');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 container mx-auto px-4 md:px-6 py-12 max-w-7xl pt-24 md:pt-32">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/shop" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors duration-200">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column - Image gallery/display */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full flex flex-col gap-4"
          >
            <div className="relative aspect-[4/5] lg:aspect-square w-full rounded-[2rem] overflow-hidden glass-panel p-2">
              <div className="w-full h-full rounded-[1.5rem] overflow-hidden bg-black/20">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* We could add thumbnails here later if multiple images are available */}
          </motion.div>

          {/* Right Column - Product details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-wider uppercase text-primary w-fit mb-4">
              {product.category}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'fill-transparent'}`} />
                ))}
              </div>
              <span className="text-gray-400 text-sm">({product.reviewsCount || 0} reviews)</span>
            </div>

            <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400 mb-8">
              ${product.price}
            </p>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-white mb-3">Description</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                {product.description || 'Premium handcrafted item.'}
              </p>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="mb-10">
                <h3 className="text-lg font-bold text-white mb-4">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-gray-300">
                      <span className="text-primary mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto border-t border-white/5 pt-8">
              <button 
                onClick={() => addToCart(product)}
                className="flex-1 py-4 px-6 rounded-2xl glass-panel bg-white/5 text-white font-bold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2 border border-white/10"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
              
              <button 
                onClick={handleBuyNow}
                className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-primary to-orange-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary),0.5)] transition-all flex items-center justify-center gap-2"
              >
                Buy Now
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/5 text-gray-400">
              <div className="flex flex-col items-center justify-center text-center gap-2">
                <ShieldCheck className="w-6 h-6 text-primary/70" />
                <span className="text-xs font-semibold">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center gap-2 border-x border-white/5">
                <Truck className="w-6 h-6 text-primary/70" />
                <span className="text-xs font-semibold">Fast Global Delivery</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center gap-2">
                <RotateCcw className="w-6 h-6 text-primary/70" />
                <span className="text-xs font-semibold">Free Returns</span>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
