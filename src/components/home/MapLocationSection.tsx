import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { BusinessSettings } from '../../types';

interface MapLocationSectionProps {
  settings?: BusinessSettings;
}

export const MapLocationSection: React.FC<MapLocationSectionProps> = () => {
  return (
    <section className="py-14 sm:py-18 bg-white dark:bg-[#0b0c10] border-t border-gray-100 dark:border-white/5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="w-10 h-1 bg-[#FBBF24] mb-2.5 rounded-full" />
          <h3 className="text-2xl sm:text-3xl font-black uppercase text-gray-900 dark:text-white tracking-tight">
            NOUS TROUVER
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#181a24] flex items-center justify-center text-gray-800 dark:text-[#FBBF24] border border-transparent dark:border-white/10 shrink-0">
                <MapPin className="w-5 h-5 text-gray-700 dark:text-[#FBBF24]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Aéroport d'Alger, Terminal 1
                </h4>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                  Alger, Algérie
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-[#181a24] flex items-center justify-center text-gray-800 dark:text-[#FBBF24] border border-transparent dark:border-white/10 shrink-0">
                <Clock className="w-5 h-5 text-gray-700 dark:text-[#FBBF24]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Ouvert 24h/24 - 7j/7
                </h4>
              </div>
            </div>
          </div>

          {/* Right Map Image matching screenshot */}
          <div className="lg:col-span-7 h-[220px] sm:h-[260px] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm relative">
            <img
              src="/images/algiers_airport_map.jpg"
              alt="Carte Aéroport d'Alger"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Red map marker point overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/95 dark:bg-[#12141c]/95 px-3 py-1.5 rounded-full shadow-md border border-gray-200 dark:border-white/10">
              <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
              <span className="text-xs font-black text-gray-900 dark:text-white">Aéroport d'Alger</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

