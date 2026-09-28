/**
 * WhatsApp Deeplink Generator for DZ RENT CAR
 * Formats Algerian phone numbers and creates URL-encoded inquiry links
 */

export function sanitizePhoneNumber(phone: string): string {
  // Remove non-numeric characters except leading '+'
  const cleaned = phone.replace(/[^0-9+]/g, '');
  if (cleaned.startsWith('+')) {
    return cleaned.substring(1);
  }
  // Algerian local number starting with 0 (e.g. 0555333316 -> 213555333316)
  if (cleaned.startsWith('0') && cleaned.length >= 9) {
    return '213' + cleaned.substring(1);
  }
  return cleaned;
}

export interface WhatsAppInquiryParams {
  vehicleName?: string;
  pickupDate?: string;
  returnDate?: string;
  pickupLocation?: string;
  customerName?: string;
  airportPickup?: boolean;
  flightNumber?: string;
}

export function generateWhatsAppLink(
  phone: string,
  type: 'general' | 'vehicle' | 'booking' | 'airport',
  params?: WhatsAppInquiryParams
): string {
  const cleanPhone = sanitizePhoneNumber(phone || '213555333316');
  let message = '';

  switch (type) {
    case 'vehicle':
      message = `Bonjour DZ RENT CAR,\n\nJe souhaite louer le véhicule suivant :\n🚘 Véhicule : ${params?.vehicleName || 'Véhicule'}\n📅 Date de départ : ${params?.pickupDate || '[À préciser]'}\n📅 Date de retour : ${params?.returnDate || '[À préciser]'}\n📍 Lieu de récupération : ${params?.pickupLocation || 'Alger / Aéroport'}\n\nMerci de me confirmer la disponibilité et le tarif.`;
      break;

    case 'booking':
      message = `Bonjour DZ RENT CAR,\n\nJ'ai soumis une demande de réservation :\n👤 Nom : ${params?.customerName || '[Nom]'}\n🚘 Véhicule : ${params?.vehicleName || '[Véhicule]'}\n📅 Période : du ${params?.pickupDate || '...'} au ${params?.returnDate || '...'}\n📍 Lieu : ${params?.pickupLocation || 'Alger'}${params?.airportPickup ? '\n✈️ Prise en charge à l\'Aéroport d\'Alger' : ''}${params?.flightNumber ? ` (Vol: ${params.flightNumber})` : ''}\n\nPouvez-vous me confirmer la disponibilité ? Merci.`;
      break;

    case 'airport':
      message = `Bonjour DZ RENT CAR,\n\nJe souhaite réserver une livraison de véhicule directement à l'Aéroport d'Alger Houari Boumediene.\n📅 Date d'arrivée : ${params?.pickupDate || '[Date]'}\n✈️ Vol : ${params?.flightNumber || '[Numéro de vol]'}\n\nMerci de me recontacter pour finaliser.`;
      break;

    case 'general':
    default:
      message = `Bonjour DZ RENT CAR,\n\nJe souhaite obtenir des informations sur vos disponibilités et vos tarifs de location de voiture à Alger.`;
      break;
  }

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

export function generateCallLink(phone: string): string {
  const cleaned = phone.replace(/[^0-9+]/g, '');
  return `tel:${cleaned}`;
}
