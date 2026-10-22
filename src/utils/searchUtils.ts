import { PropertyListing } from '../data/listings';
import { CITIES_DATA } from '../data/samsars';

export type PropertyType = 
  | 'maison' 
  | 'appartement' 
  | 'villa' 
  | 'terrain' 
  | 'riad' 
  | 'studio' 
  | 'duplex' 
  | 'local' 
  | 'bureau';

export interface ParsedVoiceFilters {
  city: string | null;
  type: PropertyType | null;
  operation: 'location' | 'achat' | null;
  detectedWords?: string[];
}

export interface ResultatFiltreVocal {
  filtreAction: 'achat' | 'location' | null;
  filtreVille: string | null;
  filtreType: PropertyType | null;
  filtreChambres?: number | null;
  resultats: PropertyListing[] | any[];
}

/**
 * Dictionnaire complet et exhaustif de synonymes Darija & Français (Types de biens)
 * Ex: 'dar' -> 'maison', 'ard' -> 'terrain', 'riad' -> 'riad', etc.
 */
export const typeMapping: Record<string, PropertyType> = {
  // Darija & Arabizi
  'dar': 'maison',
  'dari': 'maison',
  'darna': 'maison',
  'darb': 'maison',
  'douar': 'maison',
  'diour': 'maison',
  'dyour': 'maison',
  'menzel': 'maison',
  'manzil': 'maison',
  'mnzel': 'maison',
  'bayt': 'maison',
  'beit': 'maison',
  'byout': 'maison',
  
  'ard': 'terrain',
  'ardi': 'terrain',
  'aradi': 'terrain',
  'ardiya': 'terrain',
  'ardya': 'terrain',
  'lard': 'terrain',
  'l-ard': 'terrain',
  'bo93a': 'terrain',
  'boka3a': 'terrain',
  'ba93a': 'terrain',
  'bou93a': 'terrain',
  'bouk3a': 'terrain',
  'haouch': 'terrain',
  'mzra3a': 'terrain',
  'mazra3a': 'terrain',
  'ferma': 'terrain',

  'riad': 'riad',
  'riads': 'riad',
  'ryad': 'riad',
  'ryads': 'riad',
  'kasbah': 'riad',
  'qasbah': 'riad',
  'qasba': 'riad',
  'ksar': 'riad',
  'qsar': 'riad',

  'ch9a': 'appartement',
  'ch99a': 'appartement',
  'chqua': 'appartement',
  'chka': 'appartement',
  'chouka': 'appartement',
  'bertma': 'appartement',
  'bartma': 'appartement',
  'brtma': 'appartement',
  'berchmana': 'appartement',
  'bartehma': 'appartement',

  'villa': 'villa',
  'villas': 'villa',
  'vila': 'villa',
  'vilat': 'villa',
  'palais': 'villa',

  'local': 'local',
  'locaux': 'local',
  'hanout': 'local',
  'hwanet': 'local',
  'mahal': 'local',
  'mehal': 'local',
  'dokan': 'local',
  'commerce': 'local',
  'commerces': 'local',
  'commercial': 'local',
  'commerciale': 'local',
  'commerciaux': 'local',
  'boutique': 'local',
  'boutiques': 'local',
  'magasin': 'local',
  'magasins': 'local',
  'depot': 'local',
  'hangar': 'local',

  'maktab': 'bureau',
  'mktab': 'bureau',
  'makateb': 'bureau',
  'bureau': 'bureau',
  'bureaux': 'bureau',
  'office': 'bureau',

  'studio': 'studio',
  'studios': 'studio',
  'stodio': 'studio',

  'duplex': 'duplex',
  'duplexes': 'duplex',
  'penthouse': 'duplex',

  // Français standard et pluriels
  'maison': 'maison',
  'maisons': 'maison',
  'appartement': 'appartement',
  'appartements': 'appartement',
  'appart': 'appartement',
  'apparts': 'appartement',
  'flat': 'appartement',
  'terrain': 'terrain',
  'terrains': 'terrain',
  'lot': 'terrain',
  'lots': 'terrain',
  'parcelle': 'terrain',
  'parcelles': 'terrain',
  'ferme': 'terrain',
  'fermes': 'terrain',
  'foncier': 'terrain',
  'propriete': 'terrain',
  'propriété': 'terrain',
  'proprietes': 'terrain',
  'propriétés': 'terrain',

  // Écritures arabes
  'دار': 'maison',
  'ديور': 'maison',
  'منزل': 'maison',
  'منازل': 'maison',
  'بيت': 'maison',
  'بيوت': 'maison',
  'أرض': 'terrain',
  'ارض': 'terrain',
  'أراضي': 'terrain',
  'اراضي': 'terrain',
  'بقعة': 'terrain',
  'بقع': 'terrain',
  'مزرعة': 'terrain',
  'فيرمة': 'terrain',
  'رياض': 'riad',
  'رياضات': 'riad',
  'قصبة': 'riad',
  'قصر': 'riad',
  'شقة': 'appartement',
  'شقق': 'appartement',
  'برطمة': 'appartement',
  'برطما': 'appartement',
  'فيلا': 'villa',
  'فيلات': 'villa',
  'محل': 'local',
  'محلات': 'local',
  'حانوت': 'local',
  'تجاري': 'local',
  'متجر': 'local',
  'دكان': 'local',
  'مستودع': 'local',
  'مكتب': 'bureau',
  'مكاتب': 'bureau',
  'استوديو': 'studio',
  'ستوديو': 'studio',
  'دوبلكس': 'duplex'
};

