/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { StickyMobileCTA } from './components/common/StickyMobileCTA';

import { HomeView } from './views/HomeView';
import { VehiclesView } from './views/VehiclesView';
import { VehicleDetailView } from './views/VehicleDetailView';
import { ServicesView } from './views/ServicesView';
import { AboutView } from './views/AboutView';
import { ReviewsView } from './views/ReviewsView';
import { FAQView } from './views/FAQView';
import { ContactView } from './views/ContactView';
import { BookingView } from './views/BookingView';
import { LegalView } from './views/LegalViews';
import { AdminLoginView } from './views/admin/AdminLoginView';
import { AdminDashboardView } from './views/admin/AdminDashboardView';

import { api } from './services/api';
import { BusinessSettings, FAQItem, Language, Review, Vehicle, Booking } from './types';

export default function App() {
  // App State
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  const [lang, setLang] = useState<Language>('fr');

  // Business Data
  const [settings, setSettings] = useState<BusinessSettings>(api.getSettings());
  const [vehicles, setVehicles] = useState<Vehicle[]>(api.getVehicles());
  const [bookings, setBookings] = useState<Booking[]>(api.getBookings());
  const [reviews, setReviews] = useState<Review[]>(api.getReviews());
  const [faqs, setFaqs] = useState<FAQItem[]>(api.getFAQs());

  // Selected vehicle for detail view
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Admin session
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('dz_admin_auth') === 'true';
  });

  // Booking initial parameters for deep link navigation
  const [bookingParams, setBookingParams] = useState<Record<string, any>>({});

  // Sync RTL / LTR based on language
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Refresh data function
  const refreshData = () => {
    setSettings(api.getSettings());
    setVehicles(api.getVehicles());
    setBookings(api.getBookings());
    setReviews(api.getReviews());
    setFaqs(api.getFAQs());
  };

  // Simple Router Handler
  const handleNavigate = (route: string) => {
    // Parse query params if any
    if (route.includes('?')) {
      const [path, queryStr] = route.split('?');
      const params = new URLSearchParams(queryStr);
      const extracted: Record<string, any> = {};
      params.forEach((val, key) => {
        extracted[key] = val;
      });
      setBookingParams(extracted);
      setCurrentRoute(path);
    } else {
      setBookingParams({});
      setCurrentRoute(route);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setCurrentRoute(`/vehicles/${vehicle.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookNowVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setBookingParams({ vehicle_id: vehicle.id });
    setCurrentRoute('/booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine if route is admin
  const isAdminRoute = currentRoute.startsWith('/admin');

  return (
    <div className={`min-h-screen bg-white dark:bg-[#0b0c10] text-gray-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200 ${lang === 'ar' ? 'font-arabic' : ''}`}>
      {/* Public Header (hidden on admin portal) */}
      {!isAdminRoute && (
        <Header
          settings={settings}
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          lang={lang}
          onLanguageChange={setLang}
        />
      )}

      {/* Main Content Router */}
      <main className="flex-1">
        {/* PUBLIC ROUTES */}
        {currentRoute === '/' && (
          <HomeView
            settings={settings}
            vehicles={vehicles}
            reviews={reviews}
            faqs={faqs}
            lang={lang}
            onNavigate={handleNavigate}
            onSelectVehicle={handleSelectVehicle}
          />
        )}

        {currentRoute === '/vehicles' && (
          <VehiclesView
            vehicles={vehicles}
            settings={settings}
            onSelectVehicle={handleSelectVehicle}
            onBookNow={handleBookNowVehicle}
            lang={lang}
          />
        )}

        {currentRoute.startsWith('/vehicles/') && (
          <VehicleDetailView
            vehicle={
              selectedVehicle ||
              vehicles.find((v) => v.slug === currentRoute.replace('/vehicles/', '')) ||
              vehicles[0]
            }
            settings={settings}
            onBack={() => handleNavigate('/vehicles')}
            onBookNow={handleBookNowVehicle}
            lang={lang}
          />
        )}

        {currentRoute === '/services' && (
          <ServicesView
            settings={settings}
            onBookNow={() => handleNavigate('/booking')}
            lang={lang}
          />
        )}

        {currentRoute === '/about' && (
          <AboutView
            settings={settings}
            onExploreFleet={() => handleNavigate('/vehicles')}
            lang={lang}
          />
        )}

        {currentRoute === '/reviews' && (
          <ReviewsView
            reviews={reviews}
            settings={settings}
            lang={lang}
          />
        )}

        {currentRoute === '/faq' && (
          <FAQView
            faqs={faqs}
            lang={lang}
          />
        )}

        {currentRoute === '/contact' && (
          <ContactView
            settings={settings}
            lang={lang}
          />
        )}

        {currentRoute === '/booking' && (
          <BookingView
            vehicles={vehicles}
            settings={settings}
            preselectedVehicleId={bookingParams.vehicle_id || selectedVehicle?.id}
            initialParams={bookingParams}
            lang={lang}
          />
        )}

        {currentRoute === '/privacy' && (
          <LegalView settings={settings} type="privacy" />
        )}

        {currentRoute === '/terms' && (
          <LegalView settings={settings} type="terms" />
        )}

        {/* ADMIN ROUTES */}
        {isAdminRoute && (
          <>
            {isAdminAuthenticated ? (
              <AdminDashboardView
                settings={settings}
                vehicles={vehicles}
                bookings={bookings}
                onRefreshData={refreshData}
                onLogout={() => {
                  localStorage.removeItem('dz_admin_auth');
                  setIsAdminAuthenticated(false);
                  handleNavigate('/');
                }}
              />
            ) : (
              <AdminLoginView
                onLoginSuccess={() => {
                  setIsAdminAuthenticated(true);
                  handleNavigate('/admin/dashboard');
                }}
                onBackToSite={() => handleNavigate('/')}
              />
            )}
          </>
        )}
      </main>

      {/* Public Footer */}
      {!isAdminRoute && (
        <Footer
          settings={settings}
          onNavigate={handleNavigate}
          lang={lang}
        />
      )}

      {/* Sticky Mobile CTA Bar */}
      {!isAdminRoute && <StickyMobileCTA settings={settings} />}
    </div>
  );
}
