import React from 'react';
import { Star, CheckCircle, MessageSquare } from 'lucide-react';
import { BusinessSettings, Language, Review } from '../types';
import { generateWhatsAppLink } from '../utils/whatsapp';

interface ReviewsViewProps {
  reviews: Review[];
  settings: BusinessSettings;
  lang: Language;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({ reviews, settings }) => {
  return (
    <div className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0a0b0e] text-gray-900 dark:text-zinc-100 min-h-screen transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-widest text-[#F59E0B] dark:text-[#FBBF24]">
            Avis & Témoignages
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-gray-900 dark:text-white tracking-tight mt-1">
            Ce que nos clients disent
          </h1>
          <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2">
            La réputation de DZ RENT CAR est bâtie sur la ponctualité, la propreté de la flotte et le respect de nos engagements.
          </p>

          <div className="mt-8 inline-flex items-center gap-6 p-5 rounded-2xl bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 shadow-md dark:shadow-xl">
            <div className="text-3xl font-black text-gray-950 dark:text-[#FBBF24]">
              {settings.google_rating.toFixed(1)} / 5
            </div>
            <div className="text-left border-l border-gray-200 dark:border-white/10 pl-5">
              <div className="flex items-center gap-1 text-[#FBBF24]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-gray-600 dark:text-zinc-300 font-semibold mt-1">
                Basé sur {settings.google_reviews_count} avis Google vérifiés
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#FBBF24]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] text-gray-500 dark:text-zinc-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Avis {rev.source}
                </span>
              </div>
              <p className="text-xs text-gray-700 dark:text-zinc-300 italic leading-relaxed">
                « {rev.review_text} »
              </p>
              <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
                <span className="font-bold text-gray-900 dark:text-white">{rev.customer_name}</span>
                <span className="text-gray-400 dark:text-zinc-500">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