/**
 * Dictionnaire complet des opérations (Achat / Location en Français et Darija)
 */
export const operationMapping: Record<string, 'location' | 'achat'> = {
  // Darija / Arabizi
  'nkri': 'location',
  'kri': 'location',
  'kira': 'location',
  'kra': 'location',
  'kraa': 'location',
  'kraya': 'location',
  'karyine': 'location',
  'krina': 'location',

  // Français & synonymes
  'location': 'location',
  'louer': 'location',
  'a louer': 'location',
  'à louer': 'location',
  'alouer': 'location',

  // Anglais
  'rent': 'location',
  'rental': 'location',

  // Écritures arabes (location)
  'كراء': 'location',
  'نكري': 'location',
  'كري': 'location',
  'للكراء': 'location',
  'اكتراء': 'location',

  // Darija / Arabizi (achat)
  'nchri': 'achat',
  'chri': 'achat',
  'shri': 'achat',
  'chiraa': 'achat',
  'chra': 'achat',
  'chraa': 'achat',
  'shraa': 'achat',
  'chrinal': 'achat',

  // Français & synonymes (achat / vente)
  'achat': 'achat',
  'acheter': 'achat',
  'a acheter': 'achat',
  'à acheter': 'achat',
  'vente': 'achat',
  'vendre': 'achat',
  'a vendre': 'achat',
  'à vendre': 'achat',
  'avendre': 'achat',

  // Anglais
  'buy': 'achat',
  'sale': 'achat',

  // Écritures arabes (achat / vente)
  'شراء': 'achat',
  'نشري': 'achat',
  'شري': 'achat',
  'للبيع': 'achat',
  'بيع': 'achat'
};

/**
 * Dictionnaire des villes marocaines
 */
export const cityMapping: Record<string, string> = {
  'rabat': 'rabat',
  'rbat': 'rabat',
  'agdal': 'rabat',
  'souissi': 'rabat',
  'hassan': 'rabat',
  'casablanca': 'casablanca',
  'casa': 'casablanca',
  'maarif': 'casablanca',
  'bourgogne': 'casablanca',
  'anfa': 'casablanca',
  'gauthier': 'casablanca',
  'marrakech': 'marrakech',
  'kech': 'marrakech',
  'gueliz': 'marrakech',
  'medina': 'marrakech',
  'palmeraie': 'marrakech',
  'hivernage': 'marrakech',
  'tanger': 'tanger',
  'tanja': 'tanger',
  'malabata': 'tanger',
  'agadir': 'agadir',
  'taghazout': 'agadir',
  'fes': 'fès',
  'fez': 'fès',
  'fès': 'fès',
  'meknes': 'meknès',
  'meknès': 'meknès',
  'sale': 'sale',
  'sla': 'sale',
  'tetouan': 'tétouan',
  'tétouan': 'tétouan',
  'kenitra': 'kenitra',
  'oujda': 'oujda',
  'mohammedia': 'mohammedia',
  'essaouira': 'essaouira',
  'el jadida': 'el jadida',
  'nador': 'nador',
  'الرباط': 'rabat',
  'الدار البيضاء': 'casablanca',
  'كازا': 'casablanca',
  'مراكش': 'marrakech',
  'طنجة': 'tanger',
  'أكادير': 'agadir',
  'اكادير': 'agadir',
  'فاس': 'fès',
  'مكناس': 'meknès',
  'سلا': 'sale',
  'تطوان': 'tétouan',
  'وجدة': 'oujda',
  'المحمدية': 'mohammedia',
  'الصويرة': 'essaouira'
};

export const CITIES_LIST = [
  'casablanca', 'casa', 'rabat', 'marrakech', 'tanger', 'tanja', 'fès', 'fes', 
  'agadir', 'oujda', 'meknès', 'meknes', 'kenitra', 'tétouan', 'tetouan', 
  'safí', 'safi', 'el jadida', 'beni mellal', 'nador', 'taza', 'settat', 
  'berrechid', 'khouribga', 'laayoune', 'dakhla', 'sale', 'sla', 'mohammedia', 'essaouira'
];

