import React from 'react';
import Hero from '../components/layout/Hero';
import ProductCard from '../components/shared/ProductCard';
import Footer from '../components/layout/Footer';
import heroImage from '../assets/images/hero.png';
import galleryImage from '../assets/images/gallery.png';
import jhumka from '../assets/images/jhumka.png';
import studs from '../assets/images/studs.png';
import dangles from '../assets/images/dangles.png';
import hoops from '../assets/images/hoops.png';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Scissors, Ruler, Truck, Star } from 'lucide-react';

const DUMMY_PRODUCTS = [
  { id: 1, name: 'Golden Leaf Velvet', price: 120, image: heroImage, category: 'Embroidery' },
  { id: 2, name: 'Bespoke Tailored Suit', price: 350, image: galleryImage, category: 'Stitching' },
  { id: 3, name: 'Real Rolled Gold Jhumka Earrings Pair', price: 65, image: jhumka, category: 'Ornaments' },
  { id: 4, name: 'Premium Rolled Gold Stud Earrings Pair', price: 45, image: studs, category: 'Ornaments' },
  { id: 5, name: 'Floral Cotton Dress', price: 95, image: galleryImage, category: 'Embroidery' },
  { id: 6, name: 'Royal Crimson Sari', price: 210, image: heroImage, category: 'Stitching' },
  { id: 7, name: 'Real Rolled Gold Dangle Earrings Pair', price: 55, image: dangles, category: 'Ornaments' },
  { id: 8, name: 'Antique Rolled Gold Hoops Pair', price: 75, image: hoops, category: 'Ornaments' },
];

const Home = () => {
  return (
    <div>
      <Hero />
      
      {/* Search & Category Shortcuts */}
      <section className="py-12 relative z-10 -mt-10 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Exquisite Ornaments', desc: 'Real rolled gold earring pairs', icon: Star, category: 'Ornaments', color: 'from-amber-500/20 to-orange-500/5' },
              { title: 'Fine Embroidery', desc: 'Handcrafted floral art & fabric', icon: Scissors, category: 'Embroidery', color: 'from-primary/20 to-primary/5' },
              { title: 'Bespoke Stitching', desc: 'Expertly tailored custom fits', icon: Ruler, category: 'Stitching', color: 'from-blue-500/20 to-blue-500/5' }
            ].map((col, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link 
                  to={`/shop?category=${col.category}`}
                  className="group relative block p-8 rounded-3xl glass-panel border-white/10 overflow-hidden h-full"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${col.color} opacity-40 group-hover:opacity-60 transition-opacity`} />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 text-white">
                      <col.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{col.title}</h3>
                    <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors">{col.desc}</p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <span>Explore Collection</span>
                      <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-24 relative z-10 bg-surface">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
          >
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Our Latest Masterpieces</h2>
              <p className="text-gray-400 max-w-lg">
                Explore our curated collection of premium embroidery, expert tailoring, and exquisite real rolled gold ornament pairs.
              </p>
            </div>
            <Link to="/shop" className="text-primary hover:text-white font-medium border border-primary/30 hover:border-primary px-6 py-3 rounded-full transition-all text-center">
              View Entire Collection
            </Link>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DUMMY_PRODUCTS.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative z-10 bg-black">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">How Bespoke Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Get your custom tailored outfits delivered right to your door in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[ 
              { icon: Ruler, title: 'Provide Measurements', desc: 'Use our interactive form to submit your exact body measurements digitally.' },
              { icon: Scissors, title: 'Master Tailoring', desc: 'Our artisans cut and stitch the premium fabric to your exact specifications.' },
              { icon: Truck, title: 'Secure Delivery', desc: 'Your bespoke garment is packaged securely and delivered to your doorstep.' }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="glass-panel bg-white/5 p-8 text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex-center mb-6 text-primary">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Marquee */}
      <section className="py-24 relative overflow-hidden bg-surface flex flex-col justify-center">
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Loved by Clients</h2>
        </div>
        
        <div className="flex gap-6 overflow-hidden max-w-[100vw] relative">
          {/* Fading Edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-surface to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-surface to-transparent z-10" />
          
          {/* Animated Track */}
          <motion.div 
            animate={{ x: [0, -1500] }} 
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="flex gap-6 min-w-max px-4"
          >
            {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((item, idx) => (
              <div key={idx} className="w-[350px] glass-panel bg-white/5 p-6 shrink-0">
                <div className="flex text-primary mb-4">
                  <Star fill="currentColor" className="w-4 h-4" />
                  <Star fill="currentColor" className="w-4 h-4" />
                  <Star fill="currentColor" className="w-4 h-4" />
                  <Star fill="currentColor" className="w-4 h-4" />
                  <Star fill="currentColor" className="w-4 h-4" />
                </div>
                <p className="text-gray-300 italic mb-6">"Absolutely stunning craftsmanship. The embroidery detail is unmatched and the bespoke suit fit me perfectly on the first try!"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/30 flex-center text-primary font-bold">{idx + 1}</div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Client Name</h4>
                    <p className="text-xs text-gray-500">Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;
