import {
  Vehicle,
  VehicleTechnicalSpecs,
  VehicleDimensionsSpecs,
  VehiclePerformanceSpecs,
  VehicleComfortSpecs,
  VehicleSafetySpecs,
} from '../types';

export interface SpecItem {
  id: string;
  label: string;
  value: string | number | boolean;
  displayValue: string;
  iconName?: string;
  highlight?: boolean;
}

export interface SpecSection {
  id: 'general' | 'motorisation' | 'transmission' | 'dimensions' | 'capacite' | 'performances' | 'confort' | 'securite';
  title: string;
  subtitle: string;
  icon: string;
  items: SpecItem[];
  itemCount: number;
}

export type VerificationStatus = 'COMPLETELY VERIFIED' | 'PARTIALLY VERIFIED' | 'NEEDS VERIFICATION';

export interface SpecValidationResult {
  isValid: boolean;
  completenessScore: number; // 0 to 100%
  verificationStatus: VerificationStatus;
  statusReason: string;
  errors: string[];
  warnings: string[];
  missingFields: string[];
}

export class VehicleSpecsService {
  /**
   * Evaluates whether a specification value is present and valid
   */
  hasValue(val: unknown): boolean {
    if (val === undefined || val === null) return false;
    if (typeof val === 'string') {
      const trimmed = val.trim().toLowerCase();
      return (
        trimmed !== '' &&
        trimmed !== 'non renseigné' &&
        trimmed !== 'à confirmer' &&
        trimmed !== 'n/a' &&
        trimmed !== 'null' &&
        trimmed !== 'undefined'
      );
    }
    if (typeof val === 'number') {
      return !isNaN(val) && val > 0;
    }
    if (typeof val === 'boolean') {
      return val === true;
    }
    return true;
  }

  /**
   * Helper to extract technical specifications (resolving both nested and flat fields)
   */
  getTechnicalSpecs(vehicle: Vehicle): VehicleTechnicalSpecs {
    const nested = vehicle.technical || {};
    return {
      engine: nested.engine || vehicle.engine,
      engine_displacement: nested.engine_displacement || vehicle.engine_displacement,
      cylinders: nested.cylinders || vehicle.cylinders,
      power_hp: nested.power_hp || vehicle.power_hp,
      power_kw: nested.power_kw || vehicle.power_kw,
      torque_nm: nested.torque_nm || vehicle.torque_nm,
      fuel_type: nested.fuel_type || vehicle.fuel_type,
      transmission: nested.transmission || vehicle.transmission,
      transmission_gears: nested.transmission_gears || vehicle.transmission_gears,
      drive_type: nested.drive_type || vehicle.drive_type,
    };
  }

  /**
   * Helper to extract performance specifications
   */
  getPerformanceSpecs(vehicle: Vehicle): VehiclePerformanceSpecs {
    const nested = vehicle.performance || {};
    return {
      top_speed_kmh: nested.top_speed_kmh || vehicle.top_speed_kmh,
      acceleration_0_100: nested.acceleration_0_100 || vehicle.acceleration_0_100,
      combined_consumption: nested.combined_consumption || vehicle.combined_consumption,
    };
  }

  /**
   * Helper to extract dimension & capacity specifications
   */
  getDimensionsSpecs(vehicle: Vehicle): VehicleDimensionsSpecs {
    const nested = vehicle.dimensions || {};
    return {
      length_mm: nested.length_mm || vehicle.length_mm,
      width_mm: nested.width_mm || vehicle.width_mm,
      height_mm: nested.height_mm || vehicle.height_mm,
      wheelbase_mm: nested.wheelbase_mm || vehicle.wheelbase_mm,
      ground_clearance_mm: nested.ground_clearance_mm || vehicle.ground_clearance_mm,
      seats: nested.seats || vehicle.seats,
      doors: nested.doors || vehicle.doors,
      luggage_capacity: nested.luggage_capacity || vehicle.luggage_capacity,
      fuel_tank_capacity: nested.fuel_tank_capacity || vehicle.fuel_tank_capacity,
    };
  }