/**
 * Parsing Darija Strict & Exhaustif selon la structure demandée
 * - Aucune limitation de longueur de mot (dar, ard, kri acceptés).
 * - Scan complet forEach de tous les mots sans interruption prématurée.
 * - Structure exacte demandée avec logs de debug.
 */
export function parseVoiceCommand(text: string): ParsedVoiceFilters {
  if (!text || !text.trim()) {
    const emptyFilters: ParsedVoiceFilters = { city: null, type: null, operation: null };
    console.log("=== DARIJA PARSING DEBUG ===");
    console.log("Mots scannés:", []);
    console.log("Filtres détectés:", emptyFilters);
    return emptyFilters;
  }

  const words = text.toLowerCase().split(/\s+/); // Split par espace
  const detectedFilters: ParsedVoiceFilters = { city: null, type: null, operation: null };

  words.forEach(word => {
    // Nettoyer le mot (enlever ponctuation)
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    
    // Vérifier si c'est une opération
    if (operationMapping[cleanWord]) {
      detectedFilters.operation = operationMapping[cleanWord];
    }
    
    // Vérifier si c'est un type de bien
    if (typeMapping[cleanWord]) {
      detectedFilters.type = typeMapping[cleanWord];
    }
    
    // Vérifier si c'est une ville (liste exhaustive)
    const cities = [
      'casablanca', 'casa', 'rabat', 'marrakech', 'tanger', 'fès', 'fes', 'agadir', 'oujda', 'meknès', 'kenitra', 'tétouan', 'safí', 'el jadida', 'beni mellal', 'nador', 'taza', 'settat', 'berrechid', 'khouribga', 'laayoune', 'dakhla',
      'الرباط', 'الدار البيضاء', 'كازا', 'مراكش', 'طنجة', 'فاس', 'أكادير', 'اكادير', 'مكناس', 'سلا', 'تطوان', 'وجدة'
    ];
    if (cities.includes(cleanWord)) {
      detectedFilters.city = cleanWord;
    }
    
    // Vérifier les prépositions darija "f", "fi", "dyal" pour la ville suivante
    if (cleanWord === 'f' || cleanWord === 'fi' || cleanWord === 'dyal' || cleanWord === 'في' || cleanWord === 'ف') {
      const nextWordIndex = words.indexOf(word) + 1;
      if (nextWordIndex < words.length) {
        const nextWord = words[nextWordIndex].replace(/[.,!?;:]/g, '');
        if (cities.includes(nextWord)) {
          detectedFilters.city = nextWord;
        }
      }
    }
  });

  console.log("=== DARIJA PARSING DEBUG ===");
  console.log("Mots scannés:", words);
  console.log("Filtres détectés:", detectedFilters);

  return detectedFilters;
}

/**
 * Filtrage strict "ET" logique sur les résultats vocaux
 */
export function filtrerParTexteEcoute(
  texte: string,
  allProperties: any[]
): ResultatFiltreVocal {
  const filters = parseVoiceCommand(texte);

  if (!filters.city && !filters.type && !filters.operation) {
    console.log("Filtres actifs:", filters);
    console.log("Nombre de biens après filtrage strict:", 0);
    return {
      filtreAction: null,
      filtreVille: null,
      filtreType: null,
      filtreChambres: null,
      resultats: []
    };
  }

  const filteredProperties = allProperties.filter((property) => {
    // 1. Vérification de la Ville (si un filtre ville est actif)
    if (filters.city && property.city.toLowerCase() !== filters.city.toLowerCase()) {
      // Tolérance pour alias de ville (ex: casa / casablanca, fes / fès, noms en arabe)
      const cityMapped = cityMapping[filters.city.toLowerCase()] || filters.city.toLowerCase();
      const propCityNorm = cityMapping[property.city.toLowerCase()] || property.city.toLowerCase();
      const isAlias = cityMapped === propCityNorm ||
                      (filters.city.toLowerCase() === 'casa' && property.city.toLowerCase() === 'casablanca') ||
                      (filters.city.toLowerCase() === 'casablanca' && property.city.toLowerCase() === 'casa') ||
                      (filters.city.toLowerCase() === 'fes' && property.city.toLowerCase() === 'fès') ||
                      (filters.city.toLowerCase() === 'fès' && property.city.toLowerCase() === 'fes');
      if (!isAlias) {
        return false; // Rejeté si la ville ne correspond pas
      }
    }

    // 2. Vérification du Type (si un filtre type est actif)
    const propType = (property.type || property.propertyType || '').toLowerCase();
    if (filters.type && propType !== filters.type.toLowerCase()) {
      return false; // Rejeté si le type ne correspond pas
    }

    // 3. Vérification de l'Opération (si un filtre opération est actif)
    const propOp = (property.operation || (property.priceMad > 50000 ? 'achat' : 'location')).toLowerCase();
    if (filters.operation && propOp !== filters.operation.toLowerCase()) {
      return false; // Rejeté si l'opération (achat/location) ne correspond pas
    }

    // Si le bien a passé tous les tests (ou si aucun filtre n'est actif), on le garde
    return true;
  });

  // Ajoute ce log pour qu'on puisse vérifier dans la console du navigateur :
  console.log("Filtres actifs:", filters);
  console.log("Nombre de biens après filtrage strict:", filteredProperties.length);

  return {
    filtreAction: filters.operation as 'achat' | 'location' | null,
    filtreVille: filters.city,
    filtreType: filters.type as PropertyType | null,
    filtreChambres: null,
    resultats: filteredProperties
  };
}

