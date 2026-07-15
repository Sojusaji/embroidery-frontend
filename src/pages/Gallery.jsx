import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Camera, X, ImageIcon, Filter, Eye, AlertCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Crucial for e-commerce redirection
import Footer from '../components/layout/Footer';
import { useGetProducts } from '../hook/useProducts';
import { DUMMY_PRODUCTS } from '../utils/dummyData';
import heroImage from '../assets/images/hero.png';
import galleryImage from '../assets/images/gallery.png';
import jhumka from '../assets/images/jhumka.png';
import studs from '../assets/images/studs.png';
import dangles from '../assets/images/dangles.png';
import hoops from '../assets/images/hoops.png';
// Utility helper for safe image resolving
const getImageUrl = (imagePath, fallbackPath) => {
  const path = imagePath || fallbackPath;
  if (!path) return '';
  if (path.startsWith('/uploads') || path.startsWith('uploads')) {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    // Ensure leading slash is handled gracefully
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }
  return path;
};

// Use actual high-quality Unsplash fallbacks if you don't have static public folder assets yet
const placeholderGallery = [
  // { 
  //   id: 'p1', 
  //   title: 'Floral Elegance Bridal Blouse', 
  //   category: 'Stitching', 
  //   img: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=800&q=80',
  //   description: 'Intricate hand-crafted zardosi and beadwork detailing on premium silk base, tailored to absolute perfection.',
  //   isCustomRequest: true
  // },
    { 
      id: 1, 
      title: 'Golden Leaf Velvet', 
      image: heroImage, 
      category: 'Embroidery',
      description: 'A luxurious velvet fabric featuring intricate golden leaf embroidery. Perfect for high-end fashion designs and statement pieces.',
     
    },
    { 
      id: 2, 
      title: 'Bespoke Tailored Suit', 
      image: galleryImage, 
      category: 'Stitching',
      description: 'Expertly crafted bespoke suit tailored to your exact measurements. Made with imported Italian wool for a sharp, confident look.',
      isCustomRequest: true
    },
    { 
      id: 3, 
      title: 'Real Rolled Gold Jhumka Earrings Pair', 
      image: jhumka, 
      category: 'Ornaments',
      description: 'Traditional Indian jhumka earrings featuring authentic rolled gold plating. Lightweight and designed to make a statement at any festival or wedding.',
    },
    { 
      id: 4, 
      title: 'Premium Rolled Gold Stud Earrings Pair', 
      image: studs, 
      category: 'Ornaments',
      description: 'Elegant rolled gold stud earrings for everyday elegance. Minimalist design that compliments any casual or formal outfit.',
    },
    { 
      id: 5, 
      title: 'Silver Thread Gown', 
      image: galleryImage, 
      category: 'Stitching',
      description: 'A stunning bespoke gown beautifully embellished with delicate silver threading. Custom tailored to highlight your silhouette perfectly.',
    },
    { 
      id: 6, 
      title: 'Floral Cotton Dress', 
      image: galleryImage, 
      category: 'Embroidery',
      description: 'A breezy cotton dress adorned with hand-embroidered floral motifs. Designed for comfort and effortless style in warm weather.',
    },
    { 
      id: 7, 
      title: 'Real Rolled Gold Dangle Earrings Pair', 
      image: dangles, 
      category: 'Ornaments',
      description: 'Beautiful dangle earrings crafted with precise real rolled gold detailing. Adds a touch of glamour to evening outings.',
    },
    { 
      id: 8, 
      title: 'Antique Rolled Gold Hoops Pair', 
      image: hoops, 
      category: 'Ornaments',
      description: 'Vintage-inspired large hoop earrings forged with antique-finish rolled gold. A timeless accessory that never goes out of style.',
    },
    { 
      id: 9, 
      title: 'Emerald Crystal Earring Pair', 
      image: jhumka, 
      category: 'Ornaments',
      description: 'Striking emerald green crystals set in beautiful rolled gold framing. Perfect for adding a pop of color to neutral outfits.',
    },
    { 
      id: 10, 
      title: 'Pearl Drop Rolled Gold Pair', 
      image: dangles, 
      category: 'Ornaments',
      description: 'Classic pearl-drop earrings suspended from beautifully crafted rolled gold fixtures. The pinnacle of sophistication and grace.',
    }
];

const Gallery = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const { data: fetchedProducts, isLoading: loading } = useGetProducts();
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');


