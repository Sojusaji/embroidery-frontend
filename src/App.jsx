import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import AdminHeader from './components/admin/AdminHeader';
import Home from './pages/Home';
import Shop from './pages/Shop';
import StitchingOrder from './pages/StitchingOrder';
import Gallery from './pages/Gallery';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/cart/CartDrawer';
import { Navigate } from 'react-router-dom';
import { useAuth } from "./hook/useAuth";
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

const ProtectedAdminRoute = ({ children }) => {
  const { data: user, isLoading } = useAuth();
  console.log('user && isLoading', user, isLoading);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isAuthorized = user?.status === "success" ||
    (user?.role === 'admin' || user?.role === 'superAdmin');

  return isAuthorized ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white flex flex-col relative">
            <Navbar />
            <CartDrawer />
            <main className="flex-grow pt-20 pb-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/custom-orders" element={<StitchingOrder />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={
                  <ProtectedAdminRoute>
                    <ErrorBoundary>
                      <AdminHeader />
                      <AdminDashboard />
                    </ErrorBoundary>
                  </ProtectedAdminRoute>
                } />
              </Routes>
            </main>
            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                style: {
                  background: '#121212', // Clean premium glass background to match your design
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  fontSize: '14px'
                }
              }}
            />
          </div>
        </Router>
      </CartProvider>
    </ErrorBoundary>
    // </AdminAuthProvider>
  );
}


export default App;
