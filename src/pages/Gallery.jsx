import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Camera, X, ImageIcon, ZoomIn, Filter } from 'lucide-react';
import Footer from '../components/layout/Footer';
import { useGetProducts } from '../hook/useProducts';

const placeholderGallery = [
  { id: 1, title: 'Floral Elegance', category: 'Embroidery', size: 'large', img: '/gallery/floral.png' },
  { id: 2, title: 'Vintage Hand-Stitch', category: 'Embroidery', size: 'large', img: '/gallery/vintage.png' },
  { id: 3, title: 'Peacock Motif', category: 'Embroidery', size: 'large', img: '/gallery/peacock.png' }
];

const categories = ['All', 'Embroidery'];

const Gallery = () => {
  const [items, setItems] = useState([]);
  const { data: fetchedProducts, isLoading: loading } = useGetProducts();
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    if (!loading) {
      if (fetchedProducts && fetchedProducts.length > 0) {
        setItems([...fetchedProducts, ...placeholderGallery]);
      } else {
        setItems(placeholderGallery);
      }
    }
  }, [fetchedProducts, loading]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pattern-grid-lg pointer-events-none" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary/20 blur-[100px] rounded-full" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-white/10 text-primary uppercase tracking-wider text-sm font-semibold mb-6"
          >
            <Camera className="w-4 h-4" />
            <span>Our Masterpieces</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight font-heading"
          >
            A Tapestry of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Artistry</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Explore our curated gallery showcasing the intricate details, golden threads, and timeless beauty of our custom embroidery and rolled gold ornaments.
          </motion.p>
        </div>
      </section>

      {/* Filtering Options */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 mr-4 text-gray-400">
            <Filter className="w-5 h-5" />
            <span className="font-medium text-sm">Filter:</span>
          </div>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeFilter === cat 
                  ? 'bg-primary text-black shadow-[0_0_15px_rgba(255,215,0,0.3)] scale-105' 
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="flex-grow container mx-auto px-4 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-[4/5] bg-white/5 rounded-2xl" />
            ))}
          </div>
        ) : (
          <LayoutGroup>
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[300px]">
              <AnimatePresence mode="popLayout">
                {items
                  .filter(item => activeFilter === 'All' || item.category === activeFilter)
                  .map((item, idx) => {
                    const isLarge = item.size === 'large' || (!item.size && idx % 4 === 0);
                    return (
                      <motion.div
                        layout
                        key={item._id || item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                        transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
                        className={`relative group cursor-zoom-in overflow-hidden rounded-2xl glass-panel border border-white/10 shadow-xl ${
                          isLarge ? 'md:col-span-2 lg:row-span-2' : ''
                        }`}
                        onClick={() => setSelectedImage(item)}
                      >
                        <div className="relative w-full h-full bg-black/40 flex items-center justify-center">
                          {item.image || item.img ? (
                            <img 
                              src={(item.image && item.image.startsWith('/uploads')) ? `http://localhost:5000${item.image}` : (item.image || item.img)} 
                              alt={item.name || item.title} 
                              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-50"
                              loading="lazy"
                            />
                          ) : (
                            <ImageIcon className="w-12 h-12 text-gray-600" />
                          )}
                          
                          {/* Polished Glass Overlay */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-6 bg-black/40 backdrop-blur-[2px]">
                            <div className="bg-primary/20 p-4 rounded-full mb-4 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 delay-75 shadow-[0_0_30px_rgba(255,215,0,0.2)]">
                              <ZoomIn className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-white text-center transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                              {item.name || item.title}
                            </h3>
                            <div className="w-12 h-1 bg-primary mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100 origin-left" />
                            {item.category && (
                              <p className="mt-3 text-sm text-primary uppercase tracking-widest font-semibold transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                {item.category}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        )}
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X className="w-6 h-6" />
            </button>
            
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-5xl max-h-[90vh] w-full isolate"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={(selectedImage.image && selectedImage.image.startsWith('/uploads')) ? `http://localhost:5000${selectedImage.image}` : (selectedImage.image || selectedImage.img)} 
                alt={selectedImage.name || selectedImage.title}
                className="w-full h-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h2 className="text-2xl font-bold text-white">{selectedImage.name || selectedImage.title}</h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Gallery;
