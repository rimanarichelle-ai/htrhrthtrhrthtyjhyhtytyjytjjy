import React from 'react';
import { Car, MessageSquare } from 'lucide-react';
import { BusinessSettings } from '../../types';
import { generateWhatsAppLink } from '../../utils/whatsapp';

interface HeroProps {
  settings: BusinessSettings;
  onExploreVehicles: () => void;
  backgroundImage?: string;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onExploreVehicles,
  backgroundImage,
}) => {
  const heroImage = backgroundImage || '/images/hero_algiers_clio.jpg';

  return (
    <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center pt-24 pb-20 overflow-hidden bg-[#0a101d]">
      {/* Full-width Panoramic Background Image of Clio in Algiers */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Location de voitures à Alger - DZ RENT CAR"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-[75%_center] sm:object-center"
        />
        {/* Subtle Dark Gradient Overlay from Left */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent sm:w-3/5"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl space-y-4 sm:space-y-6 pt-6">
          {/* Main Headline */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-none text-white">
              LOCATION DE VOITURES
            </h1>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-none text-[#ff6600]">
              À ALGER
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-base sm:text-xl font-normal text-white/90 tracking-wide">
            Votre voiture. Votre destination. Votre liberté.
          </p>

          {/* Action CTA Buttons matching screenshot */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreVehicles}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#ff6600] hover:bg-[#e65c00] active:scale-[0.98] text-white font-bold text-sm transition-all shadow-md cursor-pointer"
            >
              <Car className="w-5 h-5 fill-current" />
              <span>Voir les véhicules</span>
            </button>

            <a
              href={generateWhatsAppLink(settings.whatsapp, 'general')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#059669] hover:bg-[#047857] active:scale-[0.98] text-white font-bold text-sm transition-all shadow-md cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};


