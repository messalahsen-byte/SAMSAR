export interface PropertyListing {
  id: string;
  title: string;
  propertyType: 'appartement' | 'villa' | 'terrain' | 'commercial' | 'riad';
  city: string; // e.g. 'marrakech', 'casablanca'
  district: string; // e.g. 'chwiter', 'maarif'
  priceMad: number;
  areaM2: number;
  description: string;
  features: string[];
  imageUrl: string;
  saleMode: 'direct' | 'samsar_exclusive'; // 'direct' = sur place direct, 'samsar_exclusive' = mise en relation discrète samsar
  assignedSamsarId?: string;
  assignedSamsarName?: string;
  sellerName: string;
  sellerPhone: string;
  notifiedSamsarsCount: number;
  createdAt: string;
  status: 'active' | 'negotiation' | 'sold';
  lat?: number;
  lng?: number;
}

const STORAGE_KEY = 'daleel_samsar_listings_v1';

export const INITIAL_LISTINGS: PropertyListing[] = [
  {
    id: 'listing-chouiter-terrain',
    title: 'Terrain d\'angle rare - 3 Façades sur axes 16m, 12m et 6m',
    propertyType: 'terrain',
    city: 'marrakech',
    district: 'chwiter',
    priceMad: 390000,
    areaM2: 420,
    description: 'Parcelle d\'angle d\'exception située à Chouiter (Route d\'Ouarzazate). 3 façades ouvertes sur voies de 16m, 12m et 6m. Emplacement stratégique pour construction R+2 ou villa commerciale. Dossier foncier vérifié et titré.',
    features: ['3 Façades dégagées', 'Voie principale 16m', 'Titre foncier individuel', 'Zone R+2 / Activité', 'Accès direct Route Ouarzazate'],
    imageUrl: '',
    saleMode: 'samsar_exclusive',
    assignedSamsarId: 'samsar-chwiter',
    assignedSamsarName: 'Ba Houssine "Moul L\'Aradi"',
    sellerName: 'M. Messoudi (MRE)',
    sellerPhone: '+212661002233',
    notifiedSamsarsCount: 4,
    createdAt: '2026-10-15',
    status: 'active',
    lat: 31.5845,
    lng: -7.7850
  },
  {
    id: 'listing-maarif-apt',
    title: 'Appartement Haut Standing lumineux avec terrasse',
    propertyType: 'appartement',
    city: 'casablanca',
    district: 'maarif',
    priceMad: 1280000,
    areaM2: 95,
    description: 'Au cœur du Maârif, proche boulevard Bir Anzarane. 2 chambres avec placards, grand salon marocain/moderne, cuisine équipée, place de garage titrée et ascenseur.',
    features: ['Ascenseur & Garage titré', 'Double orientation', '2 Chambres spacieuses', 'Proche tramway & commerces'],
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
    saleMode: 'direct',
    assignedSamsarId: 'samsar-1',
    assignedSamsarName: 'Si Bouchaib Moul L\'kheir',
    sellerName: 'Karim T.',
    sellerPhone: '+212661445566',
    notifiedSamsarsCount: 5,
    createdAt: '2026-10-14',
    status: 'active',
    lat: 33.5835,
    lng: -7.6350
  },
  {
    id: 'listing-targa-villa',
    title: 'Belle Villa contemporaine avec piscine et jardin arboré',
    propertyType: 'villa',
    city: 'marrakech',
    district: 'targa',
    priceMad: 3450000,
    areaM2: 360,
    description: 'Magnifique villa contemporaine sans vis-à-vis à Targa. Piscine privative, 4 suites avec salles de bain, grand espace réception et dépendance gardien.',
    features: ['Piscine privative', 'Jardin arboré', '4 Suites indépendantes', 'Quartier sécurisé et calme'],
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80',
    saleMode: 'direct',
    sellerName: 'Laila B.',
    sellerPhone: '+212663778899',
    notifiedSamsarsCount: 3,
    createdAt: '2026-10-12',
    status: 'active',
    lat: 31.6582,
    lng: -8.0531
  },
  {
    id: 'listing-gauthier-commerce',
    title: 'Local Commercial / Boutique d\'angle - Rue passante',
    propertyType: 'commercial',
    city: 'casablanca',
    district: 'bourgogne',
    priceMad: 920000,
    areaM2: 60,
    description: 'Idéal franchise, café concept ou agence de services. Grande vitrine sécurisée avec rideau électrique, soupente aménagée et sanitaires.',
    features: ['Vitrine 8m linéaire', 'Soupente de stockage 25m²', 'Forte affluence piétonne'],
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    saleMode: 'samsar_exclusive',
    assignedSamsarId: 'samsar-2',
    assignedSamsarName: 'Haj Mostafa L\'Borgoni',
    sellerName: 'Driss M.',
    sellerPhone: '+212662113355',
    notifiedSamsarsCount: 4,
    createdAt: '2026-10-10',
    status: 'active',
    lat: 33.5954,
    lng: -7.6441
  },
  {
    id: 'listing-medina-riad',
    title: 'Riad Historique rénové - 5 Chambres & Vue Koutoubia',
    propertyType: 'riad',
    city: 'marrakech',
    district: 'medina',
    priceMad: 2750000,
    areaM2: 175,
    description: 'Riad titré authentique au cœur de la Médina de Marrakech, accès voiture proche. Patio avec fontaine en zellige, 5 suites climatisées, toit terrasse aménagé avec vue sur la Koutoubia et les montagnes de l\'Atlas.',
    features: ['Titre foncier', 'Accès voiture 50m', 'Toit-terrasse panoramique', 'Exploitation maison d\'hôtes possible'],
    imageUrl: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&auto=format&fit=crop&q=80',
    saleMode: 'direct',
    sellerName: 'Aicha K.',
    sellerPhone: '+212664998877',
    notifiedSamsarsCount: 6,
    createdAt: '2026-10-08',
    status: 'active',
    lat: 31.6258,
    lng: -7.9891
  },
  {
    id: 'listing-malabata-apt',
    title: 'Appartement Vue Mer Panoramique - Corniche Malabata',
    propertyType: 'appartement',
    city: 'tanger',
    district: 'malabata',
    priceMad: 1650000,
    areaM2: 118,
    description: 'Superbe appartement contemporain face à la baie de Tanger à Malabata. Grande terrasse vue détroit, 3 chambres, finition marbre et résidence fermée gardée 24h/24.',
    features: ['Vue mer frontale', 'Terrasse 22m²', 'Parking sous-sol titré', 'Résidence sécurisée'],
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    saleMode: 'direct',
    sellerName: 'Youssef E.',
    sellerPhone: '+212661558899',
    notifiedSamsarsCount: 4,
    createdAt: '2026-10-07',
    status: 'active',
    lat: 35.7765,
    lng: -5.7865
  },
  {
    id: 'listing-agdal-rabat-apt',
    title: 'Appartement Moderne Haut Standing - Cœur Agdal',
    propertyType: 'appartement',
    city: 'rabat',
    district: 'agdal',
    priceMad: 1850000,
    areaM2: 125,
    description: 'Bel appartement ensoleillé à Rabat Agdal proche avenue Fal Ould Oumeir. 3 chambres, double salon, ascenseur et place de parking au sous-sol.',
    features: ['3 Chambres', 'Ascenseur & Parking', 'Emplacement stratégique Agdal'],
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
    saleMode: 'direct',
    sellerName: 'Mehdi B.',
    sellerPhone: '+212661774411',
    notifiedSamsarsCount: 4,
    createdAt: '2026-10-06',
    status: 'active',
    lat: 34.0028,
    lng: -6.8505
  },
  {
    id: 'listing-sonaba-agadir-villa',
    title: 'Villa Résidentielle avec Piscine à Sonaba & Founty',
    propertyType: 'villa',
    city: 'agadir',
    district: 'sonaba',
    priceMad: 2950000,
    areaM2: 310,
    description: 'Villa lumineuse à 5 minutes de la plage d\'Agadir dans le secteur recherché de Sonaba/Founty. Jardin ensoleillé, piscine et 4 chambres.',
    features: ['Proche plage Founty', 'Piscine & Jardin', 'Titre foncier'],
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    saleMode: 'direct',
    sellerName: 'Hassan A.',
    sellerPhone: '+212662339900',
    notifiedSamsarsCount: 3,
    createdAt: '2026-10-05',
    status: 'active',
    lat: 30.4042,
    lng: -9.5892
  },
  {
    id: 'listing-fes-medina-riad',
    title: 'Riad Authentique Titré avec Patio Cèdre & Zellige',
    propertyType: 'riad',
    city: 'fes',
    district: 'medina-fes',
    priceMad: 1490000,
    areaM2: 190,
    description: 'Demeure traditionnelle restaurée à Fès El-Bali avec accès proche parking. Architecture authentique, fontaine centrale et terrasse panoramique.',
    features: ['Riad titré', 'Artisanat authentique', 'Accès véhicule proche'],
    imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&auto=format&fit=crop&q=80',
    saleMode: 'samsar_exclusive',
    sellerName: 'Moulay Idriss',
    sellerPhone: '+212661992244',
    notifiedSamsarsCount: 5,
    createdAt: '2026-10-04',
    status: 'active',
    lat: 34.0628,
    lng: -4.9754
  }
];

