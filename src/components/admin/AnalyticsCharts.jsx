import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';

// --- MOCK DATABASE ---
const mockOrders = [
  { id: 'O1', customer: 'Alina Starkov', place: 'Ketterdam', items: [{ name: 'Floral Embroidery A', type: 'Embroidery', qty: 5 }, { name: 'Gold Hoop Earrings', type: 'Earrings', qty: 2 }] },
  { id: 'O2', customer: 'Kaz Brekker', place: 'Ravka', items: [{ name: 'Stitched Kurti B', type: 'Stitching', qty: 10 }] },
  { id: 'O3', customer: 'Inej Ghafa', place: 'Ketterdam', items: [{ name: 'Rose Embroidery C', type: 'Embroidery', qty: 8 }] },
  { id: 'O4', customer: 'Jesper Fahey', place: 'Fjerda', items: [{ name: 'Silver Drop Earrings', type: 'Earrings', qty: 1 }] },
  { id: 'O5', customer: 'Nina Zenik', place: 'Ravka', items: [{ name: 'Floral Embroidery A', type: 'Embroidery', qty: 12 }] },
  { id: 'O6', customer: 'Matthias', place: 'Fjerda', items: [{ name: 'Stitched Gown A', type: 'Stitching', qty: 6 }] },
  { id: 'O7', customer: 'Genya Safin', place: 'Ravka', items: [{ name: 'Gold Hoop Earrings', type: 'Earrings', qty: 15 }] },
];

// --- DATA PROCESSING ---

// 1. Calculate specific product sales
const productSalesMap = {};
mockOrders.forEach(order => {
  order.items.forEach(item => {
    if (!productSalesMap[item.name]) {
      productSalesMap[item.name] = { name: item.name, category: item.type, count: 0 };
    }
    productSalesMap[item.name].count += item.qty;
  });
});
const specificProductData = Object.values(productSalesMap).sort((a, b) => b.count - a.count);

// 2. Calculate Area by Large Products
// Defined "Large Product Order" as an order containing at least 5 quantities of any single item
const LARGE_ORDER_THRESHOLD = 5;
const areaVolumeMap = {};

mockOrders.forEach(order => {
  const isLargeOrder = order.items.some(item => item.qty >= LARGE_ORDER_THRESHOLD);
  if (isLargeOrder) {
    if (!areaVolumeMap[order.place]) {
      areaVolumeMap[order.place] = { place: order.place, largeProductCount: 0 };
    }
    // Sum up the quantities of the items in this large order
    const totalItemsInOrder = order.items.reduce((sum, item) => sum + item.qty, 0);
    areaVolumeMap[order.place].largeProductCount += totalItemsInOrder;
  }
});
const areaData = Object.values(areaVolumeMap).sort((a, b) => b.largeProductCount - a.largeProductCount);

// 3. Sales Area Data
const salesData = [
  { month: 'Jan', sales: 4000, profit: 2400 },
  { month: 'Feb', sales: 3000, profit: 1398 },
  { month: 'Mar', sales: 5000, profit: 3800 },
  { month: 'Apr', sales: 2780, profit: 1908 },
  { month: 'May', sales: 6890, profit: 4800 },
  { month: 'Jun', sales: 8390, profit: 6800 },
];

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6']; // Emerald, Amber, Rose, Blue, Purple

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-white/10 p-3 rounded-lg shadow-xl">
        <p className="font-bold text-white mb-1">{label}</p>
        <p className="text-primary text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
          Count: {payload[0].value} units
        </p>
      </div>
    );
  }
  return null;
};

const AnalyticsCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-6">
      
      {/* 1. Large Volume Orders mapped to Location */}
      <div className="glass-panel p-6 bg-black/30 border-white/5 lg:col-span-1">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white">Large Volume Areas</h3>
          <p className="text-xs text-gray-400">Comparing places based on product counts from high-volume orders.</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={areaData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
              <XAxis dataKey="place" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
              <Bar dataKey="largeProductCount" fill="#10b981" radius={[4, 4, 0, 0]}>
                {areaData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Specific Item / Design Breakdown */}
      <div className="glass-panel p-6 bg-black/30 border-white/5 lg:col-span-1">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white">Specific Product Sales</h3>
          <p className="text-xs text-gray-400">Which specific designs/items are selling the most.</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={specificProductData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" horizontal={false} />
              <XAxis type="number" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 11 }} width={80} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
              <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]}>
                {specificProductData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.category === 'Embroidery' ? '#f59e0b' : entry.category === 'Earrings' ? '#10b981' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Original Revenue Trend */}
      <div className="glass-panel p-6 bg-black/30 border-white/5 lg:col-span-2">
        <h3 className="text-lg font-bold text-white mb-6">Revenue & Profit Trend</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="month" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="sales" stroke="#f59e0b" fillOpacity={1} fill="url(#colorSales)" />
              <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default AnalyticsCharts;
