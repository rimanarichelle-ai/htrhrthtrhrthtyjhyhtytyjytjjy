import React, { useState } from 'react';
import {
  ArrowLeft,
  Fuel,
  Gauge,
  Users,
  Briefcase,
  ShieldCheck,
  Plane,
  CheckCircle2,
  MessageSquare,
  Phone,
  Calendar,
  Zap,
  Activity,
  Maximize2,
  Timer,
  Wind,
  Check,
  Info,
  Shield,
  Layers,
  Sparkles,
  Award,
  ChevronDown,
  ChevronsUpDown
} from 'lucide-react';
import { BusinessSettings, Language, Vehicle } from '../types';
import { generateCallLink, generateWhatsAppLink } from '../utils/whatsapp';
import { getTranslation } from '../utils/i18n';
import { vehicleSpecsService, SpecSection } from '../services/vehicleSpecs';

interface VehicleDetailViewProps {
  vehicle: Vehicle;
  settings: BusinessSettings;
  onBack: () => void;
  onBookNow: (vehicle: Vehicle) => void;
  lang: Language;
}

export const VehicleDetailView: React.FC<VehicleDetailViewProps> = ({
  vehicle,
  settings,
  onBack,
  onBookNow,
  lang,
}) => {
  const t = getTranslation(lang);
  const [selectedImage, setSelectedImage] = useState<string>(vehicle.image);

  // Parse structured specification sections from service (strictly filters out null/unverified fields)
  const specSections: SpecSection[] = vehicleSpecsService.getSections(vehicle);

  // Accordion state for mobile view
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    specSections.forEach((sec) => {
      // By default open Motorisation, Dimensions, Confort, Sécurité
      initial[sec.id] = true;
    });
    return initial;
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {};
    specSections.forEach((sec) => {
      allOpen[sec.id] = true;
    });
    setOpenSections(allOpen);
  };

  const collapseAll = () => {
    const allClosed: Record<string, boolean> = {};
    specSections.forEach((sec) => {
      allClosed[sec.id] = false;
    });
    setOpenSections(allClosed);
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('fr-DZ').format(val);
  };

  const galleryImages = vehicle.gallery && vehicle.gallery.length > 0
    ? vehicle.gallery
    : [vehicle.image];

  // Helper to render icon for specification sections
  const renderSectionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers':
        return <Layers className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24]" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24]" />;
      case 'Activity':
        return <Activity className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24]" />;
      case 'Maximize2':
        return <Maximize2 className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24]" />;
      case 'Users':
        return <Users className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24]" />;
      case 'Timer':
        return <Timer className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24]" />;
      case 'Wind':
        return <Wind className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24]" />;
      case 'ShieldCheck':
      default:
        return <ShieldCheck className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24]" />;
    }
  };

  const allOpen = specSections.every((s) => openSections[s.id]);

  // Render spec items content
  const renderSpecItems = (section: SpecSection) => {
    if (section.id === 'confort' || section.id === 'securite') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-gray-800 dark:text-zinc-200">
          {section.items.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-gray-50/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex items-center gap-2.5 shadow-2xs"
            >
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="leading-snug">
                <span className="text-gray-500 dark:text-zinc-400 text-[11px] mr-1">
                  {item.label} :
                </span>
                <strong className="text-gray-900 dark:text-white font-bold">
                  {item.displayValue}
                </strong>
              </span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-3.5 pt-2 text-xs">
        {section.items.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-xl bg-gray-50/70 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 shadow-2xs ${
              item.highlight ? 'ring-1 ring-[#FBBF24]/50 bg-amber-500/[0.03]' : ''
            }`}
          >
            <span className="text-[11px] text-gray-500 dark:text-zinc-400 block font-medium">
              {item.label}
            </span>
            <strong className="text-gray-900 dark:text-white font-bold text-xs mt-0.5 block">
              {item.displayValue}
            </strong>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0a0b0e] text-gray-900 dark:text-zinc-100 min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24] group-hover:-translate-x-1 transition-transform" />
            <span>Retour au catalogue</span>
          </button>

          {/* Verified Badge */}
          {vehicle.specification_verified && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-[11px] font-bold text-amber-700 dark:text-[#FBBF24]">
              <Award className="w-3.5 h-3.5" />
              <span>Fiche Technique Officielle Vérifiée</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Gallery, Summary, Desktop Grid & Mobile Accordion Specs */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Main Gallery & Visual Showcase */}
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-[#12141a] h-72 sm:h-96 shadow-md dark:shadow-2xl">
                <img
                  src={selectedImage}
                  alt={vehicle.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-xs font-black text-[#FBBF24] uppercase tracking-wider">
                    {vehicle.category}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-md backdrop-blur-md text-xs font-bold ${
                      vehicle.available
                        ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-400'
                        : 'bg-zinc-900/80 border border-zinc-700 text-zinc-300'
                    }`}
                  >
                    {vehicle.available ? 'Disponible immédiatement' : 'Sur réservation'}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-bold text-[#FBBF24] uppercase tracking-widest block">
                    {vehicle.brand} · {vehicle.model_year || vehicle.year}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white drop-shadow-sm">
                    {vehicle.name}
                  </h1>
                </div>
              </div>

              {/* Gallery Thumbnails (if multiple images) */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        selectedImage === img
                          ? 'border-[#FBBF24] scale-105 shadow-md'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${vehicle.name} preview ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Summary Highlights Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 flex items-center gap-3 shadow-xs">
                <Gauge className="w-5 h-5 text-[#F59E0B] dark:text-[#FBBF24] shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-500 dark:text-zinc-400 block uppercase font-bold">Boîte</span>
                  <strong className="text-xs text-gray-900 dark:text-white font-extrabold">{vehicle.transmission}</strong>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 flex items-center gap-3 shadow-xs">
                <Fuel className="w-5 h-5 text-[#F59E0B] dark:text-[#FBBF24] shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-500 dark:text-zinc-400 block uppercase font-bold">Carburant</span>
                  <strong className="text-xs text-gray-900 dark:text-white font-extrabold">{vehicle.fuel_type}</strong>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 flex items-center gap-3 shadow-xs">
                <Users className="w-5 h-5 text-[#F59E0B] dark:text-[#FBBF24] shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-500 dark:text-zinc-400 block uppercase font-bold">Places</span>
                  <strong className="text-xs text-gray-900 dark:text-white font-extrabold">{vehicle.seats} personnes</strong>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 flex items-center gap-3 shadow-xs">
                <Briefcase className="w-5 h-5 text-[#F59E0B] dark:text-[#FBBF24] shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-500 dark:text-zinc-400 block uppercase font-bold">Coffre</span>
                  <strong className="text-xs text-gray-900 dark:text-white font-extrabold">
                    {vehicle.luggage_capacity ? `${vehicle.luggage_capacity} L` : `${vehicle.luggage} valises`}
                  </strong>
                </div>
              </div>
            </div>

            {/* Vehicle Description */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 shadow-xs space-y-3">
              <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24]" />
                <span>Présentation du Véhicule</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">
                {vehicle.description}
              </p>
              {vehicle.notes && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5 flex items-start gap-2 text-xs text-gray-500 dark:text-zinc-400">
                  <Info className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24] shrink-0 mt-0.5" />
                  <span>{vehicle.notes}</span>
                </div>
              )}
            </div>

            {/* =================================================================== */}
            {/* SPECIFICATIONS PRESENTATION: Desktop Grid & Mobile Accordion */}
            {/* =================================================================== */}
            <div className="space-y-6">
              {/* Section Heading */}
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 dark:text-white">
                  Fiche Technique Détaillée
                </h2>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                  Spécifications et équipements vérifiés organisés par sections
                </p>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* 1. DESKTOP VIEW: Structured Open Grid Layout (hidden on mobile) */}
              {/* ----------------------------------------------------------------- */}
              <div className="hidden lg:flex lg:flex-col space-y-5">
                {specSections.map((section) => (
                  <div
                    key={`desktop-${section.id}`}
                    className="p-5.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#12141a] shadow-xs space-y-4"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                          {renderSectionIcon(section.icon)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">
                              {section.title}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-zinc-400">
                              {section.itemCount}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">
                            {section.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Content Items */}
                    {renderSpecItems(section)}
                  </div>
                ))}
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* 2. MOBILE VIEW: Interactive Accordion System (hidden on desktop) */}
              {/* ----------------------------------------------------------------- */}
              <div className="lg:hidden space-y-3">
                {/* Accordion Expand/Collapse Controls for Mobile */}
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold text-gray-500 dark:text-zinc-400">
                    {specSections.length} sections disponibles
                  </span>
                  <button
                    onClick={allOpen ? collapseAll : expandAll}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <ChevronsUpDown className="w-3.5 h-3.5 text-[#F59E0B] dark:text-[#FBBF24]" />
                    <span>{allOpen ? 'Tout replier' : 'Tout déplier'}</span>
                  </button>
                </div>

                {/* Mobile Accordion Items */}
                {specSections.map((section) => {
                  const isOpen = !!openSections[section.id];
                  return (
                    <div
                      key={`mobile-${section.id}`}
                      className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#12141a] overflow-hidden shadow-xs transition-all duration-200"
                    >
                      {/* Accordion Toggle Header */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-4.5 text-left hover:bg-gray-50/70 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                            {renderSectionIcon(section.icon)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white">
                                {section.title}
                              </h3>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-zinc-400">
                                {section.itemCount}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5">
                              {section.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div
                            className={`w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-zinc-300 transition-transform duration-200 ${
                              isOpen ? 'rotate-180 bg-[#FBBF24]/20 text-[#F59E0B] dark:text-[#FBBF24]' : ''
                            }`}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </button>

                      {/* Accordion Collapsible Panel */}
                      {isOpen && (
                        <div className="px-4.5 pb-4.5 pt-2 border-t border-gray-100 dark:border-white/5">
                          {renderSpecItems(section)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Source & Verification Transparency Box */}
              {vehicle.specification_source && (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 text-[11px] text-gray-500 dark:text-zinc-400 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold gap-1">
                    <span>Source : {vehicle.specification_source}</span>
                    {vehicle.last_verified_at && (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        ✓ Fiche vérifiée le {vehicle.last_verified_at}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500">
                    Les caractéristiques techniques sont données à titre indicatif selon les spécifications constructeur et peuvent légèrement varier selon les arrivages en agence.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Pricing Tiers & Direct Reservation CTAs */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 rounded-2xl bg-white dark:bg-[#14161f] border border-gray-200 dark:border-white/10 p-6 space-y-6 shadow-md dark:shadow-2xl transition-colors">
              {/* Daily Rate Promo Box */}
              <div className="p-5 rounded-xl bg-gray-50 dark:bg-[#0b0c10] border border-gray-200/80 dark:border-white/10">
                <span className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider block">
                  Tarif promotionnel officiel
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-[#FBBF24] tracking-tight">
                    {formatPrice(vehicle.daily_price)}
                  </span>
                  <span className="text-sm font-bold text-gray-600 dark:text-zinc-300">
                    {vehicle.currency} / jour
                  </span>
                </div>

                {/* Tiered pricing if available */}
                {(vehicle.weekly_price || vehicle.monthly_price) && (
                  <div className="mt-3 pt-3 border-t border-gray-200/60 dark:border-white/5 grid grid-cols-2 gap-2 text-xs">
                    {vehicle.weekly_price && (
                      <div>
                        <span className="text-[10px] text-gray-500 dark:text-zinc-400 block font-medium">Tarif Semaine</span>
                        <strong className="text-gray-900 dark:text-white font-bold">{formatPrice(vehicle.weekly_price)} {vehicle.currency}</strong>
                      </div>
                    )}
                    {vehicle.monthly_price && (
                      <div>
                        <span className="text-[10px] text-gray-500 dark:text-zinc-400 block font-medium">Tarif Mois</span>
                        <strong className="text-gray-900 dark:text-white font-bold">{formatPrice(vehicle.monthly_price)} {vehicle.currency}</strong>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-2">
                  * Tarif dégressif selon la durée de votre séjour en Algérie.
                </p>
              </div>

              {/* Conversion Buttons */}
              <div className="space-y-3">
                {/* WhatsApp Priority CTA */}
                <a
                  href={generateWhatsAppLink(settings.whatsapp, 'vehicle', {
                    vehicleName: vehicle.name,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 py-4 px-4 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer group"
                >
                  <MessageSquare className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                  <span>Réserver sur WhatsApp</span>
                </a>

                {/* Reservation Form Button */}
                <button
                  onClick={() => onBookNow(vehicle)}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-gray-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Demande de devis en ligne</span>
                </button>

                {/* Direct Phone Call Button */}
                <a
                  href={generateCallLink(settings.primary_phone)}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24]" />
                  <span>Appeler : {settings.primary_phone}</span>
                </a>
              </div>

              {/* Trust Guarantees */}
              <div className="pt-4 border-t border-gray-100 dark:border-white/5 space-y-2.5 text-xs text-gray-600 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24] shrink-0" />
                  <span>Livraison gratuite Aéroport Houari Boumediene d'Alger</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24] shrink-0" />
                  <span>Assurance tous risques & assistance routière 24h/24 7j/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24] shrink-0" />
                  <span>Véhicule nettoyé, désinfecté et révisé avant livraison</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
