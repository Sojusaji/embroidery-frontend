import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, Shirt, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '../utils/cn';

const steps = [
  { id: 'fabric', title: 'Fabric & Style', icon: Shirt },
  { id: 'measure', title: 'Measurements', icon: Ruler },
  { id: 'details', title: 'Your Details', icon: CheckCircle },
];

const StitchingOrder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fabricType: '',
    style: '',
    chest: '',
    waist: '',
    hips: '',
    length: '',
    name: '',
    email: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = (e) => {
    e.preventDefault();
    // In actual implementation, send to Express backend
    alert('Order Submitted Successfully! We will contact you soon.');
    setCurrentStep(0);
    setFormData({ fabricType: '', style: '', chest: '', waist: '', hips: '', length: '', name: '', email: '', address: '' });
  };

  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Bespoke Stitching Service</h1>
        <p className="text-gray-400">Provide your measurements and let our master tailors work their magic.</p>
      </div>

      {/* Stepper Progress */}
      <div className="flex justify-between items-center mb-12 relative max-w-2xl mx-auto">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 -translate-y-1/2 z-0" />
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: currentStep / (steps.length - 1) }}
          transition={{ duration: 0.5 }}
        />
        
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isPast = idx < currentStep;
          const Icon = step.icon;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500",
                isActive || isPast ? "bg-primary text-white" : "bg-surface border border-white/10 text-gray-400"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "hidden sm:block text-xs font-semibold absolute -bottom-6 w-max",
                isActive ? "text-primary" : "text-gray-500"
              )}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form Container */}
      <div className="glass-panel p-6 md:p-10 relative overflow-hidden bg-surface/50 border-white/5">
        <AnimatePresence mode="wait">
          <motion.form 
            key={currentStep}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onSubmit={currentStep === steps.length - 1 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}
            className="space-y-6"
          >
            {/* Step 1: Fabric & Style */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Select Your Material</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Fabric Preference</label>
                    <select 
                      name="fabricType" 
                      value={formData.fabricType}
                      onChange={handleChange}
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    >
                      <option value="" disabled>Choose fabric...</option>
                      <option value="cotton">Premium Cotton</option>
                      <option value="silk">Pure Silk</option>
                      <option value="velvet">Royal Velvet</option>
                      <option value="linen">Breathable Linen</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Garment Style</label>
                    <select 
                      name="style" 
                      value={formData.style}
                      onChange={handleChange}
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    >
                      <option value="" disabled>Choose style...</option>
                      <option value="dress">Elegant Dress</option>
                      <option value="suit">Tailored Suit</option>
                      <option value="sari">Traditional Sari Blouse</option>
                      <option value="custom">Custom Design (Specify below)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Measurements */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Your Measurements (inches)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {['chest', 'waist', 'hips', 'length'].map(field => (
                    <div key={field} className="space-y-2">
                      <label className="text-sm text-gray-400 capitalize">{field}</label>
                      <input 
                        type="number" 
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        required
                        min="1"
                        placeholder="0.0"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Contact & Delivery Info</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm text-gray-400">Delivery Address</label>
                    <textarea 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:outline-none transition-all min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-6 mt-8 border-t border-white/10 flex justify-between items-center">
               <button 
                type="button"
                onClick={prevStep}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all",
                  currentStep === 0 ? "opacity-0 pointer-events-none" : "hover:bg-white/5 text-gray-300"
                )}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              
              <button 
                type="submit"
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 text-white font-bold transition-all hover:scale-105 active:scale-95"
              >
                {currentStep === steps.length - 1 ? 'Submit Order' : 'Continue'}
                {currentStep !== steps.length - 1 && <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StitchingOrder;
