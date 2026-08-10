import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Footer from '../components/layout/Footer';

export const ProductDetailsPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 container mx-auto px-4 md:px-6 py-12 max-w-7xl pt-10 md:pt-10">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/shop" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors duration-200">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 animate-pulse">
          
          {/* Left Column - Image Skeleton */}
          <div className="w-full flex flex-col gap-4">
            <div className="relative aspect-[4/5] lg:aspect-square w-full rounded-[2rem] overflow-hidden glass-panel p-2 bg-white/5">
              <div className="w-full h-full rounded-[1.5rem] bg-white/10" />
            </div>
          </div>

          {/* Right Column - Product Details Skeleton */}
          <div className="flex flex-col">
            {/* Category Tag */}
            <div className="h-6 w-24 rounded-full bg-white/10 mb-4" />
            
            {/* Title */}
            <div className="h-12 w-3/4 rounded-xl bg-white/10 mb-4" />

            {/* Ratings */}
            <div className="h-5 w-32 rounded-lg bg-white/10 mb-6" />

            {/* Price */}
            <div className="h-8 w-28 rounded-lg bg-white/10 mb-8" />

            {/* Description Section */}
            <div className="mb-10 space-y-3">
              <div className="h-6 w-28 rounded-lg bg-white/10 mb-3" />
              <div className="h-4 w-full rounded bg-white/5" />
              <div className="h-4 w-5/6 rounded bg-white/5" />
              <div className="h-4 w-4/6 rounded bg-white/5" />
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto border-t border-white/5 pt-8">
              <div className="flex-1 h-14 rounded-2xl bg-white/10" />
              <div className="flex-1 h-14 rounded-2xl bg-white/10" />
            </div>

            {/* Guarantees Skeleton */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/5">
              <div className="h-10 rounded bg-white/5" />
              <div className="h-10 rounded bg-white/5" />
              <div className="h-10 rounded bg-white/5" />
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

