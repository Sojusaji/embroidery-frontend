import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  MessageSquare,
  User,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Rating from './Rating';
import { useGetProductReviews, useCreateProductReview } from '../hook/useProducts';
import { UserAuthContext } from '../context/UserAuthContext';

const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Average',
  4: 'Very Good',
  5: 'Excellent',
};

const ProductReviewsSection = ({ productId, initialRating = 0, initialNumReviews = 0 }) => {
  const [page, setPage] = useState(1);
  const [ratingInput, setRatingInput] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentInput, setCommentInput] = useState('');

  const { isUserAuthenticated, user } = useContext(UserAuthContext);

  // Fetch reviews using TanStack Query
  const { data, isLoading, isError } = useGetProductReviews(productId, page, 5);
  const { mutate: submitReview, isPending: isSubmitting } = useCreateProductReview();

  const reviews = data?.reviews || [];
  const pagination = data?.pagination || { totalReviews: initialNumReviews, totalPages: 1, currentPage: 1 };
  const overallRating = data?.rating ?? initialRating;
  const totalReviews = data?.numReviews ?? initialNumReviews;
  const breakdown = data?.breakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  // Check if current logged in user has already reviewed
  const hasUserReviewed = isUserAuthenticated && reviews.some(
    (rev) => rev.user === user?.id || rev.user?._id === user?.id || rev.name === user?.name
  );

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!isUserAuthenticated) {
      toast.error('Please log in to submit a review.', { id: 'auth-review-error' });
      return;
    }

    if (!ratingInput) {
      toast.error('Please select a star rating.', { id: 'rating-missing-error' });
      return;
    }

    if (!commentInput.trim()) {
      toast.error('Please write a comment for your review.', { id: 'comment-missing-error' });
      return;
    }

    submitReview(
      {
        productId,
        rating: ratingInput,
        comment: commentInput.trim(),
      },
      {
        onSuccess: (res) => {
          toast.success(res?.message || 'Thank you! Your review has been published.', {
            id: 'review-success-toast',
          });
          setCommentInput('');
          setRatingInput(5);
          setPage(1); // Jump to first page to see newly posted review
        },
        onError: (err) => {
          const message = err?.message || 'Failed to submit review. Please try again.';
          toast.error(message, { id: 'review-error-toast' });
        },
      }
    );
  };

  return (
    <section className="w-full mt-16 pt-12 border-t border-white/10" id="customer-reviews">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Customer Reviews & Ratings
          </h2>
          <p className="text-gray-400 text-sm mt-0.5">
            Real feedback from verified purchasers
          </p>
        </div>
      </div>

      {/* Aggregate Header & Rating Breakdown Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Score Box */}
        <div className="lg:col-span-4 rounded-3xl glass-panel p-8 bg-white/[0.02] border border-white/10 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="text-5xl font-black text-white mb-2 tracking-tight">
            {Number(overallRating).toFixed(1)}
          </div>
          <Rating value={overallRating} size="w-6 h-6" className="mb-3" />
          <p className="text-gray-400 text-sm font-medium">
            Based on <span className="text-white font-bold">{totalReviews}</span> {totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Right Star Breakdown Bars */}
        <div className="lg:col-span-8 rounded-3xl glass-panel p-8 bg-white/[0.02] border border-white/10 flex flex-col justify-center">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Rating Distribution
          </h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((starNum) => {
              const count = breakdown[starNum] || 0;
              const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

              return (
                <div key={starNum} className="flex items-center gap-4 text-xs md:text-sm">
                  <div className="flex items-center gap-1 w-16 text-gray-300 font-medium">
                    <span>{starNum}</span>
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  </div>

                  {/* Progress Bar */}
                  <div className="flex-1 h-3 rounded-full bg-white/5 border border-white/10 overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    />
                  </div>

                  <div className="w-20 text-right text-gray-400 font-medium">
                    <span>{percentage}%</span>
                    <span className="text-gray-600 text-xs ml-1">({count})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review Submission Form Container */}
      <div className="mb-14 rounded-3xl glass-panel p-6 md:p-8 bg-white/[0.02] border border-white/10 relative">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-xl font-bold text-white">Write a Customer Review</h3>
        </div>

        {!isUserAuthenticated ? (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold">Log in to leave a review</h4>
                <p className="text-gray-400 text-xs mt-0.5">Share your experience with our artisan products</p>
              </div>
            </div>
            <a
              href="/login"
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Log In
            </a>
          </div>
        ) : hasUserReviewed ? (
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-amber-400" />
            <p className="text-sm font-medium">
              You have already submitted a review for this product. Thank you for your feedback!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-6">
            {/* Interactive Star Picker */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Your Rating
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const activeRating = hoverRating || ratingInput;
                    const isFilled = starVal <= activeRating;

                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRatingInput(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-amber-400 focus:outline-none transition-transform duration-150 hover:scale-110"
                        aria-label={`Select ${starVal} stars`}
                      >
                        <Star
                          className={`w-7 h-7 ${
                            isFilled ? 'fill-current text-amber-400' : 'text-gray-600 fill-transparent'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-sm font-semibold text-amber-400 ml-2">
                  {RATING_LABELS[hoverRating || ratingInput]}
                </span>
              </div>
            </div>

            {/* Comment Textarea */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="review-comment" className="block text-sm font-semibold text-gray-300">
                  Your Review Comment
                </label>
                <span className="text-xs text-gray-500">
                  {commentInput.length}/1000 characters
                </span>
              </div>
              <textarea
                id="review-comment"
                rows={4}
                maxLength={1000}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="What did you love about this item? Describe quality, stitching, texture, etc."
                className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/60 transition-all text-sm leading-relaxed"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-8 rounded-2xl bg-gradient-to-r from-primary to-orange-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(var(--color-primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--color-primary),0.5)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>Submitting Review...</>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Reviews List / Feed */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Customer Opinions ({totalReviews})
        </h3>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="p-6 rounded-3xl glass-panel bg-white/[0.01] border border-white/10 animate-pulse space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10" />
                  <div className="space-y-2">
                    <div className="w-32 h-4 bg-white/10 rounded" />
                    <div className="w-20 h-3 bg-white/5 rounded" />
                  </div>
                </div>
                <div className="w-full h-12 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-gray-400 glass-panel rounded-3xl border border-white/10">
            Failed to load reviews. Please refresh the page to try again.
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-panel bg-white/[0.01] border border-white/10 flex flex-col items-center justify-center">
            <div className="p-4 rounded-full bg-white/5 text-gray-500 mb-3">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h4 className="text-white font-bold text-lg mb-1">No reviews yet</h4>
            <p className="text-gray-400 text-sm max-w-md">
              Be the first customer to leave a review for this product!
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <div className="space-y-4">
              {reviews.map((rev) => (
                <motion.div
                  key={rev._id || rev.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 rounded-3xl glass-panel bg-white/[0.01] border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-base shadow-sm">
                        {rev.name ? rev.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm">
                          {rev.name || 'Verified Customer'}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {new Date(rev.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <Rating value={rev.rating} size="w-4 h-4" />
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed pl-13">
                    {rev.comment}
                  </p>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-xl glass-panel bg-white/5 text-white font-semibold text-xs hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all border border-white/10"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <span className="text-xs text-gray-400 font-medium">
              Page <span className="text-white font-bold">{pagination.currentPage}</span> of{' '}
              <span className="text-white font-bold">{pagination.totalPages}</span>
            </span>

            <button
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-xl glass-panel bg-white/5 text-white font-semibold text-xs hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all border border-white/10"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

ProductReviewsSection.propTypes = {
  productId: PropTypes.string.isRequired,
  initialRating: PropTypes.number,
  initialNumReviews: PropTypes.number,
};

export default ProductReviewsSection;
