import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Scissors } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/profile');

  if (isAdminRoute) return null;

  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 inset-x-0 z-50 w-full transition-all duration-300 border-b py-4',
        scrolled 
          ? 'bg-black/60 backdrop-blur-md border-white/10  shadow-lg' 
          : 'bg-transparent border-transparent '
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Scissors className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Stitch&Art</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {['Home', 'Shop', 'Custom Orders', 'Gallery'].map((item) => {
              const targetPath = item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`;
              const isActive = location.pathname === targetPath;
              return (
                <Link 
                  key={item} 
                  to={targetPath}
                  className={cn(
                    "transition-colors relative py-2",
                    isActive ? "text-primary font-semibold" : "text-gray-400 hover:text-white"
                  )}
                >
                  {item}
                  {isActive && (
                    <motion.span 
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Hub */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-primary text-[9px] font-black text-white flex items-center justify-center px-1 rounded-full"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* Mobile Menu Action Toggle Button */}
            <button 
              className="md:hidden p-2.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/5"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Smooth Mobile Dropdown Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 w-full border-b border-white/10 bg-black/95 backdrop-blur-xl px-6 py-4 flex flex-col gap-2 md:hidden"
          >
            {['Home', 'Shop', 'Custom Orders', 'Gallery'].map((item) => (
              <Link 
                key={item} 
                to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors p-3 rounded-xl hover:bg-white/5"
              >
                {item}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;