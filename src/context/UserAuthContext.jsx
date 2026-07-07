import { createContext, useContext } from "react";
import { useUserProfile } from "../hook/auth/userAuth.js";

export const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const { data ,isLoading} = useUserProfile();


  const isUserAuthenticated = data?.success === true && !!data?.user;
  const user = data?.user || null;

  return (
    <UserAuthContext.Provider value={{ isUserAuthenticated, user,isLoading }}>
      {children}
    </UserAuthContext.Provider>
  );
};

