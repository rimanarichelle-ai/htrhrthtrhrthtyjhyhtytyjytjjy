import React from 'react';
import { Plane, ShieldCheck, Car, CalendarCheck } from 'lucide-react';

interface WhyDZRentCarProps {
  lang?: any;
}

export const WhyDZRentCar: React.FC<WhyDZRentCarProps> = () => {
  const pillars = [
    {
      title: 'Proximité aéroport',
      desc: 'Service rapide et fiable',
      icon: Plane,
    },
    {
      title: 'Assistance 24/7',
      desc: 'Toujours à vos côtés',
      icon: ShieldCheck,
    },
    {
      title: 'Large flotte',
      desc: 'Des véhicules pour tous vos besoins',
      icon: Car,
    },
    {
      title: 'Réservation facile',
      desc: 'En quelques clics seulement',
      icon: CalendarCheck,
    },
  ];

  return (
    <section className="py-16 bg-[#f8fafc] dark:bg-[#0f1118] border-y border-gray-100 dark:border-white/5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-2xl sm:text-3xl font-black uppercase text-gray-900 dark:text-white tracking-tight">
            POURQUOI <span className="text-[#FBBF24]">DZ RENT CAR ?</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-4"
              >
                <div className="w-14 h-14 rounded-full bg-white dark:bg-[#181a24] shadow-sm border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-900 dark:text-[#FBBF24] mb-4">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

