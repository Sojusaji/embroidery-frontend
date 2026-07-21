import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, LogOut, Settings, ChevronDown, Scissors, ShieldAlert, ShoppingBag, UserPlus } from 'lucide-react';
import { useLocation } from 'react-router-dom';
// import {useAdminLogout } from '../../hook/auth/useAdminAuth';
import { useUserAuth } from '../../hook/auth/useUserAuth';
import { useUserLogout } from "../../hook/auth/userAuth"

const AdminHeader = () => {

  const location = useLocation();
  const { user: admin } = useUserAuth;
  const logoutMutation = useUserLogout();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dynamically push main content down when mobile search expands to prevent overlapping
  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (!mainEl) return;

    // Set the transition once on mount, never clear it mid-toggle
    mainEl.style.transition = 'padding-top 300ms ease-in-out';

    const updatePadding = () => {
      const isMobile = window.innerWidth < 768;
      mainEl.style.paddingTop = isMobile && isMobileSearchOpen ? '145px' : '80px';
    };

    updatePadding();
    window.addEventListener('resize', updatePadding);

    return () => {
      window.removeEventListener('resize', updatePadding);
    };
  }, [isMobileSearchOpen]);


  // Sample system notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Custom Order Inquiry #1084",
      desc: "Stitching request received from Sarah Jenkins.",
      time: "2m ago",
      icon: ShoppingBag,
      color: "text-primary bg-primary/10",
      unread: true
    },
    {
      id: 2,
      title: "Low Stock Alert: Rolled Gold Ring",
      desc: "Available inventory has dropped to 2 units.",
      time: "1h ago",
      icon: ShieldAlert,
      color: "text-red-400 bg-red-500/10",
      unread: true
    },
    {
      id: 3,
      title: "New Customer Account Created",
      desc: "Michael Brooks registered a new account.",
      time: "3h ago",
      icon: UserPlus,
      color: "text-blue-400 bg-blue-500/10",
      unread: true
    }
  ]);

  const isAdminDashboardRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  if (!isAdminDashboardRoute) return null;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="fixed top-0 inset-x-0 z-40 transition-all duration-300 py-4">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col mx-auto max-w-7xl glass-panel border-white/5 bg-black/40 shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between px-6 py-3 w-full">
            {/* Logo & Panel Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                <Scissors className="w-5 h-5 text-primary animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  Stitch&Art <span className="text-[10px] uppercase bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-semibold">Admin</span>
                </span>
              </div>
            </div>

            {/* Center: Search input (Desktop) */}
            <div className="flex-1 max-w-md mx-6 hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search system, orders, products..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-white/20"
                />
              </div>
            </div>

            {/* Right Section: Notifications and Profile */}
            <div className="flex items-center gap-4">

              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className={`p-2 text-gray-300 hover:text-white transition-all rounded-xl hover:bg-white/5 border md:hidden ${isMobileSearchOpen ? 'border-primary bg-primary/10 text-primary' : 'border-transparent'}`}
                aria-label="Toggle search bar"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications Menu */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className={`relative p-2 text-gray-300 hover:text-white transition-all rounded-xl hover:bg-white/5 border ${isNotificationsOpen ? 'border-primary bg-primary/10 text-primary' : 'border-transparent'}`}
                  aria-label="System notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full animate-ping" />
                  )}
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full" />
                  )}
                </button>

                {/* Notifications Dropdown Card */}
                {isNotificationsOpen && (
                  <div className="fixed inset-x-4 top-20 md:absolute md:inset-x-auto md:right-0 md:top-full md:mt-3 w-auto md:w-96 rounded-2xl bg-[#121212] border border-white/10 shadow-2xl p-5 animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                      <h3 className="font-bold text-white text-base">System Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-xs text-primary hover:text-primary-dark font-semibold transition-colors"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-gray-500 text-sm py-4 text-center">No new notifications</p>
                      ) : (
                        notifications.map((n) => {
                          const Icon = n.icon;
                          return (
                            <div
                              key={n.id}
                              className={`flex gap-3.5 p-3 rounded-xl transition-all duration-300 border ${n.unread ? 'bg-white/5 border-primary/20' : 'bg-transparent border-transparent'} hover:bg-white/10`}
                            >
                              <div className={`p-2.5 rounded-xl h-fit shrink-0 ${n.color}`}>
                                <Icon size={18} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-1">
                                  <h4 className={`text-sm font-bold text-white truncate ${n.unread ? 'text-primary' : ''}`}>
                                    {n.title}
                                  </h4>
                                  <span className="text-xs text-gray-400 shrink-0 font-medium mt-0.5">{n.time}</span>
                                </div>
                                <p className="text-xs text-gray-200 mt-1 line-clamp-2 leading-relaxed">{n.desc}</p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="border-t border-white/10 pt-3 mt-3 text-center">
                      <button className="text-xs text-gray-400 hover:text-white transition-colors w-full font-semibold py-1">
                        View all system logs
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all hover:bg-white/5 border ${isProfileOpen ? 'border-primary/30 bg-primary/5' : 'border-transparent'}`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary/20">
                    {admin?.username ? admin.username.substring(0, 2).toUpperCase() : 'AD'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-white leading-tight">{admin?.username || 'Admin'}</p>
                    <p className="text-[10px] text-primary font-medium tracking-wide uppercase mt-0.5">{admin?.role === 'superAdmin' ? 'Super Admin' : 'Admin'}</p>
                  </div>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-primary' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-[#121212] md:glass-panel md:bg-black/90 border border-white/10 shadow-2xl p-2 animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="px-3 py-2 border-b border-white/5 mb-1.5 lg:hidden">
                      <p className="text-xs font-bold text-white truncate">{admin?.username || 'Admin'}</p>
                      <p className="text-[10px] text-primary font-medium uppercase mt-0.5">{admin?.role === 'superAdmin' ? 'Super Admin' : 'Admin'}</p>
                    </div>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <User size={15} className="text-primary" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Settings size={15} className="text-primary" />
                      <span>System Settings</span>
                    </button>

                    <div className="border-t border-white/5 my-1.5" />

                    <button
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors font-semibold"
                    >
                      <LogOut size={15} />
                      <span>{logoutMutation.isPending ? 'Logging out...' : 'Sign Out'}</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Mobile Search Bar Expansion — pb lives INSIDE so overflow-hidden collapses it cleanly */}
          <div
            className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${isMobileSearchOpen
              ? 'max-h-[58px] opacity-100'
              : 'max-h-0 opacity-0 pointer-events-none'
              }`}
          >
            <div className="px-6 pb-4 relative">
              <div className="absolute inset-y-0 left-6 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search system, orders, products..."
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-white/20"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
