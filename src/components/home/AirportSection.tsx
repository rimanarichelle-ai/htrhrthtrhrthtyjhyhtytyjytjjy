import React from 'react';
import { Plane, UserCheck, Car, ShieldCheck } from 'lucide-react';

interface AirportSectionProps {
  onBookAirport?: () => void;
  lang?: any;
}

export const AirportSection: React.FC<AirportSectionProps> = () => {
  const steps = [
    {
      num: '1',
      icon: Plane,
      title: 'Arrivée à l\'aéroport',
    },
    {
      num: '2',
      icon: UserCheck,
      title: 'Accueil + assistance',
    },
    {
      num: '3',
      icon: Car,
      title: 'Prise du véhicule',
    },
    {
      num: '4',
      icon: ShieldCheck,
      title: 'Départ en toute sérénité',
    },
  ];

  return (
    <section id="airport" className="py-16 sm:py-20 bg-white dark:bg-[#0b0c10] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Airport Arrival Terminal Image */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[16/10] bg-gray-100 dark:bg-[#181a24] border border-gray-100 dark:border-white/10">
              <img
                src="/images/airport_arrival_terminal.jpg"
                alt="Service Aéroport d'Alger - DZ RENT CAR"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Column: Title, description and 4-step stepper */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="w-10 h-1 bg-[#FBBF24] mb-2.5 rounded-full" />
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-gray-900 dark:text-white tracking-tight">
                SERVICE AÉROPORT
              </h3>
              <p className="text-sm text-gray-600 dark:text-zinc-300 mt-2 leading-relaxed">
                Nous vous récupérons à <strong className="text-gray-900 dark:text-white">l'aéroport d'Alger</strong> et vous accompagnons jusqu'à votre véhicule, en toute simplicité.
              </p>
            </div>

            {/* Stepper with Yellow Badges and Arrow Connectors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.num} className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#FBBF24] text-gray-950 font-black text-xs flex items-center justify-center shadow-sm">
                        {step.num}
                      </div>
                      <Icon className="w-4 h-4 text-gray-700 dark:text-zinc-300" />
                      {index < steps.length - 1 && (
                        <span className="hidden sm:inline-block text-gray-300 dark:text-zinc-600 ml-2 font-bold">→</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-gray-800 dark:text-zinc-200 leading-tight">
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

