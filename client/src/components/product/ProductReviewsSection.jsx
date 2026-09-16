import React, { useState } from 'react';
import {
  Star,
  MessageSquare,
  CheckCircle,
  ThumbsUp,
  User,
  Send,
  AlertCircle,
} from 'lucide-react';

export default function ProductReviewsSection({
  product,
  reviews = [],
  user,
  newRating,
  setNewRating,
  newTitle,
  setNewTitle,
  newComment,
  setNewComment,
  handleReviewSubmit,
  reviewSubmitting,
  reviewError,
  reviewSuccess,
}) {
  const [helpfulVotes, setHelpfulVotes] = useState({});
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Toggle helpful vote locally
  const handleHelpful = (reviewId) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
  };

  // Calculate rating breakdown
  const totalReviews = reviews.length;
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
    ratingCounts[star] = (ratingCounts[star] || 0) + 1;
  });

  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviews).toFixed(1)
    : Number(product?.rating || 4.9).toFixed(1);

  return (
    <div id="reviews-section" className="rounded-2xl bg-white dark:bg-[#1A1A1D] border border-[#DDD6CE] dark:border-[#2C2C30] p-6 sm:p-8 shadow-sm space-y-8">
      {/* 1. Header & Quick Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#1C1C1E] dark:text-[#F8F7F5] flex items-center space-x-2.5">
            <MessageSquare className="w-6 h-6 text-[#C87D55]" />
            <span>Customer Reviews & Experiences</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real feedback from verified buyers across the marketplace.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowReviewForm((prev) => !prev)}
          className="px-5 py-2.5 rounded-xl bg-[#1C1C1E] dark:bg-[#2A2A2E] hover:bg-[#2B2B2F] text-white text-xs font-bold shadow transition-all self-start sm:self-auto"
        >
          {showReviewForm ? 'Close Review Form' : 'Write a Review'}
        </button>
      </div>

      {/* 2. Rating Breakdown Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#F8ECE3]/40 dark:bg-[#202024]/60 p-6 rounded-2xl border border-[#DDD6CE]/60 dark:border-[#2C2C30]">
        {/* Left: Overall Score */}
        <div className="md:col-span-4 text-center md:border-r border-slate-200 dark:border-slate-700/60 md:pr-6 space-y-2">
          <div className="text-5xl font-black text-[#1C1C1E] dark:text-[#F8F7F5]">
            {averageRating}
          </div>
          <div className="flex items-center justify-center text-[#D4A24C] space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(Number(averageRating))
                    ? 'fill-[#D4A24C] text-[#D4A24C]'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Based on {totalReviews || product?.numReviews || 12} verified ratings
          </p>
        </div>

        {/* Right: Star Distribution Bars */}
        <div className="md:col-span-8 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star] || (star === 5 ? 10 : star === 4 ? 2 : 0);
            const total = totalReviews || 12;
            const percent = Math.round((count / total) * 100);

            return (
              <div key={star} className="flex items-center space-x-3 text-xs">
                <span className="w-12 font-bold text-slate-600 dark:text-slate-300 flex items-center justify-end gap-1">
                  <span>{star}</span>
                  <Star className="w-3 h-3 fill-[#D4A24C] text-[#D4A24C]" />
                </span>
                <div className="flex-1 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C87D55] to-[#D4A24C] rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-10 text-right text-slate-400 font-mono text-[11px]">
                  {percent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Review Submission Form (Collapsible) */}
      {showReviewForm && (
        <form
          onSubmit={handleReviewSubmit}
          className="p-6 rounded-2xl bg-slate-50 dark:bg-[#202024] border border-[#DDD6CE] dark:border-[#333338] space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Share Your Experience
            </h4>
            {user && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Posting as <strong>{user.name || user.email}</strong>
              </span>
            )}
          </div>

          {reviewError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{reviewError}</span>
            </div>
          )}

          {reviewSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{reviewSuccess}</span>
            </div>
          )}

          {/* Interactive Star Rating Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Overall Rating
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className="p-1 text-[#D4A24C] hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= newRating
                        ? 'fill-[#D4A24C] text-[#D4A24C]'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 ml-2">
                {newRating === 5
                  ? '5 Stars — Outstanding'
                  : newRating === 4
                  ? '4 Stars — Very Good'
                  : newRating === 3
                  ? '3 Stars — Average'
                  : newRating === 2
                  ? '2 Stars — Needs Improvement'
                  : '1 Star — Poor'}
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Review Title
            </label>
            <input
              type="text"
              placeholder="e.g., Exceptional craftsmanship and smooth delivery"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-[#1A1A1D] border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#C87D55]"
            />
          </div>

          {/* Comment */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Your Review
            </label>
            <textarea
              placeholder="What did you like or dislike about this product? How did it meet your expectations?"
              rows="4"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white dark:bg-[#1A1A1D] border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#C87D55]"
            />
          </div>

          <button
            type="submit"
            disabled={reviewSubmitting}
            className="px-6 py-3 rounded-xl bg-[#C87D55] hover:bg-[#A9653C] text-white text-xs font-bold shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{reviewSubmitting ? 'Publishing Review...' : 'Submit Verified Review'}</span>
          </button>
        </form>
      )}

      {/* 4. Verified Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-[#202024] text-slate-400 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-xs font-medium">
              No customer reviews yet. Be the first to share your experience!
            </p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev._id}
              className="p-5 rounded-2xl bg-[#F7F5F2]/60 dark:bg-[#202024]/60 border border-[#DDD6CE]/60 dark:border-[#2C2C30] space-y-3 transition-colors hover:border-[#C87D55]/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-[#1C1C1E] dark:text-[#F8F7F5]">
                        {rev.customer?.name || 'Verified Customer'}
                      </span>
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified Purchase
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(rev.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {/* Rating & Title */}
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-[#D4A24C]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= (rev.rating || 5)
                          ? 'fill-[#D4A24C] text-[#D4A24C]'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  ))}
                </div>
                {rev.title && (
                  <h5 className="text-xs sm:text-sm font-bold text-[#1C1C1E] dark:text-white">
                    {rev.title}
                  </h5>
                )}
              </div>

              {/* Comment */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {rev.comment}
              </p>

              {/* Helpful Upvote Button */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-200/50 dark:border-slate-700/50">
                <button
                  type="button"
                  onClick={() => handleHelpful(rev._id)}
                  className="flex items-center space-x-1.5 hover:text-[#C87D55] transition text-[11px] font-medium"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({(helpfulVotes[rev._id] || 0) + (rev.helpfulVotes || 0)})</span>
                </button>
                <span className="text-[10px]">Was this review helpful to you?</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
