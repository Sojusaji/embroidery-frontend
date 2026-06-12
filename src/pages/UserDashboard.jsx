import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Scissors, ShoppingBag, Ruler, MapPin,
  LogOut, Bell, ChevronRight, Compass, Shield,
  Sparkles, Clock, CheckCircle2, ArrowUpRight,
  Eye, RefreshCw, Smartphone, Laptop, KeyRound, Download, Menu, X
} from 'lucide-react';
import StitchingOrder from './StitchingOrder'; // Assuming this is your custom order form path

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [orderFilter, setOrderFilter] = useState('all');
  const [twoFactor, setTwoFactor] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Premium User Mock Data
  const userProfile = {
    name: "Alex Mathew",
    memberSince: "March 2026",
    avatar: null,
    measurements: [
      { label: "Chest", value: "40.5 in", updated: "2 weeks ago" },
      { label: "Shoulder width", value: "18.2 in", updated: "2 weeks ago" },
      { label: "Sleeve Length", value: "25.0 in", updated: "2 weeks ago" },
      { label: "Waist", value: "34.0 in", updated: "2 weeks ago" },
    ],
    activeOrders: [
      {
        id: "ORD-9982",
        item: "Premium Charcoal Wool Blazer",
        type: "Bespoke Tailoring",
        status: "In Production",
        progress: 65,
        estimatedDelivery: "June 28, 2026",
        timeline: [
          { step: "Design Approved", done: true },
          { step: "Fabric Laser Cutting", done: true },
          { step: "Hand Stitching Assembly", done: true },
          { step: "Final Fitting QC", done: false }
        ]
      }
    ],
    pastOrders: [
      {
        id: "ORD-8812",
        item: "Midnight Silk Sari Blouse",
        type: "Traditional Custom",
        status: "Completed",
        date: "April 14, 2026",
        price: "₹4,500"
      },
      {
        id: "ORD-7651",
        item: "Egyptian Cotton Crisp White Shirt",
        type: "Bespoke Tailoring",
        status: "Completed",
        date: "March 02, 2026",
        price: "₹3,200"
      }
    ],
    sessions: [
      { device: "Windows 11 PC • Chrome", location: "Kochi, India", status: "Active Now", current: true, icon: Laptop },
      { device: "iPhone 15 Pro • Safari", location: "Ernakulam, India", status: "Logged in 2 days ago", current: false, icon: Smartphone }
    ]
  };

  const sidebarLinks = [
    { id: 'overview', label: 'Overview Dashboard', icon: Compass },
    { id: 'measurements', label: 'My Saved Sizes', icon: Scissors },
    { id: 'custom-order', label: 'New Custom Order', icon: Sparkles },
    { id: 'orders', label: 'Order History', icon: ShoppingBag },
    { id: 'security', label: 'Account Security', icon: Shield },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileSidebarOpen(false); // Cleanly shut layout drawer on mobile viewports
  };

  return (
    <div className="relative h-screen w-screen bg-black text-white flex overflow-hidden">

      {/* 🌌 Background Light Ambience Blooms */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-dark/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/assets/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* 🎛️ RESPONSIVE SIDEBAR NAVIGATION (Desktop Fixed Left Bar & Mobile Animated Drawer Overlay) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-black/95 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col justify-between transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:bg-white/[0.01]
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-4 h-4 text-white fill-white/20" />
              </div>
              <span className="text-base font-bold uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Bespoke Studio
              </span>
            </div>
            
            {/* Collapse Close Button UI for Mobile Screen views */}
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Badge Identification Panel */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary">
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide truncate max-w-[150px]">{userProfile.name}</h4>
              <p className="text-xs text-gray-400">Premium Client</p>
            </div>
          </div>

          {/* Nav Map Iteration Links */}
          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleTabChange(link.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${isActive
                    ? 'bg-primary text-white font-semibold shadow-lg shadow-primary/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/5 hover:text-red-300 transition-all cursor-pointer">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </aside>

      {/* Dynamic Drawer Backdrop Shading Layer for Mobile view toggles */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 💻 MAIN VIEWPORT AREA INNER WRAPPER CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10 h-screen">

        {/* Sticky Dashboard Section Header Bar */}
        <header className="h-20 border-b border-white/10 px-4 sm:px-6 lg:px-10 flex items-center justify-between bg-black/20 backdrop-blur-md sticky top-0 z-20 w-full">
          <div className="flex items-center gap-3 lg:hidden">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Open Sidebar Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">B</div>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Studio</span>
            </div>
          </div>
          
          <h2 className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 capitalize hidden lg:block">
            {activeTab === 'overview' ? 'Your Dashboard' : activeTab === 'measurements' ? 'My Measurements' : activeTab.replace('-', ' ')}
          </h2>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors relative cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary ring-4 ring-black" />
            </button>
          </div>
        </header>

        {/* Dynamic Inner Active Panel Views Workspace */}
        <div className="p-4 sm:p-6 lg:p-10 max-w-5xl w-full mx-auto flex-1 pb-24">
          <AnimatePresence mode="wait">

            {/* TAB: OVERVIEW VIEW */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="relative rounded-3xl overflow-hidden glass-panel bg-gradient-to-br from-white/5 to-white/[0.01] border-white/15 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                      Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-dark">{userProfile.name.split(' ')[0]}</span>
                    </h1>
                    <p className="text-sm text-gray-300">Your measurements and active custom orders are up to date.</p>
                  </div>
                  <div className="text-xs text-gray-400 font-medium px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full">
                    Client Tier: Premium Member
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" /> Active Stitching Order
                    </h3>

                    {userProfile.activeOrders.map((order) => (
                      <div key={order.id} className="rounded-2xl glass-panel bg-white/5 border-white/15 p-6 space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-semibold text-primary px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                              {order.type}
                            </span>
                            <h4 className="text-lg font-bold mt-2 text-white">{order.item}</h4>
                            <p className="text-xs text-gray-400 mt-1">Order ID: {order.id} • Est. Delivery: {order.estimatedDelivery}</p>
                          </div>
                          <span className="text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20 animate-pulse">
                            {order.status}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-medium text-gray-400">
                            <span>Order Progress</span>
                            <span className="font-mono text-white">{order.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/10">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${order.progress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                          {order.timeline.map((step, idx) => (
                            <div key={idx} className="space-y-2">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className={`w-4 h-4 ${step.done ? 'text-primary' : 'text-gray-500'}`} />
                                <span className={`text-xs font-semibold ${step.done ? 'text-gray-200' : 'text-gray-400'}`}>
                                  Stage 0{idx + 1}
                                </span>
                              </div>
                              <p className={`text-[11px] font-medium leading-tight ${step.done ? 'text-gray-400' : 'text-gray-500'}`}>
                                {step.step}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-primary" /> Current Fit Profile
                    </h3>

                    <div className="rounded-2xl glass-panel bg-white/[0.02] border-white/10 p-6 space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Scissors className="w-24 h-24 text-white" />
                      </div>

                      <div className="flex justify-between items-center pb-2 border-b border-white/10">
                        <span className="text-xs font-bold text-gray-400">Master Size Guide</span>
                        <button
                          onClick={() => setActiveTab('measurements')}
                          className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          View All <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {userProfile.measurements.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 px-3 rounded-xl bg-white/[0.02] border border-white/10">
                            <span className="text-xs text-gray-400 font-medium">{item.label}</span>
                            <span className="text-sm font-bold text-white font-mono">{item.value}</span>
                          </div>
                        ))}
                      </div>

                      <p className="text-[10px] text-gray-400 text-center pt-2">
                        Last verified during your fitting session.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: MEASUREMENTS WORKSPACE */}
            {activeTab === 'measurements' && (
              <motion.div
                key="measurements"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Your Custom Measurement Profile</h2>
                  <p className="text-sm text-gray-300 mt-1">These are your saved sizes. We use these exact numbers to cut and stitch your garments for a perfect fit.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {userProfile.measurements.map((item, index) => (
                    <div key={index} className="p-5 rounded-2xl glass-panel bg-white/5 border-white/15 space-y-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">{item.label}</span>
                      <span className="text-2xl font-extrabold text-primary font-mono block">{item.value}</span>
                      <span className="text-[10px] text-gray-400 block pt-2 border-t border-white/10">Updated {item.updated}</span>
                    </div>
                  ))}
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex gap-4 items-start">
                  <Ruler className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-3 flex-1">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">Ready to design something new?</h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        Use your saved measurements to request a new premium garment handcrafted by our master designers.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => setActiveTab('custom-order')}
                        className="text-xs font-semibold bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/10 cursor-pointer"
                      >
                        Start New Custom Order
                      </button>
                      <button
                        className="text-xs font-semibold bg-white/[0.03] text-gray-300 border border-white/10 px-4 py-2 rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
                      >
                        Message Designer
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: NEW CUSTOM ORDER FORM CONTAINER */}
            {activeTab === 'custom-order' && (
              <motion.div
                key="custom-order"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <StitchingOrder initialMeasurements={userProfile.measurements} />
              </motion.div>
            )}

            {/* TAB: ORDER HISTORY */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Your Collections</h2>
                    <p className="text-sm text-gray-400 mt-1">Review your past orders and active bespoke creations.</p>
                  </div>

                  <div className="flex gap-1 p-1 bg-white/[0.02] border border-white/5 rounded-xl">
                    {['all', 'active', 'completed'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setOrderFilter(filter)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${orderFilter === filter ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                          }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {(orderFilter === 'all' || orderFilter === 'active') &&
                    userProfile.activeOrders.map((order) => (
                      <div key={order.id} className="p-5 rounded-2xl glass-panel bg-white/[0.02] border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">{order.item}</h4>
                              <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">In Progress</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">Order ID: {order.id} • Est. Delivery: {order.estimatedDelivery}</p>
                          </div>
                        </div>
                        <button onClick={() => setActiveTab('overview')} className="text-xs font-semibold bg-white/5 text-gray-300 px-4 py-2 rounded-xl hover:bg-white/10 transition-all border border-white/10 flex items-center gap-1 self-start md:self-auto cursor-pointer">
                          Track Progress <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  }

                  {(orderFilter === 'all' || orderFilter === 'completed') &&
                    userProfile.pastOrders.map((order) => (
                      <div key={order.id} className="p-5 rounded-2xl glass-panel bg-white/[0.01] border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">{order.item}</h4>
                              <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">Delivered</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">Order ID: {order.id} • Completed on {order.date} • <span className="font-mono text-gray-300">{order.price}</span></p>
                          </div>
                        </div>
                        <button className="text-xs font-semibold bg-white/[0.02] text-gray-400 px-4 py-2 rounded-xl hover:bg-white/5 hover:text-white transition-all border border-white/10 flex items-center gap-2 self-start md:self-auto cursor-pointer">
                          <Download className="w-3 h-3" /> Invoice
                        </button>
                      </div>
                    ))
                  }
                </div>
              </motion.div>
            )}

            {/* TAB: ACCOUNT SECURITY */}
            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Security Settings</h2>
                  <p className="text-sm text-gray-400 mt-1">Manage your secure sign-in status, logged-in devices, and security layers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl glass-panel bg-white/[0.02] border-white/10 space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-300 flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-primary" /> Identity Verification
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Your account is linked securely via your master sign-in provider. A traditional system password is not required.
                      </p>

                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs text-primary">G</div>
                          <div>
                            <h4 className="text-xs font-bold text-white">Google Account</h4>
                            <p className="text-[10px] text-gray-500 mt-0.5">Primary login email linked safely</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                          Connected
                        </span>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl glass-panel bg-white/[0.02] border-white/10 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-primary" /> Two-Factor Authentication (2FA)
                        </h4>
                        <p className="text-xs text-gray-400 leading-relaxed">Require a mobile confirmation step to update your addresses or design orders.</p>
                      </div>
                      <button
                        onClick={() => setTwoFactor(!twoFactor)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer flex-shrink-0 ${twoFactor ? 'bg-primary' : 'bg-white/10'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${twoFactor ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 px-1">
                      <Laptop className="w-4 h-4 text-primary" /> Where You're Logged In
                    </h3>

                    <div className="space-y-3">
                      {userProfile.sessions.map((session, index) => {
                        const DeviceIcon = session.icon;
                        return (
                          <div key={index} className="p-4 rounded-2xl bg-white/[0.01] border border-white/10 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                                <DeviceIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white">{session.device}</h4>
                                <p className="text-[11px] text-gray-400 mt-0.5">{session.location} • <span className={session.current ? 'text-primary font-medium' : ''}>{session.status}</span></p>
                              </div>
                            </div>
                            {!session.current && (
                              <button className="text-[10px] font-bold text-red-400 hover:underline cursor-pointer">
                                Log Out
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}