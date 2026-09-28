import { Booking, BusinessSettings, FAQItem, Review, ServiceItem, Vehicle } from '../types';
import {
  INITIAL_BOOKINGS,
  INITIAL_BUSINESS_SETTINGS,
  INITIAL_FAQS,
  INITIAL_REVIEWS,
  INITIAL_SERVICES,
  INITIAL_VEHICLES,
} from '../data/seedData';

const SETTINGS_KEY = 'dz_rent_car_settings';
const VEHICLES_KEY = 'dz_rent_car_vehicles';
const BOOKINGS_KEY = 'dz_rent_car_bookings';
const REVIEWS_KEY = 'dz_rent_car_reviews';
const SERVICES_KEY = 'dz_rent_car_services';
const FAQS_KEY = 'dz_rent_car_faqs';

class DataService {
  // --- SETTINGS ---
  getSettings(): BusinessSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return INITIAL_BUSINESS_SETTINGS;
  }

  saveSettings(newSettings: BusinessSettings): BusinessSettings {
    const updated = {
      ...newSettings,
      updated_at: new Date().toISOString(),
    };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
    return updated;
  }

  // --- VEHICLES ---
  getVehicles(): Vehicle[] {
    try {
      const stored = localStorage.getItem(VEHICLES_KEY);
      if (stored) {
        const list: Vehicle[] = JSON.parse(stored);
        // Merge with INITIAL_VEHICLES to ensure complete technical specs are always present
        return INITIAL_VEHICLES.map((initial) => {
          const found = list.find((v) => v.id === initial.id);
          if (!found) return initial;
          return {
            ...initial,
            ...found,
            // Keep verified technical specs from initial if not set in local storage
            engine: found.engine || initial.engine,
            power_hp: found.power_hp || initial.power_hp,
            torque_nm: found.torque_nm || initial.torque_nm,
            luggage_capacity: found.luggage_capacity || initial.luggage_capacity,
            length_mm: found.length_mm || initial.length_mm,
            width_mm: found.width_mm || initial.width_mm,
            height_mm: found.height_mm || initial.height_mm,
            wheelbase_mm: found.wheelbase_mm || initial.wheelbase_mm,
            top_speed_kmh: found.top_speed_kmh || initial.top_speed_kmh,
            acceleration_0_100: found.acceleration_0_100 || initial.acceleration_0_100,
            combined_consumption: found.combined_consumption || initial.combined_consumption,
            climate_control: found.climate_control || initial.climate_control,
            parking_sensors: found.parking_sensors || initial.parking_sensors,
            specification_source: found.specification_source || initial.specification_source,
            specification_verified: found.specification_verified !== undefined ? found.specification_verified : initial.specification_verified,
            last_verified_at: found.last_verified_at || initial.last_verified_at,
          };
        });
      }
    } catch {
      // Fallback
    }
    // Seed initial
    try {
      localStorage.setItem(VEHICLES_KEY, JSON.stringify(INITIAL_VEHICLES));
    } catch {}
    return INITIAL_VEHICLES;
  }

  getVehicleBySlug(slug: string): Vehicle | undefined {
    return this.getVehicles().find((v) => v.slug === slug || v.id === slug);
  }

  saveVehicle(vehicle: Vehicle): Vehicle {
    const list = this.getVehicles();
    const existingIndex = list.findIndex((v) => v.id === vehicle.id);
    let updatedList: Vehicle[];

    if (existingIndex >= 0) {
      updatedList = [...list];
      updatedList[existingIndex] = {
        ...vehicle,
        updated_at: new Date().toISOString(),
      };
    } else {
      updatedList = [
        ...list,
        {
          ...vehicle,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
    }

    try {
      localStorage.setItem(VEHICLES_KEY, JSON.stringify(updatedList));
    } catch (err) {
      console.error('Failed to save vehicle:', err);
    }
    return vehicle;
  }

  deleteVehicle(id: string): boolean {
    const list = this.getVehicles();
    const filtered = list.filter((v) => v.id !== id);
    try {
      localStorage.setItem(VEHICLES_KEY, JSON.stringify(filtered));
      return true;
    } catch {
      return false;
    }
  }

  // --- BOOKINGS ---
  getBookings(): Booking[] {
    try {
      const stored = localStorage.getItem(BOOKINGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    try {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_BOOKINGS));
    } catch {}
    return INITIAL_BOOKINGS;
  }

  createBooking(
    bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'status'>
  ): { success: boolean; booking?: Booking; error?: string } {
    // Basic date check
    if (bookingData.pickup_date >= bookingData.return_date) {
      return {
        success: false,
        error: 'La date de retour doit être strictement postérieure à la date de départ.',
      };
    }

    // Overlap availability check
    const isAvailable = this.checkVehicleAvailability(
      bookingData.vehicle_id,
      bookingData.pickup_date,
      bookingData.return_date
    );

    if (!isAvailable) {
      return {
        success: false,
        error: 'Ce véhicule a déjà une réservation active sur cette période. Contactez-nous sur WhatsApp pour une alternative disponible.',
      };
    }

    const currentBookings = this.getBookings();
    const newId = `DZ-${1000 + currentBookings.length + 1}`;

    const newBooking: Booking = {
      ...bookingData,
      id: newId,
      status: 'new',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [newBooking, ...currentBookings];
    try {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to create booking:', err);
    }

    return { success: true, booking: newBooking };
  }

  updateBookingStatus(id: string, status: Booking['status'], adminNotes?: string): boolean {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) return false;

    // If confirming, re-check conflict server-side
    if (status === 'confirmed') {
      const target = bookings[index];
      const conflict = bookings.some(
        (b) =>
          b.id !== id &&
          b.vehicle_id === target.vehicle_id &&
          (b.status === 'confirmed' || b.status === 'pending') &&
          target.pickup_date < b.return_date &&
          target.return_date > b.pickup_date
      );

      if (conflict) {
        console.warn('Booking conflict detected for confirmation.');
      }
    }

    bookings[index] = {
      ...bookings[index],
      status,
      admin_notes: adminNotes !== undefined ? adminNotes : bookings[index].admin_notes,
      updated_at: new Date().toISOString(),
    };

    try {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
      return true;
    } catch {
      return false;
    }
  }

  // Overlap verification logic
  checkVehicleAvailability(
    vehicleId: string,
    pickupDate: string,
    returnDate: string,
    excludeBookingId?: string
  ): boolean {
    const bookings = this.getBookings();
    const conflicts = bookings.filter((b) => {
      if (b.vehicle_id !== vehicleId) return false;
      if (excludeBookingId && b.id === excludeBookingId) return false;
      if (b.status === 'cancelled' || b.status === 'completed') return false;

      // Overlap condition
      const overlap = pickupDate < b.return_date && returnDate > b.pickup_date;
      return overlap;
    });

    return conflicts.length === 0;
  }

  // Filter vehicles available for selected dates
  getAvailableVehicles(pickupDate?: string, returnDate?: string, category?: string): Vehicle[] {
    let vehicles = this.getVehicles().filter((v) => v.active);

    if (category && category !== 'Tous') {
      vehicles = vehicles.filter((v) => v.category === category);
    }

    if (pickupDate && returnDate && pickupDate < returnDate) {
      vehicles = vehicles.filter((v) =>
        this.checkVehicleAvailability(v.id, pickupDate, returnDate)
      );
    }

    return vehicles;
  }

  // --- REVIEWS ---
  getReviews(): Review[] {
    try {
      const stored = localStorage.getItem(REVIEWS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_REVIEWS;
  }

  saveReview(review: Review): void {
    const reviews = this.getReviews();
    const index = reviews.findIndex((r) => r.id === review.id);
    let updated: Review[];
    if (index >= 0) {
      updated = [...reviews];
      updated[index] = review;
    } else {
      updated = [review, ...reviews];
    }
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updated));
  }

  // --- SERVICES & FAQ ---
  getServices(): ServiceItem[] {
    try {
      const stored = localStorage.getItem(SERVICES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_SERVICES;
  }

  getFAQs(): FAQItem[] {
    try {
      const stored = localStorage.getItem(FAQS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_FAQS;
  }

  // Reset to initial seed data
  resetAllData(): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_BUSINESS_SETTINGS));
    localStorage.setItem(VEHICLES_KEY, JSON.stringify(INITIAL_VEHICLES));
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(INITIAL_REVIEWS));
    localStorage.setItem(SERVICES_KEY, JSON.stringify(INITIAL_SERVICES));
    localStorage.setItem(FAQS_KEY, JSON.stringify(INITIAL_FAQS));
  }
}

export const api = new DataService();
