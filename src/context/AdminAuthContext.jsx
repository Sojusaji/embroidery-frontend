// import React, { createContext, useState, useEffect, useContext } from 'react';

// const AdminAuthContext = createContext();

// export const useAdminAuth = () => useContext(AdminAuthContext);

// export const AdminAuthProvider = ({ children }) => {
//   const [admin, setAdmin] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const verifyToken = async () => {
//     try {
//       const res = await fetch('/api/admin/verify', {
//         headers: {
//           'Accept': 'application/json'
//         }
//       });
//       const data = await res.json();
//       if (res.ok && data.status === 'success') {
//         setAdmin(data.data);
//         setIsAuthenticated(true);
//       } else {
//         setAdmin(null);
//         setIsAuthenticated(false);
//       }
//     } catch (err) {
//       setAdmin(null);
//       setIsAuthenticated(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     verifyToken();
//   }, []);

//   const loginAdmin = async (gmail, password) => {
//     try {
//       const res = await fetch('/api/admin/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ gmail, password })
//       });
//       const data = await res.json();
      
//       if (res.ok && data.status === 'success') {
//         // After login, verify to get full profile
//         await verifyToken();
//         return { success: true };
//       } else {
//         return { success: false, message: data.message || 'Login failed' };
//       }
//     } catch (err) {
//       return { success: false, message: 'Server error' };
//     }
//   };

//   const logoutAdmin = () => {
//     // Note: Backend should have a logout route to clear cookies, but for now we just clear local state
//     // and let the next verify fail.
//     setAdmin(null);
//     setIsAuthenticated(false);
//     // Optionally call backend logout here
//   };

//   return (
//     <AdminAuthContext.Provider value={{ admin, isAuthenticated, loading, loginAdmin, logoutAdmin, refreshAdmin: verifyToken }}>
//       {children}
//     </AdminAuthContext.Provider>
//   );
// };

