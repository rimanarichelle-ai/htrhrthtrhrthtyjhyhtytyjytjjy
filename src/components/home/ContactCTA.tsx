import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { BusinessSettings } from '../../types';
import { generateCallLink, generateWhatsAppLink } from '../../utils/whatsapp';

interface ContactCTAProps {
  settings: BusinessSettings;
  onExploreVehicles?: () => void;
}

export const ContactCTA: React.FC<ContactCTAProps> = ({ settings }) => {
  return (
    <section className="relative py-16 sm:py-20 bg-[#0a0f1d] overflow-hidden">
      {/* Background Car Banner */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/cta_car_dark_banner.jpg"
          alt="Prêt à prendre la route"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/70 to-[#0a0f1d]/70" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <h3 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
          PRÊT À PRENDRE LA ROUTE ?
        </h3>

        <p className="text-sm text-gray-300">
          Réservez dès maintenant et profitez de la liberté de voyager.
        </p>

        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
          {/* WhatsApp Button */}
          <a
            href={generateWhatsAppLink(settings.whatsapp, 'general')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span>WhatsApp</span>
          </a>

          {/* Call Button */}
          <a
            href={generateCallLink(settings.primary_phone)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/30 backdrop-blur-sm shadow-md transition-all cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Appeler</span>
          </a>
        </div>
      </div>
    </section>
  );
};

