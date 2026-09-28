import React from 'react';
import { Plane, ShieldCheck, Car, UserCheck, CheckCircle2, MessageSquare, Phone } from 'lucide-react';
import { BusinessSettings, Language } from '../types';
import { generateCallLink, generateWhatsAppLink } from '../utils/whatsapp';

interface ServicesViewProps {
  settings: BusinessSettings;
  onBookNow: () => void;
  lang: Language;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ settings, onBookNow }) => {
  return (
    <div className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0a0b0e] text-gray-900 dark:text-zinc-100 min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="text-xs font-black uppercase tracking-widest text-[#F59E0B] dark:text-[#FBBF24]">
            Prestations Professionnelles
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-gray-900 dark:text-white tracking-tight mt-1">
            Nos Services de Location
          </h1>
          <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2">
            Des solutions de mobilité flexibles à Alger et à l'aéroport Houari Boumediene pour particuliers, professionnels et vacanciers.
          </p>
        </div>

        {/* Highlight Service 1: Airport Delivery */}
        <div id="airport" className="p-8 rounded-2xl bg-white dark:bg-gradient-to-r dark:from-[#141620] dark:via-[#101217] dark:to-[#141620] border border-gray-200 dark:border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-md dark:shadow-2xl transition-colors">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-400/10 text-amber-700 dark:text-[#FBBF24] text-xs font-bold uppercase border border-amber-200 dark:border-transparent">
              <Plane className="w-3.5 h-3.5" />
              <span>Service Vedette</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-gray-900 dark:text-white">
              Livraison et Restitution Aéroport Gratuites
            </h2>
            <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
              Nous livrons votre véhicule directement à votre sortie de terminal à l’Aéroport International d'Alger Houari Boumediene (Terminal 1 et Terminal 2). Un agent DZ RENT CAR vous accueille dès l'atterrissage de votre vol.
            </p>
            <ul className="space-y-2 text-xs text-gray-700 dark:text-zinc-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24]" />
                <span>Aucune attente au guichet d'aéroport</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24]" />
                <span>Restitution directe avant votre vol de départ</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24]" />
                <span>Suivi du numéro de vol en cas de retard</span>
              </li>
            </ul>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onBookNow}
                className="px-6 py-3 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-gray-950 font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                Réserver pour mon vol
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 h-64 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm">
            <img
              src="/images/airport_arrival_terminal.jpg"
              alt="Livraison Aéroport Alger"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 3 Secondary Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-400/10 flex items-center justify-center text-[#F59E0B] dark:text-[#FBBF24]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase">Assistance 24/7 & Assurance</h3>
            <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
              Une assistance continue partout en Algérie. En cas d'imprévu, notre équipe intervient immédiatement pour assurer la continuité de votre voyage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-400/10 flex items-center justify-center text-[#F59E0B] dark:text-[#FBBF24]">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase">Location Avec Chauffeur</h3>
            <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
              Profitez d'un chauffeur professionnel, ponctuel et expérimenté pour vos rendez-vous d'affaires, réceptions ou circuits touristiques.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-400/10 flex items-center justify-center text-[#F59E0B] dark:text-[#FBBF24]">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase">Moyenne & Longue Durée</h3>
            <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
              Tarifs dégressifs pour les entreprises et particuliers souhaitant louer une voiture pour plusieurs semaines ou mois avec entretien inclus.
            </p>
          </div>
        </div>

        {/* WhatsApp & Call Banner */}
        <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase">Besoin d'un devis sur-mesure ?</h4>
            <p className="text-xs text-gray-600 dark:text-zinc-400">Notre équipe commerciale est disponible 7j/7 sur WhatsApp et par téléphone.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={generateWhatsAppLink(settings.whatsapp, 'general')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-current" /> WhatsApp
            </a>
            <a
              href={generateCallLink(settings.primary_phone)}
              className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24]" /> Appeler
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
