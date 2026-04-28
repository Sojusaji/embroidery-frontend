import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import ProductCard from '../components/shared/ProductCard';
import Footer from '../components/layout/Footer';
import heroImage from '../assets/images/hero.png';
import galleryImage from '../assets/images/gallery.png';
import jhumka from '../assets/images/jhumka.png';
import studs from '../assets/images/studs.png';
import dangles from '../assets/images/dangles.png';
import hoops from '../assets/images/hoops.png';

const DUMMY_PRODUCTS = [
  { id: 1, name: 'Golden Leaf Velvet', price: 120, image: heroImage, category: 'Embroidery' },
  { id: 2, name: 'Bespoke Tailored Suit', price: 350, image: galleryImage, category: 'Stitching' },
  { id: 3, name: 'Real Rolled Gold Jhumka Earrings Pair', price: 65, image: jhumka, category: 'Ornaments' },
  { id: 4, name: 'Premium Rolled Gold Stud Earrings Pair', price: 45, image: studs, category: 'Ornaments' },
  { id: 5, name: 'Silver Thread Gown', price: 420, image: galleryImage, category: 'Stitching' },
  { id: 6, name: 'Floral Cotton Dress', price: 95, image: galleryImage, category: 'Embroidery' },
  { id: 7, name: 'Real Rolled Gold Dangle Earrings Pair', price: 55, image: dangles, category: 'Ornaments' },
  { id: 8, name: 'Antique Rolled Gold Hoops Pair', price: 75, image: hoops, category: 'Ornaments' },
  { id: 9, name: 'Emerald Crystal Earring Pair', price: 85, image: jhumka, category: 'Ornaments' },
  { id: 10, name: 'Pearl Drop Rolled Gold Pair', price: 90, image: dangles, category: 'Ornaments' },
];

const CATEGORIES = ['All', 'Embroidery', 'Stitching', 'Ornaments'];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  
  const activeCategory = searchParams.get('category') || 'All';

  const setActiveCategory = (category) => {
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    return DUMMY_PRODUCTS.filter(product => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 container mx-auto px-4 md:px-6 py-12 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/5 pb-8 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Shop Collection</h1>
            <p className="text-gray-400">Discover premium handcrafted masterpieces.</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search products (e.g. jhumka...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-11 pr-11 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:text-white text-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Bar - Sticky */}
        <div className="sticky top-[80px] z-30 bg-background/80 backdrop-blur-md py-4 mb-10 border-b border-white/5 -mx-4 px-4  overflow-x-auto
         hide-scrollbar">
          <div className="flex gap-4 min-w-max">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full transition-all font-medium ${
                  activeCategory === category 
                    ? 'bg-primary text-white scale-105 shadow-lg shadow-primary/20' 
                    : 'glass-panel bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-20">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
          {filteredProducts.length === 0 && (
            <p className="col-span-full text-center text-gray-400 py-12">No products found in this category.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Shop;
