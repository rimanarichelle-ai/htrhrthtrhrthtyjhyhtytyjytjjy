import React from 'react';
import { Hero } from '../components/home/Hero';
import { BookingWidget } from '../components/home/BookingWidget';
import { FleetSection } from '../components/home/FleetSection';
import { AirportSection } from '../components/home/AirportSection';
import { WhyDZRentCar } from '../components/home/WhyDZRentCar';
import { HowItWorks } from '../components/home/HowItWorks';
import { ReviewsSection } from '../components/home/ReviewsSection';
import { MapLocationSection } from '../components/home/MapLocationSection';
import { FAQSection } from '../components/home/FAQSection';
import { ContactCTA } from '../components/home/ContactCTA';
import { BusinessSettings, FAQItem, Language, Review, Vehicle } from '../types';
import primaryCarImage from '../assets/images/dz_fleet_hero.jpg';

interface HomeViewProps {
  settings: BusinessSettings;
  vehicles: Vehicle[];
  reviews: Review[];
  faqs: FAQItem[];
  lang: Language;
  onNavigate: (route: string) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  settings,
  vehicles,
  reviews,
  faqs,
  lang,
  onNavigate,
  onSelectVehicle,
}) => {
  return (
    <div className="flex flex-col bg-white dark:bg-[#0b0c10] transition-colors duration-200">
      {/* 1. Hero with panoramic Algiers Clio background */}
      <Hero
        settings={settings}
        backgroundImage="/images/hero_algiers_clio.jpg"
        onExploreVehicles={() => onNavigate('/vehicles')}
      />

      {/* 2. Quick Booking Widget */}
      <BookingWidget
        lang={lang}
        onCheckAvailability={(params) => {
          // Navigate to booking page with pre-filled state
          onNavigate(
            `/booking?category=${encodeURIComponent(params.category)}&pickup_date=${params.pickupDate}&return_date=${params.returnDate}&pickup_loc=${encodeURIComponent(params.pickupLocation)}`
          );
        }}
      />

      {/* 3. Featured Fleet */}
      <FleetSection
        vehicles={vehicles}
        whatsappNumber={settings.whatsapp}
        onSelectVehicle={onSelectVehicle}
        onBookNow={(vehicle) => {
          onNavigate(`/booking?vehicle_id=${vehicle.id}`);
        }}
        onViewAllFleet={() => onNavigate('/vehicles')}
        lang={lang}
      />

      {/* 4. Trust Pillars */}
      <WhyDZRentCar lang={lang} />

      {/* 5. Airport Service VIP */}
      <AirportSection
        onBookAirport={() => onNavigate('/booking?airport=true')}
        lang={lang}
      />

      {/* 6. How Booking Works */}
      <HowItWorks lang={lang} />

      {/* 7. Reviews */}
      <ReviewsSection
        reviews={reviews}
        googleRating={settings.google_rating}
        reviewsCount={settings.google_reviews_count}
      />

      {/* 8. Map & Service Area */}
      <MapLocationSection settings={settings} />

      {/* 9. FAQ */}
      <FAQSection faqs={faqs} />

      {/* 10. Final Call to Action */}
      <ContactCTA
        settings={settings}
        onExploreVehicles={() => onNavigate('/vehicles')}
      />
    </div>
  );
};
