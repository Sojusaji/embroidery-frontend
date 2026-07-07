// hooks/useUserAuth.js
import { useContext } from "react";
import { UserAuthContext } from "../../context/UserAuthContext";

export const useUserAuth = () => {

  const context = useContext(UserAuthContext);
  return context;
};