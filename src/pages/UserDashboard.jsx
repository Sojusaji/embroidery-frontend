// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import {
//   Compass, Shield, Sparkles, Clock, CheckCircle2,
//   ArrowUpRight, Smartphone, Laptop, KeyRound, Ruler,
//   Download, ShoppingCart, ShoppingBag, LogOut, ChevronRight,
//   Menu, X, User
// } from 'lucide-react';
// import StitchingOrder from './StitchingOrder';
// import { useCart } from '../context/CartContext';
// import { useUserAuth } from '../hook/auth/useUserAuth';
// import { useUserLogout } from '../hook/auth/userAuth';

// // ─── Reusable Design Primitives ──────────────────────────────────────────────

// const Badge = ({ color = 'amber', children }) => {
//   const styles = {
//     amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/5',
//     green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5',
//     blue: 'bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-sky-500/5',
//   };
//   return (
//     <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-sm ${styles[color] || styles.amber}`}>
//       {children}
//     </span>
//   );
// };

// const SectionHeading = ({ icon: Icon, children }) => (
//   <div className="flex items-center gap-2 mb-4">
//     {Icon && <Icon className="w-4 h-4 text-amber-400" aria-hidden="true" />}
//     <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">{children}</h2>
//   </div>
// );

// const Card = ({ children, className = '' }) => (
//   <div className={`bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl transition-all duration-300 hover:border-white/20 ${className}`}>
//     {children}
//   </div>
// );

// const MetricCard = ({ label, value, sub }) => (
//   <Card className="p-4 sm:p-5 flex flex-col justify-between group hover:bg-neutral-900/90 transition-colors">
//     <p className="text-[11px] sm:text-xs text-neutral-400 font-semibold uppercase tracking-wider">{label}</p>
//     <div className="my-2.5">
//       <p className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight group-hover:text-amber-400 transition-colors">{value}</p>
//     </div>
//     {sub && <p className="text-[11px] text-neutral-500 border-t border-white/5 pt-2">{sub}</p>}
//   </Card>
// );

// const TabPanel = ({ children }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 12 }}
//     animate={{ opacity: 1, y: 0 }}
//     exit={{ opacity: 0, y: -12 }}
//     transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
//     className="space-y-6"
//   >
//     {children}
//   </motion.div>
// );

// // ─── Sub Views ─────────────────────────────────────────────────────────────────

// const OverviewTab = ({ userProfile, goTo }) => {
//   const activeOrder = userProfile.activeOrders[0];

//   return (
//     <TabPanel>
//       <Card className="p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-neutral-900/95 via-neutral-900/70 to-neutral-950 border-white/10">
//         <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
//         <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div className="space-y-1">
//             <span className="text-[10px] sm:text-[11px] font-bold text-amber-400 uppercase tracking-widest">Dashboard Overview</span>
//             <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
//               Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-200">{userProfile.name}</span>
//             </h1>
//             <p className="text-xs sm:text-sm text-neutral-400">{userProfile.email}</p>
//           </div>
//           <div className="self-start sm:self-auto">
//             <Badge color="amber">{userProfile.tier}</Badge>
//           </div>
//         </div>
//       </Card>

//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//         <MetricCard label="Active Orders" value={userProfile.activeOrders.length} sub="In production" />
//         <MetricCard label="Past Orders" value={userProfile.pastOrders.length} sub="Delivered" />
//         <MetricCard label="Saved Sizes" value={userProfile.measurements.length} sub="Profile ready" />
//         <MetricCard label="Member Tier" value={userProfile.tier.split(' ')[0]} sub={`Since ${userProfile.memberSince}`} />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
//         <div className="lg:col-span-3">
//           <SectionHeading icon={Clock}>Active Order Tracker</SectionHeading>
//           {activeOrder ? (
//             <Card className="p-5 sm:p-6 space-y-6">
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
//                 <div>
//                   <Badge color="amber">{activeOrder.type}</Badge>
//                   <h3 className="text-base font-bold text-white mt-2.5">{activeOrder.item}</h3>
//                   <p className="text-xs text-neutral-400 mt-1">Order ID: <span className="font-mono text-neutral-300">{activeOrder.id}</span> &bull; Est. Delivery: {activeOrder.estimatedDelivery}</p>
//                 </div>
//                 <div className="self-start sm:self-auto">
//                   <Badge color="blue">{activeOrder.status}</Badge>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <div className="flex justify-between text-xs text-neutral-400 font-medium">
//                   <span>Tailoring Progress</span>
//                   <span className="text-white font-mono font-bold">{activeOrder.progress}%</span>
//                 </div>
//                 <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
//                   <motion.div
//                     initial={{ width: 0 }}
//                     animate={{ width: `${activeOrder.progress}%` }}
//                     transition={{ duration: 1, ease: 'easeOut' }}
//                     className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full shadow-lg shadow-amber-500/20"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
//                 {activeOrder.timeline.map((s, i) => (
//                   <div key={i} className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
//                     <div className="flex items-center gap-1.5">
//                       <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${s.done ? 'text-amber-400' : 'text-neutral-600'}`} />
//                       <span className={`text-[10px] uppercase font-black ${s.done ? 'text-neutral-300' : 'text-neutral-500'}`}>
//                         Step {i + 1}
//                       </span>
//                     </div>
//                     <p className={`text-xs ${s.done ? 'text-neutral-300 font-medium' : 'text-neutral-500'}`}>{s.step}</p>
//                   </div>
//                 ))}
//               </div>
//             </Card>
//           ) : (
//             <Card className="p-8 text-center space-y-3">
//               <p className="text-sm text-neutral-400">No active custom orders at the moment.</p>
//               <button onClick={() => goTo('custom-order')} className="text-xs text-amber-400 font-bold hover:underline inline-flex items-center gap-1">
//                 Start a new bespoke order &rarr;
//               </button>
//             </Card>
//           )}
//         </div>

