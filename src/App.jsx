import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import StitchingOrder from './pages/StitchingOrder';
import AdminDashboard from './pages/AdminDashboard';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/cart/CartDrawer';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white flex flex-col relative">
          <Navbar />
          <CartDrawer />
          <main className="flex-grow pt-20 pb-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/custom-orders" element={<StitchingOrder />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
