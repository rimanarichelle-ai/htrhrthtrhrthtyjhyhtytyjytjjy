import React from 'react';
import { ShieldCheck, MapPin, Award, CheckCircle2, Phone, MessageSquare } from 'lucide-react';
import { BusinessSettings, Language } from '../types';
import { generateCallLink, generateWhatsAppLink } from '../utils/whatsapp';

interface AboutViewProps {
  settings: BusinessSettings;
  onExploreFleet: () => void;
  lang: Language;
}

export const AboutView: React.FC<AboutViewProps> = ({ settings, onExploreFleet }) => {
  return (
    <div className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0a0b0e] text-gray-900 dark:text-zinc-100 min-h-screen transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#F59E0B] dark:text-[#FBBF24]">
            À Propos de DZ RENT CAR
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-gray-900 dark:text-white tracking-tight mt-1">
            Votre Partenaire Mobilité à Alger
          </h1>
          <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2 max-w-2xl">
            Implantée à Dar El Beïda, aux portes de l'aéroport international Houari Boumediene, l'agence DZ RENT CAR propose une nouvelle expérience de location de véhicules en Algérie.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-xs text-gray-700 dark:text-zinc-300 leading-relaxed">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase">
              Notre Mission : Clarté, Ponctualité & Confort
            </h3>
            <p>
              Créée avec la volonté de simplifier la mobilité dans la capitale, DZ RENT CAR s'engage à fournir des véhicules récents (2022 à 2024), nettoyés et rigoureusement inspectés après chaque location.
            </p>
            <p>
              Que vous arriviez de l'étranger pour des vacances en famille ou pour une mission professionnelle, nous éliminons les démarches fastidieuses grâce à la livraison directe au terminal d'aéroport et un service client joignable en continu sur WhatsApp.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-3 text-gray-900 dark:text-white font-bold">
              <div className="p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 shadow-xs">
                <span className="text-2xl font-black text-gray-950 dark:text-[#FBBF24] block">5.0 / 5</span>
                <span className="text-xs text-gray-500 dark:text-zinc-400">126 avis Google certifiés</span>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 shadow-xs">
                <span className="text-2xl font-black text-gray-950 dark:text-[#FBBF24] block">24/7</span>
                <span className="text-xs text-gray-500 dark:text-zinc-400">Assistance continue</span>
              </div>
            </div>
          </div>

          <div className="h-80 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-md dark:shadow-2xl">
            <img
              src="/images/hero_algiers_clio.jpg"
              alt="DZ RENT CAR flotte"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 space-y-2 shadow-xs">
            <Award className="w-6 h-6 text-[#F59E0B] dark:text-[#FBBF24]" />
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase">Transparence Tarifaire</h4>
            <p className="text-xs text-gray-600 dark:text-zinc-400">
              Des tarifs clairs en Dinar Algérien sans mauvaise surprise à la signature du contrat.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 space-y-2 shadow-xs">
            <ShieldCheck className="w-6 h-6 text-[#F59E0B] dark:text-[#FBBF24]" />
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase">Sécurité Routière</h4>
            <p className="text-xs text-gray-600 dark:text-zinc-400">
              Véhicules entretenus avec pneumatiques récents, freins contrôlés et climatisation performante.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 space-y-2 shadow-xs">
            <MapPin className="w-6 h-6 text-[#F59E0B] dark:text-[#FBBF24]" />
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase">Proximité Aéroport</h4>
            <p className="text-xs text-gray-600 dark:text-zinc-400">
              Notre base de Dar El Beïda permet une intervention et une livraison en quelques minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
