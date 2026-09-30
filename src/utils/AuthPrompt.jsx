import React, { useContext } from 'react';
import {  useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';
import { CartContext } from "../context/CartContext";

const AuthPrompt = ({
  title = "Authentication Required",
  message = "Please log in to access this page and view your protected content.",
  icon: Icon = ShieldAlert,
  isLoading = false
}) => {

  const { isCartOpen, setIsCartOpen } = useContext(CartContext);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-gray-400 font-medium tracking-wide">Verifying your session...</p>
        </div>
      </div>
    );
  }

  const handleLogin = () => {
    setIsCartOpen(false),
      navigate('/login');
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12 animate-fadeIn">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 text-center backdrop-blur-xl shadow-2xl relative overflow-hidden group">


        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/30 transition-all duration-500" />


        <div className="relative mx-auto w-16 h-16 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
          <Icon className="w-7 h-7 text-primary" />
          <div className="absolute -bottom-1 -right-1 bg-background border border-white/10 p-1 rounded-full">
            <Lock className="w-3.5 h-3.5 text-gray-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
          {title}
        </h2>
        <p className="text-sm text-gray-400 mb-8 leading-relaxed">
          {message}
        </p>


        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-full transition-all duration-200 shadow-lg shadow-primary/5 hover:scale-[1.02]"
            onClick={() => handleLogin()}
          >

            <span>Log In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthPrompt;