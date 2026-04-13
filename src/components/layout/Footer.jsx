import React from 'react';
import { Scissors, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1 border-r border-white/5 pr-8">
            <div className="flex items-center gap-2 group mb-6">
              <div className="p-2 rounded-xl bg-primary/10">
                <Scissors className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Stitch&Art</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Purveyors of bespoke embroidered art and premium tailoring services, bringing elegance straight to your wardrobe.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition-all">IG</a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition-all">FB</a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition-all">X</a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">Embroidery Gallery</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Custom Stitching</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Our Master Tailors</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Materials & Care</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">Measurement Guide</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-primary" /> 123 Artisan Ave, Style City</li>
              <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-primary" /> +1 (555) 123-4567</li>
              <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-primary" /> hello@stitchandart.co</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 Stitch&Art Label. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
