import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '../../types';

interface ReviewsSectionProps {
  reviews: Review[];
  googleRating?: number;
  reviewsCount?: number;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
}) => {
  const displayReviews = reviews.slice(0, 3);

  return (
    <section className="py-16 bg-white dark:bg-[#0b0c10] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="w-10 h-1 bg-[#FBBF24] mb-2.5 rounded-full" />
          <h3 className="text-2xl sm:text-3xl font-black uppercase text-gray-900 dark:text-white tracking-tight">
            AVIS CLIENTS
          </h3>

          {/* Overall Rating Score */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5 text-[#FBBF24]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-900 dark:text-white">5.0</span>
            <span className="text-xs text-gray-500 dark:text-zinc-400">/ 126 avis</span>
          </div>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#12141d] border border-gray-100 dark:border-white/10 shadow-sm dark:shadow-black/50 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div>
                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={rev.customer_name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-white/15"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      {rev.customer_name}
                    </h4>
                    <span className="text-[11px] text-gray-400 dark:text-zinc-500">
                      {rev.date}
                    </span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 text-[#FBBF24] my-2.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                {/* Comment Text */}
                <p className="text-xs text-gray-600 dark:text-zinc-300 italic leading-relaxed">
                  "{rev.review_text}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