//         <div className="lg:col-span-2">
//           <div className="flex items-center justify-between mb-4">
//             <SectionHeading icon={Ruler}>Saved Sizes</SectionHeading>
//             <button onClick={() => goTo('measurements')} className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold">
//               Manage <ArrowUpRight className="w-3.5 h-3.5" />
//             </button>
//           </div>
//           <Card className="divide-y divide-white/5 overflow-hidden">
//             {userProfile.measurements.map((m, i) => (
//               <div key={i} className="flex items-center justify-between p-4 text-xs sm:text-sm hover:bg-white/[0.02] transition-colors">
//                 <span className="text-neutral-400 font-medium">{m.label}</span>
//                 <span className="font-bold text-white font-mono bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">{m.value}</span>
//               </div>
//             ))}
//           </Card>
//         </div>
//       </div>
//     </TabPanel>
//   );
// };

// const MeasurementsTab = ({ userProfile, goTo }) => (
//   <TabPanel>
//     <div>
//       <h2 className="text-xl font-bold text-white tracking-tight">Fit Profile</h2>
//       <p className="text-xs sm:text-sm text-neutral-400 mt-1">Your exact tailor measurements for custom garments.</p>
//     </div>

//     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
//       {userProfile.measurements.map((m, i) => (
//         <MetricCard key={i} label={m.label} value={m.value} sub={`Updated ${m.updated}`} />
//       ))}
//     </div>

//     <Card className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-neutral-900/90 to-amber-500/10">
//       <div className="flex items-center gap-4">
//         <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-inner">
//           <Ruler className="w-6 h-6" />
//         </div>
//         <div>
//           <h3 className="text-sm font-bold text-white">Create new garment with saved sizes</h3>
//           <p className="text-xs text-neutral-400 mt-0.5">Use this fit profile directly for instant custom stitching.</p>
//         </div>
//       </div>
//       <button
//         onClick={() => goTo('custom-order')}
//         className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black rounded-xl transition-all shadow-lg shadow-amber-500/20 flex-shrink-0 active:scale-[0.98]"
//       >
//         New Custom Order
//       </button>
//     </Card>
//   </TabPanel>
// );

// const OrdersTab = ({ userProfile, goTo }) => {
//   const [filter, setFilter] = useState('all');

//   return (
//     <TabPanel>
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//         <div>
//           <h2 className="text-xl font-bold text-white tracking-tight">Orders & Stitching</h2>
//           <p className="text-xs sm:text-sm text-neutral-400 mt-1">History of past and active garments.</p>
//         </div>
//         <div className="flex gap-1 p-1 bg-neutral-900/80 border border-white/10 rounded-xl self-start sm:self-auto backdrop-blur-md">
//           {['all', 'active', 'completed'].map(f => (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
//                 filter === f ? 'bg-white/10 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
//               }`}
//             >
//               {f}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="space-y-3">
//         {(filter === 'all' || filter === 'active') && userProfile.activeOrders.map(o => (
//           <Card key={o.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20">
//             <div className="flex items-center gap-4">
//               <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
//                 <Clock className="w-5 h-5" />
//               </div>
//               <div>
//                 <div className="flex items-center gap-2.5 flex-wrap">
//                   <span className="text-sm font-bold text-white">{o.item}</span>
//                   <Badge color="amber">In Tailoring</Badge>
//                 </div>
//                 <p className="text-xs text-neutral-400 mt-1">ID: <span className="font-mono text-neutral-300">{o.id}</span> &bull; Estimated: {o.estimatedDelivery}</p>
//               </div>
//             </div>
//             <button
//               onClick={() => goTo('overview')}
//               className="text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-200 border border-white/10 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto active:scale-95"
//             >
//               Track Progress <ChevronRight className="w-3.5 h-3.5" />
//             </button>
//           </Card>
//         ))}

