import React from 'react';
import { ArrowRight } from 'lucide-react';
import { VehicleCard } from './VehicleCard';
import { Vehicle } from '../../types';

interface FleetSectionProps {
  vehicles: Vehicle[];
  whatsappNumber: string;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onBookNow: (vehicle: Vehicle) => void;
  onViewAllFleet: () => void;
  lang?: any;
}

export const FleetSection: React.FC<FleetSectionProps> = ({
  vehicles,
  whatsappNumber,
  onSelectVehicle,
  onBookNow,
  onViewAllFleet,
}) => {
  // Show first 4 vehicles matching screenshot
  const displayVehicles = vehicles.filter((v) => v.active).slice(0, 4);

  return (
    <section className="py-14 sm:py-18 bg-white dark:bg-[#0b0c10] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-6">
          <div>
            <div className="w-10 h-1 bg-[#FBBF24] mb-2.5 rounded-full" />
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-gray-900 dark:text-white tracking-tight">
              NOS VÉHICULES
            </h3>
          </div>

          <button
            onClick={onViewAllFleet}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-300 hover:text-gray-950 dark:hover:text-white transition-colors group cursor-pointer"
          >
            <span>Voir tous les véhicules</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4 Vehicle Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {displayVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              whatsappNumber={whatsappNumber}
              onSelectVehicle={onSelectVehicle}
              onBookNow={onBookNow}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

