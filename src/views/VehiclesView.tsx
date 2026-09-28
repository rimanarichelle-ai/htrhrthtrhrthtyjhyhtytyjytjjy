import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Car, Check, X } from 'lucide-react';
import { VehicleCard } from '../components/home/VehicleCard';
import { BusinessSettings, Language, Vehicle } from '../types';
import { getTranslation } from '../utils/i18n';

interface VehiclesViewProps {
  vehicles: Vehicle[];
  settings: BusinessSettings;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onBookNow: (vehicle: Vehicle) => void;
  lang: Language;
}

export const VehiclesView: React.FC<VehiclesViewProps> = ({
  vehicles,
  settings,
  onSelectVehicle,
  onBookNow,
  lang,
}) => {
  const t = getTranslation(lang);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('Tous');
  const [selectedFuel, setSelectedFuel] = useState<string>('Tous');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const categories = ['Tous', 'SUV', 'Citadine', 'Compacte', 'Berline', 'Crossover'];
  const transmissions = ['Tous', 'Automatique', 'Manuelle'];
  const fuels = ['Tous', 'Essence', 'Diesel'];

  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => v.active)
      .filter((v) => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (
          v.name.toLowerCase().includes(q) ||
          v.brand.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q)
        );
      })
      .filter((v) => (selectedCategory === 'Tous' ? true : v.category === selectedCategory))
      .filter((v) => (selectedTransmission === 'Tous' ? true : v.transmission === selectedTransmission))
      .filter((v) => (selectedFuel === 'Tous' ? true : v.fuel_type === selectedFuel))
      .filter((v) => (onlyAvailable ? v.available : true))
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.daily_price - b.daily_price;
        if (sortBy === 'price-desc') return b.daily_price - a.daily_price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return a.sort_order - b.sort_order;
      });
  }, [vehicles, searchTerm, selectedCategory, selectedTransmission, selectedFuel, onlyAvailable, sortBy]);

  return (
    <div className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0a0b0e] min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#F59E0B] dark:text-[#FBBF24]">
            <Car className="w-3.5 h-3.5" />
            <span>Catalogue Officiel DZ RENT CAR</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-gray-900 dark:text-white tracking-tight mt-1">
            Nos Voitures de Location
          </h1>
          <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2 max-w-2xl">
            Tous nos véhicules sont récents (2022-2024), nettoyés et révisés. Livraison disponible à l'aéroport d'Alger et dans la wilaya d'Alger.
          </p>
        </div>

        {/* Filters & Search Control Bar */}
        <div className="bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 rounded-2xl p-5 mb-10 space-y-4 shadow-sm dark:shadow-xl">
          {/* Top Search & Sort Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 text-gray-400 dark:text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.fleet.filterSearch}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#FBBF24]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="md:col-span-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white font-semibold focus:outline-none focus:border-[#FBBF24]"
              >
                <option value="featured" className="dark:bg-[#181a22]">{t.fleet.sortFeatured}</option>
                <option value="price-asc" className="dark:bg-[#181a22]">{t.fleet.sortPriceAsc}</option>
                <option value="price-desc" className="dark:bg-[#181a22]">{t.fleet.sortPriceDesc}</option>
                <option value="name" className="dark:bg-[#181a22]">{t.fleet.sortName}</option>
              </select>
            </div>
          </div>

          {/* Categories Segmented Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/5">
            <span className="text-[11px] font-bold text-gray-500 dark:text-zinc-500 uppercase mr-1">
              Catégorie :
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#FBBF24] text-gray-950 font-black shadow-sm'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary Filters: Transmission & Fuel */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-100 dark:border-white/5 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              {/* Transmission filter */}
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-zinc-400 text-[11px] font-medium">Boîte :</span>
                <select
                  value={selectedTransmission}
                  onChange={(e) => setSelectedTransmission(e.target.value)}
                  className="bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1 text-xs text-gray-800 dark:text-zinc-200"
                >
                  {transmissions.map((t) => (
                    <option key={t} value={t} className="dark:bg-[#181a22]">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fuel filter */}
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-zinc-400 text-[11px] font-medium">Carburant :</span>
                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  className="bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1 text-xs text-gray-800 dark:text-zinc-200"
                >
                  {fuels.map((f) => (
                    <option key={f} value={f} className="dark:bg-[#181a22]">
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results count & reset */}
            <div className="flex items-center gap-3">
              <span className="text-gray-600 dark:text-zinc-400 font-medium">
                <strong className="text-gray-900 dark:text-white font-bold">{filteredVehicles.length}</strong>{' '}
                véhicule(s) trouvé(s)
              </span>
              {(searchTerm || selectedCategory !== 'Tous' || selectedTransmission !== 'Tous' || selectedFuel !== 'Tous') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('Tous');
                    setSelectedTransmission('Tous');
                    setSelectedFuel('Tous');
                  }}
                  className="text-xs text-[#F59E0B] dark:text-[#FBBF24] hover:underline font-bold cursor-pointer"
                >
                  Réinitialiser
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                whatsappNumber={settings.whatsapp}
                onSelectVehicle={onSelectVehicle}
                onBookNow={onBookNow}
              />
            ))}
          </div>
        ) : (
          /* Branded Empty State */
          <div className="text-center py-20 bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 rounded-2xl p-8 max-w-md mx-auto shadow-sm">
            <Car className="w-12 h-12 text-gray-400 dark:text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase">
              Aucun véhicule trouvé
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2">
              {t.fleet.noVehicles}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Tous');
                setSelectedTransmission('Tous');
                setSelectedFuel('Tous');
              }}
              className="mt-5 px-5 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-gray-950 text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Afficher toute la flotte
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
