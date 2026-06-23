import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Scissors, LogIn, User, Settings, LogOut, LayoutDashboard, UserPlus } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useCart } from '../../context/CartContext';


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = true;
  const user = {
    name: 'soju saji',
    email: 'soju.saji@example.com'
  };

  const { cartCount, setIsCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    // Add your auth logout logic here
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  // Hide entirely on admin or full profile routes
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/profile-dashboard');
  if (isAdminRoute) return null;

  const navItems = ['Home', 'Shop', 'Custom Orders', 'Gallery'];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 inset-x-0 z-50 w-full transition-all duration-300 border-b py-4',
        scrolled
          ? 'bg-black/60 backdrop-blur-md border-white/10 shadow-lg'
          : 'bg-transparent border-transparent'
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
            {navItems.map((item) => {
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
            {/* Cart Button */}
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

            {/* Desktop Profile Dropdown (Hidden on Mobile) */}
            <div className="relative hidden md:block" ref={profileRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={cn(
                  "p-2.5 rounded-xl transition-colors text-gray-400 hover:text-white hover:bg-white/5",
                  isProfileMenuOpen && "bg-white/5 text-white"
                )}
              >
                <User className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl p-2 shadow-2xl z-50"
                  >
                    {!isLoggedIn ? (
                      /* Desktop Guest Menu */
                      <div className="p-1 space-y-1">
                        <div className="px-3 py-2">
                          <p className="text-sm font-semibold text-white">Welcome!</p>
                          <p className="text-xs text-gray-400 mt-0.5">Sign in to manage custom orders.</p>
                        </div>
                        <Link
                          to="/login"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                        >
                          <LogIn className="w-4 h-4 text-primary" />
                          Sign In or Create Your Account
                        </Link>
                      </div>
                    ) : (
                      /* Desktop Authenticated Menu */
                      <div className="p-1 space-y-0.5">
                        <div className="px-3 py-2.5 border-b border-white/5 mb-1">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-primary" />
                          Dashboard
                        </Link>
                        <div className="pt-1 mt-1 border-t border-white/5">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle Button (Triggers slide down navigation drawer) */}
            <button
              className="md:hidden p-2.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Unified Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="absolute top-full left-0 right-0 w-full border-b border-white/10 bg-black/95 backdrop-blur-xl px-6 py-6 flex flex-col justify-between md:hidden max-h-[85vh]"
          >
            {/* 1. PRIMARY NAVIGATION LINKS */}
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white text-base font-medium transition-colors py-3 px-2 rounded-xl hover:bg-white/5"
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* 2. ACCOUNT ACTIONS (Pushed cleanly to the bottom) */}
            <div className="border-t border-white/5 mt-6 pt-4">
              {!isLoggedIn ? (
                /* Clean Mobile Guest Actions */
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-300 bg-white/5 rounded-xl border border-white/5"
                  >
                    <LogIn className="w-4 h-4 text-primary" />
                    Sign In or Create Your Account
                  </Link>
                </div>
              ) : (
                /* High-End Mobile Authenticated Layout */
                <div className="space-y-1">
                  {/* Minimalist Profile Row */}
                  <div className="flex items-center gap-3 px-2 py-2 mb-5 text-gray-400">
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center border border-white/15">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white truncate">{user.name}</span>
                  </div>

                  {/* Compact Quick Links */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-gray-400 bg-white/5 p-3 rounded-xl border border-white/5"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-primary" />
                      Dashboard
                    </Link>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 text-xs font-medium p-3 rounded-xl w-full mt-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;