import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
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
import { Navigate, useLocation } from 'react-router-dom';
// import { useAdminAuth } from "./hook/auth/useAdminAuth";
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import UserDashboard from './pages/UserDashboard';
import ProductDetail from './pages/ProductDetail';
import { UserAuthProvider, } from "./context/UserAuthContext";
import { useUserAuth } from "./hook/auth/useUserAuth";
import {
  useGoogleLogin
} from "../src/hook/auth/userAuth";
import toast from 'react-hot-toast';

const PublicRoute = ({ children }) => {
  const location = useLocation();
  const { isUserAuthenticated, isLoading } = useUserAuth();
  console.log('isUserAuthenticated:', isUserAuthenticated);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (isUserAuthenticated) {
    const isAdmin = user?.role === 'admin' || user?.role === 'superAdmin';
    const destination = isAdmin ? '/admin' : (location.state?.from || '/');

    return <Navigate to={destination} replace />;
  }

  return children;
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
  console.log('protected route called');
  const { user, isLoading, isUserAuthenticated } = useUserAuth();

  console.log('Admin route check - User:', user, 'Loading:', isLoading);
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isUserAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin' && user?.role !== 'superAdmin') {
    return <Navigate to="/" replace />;
  }


  return children;
};




const StorefrontLayout = ({ children, noPadding = false }) => {
  return (
    <div className="min-h-screen flex flex-col relative bg-background text-foreground selection:bg-primary selection:text-white">
      <Navbar />
      <CartDrawer />
      <main className={`flex-grow bg-transparent ${noPadding ? '' : 'pt-15 [&:has(section,.login)]:pt-0'}`}>
        {children}
      </main>
    </div>
  );
};



function App() {
  const { mutateAsync: googleLogin } = useGoogleLogin()

  useEffect(() => {
    if (!window.__gisInitialized && window.google && window.google.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.prompt();
      window.__gisInitialized = true; // prevent duplicate init
    }
  }, []);



  const handleCredentialResponse = async (response) => {
    console.log('handleCredentialResponse function called ');
    try {
      const res = await googleLogin({ token: response.credential, });

      if (res.success) {
        console.log('response from server:', res);
      }
    } catch (error) {
      // If your server verification fails, handle it right here inside React!
      const errorMsg = error.response?.data?.message || "Google login failed.";
      toast.error('Google login failed. You can use another login method');
    }
  };

  const AdminLayout = ({ children }) => {
    return (
      // 1. Lock screen height and hide document-level overflow
      <div className="min-h-screen lg:h-screen w-full bg-background flex flex-col overflow-y-auto lg:overflow-hidden relative">
        <AdminHeader />

        {/* 2. Push content down below floating glass header (pt-20) */}
        {/* 3. min-h-0 forces child containers to observe height bounds instead of stretching */}
        <main className="flex-1 min-h-0 flex flex-col pt-20 overflow-hidden">
          {children}
        </main>
      </div>
    );
  };





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
                  <StorefrontLayout noPadding>
                    {/* <PrivateRoute> */}
                    <UserDashboard />
                    {/* </PrivateRoute> */}
                  </StorefrontLayout>
                } />

                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={
                  // <ProtectedAdminRoute>
                  <ErrorBoundary>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </ErrorBoundary>
                  // </ProtectedAdminRoute>
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
