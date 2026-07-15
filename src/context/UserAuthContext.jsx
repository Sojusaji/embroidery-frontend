import { createContext, useContext } from "react";
import { useUserProfile } from "../hook/auth/userAuth.js";

export const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const { data: user, isLoading } = useUserProfile();
  console.log('data from useUserProfile route:', user);

  const isUserAuthenticated = !!user;
  return (
    <UserAuthContext.Provider value={{ isUserAuthenticated, user, isLoading }}>
      {children}
    </UserAuthContext.Provider>
  );
};

