import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, delay = 0 }) => {
  const isPositive = trend === 'up';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-panel p-6 bg-black/30 border-white/5 relative overflow-hidden group"
    >
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        </div>
        <div className="p-3 bg-white/5 rounded-xl text-primary border border-white/10 group-hover:border-primary/50 transition-colors">
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm relative z-10 mt-4">
        <span className={`px-2 py-0.5 rounded-full ${
          isPositive ? 'bg-green-500/20 text-emerald-400' : 'bg-red-500/20 text-rose-400'
        } font-medium flex items-center gap-1`}>
          {isPositive ? '↑' : '↓'} {trendValue}
        </span>
        <span className="text-gray-500">vs last month</span>
      </div>
    </motion.div>
  );
};

export default StatCard;
