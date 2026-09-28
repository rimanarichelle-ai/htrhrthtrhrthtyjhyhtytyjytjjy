import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { BusinessSettings } from '../../types';
import { generateCallLink, generateWhatsAppLink } from '../../utils/whatsapp';

interface StickyMobileCTAProps {
  settings: BusinessSettings;
}

export const StickyMobileCTA: React.FC<StickyMobileCTAProps> = ({ settings }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2.5 bg-[#0b0c10]/95 backdrop-blur-lg border-t border-white/10 sm:hidden">
      <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
        {/* Click to call using configured primary phone */}
        <a
          href={generateCallLink(settings.primary_phone)}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-zinc-800/90 active:bg-zinc-700 text-white font-bold text-xs border border-white/10 transition-colors shadow-md"
        >
          <Phone className="w-4 h-4 text-[#FF6600]" />
          <span>Appeler</span>
        </a>

        {/* 1-click WhatsApp quote using configured WhatsApp number */}
        <a
          href={generateWhatsAppLink(settings.whatsapp, 'general')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#25D366] active:bg-[#1fa951] text-zinc-950 font-black text-xs transition-colors shadow-lg shadow-[#25D366]/20"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          <span>WhatsApp Réserver</span>
        </a>
      </div>
    </div>
  );
};
