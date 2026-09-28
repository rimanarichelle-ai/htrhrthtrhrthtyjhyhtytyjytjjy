import React from 'react';
import { Search, Calendar, CreditCard, Car, ChevronRight } from 'lucide-react';

interface HowItWorksProps {
  lang?: any;
}

export const HowItWorks: React.FC<HowItWorksProps> = () => {
  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Choisissez votre véhicule',
    },
    {
      num: '02',
      icon: Calendar,
      title: 'Sélectionnez vos dates',
    },
    {
      num: '03',
      icon: CreditCard,
      title: 'Effectuez la réservation',
    },
    {
      num: '04',
      icon: Car,
      title: 'Récupérez votre véhicule',
    },
  ];

  return (
    <section className="py-16 bg-[#f8fafc] dark:bg-[#0f1118] border-y border-gray-100 dark:border-white/5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-2xl sm:text-3xl font-black uppercase text-gray-900 dark:text-white tracking-tight">
            COMMENT ÇA MARCHE ?
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.num}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#111827] dark:bg-[#1e2230] border border-transparent dark:border-white/10 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                    {step.num}
                  </div>
                  <div>
                    <Icon className="w-4 h-4 text-gray-700 dark:text-zinc-400 mb-1" />
                    <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-tight block">
                      {step.title}
                    </span>
                  </div>
                </div>

                {idx < steps.length - 1 && (
                  <ChevronRight className="hidden sm:block w-5 h-5 text-gray-300 dark:text-zinc-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