//         {(filter === 'all' || filter === 'completed') && userProfile.pastOrders.map(o => (
//           <Card key={o.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20">
//             <div className="flex items-center gap-4">
//               <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
//                 <CheckCircle2 className="w-5 h-5" />
//               </div>
//               <div>
//                 <div className="flex items-center gap-2.5 flex-wrap">
//                   <span className="text-sm font-bold text-white">{o.item}</span>
//                   <Badge color="green">Delivered</Badge>
//                 </div>
//                 <p className="text-xs text-neutral-400 mt-1">ID: <span className="font-mono text-neutral-300">{o.id}</span> &bull; Delivered {o.date} &bull; <span className="text-white font-mono font-bold">{o.price}</span></p>
//               </div>
//             </div>
//             <button className="text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto active:scale-95">
//               <Download className="w-3.5 h-3.5" /> Invoice
//             </button>
//           </Card>
//         ))}
//       </div>
//     </TabPanel>
//   );
// };

// const SecurityTab = ({ userProfile }) => (
//   <TabPanel>
//     <div>
//       <h2 className="text-xl font-bold text-white tracking-tight">Security & Access</h2>
//       <p className="text-xs sm:text-sm text-neutral-400 mt-1">Manage active sessions and security settings.</p>
//     </div>

//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       <Card className="p-6 space-y-4">
//         <SectionHeading icon={KeyRound}>Connected Identity</SectionHeading>
//         <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-xs font-bold text-amber-400 border border-white/10">G</div>
//             <div>
//               <p className="text-xs font-bold text-white">Google SSO</p>
//               <p className="text-[11px] text-neutral-400">{userProfile.email}</p>
//             </div>
//           </div>
//           <Badge color="green">Connected</Badge>
//         </div>
//       </Card>

//       <div className="space-y-4">
//         <SectionHeading icon={Laptop}>Active Sessions</SectionHeading>
//         {userProfile.sessions.map((s, i) => {
//           const DeviceIcon = s.Icon;
//           return (
//             <Card key={i} className="p-4 flex items-center justify-between gap-3">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 flex-shrink-0">
//                   <DeviceIcon className="w-4 h-4" />
//                 </div>
//                 <div>
//                   <p className="text-xs font-bold text-white">{s.device}</p>
//                   <p className="text-[11px] text-neutral-400">{s.location} &bull; <span className={s.current ? 'text-amber-400 font-semibold' : ''}>{s.status}</span></p>
//                 </div>
//               </div>
//             </Card>
//           );
//         })}
//       </div>
//     </div>
//   </TabPanel>
// );

// // ─── Main Dashboard ─────────────────────────────────────────────────────────────

// export default function UserDashboard() {
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const activeTab = searchParams.get('tab') || 'overview';
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const { cartCount, setIsCartOpen } = useCart();
//   const { user } = useUserAuth();
//   const { mutateAsync: logout } = useUserLogout();

