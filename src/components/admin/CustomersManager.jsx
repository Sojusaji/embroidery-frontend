import React, { useState } from 'react';
import { Search, Mail, MapPin } from 'lucide-react';

const mockCustomersDb = [
  { id: 'CUST-01', name: 'Alina Starkov', email: 'alina@example.com', place: 'Ketterdam', totalSpent: 4500, orders: 12, joined: '2025-01-15' },
  { id: 'CUST-02', name: 'Kaz Brekker', email: 'kaz@example.com', place: 'Ravka', totalSpent: 3200, orders: 8, joined: '2025-02-10' },
  { id: 'CUST-03', name: 'Inej Ghafa', email: 'inej@example.com', place: 'Ketterdam', totalSpent: 1800, orders: 5, joined: '2025-03-22' },
  { id: 'CUST-04', name: 'Jesper Fahey', email: 'jesper@example.com', place: 'Fjerda', totalSpent: 120, orders: 2, joined: '2025-06-05' },
  { id: 'CUST-05', name: 'Nina Zenik', email: 'nina@example.com', place: 'Ravka', totalSpent: 890, orders: 3, joined: '2025-08-11' },
];

const CustomersManager = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = mockCustomersDb.filter(
    c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         c.place.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">Customer Directory</h1>
          <p className="text-gray-400 mt-2">Manage customer relationships and view order histories.</p>
        </div>
        
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search name or place..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="glass-panel p-6 bg-black/30 border-white/5 hover:border-primary/30 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xl font-bold">
                {customer.name.charAt(0)}
              </div>
              <span className="text-xs text-gray-500">Joined {customer.joined}</span>
            </div>
            
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{customer.name}</h3>
            
            <div className="space-y-2 mt-4 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{customer.place}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 flex justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Orders</p>
                <p className="text-white font-medium">{customer.orders}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Lifetime Value</p>
                <p className="text-emerald-400 font-medium">${customer.totalSpent}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 text-gray-500 glass-panel bg-black/20 border-white/5">
          No customers found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default CustomersManager;
