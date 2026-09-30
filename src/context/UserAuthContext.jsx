import { createContext } from "react";
import { useUserProfile } from "../hook/auth/userAuth.js";

export const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  console.log('userAuthContext function called')
  const { data: user, isLoading } = useUserProfile();
  const isUserAuthenticated = !!user;
  return (
    <UserAuthContext.Provider value={{ isUserAuthenticated, user, isLoading }}>
      {children}
    </UserAuthContext.Provider>
  );
};