//   const handleTabChange = (tabId) => {
//     setSearchParams({ tab: tabId });
//     setMobileMenuOpen(false);
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate('/');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   const profileData = {
//     name: user?.name || user?.email?.split('@')[0] || 'Member',
//     email: user?.email || 'user@example.com',
//     tier: user?.role === 'admin' ? 'Administrator' : 'Premium Member',
//     memberSince: 'March 2026',
//     measurements: [
//       { label: 'Chest', value: '40.5 in', updated: '2 weeks ago' },
//       { label: 'Shoulder Width', value: '18.2 in', updated: '2 weeks ago' },
//       { label: 'Sleeve Length', value: '25.0 in', updated: '2 weeks ago' },
//       { label: 'Waist', value: '34.0 in', updated: '2 weeks ago' },
//     ],
//     activeOrders: [
//       {
//         id: 'ORD-9982', item: 'Premium Charcoal Wool Blazer',
//         type: 'Bespoke Tailoring', status: 'In Production', progress: 65,
//         estimatedDelivery: 'June 28, 2026',
//         timeline: [
//           { step: 'Design Approved', done: true },
//           { step: 'Fabric Laser Cutting', done: true },
//           { step: 'Hand Stitching Assembly', done: true },
//           { step: 'Final Fitting QC', done: false },
//         ],
//       },
//     ],
//     pastOrders: [
//       { id: 'ORD-8812', item: 'Midnight Silk Sari Blouse', type: 'Traditional Custom', date: 'Apr 14, 2026', price: '₹4,500' },
//       { id: 'ORD-7651', item: 'Egyptian Cotton White Shirt', type: 'Bespoke Tailoring', date: 'Mar 2, 2026', price: '₹3,200' },
//     ],
//     sessions: [
//       { device: 'Windows 11 PC • Chrome', location: 'Kochi, India', status: 'Active Now', current: true, Icon: Laptop },
//       { device: 'iPhone 15 Pro • Safari', location: 'Ernakulam, India', status: 'Logged in 2 days ago', current: false, Icon: Smartphone },
//     ],
//   };

//   const primaryNavItems = [
//     { id: 'overview', label: 'Overview', Icon: Compass },
//     { id: 'custom-order', label: 'New Order', Icon: Sparkles },
//     { id: 'orders', label: 'Orders', Icon: ShoppingBag },
//     { id: 'measurements', label: 'Fit Profile', Icon: Ruler },
//   ];

//   const secondaryNavItems = [
//     { id: 'cart-trigger', label: 'Cart', Icon: ShoppingCart, isCart: true },
//     { id: 'security', label: 'Security', Icon: Shield },
//   ];

//   const allNavItems = [...primaryNavItems, ...secondaryNavItems];

//   const handleNavClick = (item) => {
//     if (item.isCart) {
//       setIsCartOpen(true);
//       setMobileMenuOpen(false);
//     } else {
//       handleTabChange(item.id);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full bg-black text-neutral-100 flex flex-col lg:flex-row pt-20 sm:pt-24 pb-20 lg:pb-12">

//       {/* ── Desktop Sidebar Navigation ──────────────────────────────────── */}
//       <aside className="hidden lg:flex w-64 xl:w-72 bg-neutral-950/90 backdrop-blur-2xl border-r border-white/10 flex-col justify-between fixed left-0 top-20 h-[calc(100vh-5rem)] z-20 pb-6">
//         <div className="p-6 space-y-6 overflow-y-auto">
//           {/* User Profile Summary */}
//           <div className="flex items-center gap-3 p-3.5 bg-neutral-900/80 border border-white/10 rounded-2xl shadow-md">
//             <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-extrabold text-amber-400 text-sm flex-shrink-0 shadow-inner">
//               {profileData.name.charAt(0).toUpperCase()}
//             </div>
//             <div className="min-w-0">
//               <p className="text-sm font-bold text-white truncate">{profileData.name}</p>
//               <p className="text-[11px] text-neutral-400 truncate">{profileData.email}</p>
//             </div>
//           </div>

//           {/* Navigation Links */}
//           <nav className="space-y-1.5" role="tablist">
//             {allNavItems.map(item => {
//               const isActive = !item.isCart && activeTab === item.id;
//               return (
//                 <button
//                   key={item.id}
//                   role="tab"
//                   aria-selected={isActive}
//                   onClick={() => handleNavClick(item)}
//                   className={`relative w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
//                     isActive
//                       ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
//                       : 'text-neutral-400 hover:text-white hover:bg-white/5'
//                   }`}
//                 >
//                   <div className="flex items-center gap-3 z-10">
//                     <item.Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-black' : 'text-neutral-400'}`} />
//                     <span>{item.label}</span>
//                   </div>
//                   {item.isCart && cartCount > 0 && (
//                     <span className="z-10 text-[10px] font-black bg-white text-black rounded-full px-2 py-0.5 min-w-[20px] text-center shadow-sm">
//                       {cartCount}
//                     </span>
//                   )}
//                 </button>
//               );
//             })}
//           </nav>
//         </div>

//         {/* Logout */}
//         <div className="px-6 pt-4 border-t border-white/10">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-neutral-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all active:scale-[0.98]"
//           >
//             <LogOut className="w-4 h-4" /> Sign Out
//           </button>
//         </div>
//       </aside>

//       {/* Desktop Sidebar Spacer */}
//       <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0" />

//       {/* ── Main Dashboard Content Area ──────────────────────────────── */}
//       <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 max-w-6xl mx-auto">
//         <AnimatePresence mode="wait">
//           {activeTab === 'overview' && <OverviewTab key="overview" userProfile={profileData} goTo={handleTabChange} />}
//           {activeTab === 'measurements' && <MeasurementsTab key="measurements" userProfile={profileData} goTo={handleTabChange} />}
//           {activeTab === 'custom-order' && (
//             <motion.div key="custom-order" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
//               <StitchingOrder initialMeasurements={profileData.measurements} />
//             </motion.div>
//           )}
//           {activeTab === 'orders' && <OrdersTab key="orders" userProfile={profileData} goTo={handleTabChange} />}
//           {activeTab === 'security' && <SecurityTab key="security" userProfile={profileData} />}
//         </AnimatePresence>
//       </main>

//       {/* ── Mobile Native Bottom Bar Nav ─────────────────────────────── */}
//       <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/90 backdrop-blur-2xl border-t border-white/10 px-3 py-2">
//         <div className="flex items-center justify-around">
//           {primaryNavItems.map(item => {
//             const isActive = activeTab === item.id;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => handleNavClick(item)}
//                 className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all ${
//                   isActive ? 'text-amber-400' : 'text-neutral-400 hover:text-neutral-200'
//                 }`}
//               >
//                 <item.Icon className="w-5 h-5" />
//                 <span className="text-[10px] font-semibold">{item.label}</span>
//               </button>
//             );
//           })}
//           <button
//             onClick={() => setMobileMenuOpen(true)}
//             className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all ${
//               mobileMenuOpen ? 'text-amber-400' : 'text-neutral-400 hover:text-neutral-200'
//             }`}
//           >
//             <Menu className="w-5 h-5" />
//             <span className="text-[10px] font-semibold">More</span>
//           </button>
//         </div>
//       </div>

//       {/* ── Mobile Bottom Drawer Sheet ───────────────────────────────── */}
//       <AnimatePresence>
//         {mobileMenuOpen && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setMobileMenuOpen(false)}
//               className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
//             />
//             <motion.div
//               initial={{ y: '100%' }}
//               animate={{ y: 0 }}
//               exit={{ y: '100%' }}
//               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
//               className="lg:hidden fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-white/10 rounded-t-3xl p-6 z-50 space-y-4"
//             >
//               <div className="flex items-center justify-between border-b border-white/10 pb-4">
//                 <div className="flex items-center gap-3">
//                   <User className="w-5 h-5 text-amber-400" />
//                   <span className="text-sm font-bold text-white">Menu Options</span>
//                 </div>
//                 <button
//                   onClick={() => setMobileMenuOpen(false)}
//                   className="p-1 rounded-full bg-white/5 text-neutral-400 hover:text-white"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="space-y-2">
//                 {secondaryNavItems.map(item => (
//                   <button
//                     key={item.id}
//                     onClick={() => handleNavClick(item)}
//                     className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/5 text-xs font-bold text-neutral-200 hover:bg-white/10 transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <item.Icon className="w-4 h-4 text-amber-400" />
//                       <span>{item.label}</span>
//                     </div>
//                     {item.isCart && cartCount > 0 && (
//                       <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
//                         {cartCount}
//                       </span>
//                     )}
//                   </button>
//                 ))}

//                 <button
//                   onClick={handleLogout}
//                   className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400 mt-4"
//                 >
//                   <LogOut className="w-4 h-4" /> Sign Out
//                 </button>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }




import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Compass, Shield, Sparkles, Clock, CheckCircle2,
  ArrowUpRight, Smartphone, Laptop, KeyRound, Ruler,
  Download, ShoppingCart, ShoppingBag, LogOut, ChevronRight,
  Menu, X, User, Copy, ExternalLink, RefreshCw, AlertCircle
} from 'lucide-react';
import StitchingOrder from './StitchingOrder';
import { useCart } from '../context/CartContext';
import { useUserAuth } from '../hook/auth/useUserAuth';
import { useUserLogout } from '../hook/auth/userAuth';