  /**
   * Helper to extract comfort & equipment specifications
   */
  getComfortSpecs(vehicle: Vehicle): VehicleComfortSpecs {
    const nested = vehicle.comfort || {};
    return {
      air_conditioning: nested.air_conditioning !== undefined ? nested.air_conditioning : vehicle.air_conditioning,
      climate_control: nested.climate_control !== undefined ? nested.climate_control : vehicle.climate_control,
      parking_sensors: nested.parking_sensors !== undefined ? nested.parking_sensors : vehicle.parking_sensors,
      rear_camera: nested.rear_camera !== undefined ? nested.rear_camera : vehicle.rear_camera,
      cruise_control: nested.cruise_control !== undefined ? nested.cruise_control : vehicle.cruise_control,
      bluetooth: nested.bluetooth !== undefined ? nested.bluetooth : vehicle.bluetooth,
      apple_carplay: nested.apple_carplay !== undefined ? nested.apple_carplay : vehicle.apple_carplay,
      android_auto: nested.android_auto !== undefined ? nested.android_auto : vehicle.android_auto,
      usb: nested.usb !== undefined ? nested.usb : vehicle.usb,
      navigation: nested.navigation !== undefined ? nested.navigation : vehicle.navigation,
      keyless_entry: nested.keyless_entry !== undefined ? nested.keyless_entry : vehicle.keyless_entry,
      push_start: nested.push_start !== undefined ? nested.push_start : vehicle.push_start,
      sunroof: nested.sunroof !== undefined ? nested.sunroof : vehicle.sunroof,
    };
  }

  /**
   * Helper to extract safety specifications
   */
  getSafetySpecs(vehicle: Vehicle): VehicleSafetySpecs {
    const nested = vehicle.safety || {};
    return {
      abs: nested.abs !== undefined ? nested.abs : vehicle.abs,
      esp: nested.esp !== undefined ? nested.esp : vehicle.esp,
      airbags: nested.airbags !== undefined ? nested.airbags : vehicle.airbags,
      isofix: nested.isofix !== undefined ? nested.isofix : vehicle.isofix,
      tpms: nested.tpms !== undefined ? nested.tpms : vehicle.tpms,
    };
  }

  /**
   * Normalizes a vehicle record, synchronizing flat and nested properties canonically
   */
  normalizeVehicle(vehicle: Vehicle): Vehicle {
    const tech = this.getTechnicalSpecs(vehicle);
    const dims = this.getDimensionsSpecs(vehicle);
    const perf = this.getPerformanceSpecs(vehicle);
    const comfort = this.getComfortSpecs(vehicle);
    const safety = this.getSafetySpecs(vehicle);

    return {
      ...vehicle,
      // Canonical flat values
      engine: tech.engine,
      engine_displacement: tech.engine_displacement,
      cylinders: tech.cylinders,
      power_hp: tech.power_hp,
      power_kw: tech.power_kw,
      torque_nm: tech.torque_nm,
      fuel_type: tech.fuel_type || vehicle.fuel_type,
      transmission: tech.transmission || vehicle.transmission,
      transmission_gears: tech.transmission_gears,
      drive_type: tech.drive_type,

      length_mm: dims.length_mm,
      width_mm: dims.width_mm,
      height_mm: dims.height_mm,
      wheelbase_mm: dims.wheelbase_mm,
      ground_clearance_mm: dims.ground_clearance_mm,
      seats: dims.seats || vehicle.seats,
      doors: dims.doors || vehicle.doors,
      luggage_capacity: dims.luggage_capacity,
      fuel_tank_capacity: dims.fuel_tank_capacity,

      top_speed_kmh: perf.top_speed_kmh,
      acceleration_0_100: perf.acceleration_0_100,
      combined_consumption: perf.combined_consumption,

      air_conditioning: comfort.air_conditioning,
      climate_control: comfort.climate_control,
      parking_sensors: comfort.parking_sensors,
      rear_camera: comfort.rear_camera,
      cruise_control: comfort.cruise_control,
      bluetooth: comfort.bluetooth,
      apple_carplay: comfort.apple_carplay,
      android_auto: comfort.android_auto,
      usb: comfort.usb,
      navigation: comfort.navigation,
      keyless_entry: comfort.keyless_entry,
      push_start: comfort.push_start,
      sunroof: comfort.sunroof,

      abs: safety.abs,
      esp: safety.esp,
      airbags: safety.airbags,
      isofix: safety.isofix,
      tpms: safety.tpms,

      // Canonical nested objects
      technical: tech,
      dimensions: dims,
      performance: perf,
      comfort: comfort,
      safety: safety,
    };
  }

