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
import Login from './pages/Login';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/cart/CartDrawer';
import { Navigate } from 'react-router-dom';
import { useAuth } from "./hook/useAuth";
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import UserDashboard from './pages/UserDashboard';

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




const StorefrontLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative bg-background text-foreground selection:bg-primary selection:text-white">
      <Navbar />
      <CartDrawer />
      {/* className="flex-grow pt-20 pb-16" */}
      <main className="flex-grow pt-15 [&:has(section,.login)]:pt-0 bg-transparent">
        {children}
      </main>
    </div>
  );
};



function App() {


  return (
    <ErrorBoundary>
      <CartProvider>
        <Router>
          {/* <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white flex flex-col relative"> */}
          {/* <Navbar />
            <CartDrawer />
            <main className="flex-grow pt-20 pb-16"> */}
          <div className="w-full min-h-screen">
            <Routes>
              <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
              <Route path="/shop" element={<StorefrontLayout><Shop /></StorefrontLayout>} />
              <Route path="/gallery" element={<StorefrontLayout><Gallery /></StorefrontLayout>} />
              <Route path="/custom-orders" element={<StorefrontLayout><StitchingOrder /></StorefrontLayout>} />
              <Route path="/login" element={<StorefrontLayout><Login /></StorefrontLayout>} />

              <Route path="/profile" element={
                <div className="w-full h-screen overflow-hidden selection:bg-primary selection:text-white">
                  <UserDashboard />
                </div>
              } />

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
            {/* </main> */}
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
  );
}

export default App;
