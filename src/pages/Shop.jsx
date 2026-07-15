import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/shared/ProductCard';
import Footer from '../components/layout/Footer';
import { DUMMY_PRODUCTS } from '../utils/dummyData';

const CATEGORIES = ['All', 'Embroidery', 'Stitching', 'Ornaments'];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const activeCategory = searchParams.get('category') || 'All';
  const urlSearchTerm = searchParams.get('search') || '';
  
  // Local fast state for responsive typing
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm);

  // Synchronize local input state if URL changes externally (e.g. browser back button)
  useEffect(() => {
    setSearchTerm(urlSearchTerm);
  }, [urlSearchTerm]);

  // Debounce search updates to the URL to prevent history bloat and render lag
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      
      if (searchTerm) {
        params.set('search', searchTerm);
      } else {
        params.delete('search');
      }
      
      // replace: true prevents flooding the browser history stack
      setSearchParams(params, { replace: true });
    }, 300); // 300ms sweet spot for human typing pause

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, setSearchParams]);

  // Quick category change does not need debouncing
  const handleCategoryChange = (category) => {
    const params = new URLSearchParams(searchParams);
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    setSearchParams(params, { replace: true });
  };

  const filteredProducts = useMemo(() => {
    return DUMMY_PRODUCTS.filter(product => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(urlSearchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, urlSearchTerm]);

  return (
    <div className="min-h-screen bg-background flex flex-col text-white selection:bg-primary/30">
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-7xl">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-white/5 gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 md:mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Shop Collection
            </h1>
            <p className="text-sm md:text-base text-gray-400">
              Discover premium handcrafted masterpieces.
            </p>
          </div>
          
          {/* Search Input (Accessible) */}
          <div className="relative w-full md:w-80 group">
            <label htmlFor="shop-search" className="sr-only">Search products</label>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none" />
            <input 
              id="shop-search"
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-11 pr-11 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                aria-label="Clear search query"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:text-white text-gray-400 transition-colors rounded-full hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Sticky Filter Bar */}
        <nav 
          aria-label="Product categories" 
          className="sticky top-[64px] md:top-[80px] z-30 bg-background/95 backdrop-blur-md py-3 mb-8 border-b border-white/5 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 overflow-x-auto scrollbar-none flex items-center justify-between gap-4"
        >
          <div className="flex gap-2.5 min-w-max pb-1">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                aria-current={activeCategory === category ? 'page' : undefined}
                className={`px-5 py-2 rounded-full text-xs md:text-sm transition-all duration-200 font-medium ${
                  activeCategory === category 
                    ? 'bg-primary text-white scale-[1.02] shadow-md shadow-primary/10' 
                    : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 font-medium uppercase tracking-wider" aria-hidden="true">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </div>
        </nav>

        {/* Results Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-20">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center" role="status">
              <p className="text-lg font-medium text-gray-300 mb-1">No matches found</p>
              <p className="text-sm text-gray-500 max-w-xs">
                We couldn't find any products matching "{searchTerm}". Try adjusting your query or category.
              </p>
              <button 
                onClick={() => { setSearchTerm(''); handleCategoryChange('All'); }}
                className="mt-6 text-xs bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
