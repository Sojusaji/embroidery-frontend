import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
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
import { useAdminAuth } from "./hook/auth/useAdminAuth";
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import UserDashboard from './pages/UserDashboard';
import ProductDetail from './pages/ProductDetail';
import { UserAuthProvider, } from "./context/UserAuthContext";
import { useUserAuth } from "./hook/auth/useUserAuth";


const PublicRoute = ({ children }) => {
  const { isUserAuthenticated } = useUserAuth();
 console.log('isUserAuthenticated:',isUserAuthenticated);
  return !isUserAuthenticated ? children : <Navigate to='/' replace />
}

const PrivateRoute = ({ children }) => {
  const { isUserAuthenticated, isLoading } = useUserAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return isUserAuthenticated ? children : <Navigate to="/login" replace />;
}



const ProtectedAdminRoute = ({ children }) => {
  const { data: user, isLoading } = useAdminAuth();
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
      <main className="flex-grow pt-15 [&:has(section,.login)]:pt-0 bg-transparent">
        {children}
      </main>
    </div>
  );
};



function App() {

  return (
    <ErrorBoundary>
      <UserAuthProvider>
        <CartProvider>
          <Router>
            <div className="w-full min-h-screen">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
                <Route path="/shop" element={<StorefrontLayout><Shop /></StorefrontLayout>} />
                <Route path="/product/:id" element={<StorefrontLayout><ProductDetail /></StorefrontLayout>} />
                <Route path="/gallery" element={<StorefrontLayout><Gallery /></StorefrontLayout>} />
                <Route path="/custom-orders" element={<StorefrontLayout><StitchingOrder /></StorefrontLayout>} />
                <Route path="/login" element={<StorefrontLayout>
                  <PublicRoute><Login /></PublicRoute></StorefrontLayout>} />


                {/* Protected user route */}
                <Route path="/profile" element={
                  <PrivateRoute>
                    <div className="w-full h-screen overflow-hidden selection:bg-primary selection:text-white">
                      <UserDashboard />
                    </div>
                  </PrivateRoute>
                } />

                {/* Admin routes */}
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
      </UserAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
