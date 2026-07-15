import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Menu, X, Scissors, LogIn, User,
  LogOut, LayoutDashboard, Home as HomeIcon,
  ShoppingBag, Compass, Paintbrush, Settings, HelpCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useCart } from '../../context/CartContext';
import { useUserAuth } from "../../hook/auth/useUserAuth";
import { useUserLogout } from "../../hook/auth/userAuth";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mutateAsync: logout } = useUserLogout();
  const { isUserAuthenticated: isLoggedIn, user } = useUserAuth();

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

  // Prevent background scrolling when full-screen drawer is active
  useEffect(() => {
    if (isMobileMenuOpen) {
      const timeout = setTimeout(() => {
        document.body.style.overflow = 'hidden';
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
      setIsMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/profile-dashboard');
  if (isAdminRoute) return null;

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Shop', path: '/shop', icon: ShoppingBag },
    { name: 'Custom Orders', path: '/custom-orders', icon: Compass },
    { name: 'Gallery', path: '/gallery', icon: Paintbrush }
  ];

  return (
    <>
      {/* 1. Main Floating Header Layer */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-0 inset-x-0 z-50 w-full border-b py-4 transition-all duration-300',
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
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "transition-colors relative py-2",
                      isActive ? "text-primary font-semibold" : "text-gray-400 hover:text-white"
                    )}
                  >
                    {item.name}
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

              {/* Desktop Profile Dropdown */}
              <div className="relative hidden md:block" ref={profileRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={cn(
                    "p-2.5 rounded-xl transition-colors text-gray-400 hover:text-white hover:bg-white/5",
                    isProfileMenuOpen && "bg-white/5 text-white"
                  )}
                >
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-white/10"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-64  rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl p-2 shadow-2xl z-50"
                    >
                      {!isLoggedIn ? (
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
                        <div className="p-1 space-y-0.5">
                          <div className="px-3 py-2.5 border-b border-white/5 mb-1">
                            <p className="text-xs text-gray-500">Signed in as</p>
                            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
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

              {/* Mobile Menu Toggle Button */}
              <button
                className="md:hidden p-2.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* 2. Isolated Full-Screen Mobile Drawer Layer (Moved outside <motion.header>) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
            style={{ willChange: 'transform' }}
            className="fixed inset-0 w-full h-full bg-[#030303]  z-[99] md:hidden flex flex-col justify-between overflow-y-auto"
          >
            {/* Top Container  with Edge-to-Edge Solid Background */}
            <div className="space-y-8 p-6 bg-[#030303]">

              {/* Logo & Close Action Row */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Scissors className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-white">Stitch&Art</span>
                </div>
                <button
                  className="p-2.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User/Auth Panels */}
              {/* bg-[#13161c] */}
              {isLoggedIn ? (
                <div className="w-full rounded-2xl bg-[#0a0a0a]
                border border-white/5 p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user?.name || "Profile"}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white/10"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-wide leading-tight">{user?.name}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase">PREMIUM MEMBER</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 rounded-full border border-white/20 hover:border-white text-xs font-semibold text-white tracking-wide bg-transparent transition-all"
                  >
                    Dashboard
                  </Link>
                </div>
              ) : (
                <div className="w-full rounded-2xl bg-[#0a0a0a] border border-white/5 p-5 flex flex-col gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Welcome to Stitch&Art</h3>
                    <p className="text-xs text-gray-400 mt-1">Sign in to check orders and utilize your custom dashboard tools.</p>
                  </div>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold tracking-wide text-black bg-primary rounded-xl"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In to Your Account
                  </Link>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 text-lg font-bold tracking-wide transition-all py-3.5 px-3 rounded-xl relative",
                        isActive ? "text-primary bg-transparent" : "text-gray-300 hover:text-white hover:bg-white/[0.02]"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-primary rounded-full" />
                      )}
                      <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-gray-400")} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions Footer Area */}
            <div className="border-t border-white/5 mt-8 pt-6 space-y-4 p-6 bg-[#030303]">
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 text-sm font-medium text-gray-400 hover:text-white px-3 py-2 rounded-xl hover:bg-white/[0.02]"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                Account Settings
              </Link>
              <Link
                to="/support"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 text-sm font-medium text-gray-400 hover:text-white px-3 py-2 rounded-xl hover:bg-white/[0.02]"
              >
                <HelpCircle className="w-4 h-4 text-gray-400" />
                Support Center
              </Link>

              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 text-primary hover:text-orange-400 text-base font-bold tracking-wide w-full px-3 pt-4 border-t border-white/5 transition-colors"
                >
                  <LogOut className="w-5 h-5 text-primary" />
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;