import React from 'react';

const mockCustomers = [
  { id: '1', name: 'Alina Starkov', email: 'alina@example.com', orders: 12, totalSpent: 4500, type: 'Large Orders' },
  { id: '2', name: 'Kaz Brekker', email: 'kaz@example.com', orders: 8, totalSpent: 3200, type: 'Large Orders' },
  { id: '3', name: 'Inej Ghafa', email: 'inej@example.com', orders: 5, totalSpent: 1800, type: 'Medium Orders' },
  { id: '4', name: 'Jesper Fahey', email: 'jes@example.com', orders: 2, totalSpent: 120, type: 'Small Orders' },
  { id: '5', name: 'Nina Zenik', email: 'nina@example.com', orders: 1, totalSpent: 45, type: 'Small Orders' },
];

const TopCustomersList = () => {
  return (
    <div className="glass-panel bg-black/30 border-white/5 overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white">Customer Insights</h3>
          <p className="text-sm text-gray-400 mt-1">Overview of customer spending behavior.</p>
        </div>
        <button className="text-primary text-sm hover:text-primary-light font-medium">View All</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-gray-400 text-sm">
              <th className="py-4 px-6 font-medium">Customer</th>
              <th className="py-4 px-6 font-medium">Total Orders</th>
              <th className="py-4 px-6 font-medium">Total Spent</th>
              <th className="py-4 px-6 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-white/5 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="text-white font-medium group-hover:text-primary transition-colors">{customer.name}</span>
                    <span className="text-sm text-gray-500">{customer.email}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-300">{customer.orders}</td>
                <td className="py-4 px-6 text-emerald-400 font-medium">${customer.totalSpent.toLocaleString()}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    customer.type === 'Large Orders' ? 'bg-amber-500/20 text-amber-400' : 
                    customer.type === 'Small Orders' ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {customer.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopCustomersList;
