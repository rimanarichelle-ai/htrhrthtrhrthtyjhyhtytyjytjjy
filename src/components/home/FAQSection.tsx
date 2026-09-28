import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQItem } from '../../types';

interface FAQSectionProps {
  faqs: FAQItem[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const col1 = faqs.filter((_, idx) => idx % 2 === 0);
  const col2 = faqs.filter((_, idx) => idx % 2 === 1);

  return (
    <section className="py-14 sm:py-18 bg-white dark:bg-[#0b0c10] border-t border-gray-100 dark:border-white/5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="w-10 h-1 bg-[#FBBF24] mb-2.5 rounded-full" />
          <h3 className="text-2xl sm:text-3xl font-black uppercase text-gray-900 dark:text-white tracking-tight">
            FAQ
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column 1 */}
          <div className="space-y-3">
            {col1.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#12141d] overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => toggle(faq.id)}
                    className="w-full text-left p-4 flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-gray-800 dark:text-zinc-200 hover:text-gray-950 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 dark:text-zinc-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-gray-900 dark:text-[#FBBF24]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-gray-600 dark:text-zinc-400 leading-relaxed border-t border-gray-100 dark:border-white/10">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            {col2.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#12141d] overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => toggle(faq.id)}
                    className="w-full text-left p-4 flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-gray-800 dark:text-zinc-200 hover:text-gray-950 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 dark:text-zinc-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-gray-900 dark:text-[#FBBF24]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-gray-600 dark:text-zinc-400 leading-relaxed border-t border-gray-100 dark:border-white/10">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