// ─── Constants & Static Config ────────────────────────────────────────────────

const PRIMARY_NAV_ITEMS = [
  { id: 'overview', label: 'Overview', Icon: Compass },
  { id: 'custom-order', label: 'New Order', Icon: Sparkles },
  { id: 'orders', label: 'Orders', Icon: ShoppingBag },
  { id: 'measurements', label: 'Fit Profile', Icon: Ruler },
];

const SECONDARY_NAV_ITEMS = [
  { id: 'cart-trigger', label: 'Cart', Icon: ShoppingCart, isCart: true },
  { id: 'security', label: 'Security', Icon: Shield },
];

const ALL_NAV_ITEMS = [...PRIMARY_NAV_ITEMS, ...SECONDARY_NAV_ITEMS];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// ─── Design Primitives ────────────────────────────────────────────────────────

const Badge = ({ color = 'amber', children }) => {
  const styles = {
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-amber-500/10',
    green: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-emerald-500/10',
    blue: 'bg-sky-500/15 text-sky-300 border-sky-500/30 shadow-sky-500/10',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30 shadow-purple-500/10',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border backdrop-blur-md transition-colors ${styles[color] || styles.amber}`}>
      {children}
    </span>
  );
};

const SectionHeading = ({ icon: Icon, children, color = "text-amber-400" }) => (
  <div className="flex items-center gap-2 mb-4">
    {Icon && <Icon className={`w-4 h-4 ${color}`} aria-hidden="true" />}
    <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">{children}</h2>
  </div>
);

const Card = ({ children, className = '', hover = true }) => (
  <div className={`bg-neutral-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl transition-all duration-300 ${hover ? 'hover:border-white/20 hover:shadow-2xl' : ''} ${className}`}>
    {children}
  </div>
);

