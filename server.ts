import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_BOOKINGS,
  INITIAL_BUSINESS_SETTINGS,
  INITIAL_FAQS,
  INITIAL_REVIEWS,
  INITIAL_SERVICES,
  INITIAL_VEHICLES,
} from './src/data/seedData';
import { Booking, BusinessSettings, Vehicle } from './src/types';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data folder and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DBStore {
  settings: BusinessSettings;
  vehicles: Vehicle[];
  bookings: Booking[];
  reviews: typeof INITIAL_REVIEWS;
  services: typeof INITIAL_SERVICES;
  faqs: typeof INITIAL_FAQS;
}

function loadDB(): DBStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error loading db.json, falling back to seed:', err);
  }

  const initialDB: DBStore = {
    settings: INITIAL_BUSINESS_SETTINGS,
    vehicles: INITIAL_VEHICLES,
    bookings: INITIAL_BOOKINGS,
    reviews: INITIAL_REVIEWS,
    services: INITIAL_SERVICES,
    faqs: INITIAL_FAQS,
  };

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialDB, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write initial db:', e);
  }

  return initialDB;
}

function saveDB(db: DBStore): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
}

let db = loadDB();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // === API ROUTES ===

  // 1. Settings
  app.get('/api/settings', (_req: Request, res: Response) => {
    res.json(db.settings);
  });

  app.put('/api/settings', (req: Request, res: Response) => {
    db.settings = { ...req.body, updated_at: new Date().toISOString() };
    saveDB(db);
    res.json(db.settings);
  });

  // 2. Vehicles
  app.get('/api/vehicles', (_req: Request, res: Response) => {
    res.json(db.vehicles);
  });

  app.get('/api/vehicles/:slug', (req: Request, res: Response) => {
    const v = db.vehicles.find((item) => item.slug === req.params.slug || item.id === req.params.slug);
    if (!v) {
      return res.status(404).json({ error: 'Véhicule non trouvé' });
    }
    res.json(v);
  });

  app.post('/api/vehicles', (req: Request, res: Response) => {
    const newVehicle: Vehicle = {
      ...req.body,
      id: req.body.id || `v-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.vehicles.push(newVehicle);
    saveDB(db);
    res.status(201).json(newVehicle);
  });

  app.put('/api/vehicles/:id', (req: Request, res: Response) => {
    const idx = db.vehicles.findIndex((v) => v.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Véhicule non trouvé' });
    }
    db.vehicles[idx] = { ...req.body, updated_at: new Date().toISOString() };
    saveDB(db);
    res.json(db.vehicles[idx]);
  });

  app.delete('/api/vehicles/:id', (req: Request, res: Response) => {
    db.vehicles = db.vehicles.filter((v) => v.id !== req.params.id);
    saveDB(db);
    res.json({ success: true });
  });

  // 3. Bookings
  app.get('/api/bookings', (_req: Request, res: Response) => {
    res.json(db.bookings);
  });

  app.post('/api/bookings', (req: Request, res: Response) => {
    const {
      customer_name,
      customer_phone,
      vehicle_id,
      pickup_date,
      return_date,
      pickup_location,
      return_location,
    } = req.body;

    if (!customer_name || !customer_phone || !vehicle_id || !pickup_date || !return_date) {
      return res.status(400).json({ error: 'Informations requises manquantes' });
    }

    if (pickup_date >= return_date) {
      return res.status(400).json({
        error: 'La date de retour doit être strictement postérieure à la date de départ.',
      });
    }

    // Availability overlap check
    const hasOverlap = db.bookings.some(
      (b) =>
        b.vehicle_id === vehicle_id &&
        b.status !== 'cancelled' &&
        b.status !== 'completed' &&
        pickup_date < b.return_date &&
        return_date > b.pickup_date
    );

    if (hasOverlap) {
      return res.status(409).json({
        error: 'Ce véhicule a déjà une réservation active sur ces dates. Veuillez sélectionner une autre date ou nous contacter sur WhatsApp.',
      });
    }

    const newBooking: Booking = {
      ...req.body,
      id: `DZ-${1000 + db.bookings.length + 1}`,
      status: 'new',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.bookings.unshift(newBooking);
    saveDB(db);
    res.status(201).json(newBooking);
  });

  app.patch('/api/bookings/:id/status', (req: Request, res: Response) => {
    const { status, admin_notes } = req.body;
    const b = db.bookings.find((item) => item.id === req.params.id);
    if (!b) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    b.status = status;
    if (admin_notes !== undefined) b.admin_notes = admin_notes;
    b.updated_at = new Date().toISOString();
    saveDB(db);
    res.json(b);
  });

  // 4. Availability Check
  app.post('/api/bookings/check-availability', (req: Request, res: Response) => {
    const { vehicle_id, pickup_date, return_date } = req.body;
    if (!pickup_date || !return_date) {
      return res.status(400).json({ error: 'Dates requises' });
    }

    if (vehicle_id) {
      const conflict = db.bookings.find(
        (b) =>
          b.vehicle_id === vehicle_id &&
          b.status !== 'cancelled' &&
          b.status !== 'completed' &&
          pickup_date < b.return_date &&
          return_date > b.pickup_date
      );
      return res.json({ available: !conflict, conflictingBooking: conflict || null });
    }

    // Return list of available vehicle IDs
    const bookedVehicleIds = new Set(
      db.bookings
        .filter(
          (b) =>
            b.status !== 'cancelled' &&
            b.status !== 'completed' &&
            pickup_date < b.return_date &&
            return_date > b.pickup_date
        )
        .map((b) => b.vehicle_id)
    );

    const available = db.vehicles.filter((v) => v.active && !bookedVehicleIds.has(v.id));
    res.json({ available_vehicles: available });
  });

  // 5. Admin Authentication
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    // Secure simple credentials for admin demo
    if (username === 'admin' && (password === 'dzrentcar2026' || password === 'admin')) {
      return res.json({
        token: 'dz-admin-token-' + Date.now(),
        user: { role: 'ADMIN', name: 'Administrateur DZ RENT CAR' },
      });
    }
    return res.status(401).json({ error: 'Identifiants invalides' });
  });

  // === VITE DEV MIDDLEWARE OR STATIC SERVE ===
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DZ RENT CAR Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
