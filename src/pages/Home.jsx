import Hero from '../components/layout/Hero';
import ProductCard from '../components/shared/ProductCard';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Scissors, Ruler,Loader2, Truck, Star, ShieldCheck, Sparkles, ChevronDown, HelpCircle } from 'lucide-react';
import { useGetFeaturedProducts, useGetLatestProducts } from "../../src/hook/useProducts";
import ProductCardSkeleton from '../utils/productCartSkelton';
import { useState } from 'react';

// Static Configuration Data (Optimized outside component scope)
const CATEGORY_SHORTCUTS = [
  { title: 'Exquisite Ornaments', desc: 'Real rolled gold earring pairs', icon: Star, category: 'Ornaments', color: 'from-amber-500/20 to-orange-500/5' },
  { title: 'Fine Embroidery', desc: 'Handcrafted floral art & fabric', icon: Scissors, category: 'Embroidery', color: 'from-primary/20 to-primary/5' },
  { title: 'Bespoke Stitching', desc: 'Expertly tailored custom fits', icon: Ruler, category: 'Stitching', color: 'from-blue-500/20 to-blue-500/5' }
];

const TRUST_BADGES = [
  { icon: ShieldCheck, title: "100% Handcrafted", desc: "Expertly curated materials & authentic detail" },
  { icon: Sparkles, title: "Custom Fit Guarantee", desc: "Tailored precisely to your submitted measurements" },
  { icon: Truck, title: "Secure Nationwide Shipping", desc: "Safely packaged & delivered to your doorstep" },
  { icon: Star, title: "Rolled Gold Quality", desc: "Long-lasting finish with premium radiance" }
];

const BESPOKE_STEPS = [
  { icon: Ruler, title: 'Provide Measurements', desc: 'Use our interactive form to submit your exact body measurements digitally.' },
  { icon: Scissors, title: 'Master Tailoring', desc: 'Our artisans cut and stitch the premium fabric to your exact specifications.' },
  { icon: Truck, title: 'Secure Delivery', desc: 'Your bespoke garment is packaged securely and delivered to your doorstep.' }
];

const FAQ_ITEMS = [
  {
    q: "How do I submit my custom measurements?",
    a: "You can easily submit your body measurements using our interactive digital measurement form available right after placing a bespoke order, or you can check our detailed measurement guide."
  },
  {
    q: "What is the typical turnaround time for custom tailoring and embroidery?",
    a: "Because each piece is individually handcrafted by our master artisans, custom tailoring and embroidery orders typically take between 7 to 14 business days before shipping."
  },
  {
    q: "Are the rolled gold ornaments suitable for daily wear?",
    a: "Yes! Our exquisite rolled gold ornament pairs are designed with high durability layers to give you a genuine gold look and finish suitable for special occasions and regular wear."
  },
  {
    q: "What is your policy on alterations and returns?",
    a: "Since bespoke garments are stitched strictly according to your customized specifications, we provide complimentary adjustments if the fit requires minor fine-tuning upon arrival."
  }
];

