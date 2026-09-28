import React, { useState } from 'react';
import { Calendar, MapPin, Search } from 'lucide-react';
import { Language } from '../../types';

interface BookingWidgetProps {
  onCheckAvailability: (params: {
    pickupLocation: string;
    pickupDate: string;
    pickupTime: string;
    returnLocation: string;
    returnDate: string;
    returnTime: string;
    category: string;
    airportDelivery: boolean;
  }) => void;
  lang?: Language;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({ onCheckAvailability }) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  const [pickupLocation, setPickupLocation] = useState('Alger');
  const [pickupDate, setPickupDate] = useState(formatDate(tomorrow));
  const [returnDate, setReturnDate] = useState(formatDate(nextWeek));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckAvailability({
      pickupLocation,
      pickupDate,
      pickupTime: '10:00',
      returnLocation: pickupLocation,
      returnDate,
      returnTime: '10:00',
      category: 'Tous',
      airportDelivery: true,
    });
  };

  return (
    <div className="relative -mt-10 sm:-mt-12 z-20 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="bg-white dark:bg-[#12141c] rounded-2xl border border-gray-100 dark:border-white/10 shadow-xl dark:shadow-black/60 p-5 sm:p-6 transition-colors duration-200">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center"
        >
          {/* Left Title */}
          <div className="lg:col-span-3">
            <h3 className="text-base font-black uppercase text-gray-900 dark:text-white tracking-tight">
              RÉSERVATION RAPIDE
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
              Vérifiez la disponibilité et réservez en quelques clics.
            </p>
          </div>

          {/* Middle 3 input blocks */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Date de prise */}
            <div className="border border-gray-200 dark:border-white/15 rounded-xl px-3 py-2 bg-gray-50/50 dark:bg-[#191c28] hover:bg-white dark:hover:bg-[#1e2230] transition-colors">
              <label className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-400" />
                <span>Date de prise</span>
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-gray-900 dark:text-white focus:outline-none mt-0.5 [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>

            {/* Date de retour */}
            <div className="border border-gray-200 dark:border-white/15 rounded-xl px-3 py-2 bg-gray-50/50 dark:bg-[#191c28] hover:bg-white dark:hover:bg-[#1e2230] transition-colors">
              <label className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-400" />
                <span>Date de retour</span>
              </label>
              <input
                type="date"
                value={returnDate}
                min={pickupDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-gray-900 dark:text-white focus:outline-none mt-0.5 [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>

            {/* Lieu de prise */}
            <div className="border border-gray-200 dark:border-white/15 rounded-xl px-3 py-2 bg-gray-50/50 dark:bg-[#191c28] hover:bg-white dark:hover:bg-[#1e2230] transition-colors">
              <label className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-400" />
                <span>Lieu de prise</span>
              </label>
              <select
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-gray-900 dark:text-white focus:outline-none mt-0.5"
              >
                <option value="Alger" className="dark:bg-[#191c28] dark:text-white">Alger</option>
                <option value="Aéroport d'Alger" className="dark:bg-[#191c28] dark:text-white">Aéroport d'Alger</option>
                <option value="Dar El Beïda" className="dark:bg-[#191c28] dark:text-white">Dar El Beïda</option>
              </select>
            </div>
          </div>

          {/* Right Action Button */}
          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#FBBF24] hover:bg-[#F59E0B] text-gray-950 font-bold text-sm py-3 px-4 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Rechercher</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

