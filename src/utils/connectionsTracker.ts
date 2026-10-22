// Local storage counter for connections / clicks tracking

const CONNECTIONS_STORAGE_KEY = 'daleel_samsar_connections_v1';

export interface ConnectionEvent {
  id: string;
  samsarId: string;
  samsarAlias: string;
  city: string;
  district: string;
  propertyType: string;
  timestamp: number;
}

export function getStoredConnections(): ConnectionEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CONNECTIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [
      // Seed some initial realistic connections for demonstration
      { id: 'c1', samsarId: 'samsar-1', samsarAlias: 'Si Mohamed "Moul L\'Maârif"', city: 'Casablanca', district: 'Maârif', propertyType: 'Appartement', timestamp: Date.now() - 3600000 * 2 },
      { id: 'c2', samsarId: 'samsar-1', samsarAlias: 'Si Mohamed "Moul L\'Maârif"', city: 'Casablanca', district: 'Maârif', propertyType: 'Studio / Bureau', timestamp: Date.now() - 3600000 * 5 },
      { id: 'c3', samsarId: 'samsar-2', samsarAlias: 'Ba Bouchaib "Moul L\'kheir"', city: 'Casablanca', district: 'Hay Hassani', propertyType: 'Appartement', timestamp: Date.now() - 3600000 * 9 },
      { id: 'c4', samsarId: 'samsar-4', samsarAlias: 'Lhaj Abdellatif "Serr L\'Médina"', city: 'Marrakech', district: 'Médina', propertyType: 'Riad traditionnel', timestamp: Date.now() - 3600000 * 14 },
      { id: 'c5', samsarId: 'samsar-3', samsarAlias: 'Si Hamid "Spécialiste Titré"', city: 'Casablanca', district: 'Aïn Diab', propertyType: 'Villa', timestamp: Date.now() - 3600000 * 20 }
    ];
  } catch {
    return [];
  }
}

export function recordConnection(event: Omit<ConnectionEvent, 'id' | 'timestamp'>): ConnectionEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getStoredConnections();
    const newEvent: ConnectionEvent = {
      ...event,
      id: `conn-${Date.now()}`,
      timestamp: Date.now()
    };
    const updated = [newEvent, ...existing];
    localStorage.setItem(CONNECTIONS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}