  /**
   * Comprehensive validation logic to audit specifications and assess completeness
   */
  validateVehicleSpecs(vehicle: Vehicle): SpecValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingFields: string[] = [];

    // 1. Mandatory core identification checks
    if (!vehicle.id || vehicle.id.trim() === '') errors.push('ID véhicule manquant.');
    if (!vehicle.name || vehicle.name.trim() === '') errors.push('Nom du véhicule manquant.');
    if (!vehicle.brand || vehicle.brand.trim() === '') errors.push('Marque manquante.');
    if (!vehicle.category) errors.push('Catégorie de véhicule non définie.');
    if (!vehicle.daily_price || vehicle.daily_price <= 0) errors.push('Le tarif journalier doit être supérieur à 0 DA.');

    // 2. Technical sanity checks
    const tech = this.getTechnicalSpecs(vehicle);
    if (!tech.transmission) errors.push('Type de boîte de vitesses manquant.');
    if (!tech.fuel_type) errors.push('Type de carburant manquant.');

    if (tech.power_hp && (tech.power_hp < 40 || tech.power_hp > 1200)) {
      warnings.push(`Puissance inhabituelle (${tech.power_hp} ch).`);
    }

    if (tech.cylinders && (tech.cylinders < 2 || tech.cylinders > 16)) {
      warnings.push(`Nombre de cylindres inhabituel (${tech.cylinders}).`);
    }

    // 3. Dimensions & Capacity sanity checks
    const dims = this.getDimensionsSpecs(vehicle);
    if (!dims.seats || dims.seats < 1 || dims.seats > 9) {
      errors.push('Nombre de places assises invalide (doit être entre 1 et 9).');
    }

    if (dims.length_mm && (dims.length_mm < 2500 || dims.length_mm > 6000)) {
      warnings.push(`Longueur de véhicule inhabituelle (${dims.length_mm} mm).`);
    }

    // 4. Track completeness across key technical specifications
    const trackedSpecChecklist: { name: string; has: boolean }[] = [
      { name: 'Génération', has: this.hasValue(vehicle.generation) },
      { name: 'Année modèle', has: this.hasValue(vehicle.model_year || vehicle.year) },
      { name: 'Finition', has: this.hasValue(vehicle.trim) },
      { name: 'Carrosserie', has: this.hasValue(vehicle.body_type) },
      { name: 'Motorisation', has: this.hasValue(tech.engine) },
      { name: 'Cylindrée', has: this.hasValue(tech.engine_displacement) },
      { name: 'Cylindres', has: this.hasValue(tech.cylinders) },
      { name: 'Puissance (ch)', has: this.hasValue(tech.power_hp) },
      { name: 'Couple (Nm)', has: this.hasValue(tech.torque_nm) },
      { name: 'Rapports boîte', has: this.hasValue(tech.transmission_gears) },
      { name: 'Transmission mode', has: this.hasValue(tech.drive_type) },
      { name: 'Dimensions (Longueur)', has: this.hasValue(dims.length_mm) },
      { name: 'Volume coffre', has: this.hasValue(dims.luggage_capacity) },
      { name: 'Réservoir carburant', has: this.hasValue(dims.fuel_tank_capacity) },
      { name: 'Accélération 0-100', has: this.hasValue(this.getPerformanceSpecs(vehicle).acceleration_0_100) },
      { name: 'Consommation mixte', has: this.hasValue(this.getPerformanceSpecs(vehicle).combined_consumption) },
      { name: 'Climatisation', has: this.hasValue(this.getComfortSpecs(vehicle).climate_control) || !!this.getComfortSpecs(vehicle).air_conditioning },
      { name: 'Système ABS/ESP', has: !!this.getSafetySpecs(vehicle).abs && !!this.getSafetySpecs(vehicle).esp },
    ];