const CITY_DEFAULT_DISTRICTS: Record<string, string> = {
  casablanca: 'maarif',
  marrakech: 'chwiter',
  tanger: 'malabata',
  rabat: 'agdal',
  agadir: 'sonaba',
  fes: 'medina-fes'
};

function normalizeSlug(value?: string): string {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function repairListingLocation(rawItem: PropertyListing): PropertyListing {
  // 1. If this item is one of the canonical sample listings, guarantee its exact city and district
  const canonical = INITIAL_LISTINGS.find(init => init.id === rawItem.id);
  if (canonical) {
    return {
      ...canonical,
      ...rawItem,
      city: canonical.city,
      district: canonical.district,
      propertyType: canonical.propertyType,
      imageUrl: canonical.imageUrl
    };
  }

  let city = normalizeSlug(rawItem.city);
  let district = normalizeSlug(rawItem.district);
  const combinedText = normalizeSlug(`${rawItem.title || ''} ${rawItem.description || ''} ${rawItem.city || ''} ${rawItem.district || ''}`);

  // Map city names or district hints to canonical city IDs
  const validCities = ['casablanca', 'marrakech', 'tanger', 'rabat', 'agadir', 'fes'];
  if (!validCities.includes(city)) {
    if (combinedText.includes('casablanca') || combinedText.includes('maarif') || combinedText.includes('bourgogne') || combinedText.includes('anfa') || combinedText.includes('diab') || combinedText.includes('hassani') || combinedText.includes('oulfa')) {
      city = 'casablanca';
    } else if (combinedText.includes('tanger') || combinedText.includes('malabata') || combinedText.includes('marshan') || combinedText.includes('boukhalef')) {
      city = 'tanger';
    } else if (combinedText.includes('rabat') || combinedText.includes('agdal') || combinedText.includes('souissi') || combinedText.includes('hassan')) {
      city = 'rabat';
    } else if (combinedText.includes('agadir') || combinedText.includes('taghazout') || combinedText.includes('sonaba') || combinedText.includes('founty')) {
      city = 'agadir';
    } else if (combinedText.includes('fes') || combinedText.includes('bali')) {
      city = 'fes';
    } else {
      city = 'marrakech';
    }
  }

  // Ensure district is never empty
  if (!district) {
    if (city === 'marrakech') {
      if (combinedText.includes('targa')) district = 'targa';
      else if (combinedText.includes('gueliz') || combinedText.includes('hivernage')) district = 'gueliz';
      else if (combinedText.includes('medina') || combinedText.includes('riad')) district = 'medina';
      else if (combinedText.includes('palmeraie')) district = 'palmeraie';
      else district = 'chwiter';
    } else if (city === 'casablanca') {
      if (combinedText.includes('bourgogne') || combinedText.includes('gauthier')) district = 'bourgogne';
      else if (combinedText.includes('diab') || combinedText.includes('anfa')) district = 'ain-diab';
      else if (combinedText.includes('hassani') || combinedText.includes('oulfa')) district = 'hay-hassani';
      else district = 'maarif';
    } else {
      district = CITY_DEFAULT_DISTRICTS[city] || 'chwiter';
    }
  }

  const saleMode: 'direct' | 'samsar_exclusive' = rawItem.saleMode === 'samsar_exclusive' ? 'samsar_exclusive' : 'direct';

  return {
    ...rawItem,
    city,
    district,
    saleMode,
    priceMad: Number(rawItem.priceMad) || 0,
    areaM2: Number(rawItem.areaM2) || 0,
    features: Array.isArray(rawItem.features) && rawItem.features.length > 0 ? rawItem.features : ['Bien vérifié'],
    sellerName: rawItem.sellerName || 'Propriétaire',
    sellerPhone: rawItem.sellerPhone || '+212661000000',
    assignedSamsarName: rawItem.assignedSamsarName || (saleMode === 'samsar_exclusive' ? 'Samsar Référent du Secteur' : undefined),
    imageUrl: (rawItem.imageUrl && !rawItem.imageUrl.includes('photo-1500382017468-9049fed747ef')) ? rawItem.imageUrl : '',
    status: rawItem.status || 'active',
  };
}

export function getStoredListings(): PropertyListing[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LISTINGS));
      return INITIAL_LISTINGS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LISTINGS));
      return INITIAL_LISTINGS;
    }

    // Repair all stored items so none have empty city or district
    const repaired = parsed.map(item => repairListingLocation(item));

    // Ensure all canonical sample listings are present with valid city & district
    const existingIds = new Set(repaired.map(item => item.id));
    const missingInitials = INITIAL_LISTINGS.filter(init => !existingIds.has(init.id));
    const finalListings = [...repaired, ...missingInitials];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalListings));
    return finalListings;
  } catch (err) {
    console.error('Failed reading listings from localStorage', err);
    return INITIAL_LISTINGS;
  }
}

export function saveListing(newListing: Omit<PropertyListing, 'id' | 'createdAt' | 'status' | 'notifiedSamsarsCount'>): PropertyListing {
  const current = getStoredListings();
  const rawCreated: PropertyListing = {
    ...newListing,
    id: `listing-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    status: 'active',
    notifiedSamsarsCount: Math.floor(Math.random() * 3) + 3 // Automatically alert 3-5 local samsars
  };
  const listing = repairListingLocation(rawCreated);
  const updated = [listing, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed saving listing', err);
  }
  return listing;
}
