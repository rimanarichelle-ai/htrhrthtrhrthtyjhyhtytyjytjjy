import React, { useState } from 'react';
import {
  Car,
  Calendar,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  MessageSquare,
  Plus,
  Trash2,
  Edit,
  Save,
  LogOut,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../../services/api';
import { vehicleSpecsService } from '../../services/vehicleSpecs';
import { Booking, BusinessSettings, Vehicle, VehicleCategory, FuelType, TransmissionType } from '../../types';
import { generateCallLink, generateWhatsAppLink } from '../../utils/whatsapp';

interface AdminDashboardViewProps {
  settings: BusinessSettings;
  vehicles: Vehicle[];
  bookings: Booking[];
  onRefreshData: () => void;
  onLogout: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  settings: initialSettings,
  vehicles: initialVehicles,
  bookings: initialBookings,
  onRefreshData,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'vehicles' | 'settings'>('overview');
  
  // Settings Form State
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Bookings State
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [bookingFilter, setBookingFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editingNote, setEditingNote] = useState('');

  // Vehicles State
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isNewVehicle, setIsNewVehicle] = useState(false);
  const [vehicleFilter, setVehicleFilter] = useState<'all' | 'completely_verified' | 'partially_verified' | 'needs_verification'>('all');
  const [vehicleSearch, setVehicleSearch] = useState('');

  // Status Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'all') return true;
    return b.status === bookingFilter;
  });

  // Overview metrics
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter((v) => v.available && v.active).length;
  const newRequests = bookings.filter((b) => b.status === 'new').length;
  const pendingRequests = bookings.filter((b) => b.status === 'pending').length;
  const confirmedRequests = bookings.filter((b) => b.status === 'confirmed').length;

  // Handlers
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    api.saveSettings(settings);
    setSettingsSaved(true);
    onRefreshData();
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleUpdateBookingStatus = (id: string, newStatus: Booking['status']) => {
    api.updateBookingStatus(id, newStatus, editingNote || undefined);
    const updated = api.getBookings();
    setBookings(updated);
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking({ ...selectedBooking, status: newStatus, admin_notes: editingNote || selectedBooking.admin_notes });
    }
    onRefreshData();
  };

  const handleToggleVehicleAvailability = (vehicle: Vehicle) => {
    const updated = { ...vehicle, available: !vehicle.available };
    api.saveVehicle(updated);
    setVehicles(api.getVehicles());
    onRefreshData();
  };

  const handleDeleteVehicle = (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce véhicule du catalogue ?')) {
      api.deleteVehicle(id);
      setVehicles(api.getVehicles());
      onRefreshData();
    }
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;
    api.saveVehicle(editingVehicle);
    setVehicles(api.getVehicles());
    setEditingVehicle(null);
    setIsNewVehicle(false);
    onRefreshData();
  };

  return (
    <div className="pt-24 pb-20 bg-[#f8fafc] dark:bg-[#090a0d] min-h-screen text-gray-900 dark:text-zinc-200 transition-colors duration-200">
      {/* Admin Top Header Bar */}
      <div className="bg-white dark:bg-[#12141c] border-b border-gray-200 dark:border-white/10 px-4 sm:px-8 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-[#FBBF24]/40 flex items-center justify-center text-gray-950 dark:text-[#FBBF24] font-black text-sm">
              DZ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black uppercase text-gray-900 dark:text-white tracking-wider">
                  Espace Administration DZ RENT CAR
                </h1>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                  En ligne
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                Gestion des réservations, flotte de véhicules et coordonnées officielles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm('Réinitialiser toutes les données aux valeurs de démonstration officielles ?')) {
                  api.resetAllData();
                  onRefreshData();
                  window.location.reload();
                }
              }}
              className="text-xs text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center gap-1.5 cursor-pointer"
              title="Réinitialiser les données seed"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Données</span>
            </button>

            <button
              onClick={onLogout}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 px-3.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-white/10 pb-4 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#FBBF24] text-gray-950 shadow-md font-black'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>Vue d'ensemble</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-[#FBBF24] text-gray-950 shadow-md font-black'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>Réservations</span>
            {newRequests > 0 && (
              <span className="w-5 h-5 rounded-full bg-gray-900 text-white dark:bg-white dark:text-zinc-900 text-[10px] font-black flex items-center justify-center">
                {newRequests}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'vehicles'
                ? 'bg-[#FBBF24] text-gray-950 shadow-md font-black'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span>Flotte ({totalVehicles})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#FBBF24] text-gray-950 shadow-md font-black'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Paramètres</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Critical Data Quality Banner (Prompt Section 2 & 61) */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <strong className="text-amber-300 uppercase tracking-wider text-xs block">
                    Vérification des Données Métier (Audit Interne)
                  </strong>
                  <p className="text-zinc-300">
                    Plusieurs numéros de contact ont été identifiés dans les sources (Affiches promo : <strong>05 61 86 77 16</strong>, WhatsApp : <strong>+213 555 333 316</strong>, Facebook : <strong>0555 33 33 15</strong>, Google : <strong>0541 96 49 00</strong>). Le numéro promo est actuellement le contact prioritaire sur l'ensemble du site. Vous pouvez ajuster cette configuration dans l'onglet <em>Coordonnées & Réglages</em>.
                  </p>
                </div>
              </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#12141c] border border-white/10">
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">
                  Nouvelles Demandes
                </span>
                <span className="text-3xl font-black text-amber-400 mt-2 block">
                  {newRequests}
                </span>
                <span className="text-[11px] text-zinc-500 mt-1 block">À traiter d'urgence</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#12141c] border border-white/10">
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">
                  En Attente (Pending)
                </span>
                <span className="text-3xl font-black text-sky-400 mt-2 block">
                  {pendingRequests}
                </span>
                <span className="text-[11px] text-zinc-500 mt-1 block">Vérification vol/client</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#12141c] border border-white/10">
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">
                  Confirmées Actives
                </span>
                <span className="text-3xl font-black text-emerald-400 mt-2 block">
                  {confirmedRequests}
                </span>
                <span className="text-[11px] text-zinc-500 mt-1 block">Réservations validées</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#12141c] border border-white/10">
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">
                  Véhicules Disponibles
                </span>
                <span className="text-3xl font-black text-white mt-2 block">
                  {availableVehicles} <span className="text-sm text-zinc-500 font-normal">/ {totalVehicles}</span>
                </span>
                <span className="text-[11px] text-zinc-500 mt-1 block">Flotte totale active</span>
              </div>
            </div>

            {/* Recent Bookings Quick Table */}
            <div className="p-6 rounded-2xl bg-[#12141c] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Dernières Demandes de Réservation
                </h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs text-[#FF6600] font-bold hover:underline flex items-center gap-1"
                >
                  <span>Voir tout</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="pb-3">Réf / Date</th>
                      <th className="pb-3">Client</th>
                      <th className="pb-3">Véhicule</th>
                      <th className="pb-3">Période</th>
                      <th className="pb-3">Lieu</th>
                      <th className="pb-3">Statut</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 font-mono font-bold text-white">{b.id}</td>
                        <td className="py-3">
                          <strong className="text-white block">{b.customer_name}</strong>
                          <span className="text-zinc-400 text-[11px]">{b.customer_phone}</span>
                        </td>
                        <td className="py-3 text-zinc-200">{b.vehicle_name}</td>
                        <td className="py-3 text-zinc-400">
                          {b.pickup_date} → {b.return_date} ({b.total_days || 1}j)
                        </td>
                        <td className="py-3 text-zinc-300 truncate max-w-[150px]">
                          {b.airport_pickup ? '✈️ Aéroport d\'Alger' : b.pickup_location}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              b.status === 'confirmed'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : b.status === 'new'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : b.status === 'pending'
                                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                : 'bg-zinc-700/30 text-zinc-400'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-2">
                          <a
                            href={generateCallLink(b.customer_phone)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white inline-block"
                            title="Appeler le client"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#FF6600]" />
                          </a>
                          <a
                            href={generateWhatsAppLink(b.customer_phone, 'general')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] inline-block"
                            title="WhatsApp Client"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => {
                              setSelectedBooking(b);
                              setEditingNote(b.admin_notes || '');
                              setActiveTab('bookings');
                            }}
                            className="px-2.5 py-1 rounded bg-[#FF6600]/20 text-[#FF6600] font-bold text-[11px] hover:bg-[#FF6600]/30"
                          >
                            Gérer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: BOOKINGS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Status Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#12141c] border border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-zinc-400 uppercase mr-1">Filtrer par statut :</span>
                {['all', 'new', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                      bookingFilter === st
                        ? 'bg-[#FF6600] text-white shadow'
                        : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {st === 'all' ? 'Toutes' : st}
                  </button>
                ))}
              </div>

              <span className="text-xs text-zinc-400">
                {filteredBookings.length} réservation(s)
              </span>
            </div>

            {/* Detail Modal / Panel if selected */}
            {selectedBooking && (
              <div className="p-6 rounded-2xl bg-[#181a24] border border-[#FF6600]/40 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                      <span>Détail Réservation {selectedBooking.id}</span>
                      <span className="text-xs text-[#FF6600]">({selectedBooking.vehicle_name})</span>
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Reçue le {new Date(selectedBooking.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="text-xs text-zinc-400 hover:text-white font-bold"
                  >
                    ✕ Fermer
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-zinc-500 uppercase font-semibold text-[10px]">Client</span>
                    <strong className="text-white block text-sm">{selectedBooking.customer_name}</strong>
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={generateCallLink(selectedBooking.customer_phone)}
                        className="text-[#FF6600] font-bold hover:underline"
                      >
                        {selectedBooking.customer_phone}
                      </a>
                      <a
                        href={generateWhatsAppLink(selectedBooking.customer_phone, 'general')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#25D366] font-bold text-[10px] bg-[#25D366]/20 px-1.5 py-0.5 rounded"
                      >
                        WhatsApp
                      </a>
                    </div>
                    {selectedBooking.customer_email && (
                      <span className="text-zinc-400 text-[11px] block">{selectedBooking.customer_email}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-zinc-500 uppercase font-semibold text-[10px]">Période de Location</span>
                    <p className="text-zinc-200">
                      Du <strong>{selectedBooking.pickup_date}</strong> ({selectedBooking.pickup_time})<br />
                      Au <strong>{selectedBooking.return_date}</strong> ({selectedBooking.return_time})
                    </p>
                    <span className="text-[#FF6600] font-bold text-[11px]">
                      Durée : {selectedBooking.total_days || 1} jours
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-zinc-500 uppercase font-semibold text-[10px]">Lieu & Options</span>
                    <p className="text-zinc-200">{selectedBooking.pickup_location}</p>
                    {selectedBooking.flight_number && (
                      <span className="text-sky-400 font-bold block text-[11px]">
                        ✈️ Vol : {selectedBooking.flight_number}
                      </span>
                    )}
                    {selectedBooking.driver_option && (
                      <span className="text-amber-400 font-bold block text-[11px]">
                        Avec chauffeur
                      </span>
                    )}
                    {selectedBooking.message && (
                      <p className="text-zinc-400 italic text-[11px] mt-1">
                        Message : « {selectedBooking.message} »
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Switcher & Notes */}
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-zinc-400">Modifier le Statut :</span>
                    {(['new', 'pending', 'confirmed', 'completed', 'cancelled'] as Booking['status'][]).map(
                      (st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateBookingStatus(selectedBooking.id, st)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                            selectedBooking.status === st
                              ? 'bg-[#FF6600] text-white shadow'
                              : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                          }`}
                        >
                          {st}
                        </button>
                      )
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-zinc-400">
                      Notes internes pour l'équipe (visible admin uniquement) :
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingNote}
                        onChange={(e) => setEditingNote(e.target.value)}
                        placeholder="ex: Client habituel, vol retardé de 30min, remise des clés effectuée par Mourad..."
                        className="flex-1 bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                      <button
                        onClick={() => handleUpdateBookingStatus(selectedBooking.id, selectedBooking.status)}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold"
                      >
                        Enregistrer note
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Table */}
            <div className="p-6 rounded-2xl bg-[#12141c] border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="pb-3">Réf</th>
                      <th className="pb-3">Client</th>
                      <th className="pb-3">Véhicule</th>
                      <th className="pb-3">Dates</th>
                      <th className="pb-3">Prise en charge</th>
                      <th className="pb-3">Statut</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-white/[0.02]">
                        <td className="py-3.5 font-mono font-bold text-white">{b.id}</td>
                        <td className="py-3.5">
                          <strong className="text-white block">{b.customer_name}</strong>
                          <span className="text-zinc-400 text-[11px]">{b.customer_phone}</span>
                        </td>
                        <td className="py-3.5 text-zinc-200">{b.vehicle_name}</td>
                        <td className="py-3.5 text-zinc-300">
                          {b.pickup_date} → {b.return_date}
                        </td>
                        <td className="py-3.5 text-zinc-300 truncate max-w-[140px]">
                          {b.airport_pickup ? '✈️ Aéroport' : b.pickup_location}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              b.status === 'confirmed'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : b.status === 'new'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : b.status === 'pending'
                                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                : 'bg-zinc-700/30 text-zinc-400'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedBooking(b);
                              setEditingNote(b.admin_notes || '');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
                          >
                            Ouvrir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: VEHICLES MANAGEMENT & SPEC QUALITY CONTROL */}
        {/* ========================================================================= */}
        {activeTab === 'vehicles' && (() => {
          // Compute quality stats
          const vehicleValidations = vehicles.map((v) => ({
            vehicle: v,
            validation: vehicleSpecsService.validateVehicleSpecs(v),
          }));

          const completelyVerifiedCount = vehicleValidations.filter(
            (item) => item.validation.verificationStatus === 'COMPLETELY VERIFIED'
          ).length;
          const partiallyVerifiedCount = vehicleValidations.filter(
            (item) => item.validation.verificationStatus === 'PARTIALLY VERIFIED'
          ).length;
          const needsVerificationCount = vehicleValidations.filter(
            (item) => item.validation.verificationStatus === 'NEEDS VERIFICATION'
          ).length;

          // Filter vehicles
          const displayedVehicles = vehicleValidations.filter(({ vehicle, validation }) => {
            if (vehicleFilter === 'completely_verified' && validation.verificationStatus !== 'COMPLETELY VERIFIED') return false;
            if (vehicleFilter === 'partially_verified' && validation.verificationStatus !== 'PARTIALLY VERIFIED') return false;
            if (vehicleFilter === 'needs_verification' && validation.verificationStatus !== 'NEEDS VERIFICATION') return false;
            
            if (vehicleSearch.trim() !== '') {
              const q = vehicleSearch.toLowerCase();
              const matchName = vehicle.name.toLowerCase().includes(q);
              const matchBrand = vehicle.brand.toLowerCase().includes(q);
              const matchModel = (vehicle.model || '').toLowerCase().includes(q);
              if (!matchName && !matchBrand && !matchModel) return false;
            }
            return true;
          });

          return (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black uppercase text-white tracking-wider flex items-center gap-2">
                    <span>Gestion de la Flotte & Contrôle Qualité ({vehicles.length} Véhicules)</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Audit des spécifications techniques, taux de complétude et gestion des disponibilités
                  </p>
                </div>

                <button
                  onClick={() => {
                    const emptyVehicle: Vehicle = {
                      id: `v-${Date.now()}`,
                      name: '',
                      slug: '',
                      brand: '',
                      model: '',
                      category: 'Citadine',
                      image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80',
                      description: '',
                      daily_price: 7000,
                      currency: 'DA',
                      fuel_type: 'Essence',
                      transmission: 'Automatique',
                      seats: 5,
                      doors: 5,
                      luggage: 2,
                      year: 2023,
                      available: true,
                      featured: false,
                      active: true,
                      sort_order: vehicles.length + 1,
                      is_verified_price: true,
                      specification_verified: false,
                      specification_source: 'À confirmer',
                      last_verified_at: new Date().toISOString().split('T')[0],
                    };
                    setEditingVehicle(emptyVehicle);
                    setIsNewVehicle(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#FF6600] hover:bg-[#e65c00] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-[#FF6600]/25"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau Véhicule</span>
                </button>
              </div>

              {/* Quality Control KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#12141c] border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-zinc-500 uppercase font-bold text-[10px] block">Flotte Totale</span>
                    <strong className="text-xl font-black text-white">{vehicles.length}</strong>
                    <span className="text-[11px] text-zinc-400 block mt-0.5">Modèles référencés</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 text-zinc-300">
                    <Car className="w-5 h-5" />
                  </div>
                </div>

                <div
                  onClick={() => setVehicleFilter('completely_verified')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    vehicleFilter === 'completely_verified'
                      ? 'bg-emerald-500/15 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                      : 'bg-[#12141c] border-emerald-500/20 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-emerald-400 uppercase font-bold text-[10px] block">Complètement Vérifiés</span>
                      <strong className="text-xl font-black text-emerald-400">{completelyVerifiedCount}</strong>
                      <span className="text-[11px] text-emerald-400/80 block mt-0.5">
                        {Math.round((completelyVerifiedCount / (vehicles.length || 1)) * 100)}% de la flotte
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setVehicleFilter('partially_verified')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    vehicleFilter === 'partially_verified'
                      ? 'bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : 'bg-[#12141c] border-amber-500/20 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-amber-400 uppercase font-bold text-[10px] block">Partiellement Vérifiés</span>
                      <strong className="text-xl font-black text-amber-400">{partiallyVerifiedCount}</strong>
                      <span className="text-[11px] text-amber-400/80 block mt-0.5">Complétude &lt; 70%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setVehicleFilter('needs_verification')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    vehicleFilter === 'needs_verification'
                      ? 'bg-rose-500/15 border-rose-500/50 shadow-lg shadow-rose-500/10'
                      : 'bg-[#12141c] border-rose-500/20 hover:border-rose-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-rose-400 uppercase font-bold text-[10px] block">À Vérifier / Modèle incertain</span>
                      <strong className="text-xl font-black text-rose-400">{needsVerificationCount}</strong>
                      <span className="text-[11px] text-rose-400/80 block mt-0.5">Modèle à confirmer</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#12141c] border border-white/10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase mr-1">Statut Spécifications :</span>
                  {[
                    { id: 'all', label: `Tous (${vehicles.length})` },
                    { id: 'completely_verified', label: `Vérifiés (${completelyVerifiedCount})` },
                    { id: 'partially_verified', label: `Partiels (${partiallyVerifiedCount})` },
                    { id: 'needs_verification', label: `À vérifier (${needsVerificationCount})` },
                  ].map((filterTab) => (
                    <button
                      key={filterTab.id}
                      onClick={() => setVehicleFilter(filterTab.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                        vehicleFilter === filterTab.id
                          ? 'bg-[#FF6600] text-white shadow'
                          : 'bg-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {filterTab.label}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[240px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                    placeholder="Rechercher par modèle, marque..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FF6600]"
                  />
                </div>
              </div>

              {/* Vehicle Edit Modal */}
              {editingVehicle && (
                <form
                  onSubmit={handleSaveVehicle}
                  className="p-6 rounded-2xl bg-[#181a24] border border-[#FF6600]/40 space-y-4 shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h4 className="text-sm font-black text-white uppercase">
                      {isNewVehicle ? 'Ajouter un Véhicule' : `Modifier ${editingVehicle.name}`}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setEditingVehicle(null)}
                      className="text-xs text-zinc-400 hover:text-white"
                    >
                      ✕ Annuler
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase">Nom complet *</label>
                      <input
                        type="text"
                        required
                        value={editingVehicle.name}
                        onChange={(e) =>
                          setEditingVehicle({
                            ...editingVehicle,
                            name: e.target.value,
                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                          })
                        }
                        className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase">Marque *</label>
                      <input
                        type="text"
                        required
                        value={editingVehicle.brand}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, brand: e.target.value })}
                        className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase">Modèle / Finition</label>
                      <input
                        type="text"
                        value={editingVehicle.model}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, model: e.target.value })}
                        className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase">Génération</label>
                      <input
                        type="text"
                        value={editingVehicle.generation || ''}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, generation: e.target.value })}
                        placeholder="ex: Tiguan II Facelift"
                        className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase">Version / Trim</label>
                      <input
                        type="text"
                        value={editingVehicle.trim || ''}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, trim: e.target.value })}
                        placeholder="ex: R-Line / Elegance"
                        className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase">Moteur / Motorisation</label>
                      <input
                        type="text"
                        value={editingVehicle.engine || ''}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, engine: e.target.value })}
                        placeholder="ex: 2.0 TDI 150ch"
                        className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase">Puissance (ch)</label>
                      <input
                        type="number"
                        value={editingVehicle.power_hp || ''}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, power_hp: parseInt(e.target.value, 10) || undefined })}
                        placeholder="ex: 150"
                        className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase">Couple (Nm)</label>
                      <input
                        type="number"
                        value={editingVehicle.torque_nm || ''}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, torque_nm: parseInt(e.target.value, 10) || undefined })}
                        placeholder="ex: 360"
                        className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase">Catégorie</label>
                      <select
                        value={editingVehicle.category}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, category: e.target.value as VehicleCategory })}
                        className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white"
                      >
                        <option value="SUV">SUV</option>
                        <option value="Citadine">Citadine</option>
                        <option value="Berline">Berline</option>
                        <option value="Compacte">Compacte</option>
                        <option value="Crossover">Crossover</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase">Tarif / jour (DA) *</label>
                      <input
                        type="number"
                        required
                        value={editingVehicle.daily_price}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, daily_price: parseInt(e.target.value, 10) || 0 })}
                        className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white font-bold text-[#FF6600]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase">Tarif Semaine (DA)</label>
                      <input
                        type="number"
                        value={editingVehicle.weekly_price || ''}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, weekly_price: parseInt(e.target.value, 10) || undefined })}
                        placeholder="ex: 85000"
                        className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase">Tarif Mois (DA)</label>
                      <input
                        type="number"
                        value={editingVehicle.monthly_price || ''}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, monthly_price: parseInt(e.target.value, 10) || undefined })}
                        placeholder="ex: 320000"
                        className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase">Boîte de vitesses</label>
                      <select
                        value={editingVehicle.transmission}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, transmission: e.target.value as TransmissionType })}
                        className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white"
                      >
                        <option value="Automatique">Automatique</option>
                        <option value="Manuelle">Manuelle</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase">Carburant</label>
                      <select
                        value={editingVehicle.fuel_type}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, fuel_type: e.target.value as FuelType })}
                        className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white"
                      >
                        <option value="Essence">Essence</option>
                        <option value="Diesel">Diesel</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase">Places</label>
                      <input
                        type="number"
                        value={editingVehicle.seats}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, seats: parseInt(e.target.value, 10) || 5 })}
                        className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase">Volume Coffre (L)</label>
                      <input
                        type="number"
                        value={editingVehicle.luggage_capacity || ''}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, luggage_capacity: parseInt(e.target.value, 10) || undefined })}
                        placeholder="ex: 520"
                        className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase">Année Modèle</label>
                      <input
                        type="number"
                        value={editingVehicle.model_year || editingVehicle.year}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, model_year: parseInt(e.target.value, 10) || 2023, year: parseInt(e.target.value, 10) || 2023 })}
                        className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase">Source de Vérification</label>
                      <input
                        type="text"
                        value={editingVehicle.specification_source || ''}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, specification_source: e.target.value })}
                        placeholder="ex: Documentation officielle constructeur Volkswagen"
                        className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase">URL de l'image (haute résolution)</label>
                    <input
                      type="url"
                      value={editingVehicle.image}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, image: e.target.value })}
                      className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase">Description</label>
                    <textarea
                      rows={2}
                      value={editingVehicle.description}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, description: e.target.value })}
                      className="w-full bg-[#12141c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={editingVehicle.available}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, available: e.target.checked })}
                        className="accent-[#FF6600]"
                      />
                      <span>Disponible à la location</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={editingVehicle.featured}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, featured: e.target.checked })}
                        className="accent-[#FF6600]"
                      />
                      <span>Mettre en avant sur l'accueil</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={editingVehicle.specification_verified !== false}
                        onChange={(e) => setEditingVehicle({ ...editingVehicle, specification_verified: e.target.checked })}
                        className="accent-emerald-500"
                      />
                      <span className="text-emerald-400 font-bold">Spécifications validées</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setEditingVehicle(null)}
                      className="px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs font-bold"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-[#FF6600] text-white text-xs font-bold uppercase tracking-wider"
                    >
                      Sauvegarder le Véhicule
                    </button>
                  </div>
                </form>
              )}

              {/* Vehicles Table */}
              <div className="p-6 rounded-2xl bg-[#12141c] border border-white/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
                        <th className="pb-3">Véhicule</th>
                        <th className="pb-3">Catégorie</th>
                        <th className="pb-3">Tarif / jour</th>
                        <th className="pb-3">Contrôle Qualité & Complétude</th>
                        <th className="pb-3">Disponibilité</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {displayedVehicles.map(({ vehicle: v, validation }) => (
                        <tr key={v.id} className="hover:bg-white/[0.02]">
                          <td className="py-3.5 flex items-center gap-3">
                            <img
                              src={v.image}
                              alt={v.name}
                              className="w-12 h-9 rounded object-cover border border-white/10 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <strong className="text-white block font-black">{v.name}</strong>
                                {v.id === 'geely-livan' && (
                                  <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 py-0.2 rounded text-[9px] font-black uppercase">
                                    Modèle à confirmer
                                  </span>
                                )}
                              </div>
                              <span className="text-zinc-500 text-[11px]">
                                {v.generation || v.model} · {v.engine || 'Moteur non renseigné'}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5">
                            <span className="bg-white/5 text-zinc-300 px-2 py-0.5 rounded text-[11px] font-semibold">
                              {v.category}
                            </span>
                          </td>
                          <td className="py-3.5 font-bold text-[#FF6600]">
                            {new Intl.NumberFormat('fr-DZ').format(v.daily_price)} DA
                          </td>
                          <td className="py-3.5">
                            <div className="space-y-1.5 max-w-[220px]">
                              <div className="flex items-center justify-between text-[11px]">
                                <span
                                  className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 ${
                                    validation.verificationStatus === 'COMPLETELY VERIFIED'
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                      : validation.verificationStatus === 'PARTIALLY VERIFIED'
                                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  }`}
                                >
                                  {validation.verificationStatus === 'COMPLETELY VERIFIED' && <CheckCircle className="w-2.5 h-2.5" />}
                                  {validation.verificationStatus === 'NEEDS VERIFICATION' && <AlertTriangle className="w-2.5 h-2.5" />}
                                  <span>{validation.verificationStatus}</span>
                                </span>
                                <span className="font-mono font-bold text-zinc-300">
                                  {validation.completenessScore}%
                                </span>
                              </div>

                              {/* Progress bar */}
                              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    validation.completenessScore >= 80
                                      ? 'bg-emerald-500'
                                      : validation.completenessScore >= 50
                                      ? 'bg-amber-500'
                                      : 'bg-rose-500'
                                  }`}
                                  style={{ width: `${validation.completenessScore}%` }}
                                />
                              </div>

                              <p className="text-[10px] text-zinc-500 truncate" title={validation.statusReason}>
                                {validation.statusReason}
                              </p>
                            </div>
                          </td>
                          <td className="py-3.5">
                            <button
                              onClick={() => handleToggleVehicleAvailability(v)}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase cursor-pointer transition-colors ${
                                v.available
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                                  : 'bg-zinc-700/40 text-zinc-400 hover:bg-zinc-700/60'
                              }`}
                            >
                              {v.available ? 'Disponible' : 'Indisponible'}
                            </button>
                          </td>
                          <td className="py-3.5 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingVehicle(v);
                                setIsNewVehicle(false);
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white inline-block"
                              title="Modifier les caractéristiques"
                            >
                              <Edit className="w-3.5 h-3.5 text-[#FF6600]" />
                            </button>
                            <button
                              onClick={() => handleDeleteVehicle(v.id)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 inline-block"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ========================================================================= */}
        {/* TAB 4: SETTINGS & CENTRALIZED BUSINESS INFO */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <form
            onSubmit={handleSaveSettings}
            className="p-6 sm:p-8 rounded-2xl bg-[#12141c] border border-white/10 space-y-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-black uppercase text-white tracking-wider">
                  Paramètres Métier Centralisés (DZ RENT CAR)
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Toute modification ici met à jour immédiatement les boutons d'appel, WhatsApp, le header et le footer public.
                </p>
              </div>

              {settingsSaved && (
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                  <CheckCircle className="w-4 h-4" />
                  <span>Modifications enregistrées !</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                  Nom commercial
                </label>
                <input
                  type="text"
                  value={settings.business_name}
                  onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                  className="w-full bg-[#181a22] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                  Slogan officiel
                </label>
                <input
                  type="text"
                  value={settings.brand_subtitle}
                  onChange={(e) => setSettings({ ...settings, brand_subtitle: e.target.value })}
                  className="w-full bg-[#181a22] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              {/* CRITICAL: Primary Phone */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#FF6600] uppercase tracking-wider flex items-center gap-1">
                  <span>Numéro Téléphonique Principal (Boutons d'appel) *</span>
                </label>
                <input
                  type="text"
                  value={settings.primary_phone}
                  onChange={(e) => setSettings({ ...settings, primary_phone: e.target.value })}
                  placeholder="ex: 05 61 86 77 16"
                  className="w-full bg-[#181a22] border border-[#FF6600]/40 rounded-xl px-3.5 py-2.5 text-white font-bold"
                  required
                />
                <span className="text-[10px] text-zinc-400 block">
                  Actuel : {settings.primary_phone} (affiche promotionnelle officielle)
                </span>
              </div>

              {/* Secondary Phone */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                  Numéro Téléphonique Secondaire
                </label>
                <input
                  type="text"
                  value={settings.secondary_phone}
                  onChange={(e) => setSettings({ ...settings, secondary_phone: e.target.value })}
                  placeholder="ex: 0555 33 33 15"
                  className="w-full bg-[#181a22] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                />
                <span className="text-[10px] text-zinc-400 block">
                  Autre numéro visible sur Facebook : 0555 33 33 15
                </span>
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#25D366] uppercase tracking-wider">
                  Numéro WhatsApp (Deeplinks) *
                </label>
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#25D366]/40 rounded-xl px-3.5 py-2.5 text-white font-bold"
                  required
                />
                <span className="text-[10px] text-zinc-400 block">
                  Numéro au format international E.164 (ex: +213 555 333 316)
                </span>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                  Email de contact
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full bg-[#181a22] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              {/* Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                  Adresse de l'agence (Dar El Beïda, Alger)
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-[#181a22] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              {/* Social Channels */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                  Lien / Compte TikTok
                </label>
                <input
                  type="text"
                  value={settings.tiktok}
                  onChange={(e) => setSettings({ ...settings, tiktok: e.target.value })}
                  className="w-full bg-[#181a22] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                  Lien Instagram
                </label>
                <input
                  type="text"
                  value={settings.instagram}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  className="w-full bg-[#181a22] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              {/* Google Reviews */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                  Note Google (ex: 5.0)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.google_rating}
                  onChange={(e) => setSettings({ ...settings, google_rating: parseFloat(e.target.value) || 5.0 })}
                  className="w-full bg-[#181a22] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                  Nombre d'avis Google vérifiés
                </label>
                <input
                  type="number"
                  value={settings.google_reviews_count}
                  onChange={(e) => setSettings({ ...settings, google_reviews_count: parseInt(e.target.value, 10) || 126 })}
                  className="w-full bg-[#181a22] border border-white/10 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl bg-[#FF6600] hover:bg-[#e65c00] active:scale-[0.98] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#FF6600]/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer les Paramètres Publics</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
