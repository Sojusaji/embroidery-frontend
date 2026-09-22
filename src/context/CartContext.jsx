import { useContext, createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  return <CartContext.Provider value={{ isCartOpen, setIsCartOpen }}>
    {children}
  </CartContext.Provider>
}