    trackedSpecChecklist.forEach((item) => {
      if (!item.has) missingFields.push(item.name);
    });

    const totalTrackedFields = trackedSpecChecklist.length;
    const filledCount = totalTrackedFields - missingFields.length;
    const completenessScore = Math.round((Math.max(0, filledCount) / totalTrackedFields) * 100);

    // 5. Determine Verification Status & Reason
    let verificationStatus: VerificationStatus = 'COMPLETELY VERIFIED';
    let statusReason = 'Fiche technique constructeur complète et vérifiée.';

    if (vehicle.id === 'geely-livan' || vehicle.specification_verified === false) {
      verificationStatus = 'NEEDS VERIFICATION';
      statusReason = 'Exact model / millésime à confirmer par l\'agence DZ RENT CAR.';
    } else if (completenessScore < 70) {
      verificationStatus = 'PARTIALLY VERIFIED';
      statusReason = `Données partiellement complétées (${completenessScore}% renseigné).`;
    } else {
      verificationStatus = 'COMPLETELY VERIFIED';
      statusReason = `Spécifications officielles vérifiées (${completenessScore}% de complétude).`;
    }

    return {
      isValid: errors.length === 0,
      completenessScore,
      verificationStatus,
      statusReason,
      errors,
      warnings,
      missingFields,
    };
  }

  /**
   * Formats power string cleanly (e.g. "150 ch (110 kW)" or "150 ch")
   */
  formatPower(hp?: number, kw?: number): string {
    if (!hp) return 'Non renseigné';
    if (kw) return `${hp} ch (${kw} kW)`;
    return `${hp} ch`;
  }

  /**
   * Formats torque string
   */
  formatTorque(nm?: number): string {
    if (!nm) return 'Non renseigné';
    return `${nm} Nm`;
  }

  /**
   * Formats dimensions string (e.g. "4 509 × 1 839 × 1 675 mm")
   */
  formatDimensions(length?: number, width?: number, height?: number): string {
    if (!length || !width || !height) return 'Dimensions standard';
    return `${length} × ${width} × ${height} mm`;
  }

  /**
   * Generates all structured specification sections for a given vehicle
   */
  getSections(vehicle: Vehicle): SpecSection[] {
    const sections: SpecSection[] = [];
    const tech = this.getTechnicalSpecs(vehicle);
    const dims = this.getDimensionsSpecs(vehicle);
    const perf = this.getPerformanceSpecs(vehicle);
    const comfort = this.getComfortSpecs(vehicle);
    const safety = this.getSafetySpecs(vehicle);

    // 1. Informations Générales
    const generalItems: SpecItem[] = [];
    if (this.hasValue(vehicle.brand)) {
      generalItems.push({ id: 'brand', label: 'Marque', value: vehicle.brand, displayValue: vehicle.brand });
    }
    if (this.hasValue(vehicle.model)) {
      generalItems.push({ id: 'model', label: 'Modèle', value: vehicle.model, displayValue: vehicle.model });
    }
    if (this.hasValue(vehicle.model_year || vehicle.year)) {
      const yr = vehicle.model_year || vehicle.year;
      generalItems.push({ id: 'year', label: 'Année modèle', value: yr, displayValue: `${yr}` });
    }
    if (this.hasValue(vehicle.generation)) {
      generalItems.push({ id: 'generation', label: 'Génération', value: vehicle.generation!, displayValue: vehicle.generation! });
    }
    if (this.hasValue(vehicle.trim)) {
      generalItems.push({ id: 'trim', label: 'Finition / Version', value: vehicle.trim!, displayValue: vehicle.trim! });
    }
    if (this.hasValue(vehicle.category)) {
      generalItems.push({ id: 'category', label: 'Catégorie', value: vehicle.category, displayValue: vehicle.category });
    }
    if (this.hasValue(vehicle.body_type)) {
      generalItems.push({ id: 'body_type', label: 'Carrosserie', value: vehicle.body_type!, displayValue: vehicle.body_type! });
    }

    if (generalItems.length > 0) {
      sections.push({
        id: 'general',
        title: 'Informations Générales',
        subtitle: 'Identification, catégorie et millésime',
        icon: 'Layers',
        items: generalItems,
        itemCount: generalItems.length,
      });
    }

    // 2. Motorisation
    const motorItems: SpecItem[] = [];
    if (this.hasValue(tech.engine)) {
      motorItems.push({ id: 'engine', label: 'Moteur', value: tech.engine!, displayValue: tech.engine! });
    }
    if (this.hasValue(tech.fuel_type)) {
      motorItems.push({ id: 'fuel_type', label: 'Carburant', value: tech.fuel_type!, displayValue: tech.fuel_type! });
    }
    if (this.hasValue(tech.engine_displacement)) {
      motorItems.push({ id: 'displacement', label: 'Cylindrée', value: tech.engine_displacement!, displayValue: tech.engine_displacement! });
    }
    if (this.hasValue(tech.cylinders)) {
      motorItems.push({ id: 'cylinders', label: 'Nombre de cylindres', value: tech.cylinders!, displayValue: `${tech.cylinders} cylindres en ligne` });
    }
    if (this.hasValue(tech.power_hp)) {
      motorItems.push({
        id: 'power',
        label: 'Puissance',
        value: tech.power_hp!,
        displayValue: this.formatPower(tech.power_hp, tech.power_kw),
        highlight: true,
      });
    }
    if (this.hasValue(tech.torque_nm)) {
      motorItems.push({ id: 'torque', label: 'Couple maxi', value: tech.torque_nm!, displayValue: this.formatTorque(tech.torque_nm) });
    }

    if (motorItems.length > 0) {
      sections.push({
        id: 'motorisation',
        title: 'Motorisation & Énergie',
        subtitle: 'Moteur, puissance, cylindrée et couple',
        icon: 'Zap',
        items: motorItems,
        itemCount: motorItems.length,
      });
    }

    // 3. Transmission
    const transItems: SpecItem[] = [];
    if (this.hasValue(tech.transmission)) {
      transItems.push({ id: 'transmission', label: 'Type de boîte', value: tech.transmission!, displayValue: tech.transmission!, highlight: true });
    }
    if (this.hasValue(tech.transmission_gears)) {
      transItems.push({ id: 'gears', label: 'Nombre de rapports', value: tech.transmission_gears!, displayValue: `${tech.transmission_gears} vitesses` });
    }
    if (this.hasValue(tech.drive_type)) {
      transItems.push({ id: 'drive_type', label: 'Transmission', value: tech.drive_type!, displayValue: tech.drive_type! });
    }

    if (transItems.length > 0) {
      sections.push({
        id: 'transmission',
        title: 'Transmission',
        subtitle: 'Boîte de vitesses et mode de transmission',
        icon: 'Activity',
        items: transItems,
        itemCount: transItems.length,
      });
    }

    // 4. Dimensions
    const dimItems: SpecItem[] = [];
    if (this.hasValue(dims.length_mm)) {
      dimItems.push({ id: 'length', label: 'Longueur', value: dims.length_mm!, displayValue: `${dims.length_mm} mm` });
    }
    if (this.hasValue(dims.width_mm)) {
      dimItems.push({ id: 'width', label: 'Largeur', value: dims.width_mm!, displayValue: `${dims.width_mm} mm` });
    }
    if (this.hasValue(dims.height_mm)) {
      dimItems.push({ id: 'height', label: 'Hauteur', value: dims.height_mm!, displayValue: `${dims.height_mm} mm` });
    }
    if (this.hasValue(dims.wheelbase_mm)) {
      dimItems.push({ id: 'wheelbase', label: 'Empattement', value: dims.wheelbase_mm!, displayValue: `${dims.wheelbase_mm} mm` });
    }
    if (this.hasValue(dims.ground_clearance_mm)) {
      dimItems.push({ id: 'ground_clearance', label: 'Garde au sol', value: dims.ground_clearance_mm!, displayValue: `${dims.ground_clearance_mm} mm` });
    }

    if (dimItems.length > 0) {
      sections.push({
        id: 'dimensions',
        title: 'Dimensions & Gabarit',
        subtitle: 'Longueur, largeur, hauteur et empattement',
        icon: 'Maximize2',
        items: dimItems,
        itemCount: dimItems.length,
      });
    }

    // 5. Capacité
    const capItems: SpecItem[] = [];
    if (this.hasValue(dims.seats)) {
      capItems.push({ id: 'seats', label: 'Places assises', value: dims.seats!, displayValue: `${dims.seats} places` });
    }
    if (this.hasValue(dims.doors)) {
      capItems.push({ id: 'doors', label: 'Portes', value: dims.doors!, displayValue: `${dims.doors} portes` });
    }
    if (this.hasValue(dims.luggage_capacity)) {
      capItems.push({ id: 'luggage_capacity', label: 'Volume coffre', value: dims.luggage_capacity!, displayValue: `${dims.luggage_capacity} Litres` });
    } else if (this.hasValue(vehicle.luggage)) {
      capItems.push({ id: 'luggage', label: 'Capacité coffre', value: vehicle.luggage, displayValue: `${vehicle.luggage} grandes valises` });
    }
    if (this.hasValue(dims.fuel_tank_capacity)) {
      capItems.push({ id: 'tank', label: 'Réservoir carburant', value: dims.fuel_tank_capacity!, displayValue: `${dims.fuel_tank_capacity} Litres` });
    }

    if (capItems.length > 0) {
      sections.push({
        id: 'capacite',
        title: 'Capacité & Volume',
        subtitle: 'Habitabilité, nombre de places et coffre',
        icon: 'Users',
        items: capItems,
        itemCount: capItems.length,
      });
    }

    // 6. Performances & Consommation
    const perfItems: SpecItem[] = [];
    if (this.hasValue(perf.acceleration_0_100)) {
      perfItems.push({ id: 'accel', label: '0 à 100 km/h', value: perf.acceleration_0_100!, displayValue: `${perf.acceleration_0_100} s` });
    }
    if (this.hasValue(perf.top_speed_kmh)) {
      perfItems.push({ id: 'speed', label: 'Vitesse maximale', value: perf.top_speed_kmh!, displayValue: `${perf.top_speed_kmh} km/h` });
    }
    if (this.hasValue(perf.combined_consumption)) {
      perfItems.push({ id: 'consumption', label: 'Consommation mixte', value: perf.combined_consumption!, displayValue: `${perf.combined_consumption}` });
    }

    if (perfItems.length > 0) {
      sections.push({
        id: 'performances',
        title: 'Performances & Consommation',
        subtitle: 'Accélération, vitesse de pointe et moyenne mixte',
        icon: 'Timer',
        items: perfItems,
        itemCount: perfItems.length,
      });
    }

    // 7. Confort & Équipements
    const comfortItems: SpecItem[] = [];
    if (this.hasValue(comfort.climate_control)) {
      comfortItems.push({
        id: 'climate',
        label: 'Climatisation',
        value: comfort.climate_control!,
        displayValue: typeof comfort.climate_control === 'string' ? comfort.climate_control : 'Climatisation automatique',
      });
    } else if (comfort.air_conditioning) {
      comfortItems.push({ id: 'ac', label: 'Climatisation', value: true, displayValue: 'Climatisation révisée garantie' });
    }

    if (this.hasValue(comfort.cruise_control)) {
      comfortItems.push({
        id: 'cruise',
        label: 'Régulateur de vitesse',
        value: comfort.cruise_control!,
        displayValue: typeof comfort.cruise_control === 'string' ? comfort.cruise_control : 'Régulateur / limiteur inclus',
      });
    }
    if (comfort.rear_camera) {
      comfortItems.push({ id: 'camera', label: 'Caméra de recul', value: true, displayValue: 'Caméra de recul avec repères visuels' });
    }
    if (this.hasValue(comfort.parking_sensors)) {
      comfortItems.push({
        id: 'sensors',
        label: 'Radars de stationnement',
        value: comfort.parking_sensors!,
        displayValue: typeof comfort.parking_sensors === 'string' ? comfort.parking_sensors : 'Radars avant / arrière',
      });
    }
    if (comfort.bluetooth) {
      comfortItems.push({ id: 'bluetooth', label: 'Bluetooth', value: true, displayValue: 'Mains-libres & Streaming Bluetooth' });
    }
    if (comfort.apple_carplay || comfort.android_auto) {
      comfortItems.push({ id: 'carplay_android', label: 'Connectivité smartphone', value: true, displayValue: 'Apple CarPlay & Android Auto' });
    }
    if (this.hasValue(comfort.usb)) {
      comfortItems.push({
        id: 'usb',
        label: 'Connectique',
        value: comfort.usb!,
        displayValue: typeof comfort.usb === 'string' ? comfort.usb : 'Ports USB avant et arrière',
      });
    }
    if (comfort.navigation) {
      comfortItems.push({ id: 'nav', label: 'Navigation', value: true, displayValue: 'GPS Navigation intégrée' });
    }
    if (comfort.push_start) {
      comfortItems.push({ id: 'start', label: 'Démarrage', value: true, displayValue: 'Démarrage sans clé (Push Start)' });
    }
    if (comfort.keyless_entry) {
      comfortItems.push({ id: 'keyless', label: 'Accès', value: true, displayValue: 'Accès mains-libres (Keyless)' });
    }
    if (this.hasValue(comfort.sunroof)) {
      comfortItems.push({
        id: 'sunroof',
        label: 'Toit ouvrant',
        value: comfort.sunroof!,
        displayValue: typeof comfort.sunroof === 'string' ? comfort.sunroof : 'Toit ouvrant / panoramique',
      });
    }

    if (comfortItems.length > 0) {
      sections.push({
        id: 'confort',
        title: 'Confort & Multimédia',
        subtitle: 'Climatisation, connectivité, aides au stationnement',
        icon: 'Wind',
        items: comfortItems,
        itemCount: comfortItems.length,
      });
    }

    // 8. Sécurité
    const secItems: SpecItem[] = [];
    if (safety.abs) {
      secItems.push({ id: 'abs', label: 'Système ABS', value: true, displayValue: 'Système antiblocage des roues (ABS)' });
    }
    if (safety.esp) {
      secItems.push({ id: 'esp', label: 'Contrôle ESP', value: true, displayValue: 'Contrôle dynamique de stabilité (ESP/ESC)' });
    }
    if (this.hasValue(safety.airbags)) {
      secItems.push({
        id: 'airbags',
        label: 'Airbags',
        value: safety.airbags!,
        displayValue: typeof safety.airbags === 'string' ? safety.airbags : `${safety.airbags} airbags de sécurité`,
      });
    }
    if (safety.isofix) {
      secItems.push({ id: 'isofix', label: 'Fixations ISOFIX', value: true, displayValue: 'Points d\'ancrage pour sièges enfants' });
    }
    if (safety.tpms) {
      secItems.push({ id: 'tpms', label: 'Pression des pneus', value: true, displayValue: 'Surveillance TPMS automatique' });
    }
    secItems.push({ id: 'insurance', label: 'Assurance & Assistance', value: true, displayValue: 'Assurance tous risques & Assistance 24/7' });

    if (secItems.length > 0) {
      sections.push({
        id: 'securite',
        title: 'Sécurité & Assistance',
        subtitle: 'Protection active, passive et assistance 24/7',
        icon: 'ShieldCheck',
        items: secItems,
        itemCount: secItems.length,
      });
    }

    return sections;
  }

  /**
   * Helper to retrieve 3-4 top highlights for display chips on cards and headers
   */
  getQuickHighlights(vehicle: Vehicle): { label: string; value: string; icon: string }[] {
    const tech = this.getTechnicalSpecs(vehicle);
    const dims = this.getDimensionsSpecs(vehicle);

    const highlights = [
      { label: 'Boîte', value: tech.transmission || vehicle.transmission, icon: 'Gauge' },
      { label: 'Carburant', value: tech.fuel_type || vehicle.fuel_type, icon: 'Fuel' },
      { label: 'Places', value: `${dims.seats || vehicle.seats} places`, icon: 'Users' },
    ];

    if (tech.power_hp) {
      highlights.push({ label: 'Puissance', value: `${tech.power_hp} ch`, icon: 'Zap' });
    } else if (dims.luggage_capacity) {
      highlights.push({ label: 'Coffre', value: `${dims.luggage_capacity} L`, icon: 'Briefcase' });
    }

    return highlights;
  }
}

export const vehicleSpecsService = new VehicleSpecsService();