const Home = () => {

  const [featuredLimit, setFeaturedLimit] = useState(10);
  const [latestLimit, setLatestLimit] = useState(10);

  const { data: featuredData, isFetching: fetchingFeatured } = useGetFeaturedProducts(featuredLimit);
  const { data: latestData, isFetching: fetchingLatest } = useGetLatestProducts(latestLimit);

  const featuredProducts = featuredData?.products || [];
  const featuredTotal = featuredData?.totalCount || 0;

  const latestProducts = latestData?.latestProducts || [];
  const latestTotal = latestData?.totalCount || 0;


  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };


  const LoadMoreButton = ({ onClick, isFetching, hasMore, label }) => {
    if (!hasMore) return null;

    return (
      <div className="flex justify-center mt-12">
        <button
          onClick={onClick}
          disabled={isFetching}
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white/5 hover:bg-primary/20 text-white font-medium transition-all duration-300 border border-white/10 hover:border-primary/50 shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          {isFetching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Loading...</span>
            </>
          ) : (
            <span>{label}</span>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white overflow-x-hidden">
      <Hero />

      {/* Search & Category Shortcuts */}
      <section className="py-16 relative z-10 -mt-10">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CATEGORY_SHORTCUTS.map((col, idx) => (
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
                  className="group relative block p-8 rounded-3xl glass-panel border-white/10 overflow-hidden h-full shadow-lg"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${col.color} opacity-40 group-hover:opacity-60 transition-opacity`} />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 text-white shadow-md">
                      <col.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{col.title}</h3>
                    <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors text-sm">{col.desc}</p>
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

      {/* Trust Badges / Value Props Section */}
      <section className="py-12 relative z-10 border-y border-white/5 bg-black/60 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_BADGES.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl glass-panel bg-white/5 border-white/5">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0 shadow-inner">
                  <badge.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">{badge.title}</h4>
                  <p className="text-gray-400 text-xs mt-0.5">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {(fetchingFeatured || (featuredProducts && featuredProducts.length > 0)) && (
        <section className="py-20 relative z-10 bg-surface">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
            >
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Our Featured Masterpieces</h2>
                <p className="text-gray-400 max-w-lg text-sm md:text-base">
                  Explore our curated collection of premium embroidery, expert tailoring, and exquisite real rolled gold ornament pairs.
                </p>
              </div>
              <Link to="/shop" className="text-primary hover:text-white font-medium border border-primary/30 hover:border-primary px-6 py-3 rounded-full transition-all text-center">
                View Entire Collection
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {fetchingFeatured
                ? [1, 2, 3, 4].map((_, idx) => <ProductCardSkeleton key={idx} index={idx} />)
                : featuredProducts.map((product, idx) => <ProductCard key={product.id} product={product} index={idx} />)}
            </div>
          </div>

          <LoadMoreButton
            onClick={() => setFeaturedLimit(prev => prev + 10)}
            isFetching={fetchingFeatured}
            hasMore={featuredProducts.length < featuredTotal}
            label="Show More Featured"
          />
        </section>
      )}

      {/* How It Works Section */}
      <section className="py-24 relative z-10 bg-black">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">How Bespoke Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">Get your custom tailored outfits delivered right to your door in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BESPOKE_STEPS.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="glass-panel bg-white/5 p-8 text-center flex flex-col items-center rounded-3xl border border-white/5"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 text-primary shadow-lg shadow-primary/10">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Order CTA Banner Section */}
      <section className="py-16 relative z-10 bg-gradient-to-b from-surface to-black overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="relative p-8 md:p-12 rounded-3xl glass-panel border border-white/10 bg-surface/80 text-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('/assets/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
            <span className="text-xs uppercase tracking-widest text-primary font-semibold mb-3 block">Bespoke Experience</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Have a Specific Design or Unique Size in Mind?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
              Let our master artisans craft a personalized piece just for you. Share your custom styling requests and exact measurements today.
            </p>
            <Link
              to="/custom-orders"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold transition-all hover:scale-105 shadow-lg "
            >
              <Scissors className="w-5 h-5" />
              <span>Start Your Custom Order</span>
            </Link>
          </div>
        </div>
      </section>

      {/* LATEST PRODUCTS */}
      {(fetchingLatest || (latestProducts && latestProducts.length > 0)) && (
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
                <p className="text-gray-400 max-w-lg text-sm md:text-base">
                  Explore our curated collection of premium embroidery, expert tailoring, and exquisite real rolled gold ornament pairs.
                </p>
              </div>
              <Link to="/shop" className="text-primary hover:text-white font-medium border border-primary/30 hover:border-primary px-6 py-3 rounded-full transition-all text-center">
                View Entire Collection
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {fetchingLatest
                ? [1, 2, 3, 4].map((_, idx) => <ProductCardSkeleton key={idx} index={idx} />)
                : latestProducts.map((product, idx) => <ProductCard key={product.id} product={product} index={idx} />)}
            </div>
          </div>

          {/* Latest Show More Button */}
          <LoadMoreButton
            onClick={() => setLatestLimit(prev => prev + 8)}
            isFetching={fetchingLatest}
            hasMore={latestProducts.length < latestTotal}
            label="Show More Latest"
          />
        </section>
      )}

      {/* Testimonial Marquee */}
      <section className="py-24 relative overflow-hidden bg-surface flex flex-col justify-center">
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Loved by Clients</h2>
        </div>

        <div className="flex gap-6 overflow-hidden max-w-[100vw] relative">
          {/* Fading Edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />

          {/* Animated Track */}
          <motion.div
            animate={{ x: [0, -1500] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="flex gap-6 min-w-max px-4"
          >
            {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((item, idx) => (
              <div key={idx} className="w-[350px] glass-panel bg-white/5 p-6 rounded-3xl shrink-0 border border-white/5 shadow-md">
                <div className="flex text-primary mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} fill="currentColor" className="w-4 h-4" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm italic mb-6 leading-relaxed">"Absolutely stunning craftsmanship. The embroidery detail is unmatched and the bespoke suit fit me perfectly on the first try!"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center text-primary font-bold shadow-inner">{idx + 1}</div>
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

      {/* FAQ Section */}
      <section className="py-24 relative z-10 bg-black">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 shadow-sm">
              <HelpCircle className="w-4 h-4" /> Got Questions?
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-white">Frequently Asked Questions</h2>
            <p className="text-gray-400 text-sm md:text-base">Everything you need to know about our custom tailoring, sizing process, and shipping timelines.</p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl glass-panel bg-white/5 border border-white/5 overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-semibold text-white hover:text-primary transition-colors"
                >
                  <span className="text-sm md:text-base">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-primary' : 'text-gray-400'}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
