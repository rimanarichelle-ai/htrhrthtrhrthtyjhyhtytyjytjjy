import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Vehicle } from '../../types';

interface VehicleCardProps {
  vehicle: Vehicle;
  whatsappNumber: string;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onBookNow: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onSelectVehicle,
  onBookNow,
}) => {
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('fr-DZ').format(val);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelectVehicle) {
      onSelectVehicle(vehicle);
    } else {
      onBookNow(vehicle);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group rounded-2xl bg-white dark:bg-[#12141d] border border-gray-200/90 dark:border-white/10 hover:border-[#FBBF24]/60 dark:hover:border-[#FBBF24]/50 hover:shadow-lg dark:hover:shadow-black/60 transition-all duration-300 flex flex-col overflow-hidden shadow-sm cursor-pointer"
    >
      {/* Vehicle Image */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-gray-100 dark:bg-[#181a24]">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-bold text-[#FBBF24] uppercase tracking-wider">
            {vehicle.category}
          </span>
          {vehicle.power_hp && (
            <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white/90">
              {vehicle.power_hp} ch
            </span>
          )}
        </div>
      </div>

      {/* Card Info Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-base font-black text-gray-900 dark:text-white tracking-tight group-hover:text-[#F59E0B] dark:group-hover:text-[#FBBF24] transition-colors">
            {vehicle.name}
          </h4>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 font-medium flex items-center gap-1.5 flex-wrap">
            <span>{vehicle.transmission}</span>
            <span>•</span>
            <span>{vehicle.fuel_type}</span>
            <span>•</span>
            <span>{vehicle.seats} places</span>
          </p>
        </div>

        {/* Pricing & Circular Yellow Arrow Button */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
          <div className="text-xs text-gray-600 dark:text-zinc-400">
            <span className="text-[11px] block text-gray-400 dark:text-zinc-500 font-medium">À partir de</span>
            <div className="flex items-baseline gap-1">
              <span className="font-black text-gray-950 dark:text-white text-base">
                {formatPrice(vehicle.daily_price)} {vehicle.currency}
              </span>
              <span className="text-[11px] text-gray-500 dark:text-zinc-500"> / jour</span>
            </div>
          </div>

          {/* Yellow Circle Arrow Button with Voir détails tooltip feel */}
          <div
            className="w-9 h-9 rounded-full bg-[#FBBF24] group-hover:bg-[#F59E0B] text-gray-950 flex items-center justify-center transition-all shadow-sm group-hover:scale-105"
            title="Voir fiche technique et réserver"
          >
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>
      </div>
    </div>
  );
};

