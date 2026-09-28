import React, { useState } from 'react';
import { Calendar, MapPin, Car, Plane, User, Phone, Mail, CheckCircle2, AlertCircle, MessageSquare, ArrowRight, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { BusinessSettings, Language, Vehicle } from '../types';
import { generateCallLink, generateWhatsAppLink } from '../utils/whatsapp';

interface BookingViewProps {
  vehicles: Vehicle[];
  settings: BusinessSettings;
  preselectedVehicleId?: string;
  initialParams?: {
    category?: string;
    pickup_date?: string;
    return_date?: string;
    pickup_loc?: string;
    airport?: boolean;
  };
  onSuccessNavigate?: () => void;
  lang: Language;
}

export const BookingView: React.FC<BookingViewProps> = ({
  vehicles,
  settings,
  preselectedVehicleId,
  initialParams,
  lang,
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);
  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  // Steps: 1 = Dates/Location, 2 = Car, 3 = Client Details, 4 = Confirmed Success
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [pickupLocation, setPickupLocation] = useState(
    initialParams?.pickup_loc || 'Aéroport d\'Alger (Houari Boumediene)'
  );
  const [returnLocation, setReturnLocation] = useState(
    initialParams?.pickup_loc || 'Aéroport d\'Alger (Houari Boumediene)'
  );
  const [pickupDate, setPickupDate] = useState(initialParams?.pickup_date || formatDate(tomorrow));
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState(initialParams?.return_date || formatDate(nextWeek));
  const [returnTime, setReturnTime] = useState('10:00');
  const [airportPickup, setAirportPickup] = useState(initialParams?.airport ?? true);
  const [flightNumber, setFlightNumber] = useState('');

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    preselectedVehicleId || vehicles[0]?.id || ''
  );
  const [driverOption, setDriverOption] = useState(false);

  // Customer Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [message, setMessage] = useState('');

  // Status & Confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 1;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = end.getTime() - start.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  const daysCount = calculateDays();
  const estimatedTotal = selectedVehicle ? selectedVehicle.daily_price * daysCount : 0;

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (pickupDate >= returnDate) {
      setErrorMsg('La date de retour doit être strictement postérieure à la date de départ.');
      return;
    }
    setErrorMsg(null);
    setCurrentStep(2);
  };

  const handleStep2Next = () => {
    if (!selectedVehicleId) {
      setErrorMsg('Veuillez sélectionner un véhicule.');
      return;
    }
    // Verify availability
    const isAvail = api.checkVehicleAvailability(selectedVehicleId, pickupDate, returnDate);
    if (!isAvail) {
      setErrorMsg('Ce véhicule a déjà une réservation sur cette période. Choisissez un autre véhicule disponible.');
      return;
    }
    setErrorMsg(null);
    setCurrentStep(3);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Veuillez renseigner votre nom et votre numéro de téléphone.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const result = api.createBooking({
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail || undefined,
      vehicle_id: selectedVehicle.id,
      vehicle_name: selectedVehicle.name,
      pickup_location: pickupLocation,
      pickup_date: pickupDate,
      pickup_time: pickupTime,
      return_location: returnLocation,
      return_date: returnDate,
      return_time: returnTime,
      airport_pickup: airportPickup,
      flight_number: flightNumber || undefined,
      driver_option: driverOption,
      message: message || undefined,
      total_days: daysCount,
      estimated_price: estimatedTotal,
    });

    setIsSubmitting(false);

    if (result.success && result.booking) {
      setConfirmedBookingId(result.booking.id);
      setCurrentStep(4);
    } else {
      setErrorMsg(result.error || 'Une erreur est survenue lors de la réservation.');
    }
  };

  return (
    <div className="pt-28 pb-24 bg-[#f8fafc] dark:bg-[#0a0b0e] text-gray-900 dark:text-zinc-100 min-h-screen transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#F59E0B] dark:text-[#FBBF24]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Réservation Simple & Sécurisée</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase text-gray-900 dark:text-white tracking-tight mt-1">
            Demande de Location
          </h1>
          <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1">
            Notre équipe vérifie la disponibilité et vous répond dans les plus brefs délais.
          </p>
        </div>

        {/* Step Progress Indicators */}
        <div className="mb-10 max-w-xl mx-auto">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
            <span className={currentStep >= 1 ? 'text-[#F59E0B] dark:text-[#FBBF24] font-black' : ''}>1. Dates & Lieux</span>
            <span>·</span>
            <span className={currentStep >= 2 ? 'text-[#F59E0B] dark:text-[#FBBF24] font-black' : ''}>2. Véhicule</span>
            <span>·</span>
            <span className={currentStep >= 3 ? 'text-[#F59E0B] dark:text-[#FBBF24] font-black' : ''}>3. Coordonnées</span>
            <span>·</span>
            <span className={currentStep === 4 ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''}>4. Validation</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#FBBF24] h-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: DATES & LOCATIONS */}
        {currentStep === 1 && (
          <form
            onSubmit={handleStep1Next}
            className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 space-y-6 shadow-md dark:shadow-2xl transition-colors"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase border-b border-gray-100 dark:border-white/10 pb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24]" />
              <span>Étape 1 : Dates et Lieux de Prise en Charge</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
                  Lieu de prise en charge
                </label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FBBF24]"
                >
                  <option value="Aéroport d'Alger (Houari Boumediene)" className="dark:bg-[#181a22]">
                    Aéroport d'Alger (Houari Boumediene)
                  </option>
                  <option value="Dar El Beïda (Agence centrale)" className="dark:bg-[#181a22]">
                    Dar El Beïda (Agence centrale)
                  </option>
                  <option value="Alger Centre" className="dark:bg-[#181a22]">Alger Centre</option>
                  <option value="Autre adresse sur Alger" className="dark:bg-[#181a22]">Autre adresse sur Alger</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
                  Lieu de retour
                </label>
                <select
                  value={returnLocation}
                  onChange={(e) => setReturnLocation(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FBBF24]"
                >
                  <option value="Aéroport d'Alger (Houari Boumediene)" className="dark:bg-[#181a22]">
                    Aéroport d'Alger (Houari Boumediene)
                  </option>
                  <option value="Dar El Beïda (Agence centrale)" className="dark:bg-[#181a22]">
                    Dar El Beïda (Agence centrale)
                  </option>
                  <option value="Alger Centre" className="dark:bg-[#181a22]">Alger Centre</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
                  Date & Heure de Départ
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="col-span-2 bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FBBF24] [color-scheme:light] dark:[color-scheme:dark]"
                    required
                  />
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-xl px-2 py-2.5 text-xs text-gray-900 dark:text-white text-center focus:outline-none focus:border-[#FBBF24] [color-scheme:light] dark:[color-scheme:dark]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
                  Date & Heure de Retour
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="date"
                    value={returnDate}
                    min={pickupDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="col-span-2 bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FBBF24] [color-scheme:light] dark:[color-scheme:dark]"
                    required
                  />
                  <input
                    type="time"
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-xl px-2 py-2.5 text-xs text-gray-900 dark:text-white text-center focus:outline-none focus:border-[#FBBF24] [color-scheme:light] dark:[color-scheme:dark]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Airport Delivery Toggle */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={airportPickup}
                  onChange={(e) => setAirportPickup(e.target.checked)}
                  className="accent-[#FBBF24] w-4 h-4 rounded"
                />
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24]" />
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    Livraison & Restitution Gratuite à l'Aéroport d'Alger
                  </span>
                </div>
              </label>

              {airportPickup && (
                <div className="pt-2">
                  <label className="text-[11px] font-semibold text-gray-600 dark:text-zinc-400 block mb-1">
                    Numéro de Vol (facultatif - pour suivi des retards) :
                  </label>
                  <input
                    type="text"
                    placeholder="ex: AH1003, AF1484, etc."
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    className="w-full sm:w-64 bg-white dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FBBF24]"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-gray-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Choisir le véhicule ({daysCount} jours)</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: VEHICLE SELECTION */}
        {currentStep === 2 && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 space-y-6 shadow-md dark:shadow-2xl transition-colors">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase flex items-center gap-2">
                <Car className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24]" />
                <span>Étape 2 : Sélectionnez votre véhicule</span>
              </h2>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Modifier dates
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-1">
              {vehicles.map((v) => {
                const isSelected = selectedVehicleId === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVehicleId(v.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-50/50 dark:bg-amber-500/10 border-[#FBBF24] shadow-md'
                        : 'bg-gray-50 dark:bg-[#181a22] border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="h-28 rounded-lg overflow-hidden bg-gray-100 dark:bg-black/40 mb-3">
                        <img
                          src={v.image}
                          alt={v.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase">{v.name}</h4>
                        <span className="text-[10px] text-gray-500 dark:text-zinc-400 uppercase font-semibold">{v.category}</span>
                      </div>
                      <div className="text-[11px] text-gray-600 dark:text-zinc-400 mt-1">
                        {v.transmission} · {v.fuel_type} · {v.seats} pl.
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-gray-200/60 dark:border-white/5 flex items-center justify-between">
                      <span className="text-sm font-black text-gray-900 dark:text-[#FBBF24]">
                        {new Intl.NumberFormat('fr-DZ').format(v.daily_price)} DA/j
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-black bg-[#FBBF24] text-gray-950 px-2 py-0.5 rounded">
                          Sélectionné
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chauffeur Option */}
            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 cursor-pointer">
              <input
                type="checkbox"
                checked={driverOption}
                onChange={(e) => setDriverOption(e.target.checked)}
                className="accent-[#FBBF24] w-4 h-4 rounded"
              />
              <div>
                <span className="text-xs font-bold text-gray-900 dark:text-white block">
                  Option avec chauffeur professionnel
                </span>
                <span className="text-[11px] text-gray-500 dark:text-zinc-400">
                  Idéal pour délégations d'affaires, mariages et circuits touristiques à Alger.
                </span>
              </div>
            </label>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-800 dark:text-white font-bold text-xs cursor-pointer"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={handleStep2Next}
                className="px-6 py-3.5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-gray-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Continuer avec {selectedVehicle.name}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CUSTOMER DETAILS & SUBMIT */}
        {currentStep === 3 && (
          <form
            onSubmit={handleSubmitBooking}
            className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 space-y-6 shadow-md dark:shadow-2xl transition-colors"
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white uppercase flex items-center gap-2">
                <User className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24]" />
                <span>Étape 3 : Vos Coordonnées de Contact</span>
              </h2>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-xs text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Modifier véhicule
              </button>
            </div>

            {/* Summary Recap card */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-gray-500 dark:text-zinc-500 text-[10px] block uppercase font-medium">Véhicule</span>
                <strong className="text-gray-900 dark:text-white font-bold">{selectedVehicle.name}</strong>
              </div>
              <div>
                <span className="text-gray-500 dark:text-zinc-500 text-[10px] block uppercase font-medium">Période</span>
                <span className="text-gray-700 dark:text-zinc-200 font-semibold">{daysCount} jours</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-zinc-500 text-[10px] block uppercase font-medium">Prise en charge</span>
                <span className="text-gray-700 dark:text-zinc-200 truncate block">{pickupLocation}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-zinc-500 text-[10px] block uppercase font-medium">Total indicatif</span>
                <strong className="text-gray-950 dark:text-[#FBBF24] font-black">
                  {new Intl.NumberFormat('fr-DZ').format(estimatedTotal)} DA
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
                  Nom et Prénom *
                </label>
                <input
                  type="text"
                  placeholder="ex: Mohamed B."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FBBF24]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
                  Numéro de Téléphone (ou WhatsApp) *
                </label>
                <input
                  type="tel"
                  placeholder="ex: 0550 12 34 56"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FBBF24]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
                  Adresse Email (facultatif)
                </label>
                <input
                  type="email"
                  placeholder="ex: votre-email@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FBBF24]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-zinc-300">
                  Message ou demande spécifique
                </label>
                <input
                  type="text"
                  placeholder="ex: besoin siège enfant, arrivée vol tardive..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#181a22] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#FBBF24]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-800 dark:text-white font-bold text-xs cursor-pointer"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-gray-950 font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: CONFIRMATION SUCCESS SCREEN */}
        {currentStep === 4 && (
          <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-[#12141a] border border-gray-200 dark:border-white/10 text-center space-y-6 shadow-md dark:shadow-2xl transition-colors">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#F59E0B] dark:text-[#FBBF24] uppercase tracking-widest">
                Demande Référence : {confirmedBookingId}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-gray-900 dark:text-white tracking-tight">
                Votre demande a bien été envoyée !
              </h2>
              <p className="text-xs text-gray-600 dark:text-zinc-400 max-w-md mx-auto">
                Notre équipe DZ RENT CAR va vérifier la disponibilité du véhicule ({selectedVehicle.name}) pour vos dates et vous contacter rapidement.
              </p>
            </div>

            {/* Direct Instant Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={generateWhatsAppLink(settings.whatsapp, 'booking', {
                  vehicleName: selectedVehicle.name,
                  customerName: customerName,
                  pickupDate: `${pickupDate} à ${pickupTime}`,
                  returnDate: `${returnDate} à ${returnTime}`,
                  pickupLocation: pickupLocation,
                  airportPickup: airportPickup,
                  flightNumber: flightNumber,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Ouvrir sur WhatsApp pour confirmation rapide</span>
              </a>

              <a
                href={generateCallLink(settings.primary_phone)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider border border-gray-200 dark:border-white/10 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#F59E0B] dark:text-[#FBBF24]" />
                <span>Appeler DZ RENT CAR</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