const MetricCard = ({ label, value, sub, accentColor = "from-amber-500/10" }) => (
  <Card className="p-3.5 sm:p-5 flex flex-col justify-between relative overflow-hidden group hover:bg-neutral-900/90">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${accentColor} to-transparent rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`} />
    <p className="text-[11px] sm:text-xs text-neutral-400 font-bold uppercase tracking-wider z-10">{label}</p>
    <div className="my-2 z-10">
      <p className="text-2xl sm:text-3xl font-black text-white font-sans tracking-tight group-hover:text-amber-400 transition-colors">{value}</p>
    </div>
    {sub && <p className="text-[11px] text-neutral-400 border-t border-white/5 pt-2 z-10">{sub}</p>}
  </Card>
);

const TabPanel = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.18, ease: 'easeOut' }}
    className="space-y-6"
  >
    {children}
  </motion.div>
);

// ─── Sub Views ────────────────────────────────────────────────────────────────

const OverviewTab = ({ userProfile, goTo }) => {
  const activeOrder = userProfile?.activeOrders?.[0];

  return (
    <TabPanel>
      {/* Banner */}
      <Card hover={false} className="p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-amber-950/30 border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-[11px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Premium Tailoring Studio
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">{userProfile?.name || 'Member'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400">{userProfile?.email}</p>
          </div>
          <div className="self-start sm:self-auto">
            <Badge color="amber">{userProfile?.tier || 'Member'}</Badge>
          </div>
        </div>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <MetricCard label="Active Orders" value={userProfile?.activeOrders?.length || 0} sub="Currently tailored" accentColor="from-amber-500/20" />
        <MetricCard label="Past Orders" value={userProfile?.pastOrders?.length || 0} sub="Delivered to you" accentColor="from-emerald-500/20" />
        <MetricCard label="Saved Sizes" value={userProfile?.measurements?.length || 0} sub="Fit profile active" accentColor="from-purple-500/20" />
        <MetricCard label="Member Tier" value={(userProfile?.tier || 'Member').split(' ')[0]} sub={`Joined ${userProfile?.memberSince || ''}`} accentColor="from-sky-500/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Active Order Tracker */}
        <div className="lg:col-span-3 space-y-4">
          <SectionHeading icon={Clock}>Active Order Tracker</SectionHeading>
          {activeOrder ? (
            <Card className="p-5 sm:p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge color="amber">{activeOrder.type}</Badge>
                    <Badge color="blue">{activeOrder.status}</Badge>
                  </div>
                  <h3 className="text-base font-bold text-white mt-2.5">{activeOrder.item}</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    ID: <span className="font-mono text-neutral-200">{activeOrder.id}</span> &bull; Est. Delivery: <span className="text-amber-300 font-medium">{activeOrder.estimatedDelivery}</span>
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-400">Tailoring Progress</span>
                  <span className="text-amber-400 font-mono">{activeOrder.progress}%</span>
                </div>
                <div className="h-2.5 bg-neutral-800 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${activeOrder.progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full shadow-lg shadow-amber-500/30"
                  />
                </div>
              </div>

              {/* Timeline Stepper */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 pt-2">
                {activeOrder.timeline?.map((s, i) => (
                  <div key={i} className={`p-3 rounded-xl border transition-colors ${s.done ? 'bg-amber-500/10 border-amber-500/30' : 'bg-neutral-900/50 border-white/5 opacity-60'}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${s.done ? 'text-amber-400' : 'text-neutral-600'}`} />
                      <span className={`text-[10px] uppercase font-black tracking-wider ${s.done ? 'text-amber-300' : 'text-neutral-500'}`}>
                        Step 0{i + 1}
                      </span>
                    </div>
                    <p className={`text-xs ${s.done ? 'text-neutral-200 font-semibold' : 'text-neutral-500'}`}>{s.step}</p>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center space-y-3">
              <p className="text-sm text-neutral-400">No active custom orders at the moment.</p>
              <button onClick={() => goTo('custom-order')} className="text-xs text-amber-400 font-bold hover:underline inline-flex items-center gap-1">
                Start a new bespoke order &rarr;
              </button>
            </Card>
          )}
        </div>

        {/* Quick Sizes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <SectionHeading icon={Ruler}>Saved Sizes</SectionHeading>
            <button onClick={() => goTo('measurements')} className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold">
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <Card className="divide-y divide-white/5 overflow-hidden">
            {userProfile?.measurements?.map((m, i) => (
              <div key={i} className="flex items-center justify-between p-4 text-xs sm:text-sm hover:bg-white/[0.02] transition-colors">
                <span className="text-neutral-400 font-medium">{m.label}</span>
                <span className="font-bold text-amber-300 font-mono bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                  {m.value}
                </span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </TabPanel>
  );
};

const MeasurementsTab = ({ userProfile, goTo }) => (
  <TabPanel>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Fit Profile</h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">Your bespoke tailor measurement standards.</p>
      </div>
      <button
        onClick={() => goTo('custom-order')}
        className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5 self-start sm:self-auto active:scale-95"
      >
        <Sparkles className="w-3.5 h-3.5" /> Order With This Fit Profile
      </button>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {userProfile?.measurements?.map((m, i) => (
        <MetricCard key={i} label={m.label} value={m.value} sub={`Updated ${m.updated}`} accentColor="from-purple-500/10" />
      ))}
    </div>
  </TabPanel>
);

const OrdersTab = ({ userProfile, goTo }) => {
  const [filter, setFilter] = useState('all');

  const activeOrders = userProfile?.activeOrders || [];
  const pastOrders = userProfile?.pastOrders || [];

  const showActive = filter === 'all' || filter === 'active';
  const showCompleted = filter === 'all' || filter === 'completed';

  const hasOrders = (showActive && activeOrders.length > 0) || (showCompleted && pastOrders.length > 0);

  return (
    <TabPanel>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Orders & Stitching</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">History of past and active bespoke items.</p>
        </div>
        <div className="flex gap-1 p-1 bg-neutral-900 border border-white/10 rounded-xl self-start sm:self-auto">
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-amber-500 text-black shadow-md font-bold' : 'text-neutral-400 hover:text-white'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {showActive && activeOrders.map(o => (
          <Card key={o.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-amber-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white">{o.item}</span>
                  <Badge color="amber">In Production</Badge>
                </div>
                <p className="text-xs text-neutral-400 mt-1">ID: <span className="font-mono text-neutral-200">{o.id}</span> &bull; Est: {o.estimatedDelivery}</p>
              </div>
            </div>
            <button
              onClick={() => goTo('overview')}
              className="text-xs font-semibold bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-500/20 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto active:scale-95"
            >
              Track Order <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </Card>
        ))}

        {showCompleted && pastOrders.map(o => (
          <Card key={o.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white">{o.item}</span>
                  <Badge color="green">Delivered</Badge>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  ID: <span className="font-mono text-neutral-200">{o.id}</span> &bull; Delivered {o.date} &bull; <span className="text-amber-300 font-mono font-bold">{typeof o.price === 'number' ? formatCurrency(o.price) : o.price}</span>
                </p>
              </div>
            </div>
            <button className="text-xs font-semibold bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto active:scale-95">
              <Download className="w-3.5 h-3.5 text-neutral-400" /> Invoice
            </button>
          </Card>
        ))}

        {!hasOrders && (
          <Card className="p-8 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-neutral-500 mx-auto" />
            <p className="text-sm font-semibold text-neutral-300">No orders found</p>
            <p className="text-xs text-neutral-500">There are no orders matching your selected status filter.</p>
          </Card>
        )}
      </div>
    </TabPanel>
  );
};

const SecurityTab = ({ userProfile }) => (
  <TabPanel>
    <div>
      <h2 className="text-xl font-bold text-white tracking-tight">Security & Sessions</h2>
      <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">Manage authenticated devices and identity details.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 space-y-4">
        <SectionHeading icon={KeyRound}>Connected Identity</SectionHeading>
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xs font-extrabold text-amber-400 border border-white/10">G</div>
            <div>
              <p className="text-xs font-bold text-white">Google SSO Account</p>
              <p className="text-[11px] text-neutral-400">{userProfile?.email}</p>
            </div>
          </div>
          <Badge color="green">Active</Badge>
        </div>
      </Card>

      <div className="space-y-4">
        <SectionHeading icon={Laptop}>Active Devices</SectionHeading>
        {userProfile?.sessions?.map((s, i) => {
          const DeviceIcon = s.Icon;
          return (
            <Card key={i} className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 flex-shrink-0">
                  <DeviceIcon className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{s.device}</p>
                  <p className="text-[11px] text-neutral-400">{s.location} &bull; <span className={s.current ? 'text-amber-400 font-semibold' : ''}>{s.status}</span></p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  </TabPanel>
);

// ─── Main Component ────────────────────────────────────────────────────────────

export default function UserDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { cartCount, setIsCartOpen } = useCart();
  const { user } = useUserAuth();
  const { mutateAsync: logout } = useUserLogout();

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const profileData = useMemo(() => ({
    name: user?.name || user?.email?.split('@')[0] || 'Member',
    email: user?.email || 'user@example.com',
    tier: user?.role === 'admin' ? 'Administrator' : 'Premium Member',
    memberSince: 'March 2026',
    measurements: [
      { label: 'Chest', value: '40.5 in', updated: '2 weeks ago' },
      { label: 'Shoulder Width', value: '18.2 in', updated: '2 weeks ago' },
      { label: 'Sleeve Length', value: '25.0 in', updated: '2 weeks ago' },
      { label: 'Waist', value: '34.0 in', updated: '2 weeks ago' },
    ],
    activeOrders: [
      {
        id: 'ORD-9982', item: 'Premium Charcoal Wool Blazer',
        type: 'Bespoke Tailoring', status: 'In Production', progress: 65,
        estimatedDelivery: 'June 28, 2026',
        timeline: [
          { step: 'Design Approved', done: true },
          { step: 'Fabric Laser Cutting', done: true },
          { step: 'Hand Stitching Assembly', done: true },
          { step: 'Final Fitting QC', done: false },
        ],
      },
    ],
    pastOrders: [
      { id: 'ORD-8812', item: 'Midnight Silk Sari Blouse', type: 'Traditional Custom', date: 'Apr 14, 2026', price: 4500 },
      { id: 'ORD-7651', item: 'Egyptian Cotton White Shirt', type: 'Bespoke Tailoring', date: 'Mar 2, 2026', price: 3200 },
    ],
    sessions: [
      { device: 'Windows 11 PC • Chrome', location: 'Kochi, India', status: 'Active Now', current: true, Icon: Laptop },
      { device: 'iPhone 15 Pro • Safari', location: 'Ernakulam, India', status: 'Logged in 2 days ago', current: false, Icon: Smartphone },
    ],
  }), [user]);

  const handleNavClick = (item) => {
    if (item.isCart) {
      setIsCartOpen(true);
      setMobileMenuOpen(false);
    } else {
      handleTabChange(item.id);
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col lg:flex-row pt-20 sm:pt-24 pb-20 lg:pb-12">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 xl:w-72 bg-neutral-950/90 backdrop-blur-2xl border-r border-white/10 flex-col justify-between fixed left-0 top-20 h-[calc(100vh-5rem)] z-20 pb-6">
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="flex items-center gap-3 p-3.5 bg-neutral-900/80 border border-white/10 rounded-2xl shadow-md">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-extrabold text-amber-400 text-sm flex-shrink-0">
              {profileData.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{profileData.name}</p>
              <p className="text-[11px] text-neutral-400 truncate">{profileData.email}</p>
            </div>
          </div>

          <nav className="space-y-1.5" role="tablist">
            {ALL_NAV_ITEMS.map(item => {
              const isActive = !item.isCart && activeTab === item.id;
              return (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleNavClick(item)}
                  className={`relative w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${isActive
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <div className="flex items-center gap-3 z-10">
                    <item.Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-black' : 'text-neutral-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.isCart && cartCount > 0 && (
                    <span className="z-10 text-[10px] font-black bg-amber-400 text-black rounded-full px-2 py-0.5 min-w-[20px] text-center shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-6 pt-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-neutral-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Sidebar Spacer for Layout Stability */}
      <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0" />

      {/* Main Container */}
      <main className="flex-1 min-w-0 w-full px-2.5 sm:px-6 lg:px-10 max-w-6xl mx-auto pb-28 sm:pb-32 lg:pb-12">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && <OverviewTab key="overview" userProfile={profileData} goTo={handleTabChange} />}
          {activeTab === 'measurements' && <MeasurementsTab key="measurements" userProfile={profileData} goTo={handleTabChange} />}
          {activeTab === 'custom-order' && (
            <motion.div key="custom-order" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
              <StitchingOrder initialMeasurements={profileData.measurements} />
            </motion.div>
          )}
          {activeTab === 'orders' && <OrdersTab key="orders" userProfile={profileData} goTo={handleTabChange} />}
          {activeTab === 'security' && <SecurityTab key="security" userProfile={profileData} />}
        </AnimatePresence>
      </main>

      {/* Mobile Navigation Dock */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-neutral-950/90 backdrop-blur-2xl border-t border-white/10 px-3 py-2 pb-safe"> 
        <div className="flex items-center justify-around">
          {PRIMARY_NAV_ITEMS.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all ${isActive ? 'text-amber-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
              >
                <item.Icon className="w-5 h-5" />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all ${mobileMenuOpen ? 'text-amber-400' : 'text-neutral-400 hover:text-neutral-200'
              }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-semibold">More</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-white/10 rounded-t-3xl p-6 z-50 space-y-4 pb-8 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-bold text-white">Menu Options</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full bg-white/5 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {SECONDARY_NAV_ITEMS.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/5 text-xs font-bold text-neutral-200 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <item.Icon className="w-4 h-4 text-amber-400" />
                      <span>{item.label}</span>
                    </div>
                    {item.isCart && cartCount > 0 && (
                      <span className="bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </button>
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400 mt-4"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}