import React from 'react';
import { FAQSection } from '../components/home/FAQSection';
import { FAQItem, Language } from '../types';

interface FAQViewProps {
  faqs: FAQItem[];
  lang: Language;
}

export const FAQView: React.FC<FAQViewProps> = ({ faqs }) => {
  return (
    <div className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0a0b0e] text-gray-900 dark:text-zinc-100 min-h-screen transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FAQSection faqs={faqs} />
      </div>
    </div>
  );
};
