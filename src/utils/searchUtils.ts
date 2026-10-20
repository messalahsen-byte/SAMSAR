import { PropertyListing } from '../data/listings';
import { CITIES_DATA } from '../data/samsars';

/**
 * Normalise une chaîne pour une recherche 100% fiable en Français ET en Arabe :
 * 1. Insensibilité à la casse (minuscules / majuscules).
 * 2. Suppression des accents français (é, è, ê, à, â, ç...).
 * 3. Gestion de l'arabe :
 *    - Suppression des voyelles et signes diacritiques (tashkeel / harakat : fat-ha, damma, kasra, soukoun, tanween, shadda, tatweel).
 *    - Normalisation des variantes d'Alif (أ, إ, آ, ٱ -> ا).
 *    - Normalisation de Taa Marbuta (ة -> ه).
 *    - Normalisation de l'Alif Maqsura (ى -> ي).
 * 4. Décomposition unicode (NFKD) pour unifier les formes de lettres arabes (initiales, médianes, finales, isolées).
 * 5. Nettoyage des espaces superflus et ponctuation pour permettre la recherche partielle fluide.
 */
export function normalizeSearchText(text?: string | null): string {
  if (!text) return '';

  return (
    text
      // Décomposition Unicode pour normaliser les ligatures et formes arabes
      .normalize('NFKD')
      // Suppression des diacritiques latins (accents français)
      .replace(/[\u0300-\u036f]/g, '')
      // Minuscules pour l'insensibilité à la casse (français / latin)
      .toLowerCase()
      // Suppression du Tashkeel / Harakat arabe (voyelles courtes, shadda, soukoun, tanween, tatweel/kashida)
      .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
      // Normalisation des différentes formes de l'Alif
      .replace(/[أإآٱ]/g, 'ا')
      // Normalisation Taa Marbuta
      .replace(/ة/g, 'ه')
      // Normalisation Alif Maqsura vers Yaa
      .replace(/ى/g, 'ي')
      // Remplacement de la ponctuation et caractères spéciaux par des espaces
      .replace(/[\s\-_',.+/\\()#*":;!?«»[\]{}]+/g, ' ')
      // Nettoyage des espaces superflus
      .trim()
  );
}

/**
 * Construit le texte de recherche global d'un bien immobilier, incluant :
 * - Titre (ex: 'Terrain d angle rare')
 * - Description (ex: 'Parcelle d angle Chouiter...')
 * - Ville : code, nom français (ex: 'Marrakech') et nom arabe (ex: 'مراكش')
 * - Quartier : code, nom français (ex: 'Chwiter') et nom arabe (ex: 'الشويطر')
 * - Type de bien et synonymes français / arabe (ex: 'terrain', 'boka3a', 'ارض', 'بقعة ارضية')
 * - Éléments caractéristiques (features)
 */
export function buildListingSearchableText(item: PropertyListing): string {
  const normCityId = (item.city || '').toLowerCase().trim();
  const normDistrictId = (item.district || '').toLowerCase().trim();

  // Résolution ville (Français + Arabe)
  const cityObj = CITIES_DATA.find(
    c => c.id.toLowerCase() === normCityId || c.name.toLowerCase() === normCityId
  );
  const cityNameFr = cityObj ? cityObj.name : item.city;
  const cityNameAr = cityObj ? cityObj.nameAr : '';

  // Résolution quartier (Français + Arabe)
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

  // Synonymes et équivalents multilingues selon le type de bien
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
 * Vérifie si un texte indexé correspond à une requête de recherche :
 * - Recherche partielle pour chaque mot tapé (ex: 'Chwi' trouve 'Chwiter', 'الشو' trouve 'الشويطر').
 * - Si plusieurs mots sont tapés (ex: 'terrain chwiter' ou 'ارض مراكش'), tous doivent correspondre.
 */
export function matchesSearchQuery(searchableText: string, query: string): boolean {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const tokens = normalizedQuery.split(' ').filter(Boolean);
  if (tokens.length === 0) return true;

  // Chaque mot/token doit être contenu partiellement dans le texte indexé
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
