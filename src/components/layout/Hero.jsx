import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-neutral-950">
      
      {/* 🌌 Professional Background Light Ambience Blooms */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* Main Central Soft Backlight */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary/15 to-orange-500/5 rounded-full blur-[140px] opacity-80" />
        
        {/* Subtle Ambient Bottom Accent */}
        <div className="absolute bottom-[-10%] left-[10%] w-[450px] h-[450px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
        <div className="absolute bottom-[-20%] right-[5%] w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[130px] mix-blend-screen" />
        
        {/* Premium Noise Overlay */}
        <div className="absolute inset-0 bg-[url('/assets/noise.svg')] opacity-[0.025] mix-blend-overlay" />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="container relative z-10 px-4 mx-auto md:px-6 pt-22 pb-32"
      >
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-white/10 bg-white/5 mb-8 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-gray-300">Premium Bespoke Embroidery, Tailoring &amp; Rolled Gold Ornaments</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-6 leading-tight"
          >
            Threaded With <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
              Elegance & Care
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed"
          >
            Discover our handcrafted embroidery, bespoke tailored clothing, and exquisite rolled gold ornaments - available for retail and wholesale.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center"
          >
            <motion.div whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link
                to="/shop"
                className="flex items-center gap-2 justify-center px-8 py-4 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold transition-all hover:scale-105 shadow-lg shadow-primary/20"
              >
                Shop Collection
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link
                to="/custom-orders"
                className="flex items-center gap-2 justify-center px-8 py-4 rounded-full glass-panel border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all hover:scale-105 backdrop-blur-sm"
              >
                Request Custom Stitching
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-500 tracking-widest uppercase">Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border-2 border-gray-600 flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 bg-gray-400 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