const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile(); // Run on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Unified data sync
  useEffect(() => {
    if (!loading) {
      if (fetchedProducts && fetchedProducts.length > 0) {
        // Map dynamic products to match a predictable structure
        const mappedProducts = fetchedProducts.map(prod => ({
          ...prod,
          id: prod._id,
          title: prod.name,
          img: prod.image,
          category: prod.category || 'Portfolio Piece',
          description: prod.description || 'Premium custom-made product tailored to perfection.'
        }));
        setItems([...mappedProducts, ...placeholderGallery]);
      } else {
        setItems(placeholderGallery);
      }
    }
  }, [fetchedProducts, loading]);

  // Extract dynamic filters safely
  const dynamicCategories = useMemo(() => {
    const allCats = items.map(item => item.category).filter(Boolean);
    return ['All', ...new Set(allCats)];
  }, [items]);

  // Keyboard navigation and layout locking
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };

    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

  const filteredItems = useMemo(() => {
    return items.filter(item => activeFilter === 'All' || item.category === activeFilter);
  }, [items, activeFilter]);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80'; // Reliable fallback asset
  };

  // Logic to handle conversion from Gallery view to Shop action
  const handleActionClick = (item) => {
    setSelectedImage(null);
    if (item.isCustomRequest || item.category === 'Stitching') {
      // Direct them to booking custom embroidery requests
      navigate('/custom-orders', { state: { preSelectedCategory: item.category, designName: item.title } });
    } else if (item._id) {
      // Direct them to the shopping catalog page
      navigate(`/product/${item._id}`);
    } else {
      // Fallback redirect for general shop
      navigate('/shop');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col text-slate-100 selection:bg-yellow-500/30 antialiased">
      
      {/* Luxury Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05),transparent_70%)] pointer-events-none" />
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-amber-500/10 to-transparent blur-[140px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md text-amber-400 text-xs md:text-sm font-semibold tracking-widest uppercase mb-6"
          >
            <Camera className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Exquisite Collections</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1]"
          >
            A Tapestry of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-200 font-serif italic">Artistry</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Explore our curated gallery showcasing the intricate details, golden threads, and timeless beauty of our custom embroidery, luxury stitching, and rolled gold ornaments.
          </motion.p>
        </div>
      </section>

      {/* Navigational Filter Controls */}
      <nav aria-label="Gallery category filters" className="container mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-slate-400" aria-hidden="true">
            <Filter className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-xs uppercase tracking-widest">Filter Portfolio:</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {dynamicCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 ${
                  activeFilter === cat 
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-[#0B0C10] shadow-[0_4px_20px_rgba(212,175,55,0.25)] scale-105 border-transparent' 
                    : 'bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Gallery Main Workspace */}
      <section className="flex-grow container mx-auto px-6 pb-32">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[4/5] bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl p-8 max-w-md mx-auto"
          >
            <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No masterpieces found</h3>
            <p className="text-slate-400 text-sm">We couldn't find items matching the "{activeFilter}" filter selection.</p>
          </motion.div>
        ) : (
          <LayoutGroup id='gallery-grid'>
            <motion.div 
              layout={!isMobile}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => {
                  const imageUrl = getImageUrl(item.image, item.img);

                  return (
                    <motion.div
                      layout={!isMobile}
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white/[0.01] border border-white/10 hover:border-amber-400/40 transition-all duration-300 shadow-2xl cursor-zoom-in aspect-[4/5]"
                      onClick={() => setSelectedImage(item)}
                    >
                      <div className="relative w-full h-full overflow-hidden isolate">
                        {imageUrl ? (
                          <>
                            <img 
                              src={imageUrl} 
                              alt={item.title} 
                              onError={handleImageError}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300 z-10" />
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-white/[0.02] text-slate-500">
                            <ImageIcon className="w-12 h-12 mb-2" />
                            <span className="text-xs">Image missing</span>
                          </div>
                        )}

                        {/* Interactive View Indicator */}
                        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="p-2.5 rounded-full bg-[#0B0C10]/80 backdrop-blur-md border border-white/10 text-amber-400">
                            <Eye className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Details overlay */}
                        <div className="absolute bottom-0 inset-x-0 p-6 z-20 flex flex-col justify-end">
                          <span className="text-[10px] font-semibold tracking-widest text-amber-400 uppercase mb-2">
                            {item.category}
                          </span>
                          <h3 className="text-lg md:text-xl font-bold text-white tracking-tight line-clamp-1 group-hover:text-amber-300 transition-colors duration-200">
                            {item.title}
                          </h3>
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

      {/* Lightbox Modal with Action buttons */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-3 z-50">
              <button 
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white transition-all focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-4xl flex flex-col md:flex-row gap-6 bg-[#12131C] border border-white/10 rounded-3xl p-4 md:p-6 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Frame */}
              <div className="flex-1 overflow-hidden rounded-2xl bg-black/40 flex items-center justify-center max-h-[50vh] md:max-h-[60vh]">
                <img 
                  src={getImageUrl(selectedImage.image, selectedImage.img)} 
                  alt={selectedImage.title}
                  onError={handleImageError}
                  className="w-full h-full max-h-[50vh] md:max-h-[60vh] object-contain"
                />
              </div>

              {/* Dynamic Purchase/Inquiry Details Area */}
              <div className="w-full md:w-[350px] flex flex-col justify-between py-2">
                <div>
                  <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
                    {selectedImage.category}
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-white mt-1 mb-3 tracking-tight">
                    {selectedImage.title}
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
                    {selectedImage.description}
                  </p>
                </div>

                <div className="mt-auto space-y-3">
                  {selectedImage.price && (
                    <div className="text-2xl font-bold text-white mb-4">
                      ₹{selectedImage.price}
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleActionClick(selectedImage)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-[#0B0C10] font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-yellow-500/10 hover:scale-[1.02]"
                  >
                    {selectedImage.category === 'Stitching' || selectedImage.isCustomRequest ? (
                      <>
                        <span>Book Stitching Slot</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>View in Store</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="w-full py-3 text-slate-400 hover:text-white text-xs font-semibold tracking-wider uppercase transition-colors"
                  >
                    Back to Gallery
                  </button>
                </div>
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