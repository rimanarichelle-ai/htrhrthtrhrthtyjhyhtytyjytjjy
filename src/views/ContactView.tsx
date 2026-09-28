import React, { useState } from 'react';
import { Phone, MessageSquare, MapPin, Clock, Mail, CheckCircle2, Send, ExternalLink } from 'lucide-react';
import { BusinessSettings, Language } from '../types';
import { generateCallLink, generateWhatsAppLink } from '../utils/whatsapp';

interface ContactViewProps {
  settings: BusinessSettings;
  lang: Language;
}

export const ContactView: React.FC<ContactViewProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Location de voiture');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0a0b0e] text-gray-900 dark:text-zinc-100 min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#F59E0B] dark:text-[#FBBF24]">
            Contactez DZ RENT CAR
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-gray-900 dark:text-white tracking-tight mt-1">
            Nous Sommes à Votre Écoute
          </h1>
          <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2 max-w-2xl">
            Besoin d'un renseignement, d'un devis pour un long séjour ou d'une livraison d'urgence à l'aéroport d'Alger ? Contactez-nous par WhatsApp ou par téléphone.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Phone & Coordinates */}
          <div className="lg:col-span-5 space-y-4">
            {/* Primary Phone Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 space-y-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-400/10 flex items-center justify-center text-[#F59E0B] dark:text-[#FBBF24]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase">Numéro Principal</span>
                  <a
                    href={generateCallLink(settings.primary_phone)}
                    className="text-base font-black text-gray-900 dark:text-white hover:text-[#F59E0B] dark:hover:text-[#FBBF24] block"
                  >
                    {settings.primary_phone}
                  </a>
                </div>
              </div>
              {settings.secondary_phone && (
                <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs text-gray-600 dark:text-zinc-400">
                  <span>Ligne secondaire :</span>
                  <a
                    href={generateCallLink(settings.secondary_phone)}
                    className="font-bold text-gray-900 dark:text-zinc-200 hover:underline"
                  >
                    {settings.secondary_phone}
                  </a>
                </div>
              )}
            </div>

            {/* WhatsApp Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 space-y-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-[#059669]/20 flex items-center justify-center text-[#059669] dark:text-[#10B981]">
                  <MessageSquare className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase">Assistance WhatsApp</span>
                  <a
                    href={generateWhatsAppLink(settings.whatsapp, 'general')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-black text-[#059669] dark:text-[#10B981] hover:underline block"
                  >
                    {settings.whatsapp}
                  </a>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-zinc-400">
                Réponse instantanée pour devis, confirmation de vols et réservations.
              </p>
            </div>

            {/* Location & Hours */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 space-y-4 text-xs shadow-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#F59E0B] dark:text-[#FBBF24] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 dark:text-white block uppercase">Adresse</strong>
                  <span className="text-gray-700 dark:text-zinc-300">{settings.address}</span>
                  <span className="text-gray-500 dark:text-zinc-500 block">Proche aéroport Houari Boumediene</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#F59E0B] dark:text-[#FBBF24] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 dark:text-white block uppercase">Horaires</strong>
                  <span className="text-gray-700 dark:text-zinc-300">{settings.opening_hours}</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={settings.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-[#F59E0B] dark:text-[#FBBF24] font-bold hover:underline"
                >
                  <span>Ouvrir l'itinéraire Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 shadow-md dark:shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase">Message Envoyé !</h3>
                <p className="text-xs text-gray-600 dark:text-zinc-400 max-w-sm mx-auto">
                  Merci {name}, notre équipe a bien reçu votre demande et vous répondra très rapidement.
                </p>
                <div className="pt-4">
                  <a
                    href={generateWhatsAppLink(settings.whatsapp, 'general')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs shadow-sm cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>Contacter aussi sur WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase border-b border-gray-100 dark:border-white/10 pb-3">
                  Envoyer un message en ligne
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Votre nom"
                      className="w-full bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FBBF24]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
                      Téléphone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="ex: 0555..."
                      className="w-full bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FBBF24]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre-email@example.com"
                      className="w-full bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FBBF24]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
                      Objet
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FBBF24]"
                    >
                      <option value="Location de voiture" className="dark:bg-[#181a22]">Location de voiture</option>
                      <option value="Livraison Aéroport" className="dark:bg-[#181a22]">Livraison Aéroport</option>
                      <option value="Location Longue Durée" className="dark:bg-[#181a22]">Location Longue Durée</option>
                      <option value="Autre demande" className="dark:bg-[#181a22]">Autre demande</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
                    Votre message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Précisez votre demande, dates ou modèle souhaité..."
                    className="w-full bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FBBF24]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-gray-950 font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer ma demande</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