/**
 * Normalise une chaîne pour une recherche 100% fiable en Français ET en Arabe
 */
export function normalizeSearchText(text?: string | null): string {
  if (!text) return '';

  return (
    text
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
      .replace(/[أإآٱ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[\s\-_',.+/\\()#*":;!?«»[\]{}]+/g, ' ')
      .trim()
  );
}

/**
 * Construit le texte de recherche global d'un bien immobilier
 */
export function buildListingSearchableText(item: PropertyListing): string {
  const normCityId = (item.city || '').toLowerCase().trim();
  const normDistrictId = (item.district || '').toLowerCase().trim();

  const cityObj = CITIES_DATA.find(
    c => c.id.toLowerCase() === normCityId || c.name.toLowerCase() === normCityId
  );
  const cityNameFr = cityObj ? cityObj.name : item.city;
  const cityNameAr = cityObj ? cityObj.nameAr : '';

  let districtNameFr = item.district;
  let districtNameAr = '';
  if (cityObj) {
    const districtObj = cityObj.districts.find(
      d => d.id.toLowerCase() === normDistrictId || d.name.toLowerCase() === normDistrictId
    );
    if (districtObj) {
      districtNameFr = districtObj.name;
      districtNameAr = districtObj.nameAr;
    }
  }

  const propertySynonyms: Record<string, string> = {
    terrain: 'terrain boka3a ardia parcelle foncier lotissement ardiya ارض بقعة ارضية بقعة أرضية عقار',
    appartement: 'appartement flat studio chouka berchmana logement residentiel شقة برطمة استوديو سكن منزل دار',
    villa: 'villa maison prestige riad jardin piscine دار فيلا فيلات سكن قصر',
    commercial: 'commercial magasin boutique bureau depot local fond commerce محل تجاري متجر مكتب مستودع تجارة',
    riad: 'riad maison hote tradition medina دار رياض ضيافة دار الضيافة دار عتيقة'
  };

  const typeSynonyms = propertySynonyms[item.propertyType] || item.propertyType || '';

  const rawCombined = [
    item.title || '',
    item.description || '',
    item.city || '',
    cityNameFr,
    cityNameAr,
    item.district || '',
    districtNameFr,
    districtNameAr,
    item.propertyType || '',
    typeSynonyms,
    item.assignedSamsarName || '',
    item.sellerName || '',
    ...(item.features || [])
  ].join(' ');

  return normalizeSearchText(rawCombined);
}

/**
 * Vérifie si un texte indexé correspond à une requête de recherche
 */
export function matchesSearchQuery(searchableText: string, query: string): boolean {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const tokens = normalizedQuery.split(' ').filter(Boolean);
  if (tokens.length === 0) return true;

  return tokens.every(token => searchableText.includes(token));
}

/**
 * Construit le texte de recherche global d'un Samsar pour l'annuaire
 */
export function buildSamsarSearchableText(samsar: import('../data/samsars').Samsar): string {
  const cityObj = CITIES_DATA.find(c => c.id === samsar.city);
  const cityNameFr = cityObj ? cityObj.name : samsar.city;
  const cityNameAr = cityObj ? cityObj.nameAr : '';

  const districtNamesFr: string[] = [];
  const districtNamesAr: string[] = [];
  if (cityObj) {
    cityObj.districts.forEach(d => {
      if (samsar.districts.includes(d.id)) {
        districtNamesFr.push(d.name);
        districtNamesAr.push(d.nameAr);
      }
    });
  }

  const rawCombined = [
    samsar.name || '',
    samsar.alias || '',
    samsar.coffeeSpot || '',
    samsar.bioFrench || '',
    samsar.bioDarija || '',
    samsar.audioDarijaArabic || '',
    samsar.reputationBadge || '',
    samsar.city || '',
    cityNameFr,
    cityNameAr,
    ...samsar.districts,
    ...districtNamesFr,
    ...districtNamesAr
  ].join(' ');

  return normalizeSearchText(rawCombined);
}
