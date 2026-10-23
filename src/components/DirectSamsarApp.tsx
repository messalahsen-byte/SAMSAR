import React, { useState, useMemo } from 'react';
import { 
  CITIES_DATA, 
  INITIAL_DEMO_SAMSARS, 
  Samsar,
  getCustomSamsars
} from '../data/samsars';
import { 
  PropertyListing, 
  getStoredListings, 
  saveListing 
} from '../data/listings';
import { MoroccoMap } from './MoroccoMap';
import { GoogleMapDistrictViewer } from './GoogleMapDistrictViewer';
import { MoroccoInteractiveMap } from './MoroccoInteractiveMap';
import { MoroccoFlagStarLogo } from './MoroccoFlagStarLogo';
import { 
  Search, 
  PlusCircle, 
  Building2, 
  Home, 
  Store, 
  LandPlot, 
  Sparkles, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Coffee, 
  ArrowLeft, 
  ArrowRight, 
  SlidersHorizontal,
  BellRing,
  HelpCircle,
  Tag,
  Lock,
  Eye,
  Send,
  Users,
  Navigation,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Layers,
  Compass,
  Filter,
  Menu,
  X,
  Key,
  Mic,
  Camera
} from 'lucide-react';
import { formatWhatsAppUrl, playAudioBeep, speakDarijaNatural } from '../utils/audioDarija';
import { recordConnection } from '../utils/connectionsTracker';
import { 
  normalizeSearchText, 
  buildListingSearchableText, 
  matchesSearchQuery 
} from '../utils/searchUtils';

const PROPERTY_TYPES = [
  { id: 'all', name: 'Tous les biens', nameAr: 'جميع العقارات', icon: Building2 },
  { id: 'appartement', name: 'Appartement', nameAr: 'شقة', icon: Building2 },
  { id: 'villa', name: 'Villa & Maison', nameAr: 'فيلا أو دار', icon: Home },
  { id: 'terrain', name: 'Terrain', nameAr: 'بقعة أرضية', icon: LandPlot },
  { id: 'commercial', name: 'Commerce & Local', nameAr: 'محل تجاري', icon: Store },
  { id: 'riad', name: 'Riad traditionnel', nameAr: 'رياض تقليدي', icon: Sparkles },
];

export type DirectSamsarScreen = 'home' | 'samsar_choice' | 'samsar_city' | 'samsar_district' | 'samsar_list' | 'samsar_map' | 'transact_choice' | 'transact_buy' | 'transact_sell' | 'transact';

interface DirectSamsarAppProps {
  onOpenBroadcast: (city?: string, district?: string) => void;
  onNavigateToTab: (tab: any) => void;
  screen?: DirectSamsarScreen;
  onScreenChange?: (screen: DirectSamsarScreen) => void;
}

interface ListingImageProps {
  src?: string;
  alt: string;
  className?: string;
}

const ListingImage: React.FC<ListingImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover group-hover:scale-105 transition duration-300'
}) => {
  const [hasError, setHasError] = useState(false);

  const isInvalid = !src || src.trim() === '' || src.includes('photo-1500382017468-9049fed747ef');

  if (isInvalid || hasError) {
    return (
      <div className="w-full h-full bg-stone-100 flex flex-col items-center justify-center text-stone-400 p-4 select-none">
        <div className="w-11 h-11 rounded-2xl bg-stone-200/80 flex items-center justify-center text-stone-400 mb-1.5 shadow-2xs">
          <Camera className="w-5 h-5 stroke-[1.6]" />
        </div>
        <span className="text-xs font-bold text-stone-500 text-center">
          Photo non disponible
        </span>
        <span
          className="text-[10px] text-stone-400 font-medium text-center mt-0.5"
          style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', sans-serif" }}
        >
          الصورة غير متوفرة
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
};

export const DirectSamsarApp: React.FC<DirectSamsarAppProps> = ({
  onOpenBroadcast,
  onNavigateToTab,
  screen,
  onScreenChange
}) => {
  // Navigation states: 'home' | 'samsar_map' | 'transact_choice' | 'transact_buy' | 'transact_sell'
  const [internalScreen, setInternalScreen] = useState<DirectSamsarScreen>('home');
  const currentScreen = screen !== undefined ? screen : internalScreen;
  const setCurrentScreen = (s: DirectSamsarScreen) => {
    setInternalScreen(s);
    onScreenChange?.(s);
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // In 'transact' mode: 'buy' vs 'sell'
  const [transactMode, setTransactMode] = useState<'buy' | 'sell'>('buy');

  // Step-by-Step state for Sell screen: Step 1 ('type') -> Step 2 ('details')
  const [sellStep, setSellStep] = useState<'type' | 'details'>('type');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [hasVoiceDescription, setHasVoiceDescription] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // Samsar directory navigation state (neutral by default)
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');

  // Buy form filter state (always neutral / empty on open — no memorized choices)
  const [buyCityId, setBuyCityId] = useState<string>('');
  const [buyDistrictId, setBuyDistrictId] = useState<string>('');
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('');
  const [maxBudget, setMaxBudget] = useState<string>('');
  const [keywordSearch, setKeywordSearch] = useState<string>('');
  const [hasSearchedBuy, setHasSearchedBuy] = useState<boolean>(false);
  const [hasBuyVoiceNote, setHasBuyVoiceNote] = useState<boolean>(false);

  // Differentiated detail modals for Buy screen
  // - Vente Directe: opens full detailed property sheet
  // - Mandat Discret Samsar: opens discreet contact page ("Ce bien est réservé aux Samsars...")
  const [selectedDirectListing, setSelectedDirectListing] = useState<PropertyListing | null>(null);
  const [selectedDiscreetListing, setSelectedDiscreetListing] = useState<PropertyListing | null>(null);

  // Map display mode: 'interactive_map' (Carte Leaflet Maroc fluide) vs 'google_map' (Google Maps) vs 'svg_map' (Schéma national)
  const [mapViewMode, setMapViewMode] = useState<'interactive_map' | 'google_map' | 'svg_map'>('interactive_map');
  const [selectedSamsarId, setSelectedSamsarId] = useState<string | null>(null);
  const [mapCityId, setMapCityId] = useState<string>('all');
  const [mapSelectedSamsarId, setMapSelectedSamsarId] = useState<string | null>(null);
  
  // Samsar navigation & browsing state
  const [samsarScope, setSamsarScope] = useState<'district' | 'city' | 'all'>('city');
  const [samsarSearchText, setSamsarSearchText] = useState<string>('');

  // Audio state
  const [activeVoicePlayingId, setActiveVoicePlayingId] = useState<string | null>(null);

  // Listings state
  const [listings, setListings] = useState<PropertyListing[]>(() => getStoredListings());

  // Initial empty state for Sell form (no pre-selected propertyType, city, or district)
  const getInitialSellForm = () => ({
    title: '',
    propertyType: '' as '' | 'appartement' | 'villa' | 'terrain' | 'commercial' | 'riad',
    city: '',
    district: '',
    priceMad: '',
    areaM2: '',
    description: '',
    featuresText: '',
    saleMode: 'samsar_exclusive' as 'direct' | 'samsar_exclusive',
    sellerName: '',
    sellerPhone: '',
  });

  // Form state for selling (Déposer une annonce)
  const [sellForm, setSellForm] = useState(getInitialSellForm);

  const [sellSuccessNotice, setSellSuccessNotice] = useState<{
    created: PropertyListing;
    notifiedSamsars: Samsar[];
  } | null>(null);

  // Reset helpers so forms never memorize previous user choices
  const resetBuyForm = () => {
    setListings(getStoredListings());
    setBuyCityId('');
    setBuyDistrictId('');
    setSelectedPropertyType('');
    setMaxBudget('');
    setKeywordSearch('');
    setHasSearchedBuy(false);
    setHasBuyVoiceNote(false);
    setIsRecordingVoice(false);
    setSelectedDirectListing(null);
    setSelectedDiscreetListing(null);
  };

  const resetSellForm = () => {
    setSellForm(getInitialSellForm());
    setSellStep('type');
    setSellSuccessNotice(null);
    setIsRecordingVoice(false);
    setHasVoiceDescription(false);
    setUploadedPhotos([]);
  };

  const handleExecuteBuySearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setListings(getStoredListings());
    setHasSearchedBuy(true);
    setTimeout(() => {
      const el = document.getElementById('buy-results-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Live filter change handlers: changing Ville, Quartier, or Type de bien triggers/updates the results list instantaneously
  const handleBuyCityChange = (newCityId: string) => {
    setBuyCityId(newCityId);
    setBuyDistrictId('');
    setListings(getStoredListings());
    if (newCityId) {
      setHasSearchedBuy(true);
    }
  };

  const handleBuyDistrictChange = (newDistrictId: string) => {
    setBuyDistrictId(newDistrictId);
    setListings(getStoredListings());
    if (newDistrictId) {
      setHasSearchedBuy(true);
    }
  };

  const handleBuyPropertyTypeChange = (newPropertyType: string) => {
    setSelectedPropertyType(newPropertyType);
    setListings(getStoredListings());
    if (newPropertyType && newPropertyType !== 'all') {
      setHasSearchedBuy(true);
    }
  };

  // Auto-scroll focused text/number input above iOS keyboard on iPhone
  const scrollInputIntoView = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.currentTarget;
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 260);
  };

  // All Samsars combined
  const allSamsars = useMemo(() => {
    return [...getCustomSamsars(), ...INITIAL_DEMO_SAMSARS];
  }, []);

  // Current City & District metadata for Samsar tree navigation
  const currentCity = useMemo(() => {
    return CITIES_DATA.find(c => c.id === selectedCityId) || CITIES_DATA[1];
  }, [selectedCityId]);

  const currentDistrict = useMemo(() => {
    return currentCity.districts.find(d => d.id === selectedDistrictId) || currentCity.districts[0];
  }, [currentCity, selectedDistrictId]);

  // Current City & District metadata for Buy form
  const buySelectedCityObj = useMemo(() => {
    return CITIES_DATA.find(c => c.id === buyCityId) || null;
  }, [buyCityId]);

  const buySelectedDistrictObj = useMemo(() => {
    if (!buySelectedCityObj || !buyDistrictId) return null;
    return buySelectedCityObj.districts.find(d => d.id === buyDistrictId) || null;
  }, [buySelectedCityObj, buyDistrictId]);

  // Samsars of the selected city
  const citySamsars = useMemo(() => {
    if (!selectedCityId) return allSamsars;
    return allSamsars.filter(s => s.city === selectedCityId);
  }, [allSamsars, selectedCityId]);

  // Samsars of the selected district
  const districtSamsars = useMemo(() => {
    if (!selectedCityId) return allSamsars;
    const directMatches = allSamsars.filter(
      s => s.city === selectedCityId && (!selectedDistrictId || s.districts.includes(selectedDistrictId))
    );
    if (directMatches.length > 0) return directMatches;
    return citySamsars;
  }, [allSamsars, citySamsars, selectedCityId, selectedDistrictId]);

  // Displayed Samsars list according to scope and search filter
  const displayedSamsars = useMemo(() => {
    let list: Samsar[] = [];
    if (samsarScope === 'district') {
      list = districtSamsars;
    } else if (samsarScope === 'city') {
      list = citySamsars;
    } else {
      list = allSamsars;
    }

    if (!samsarSearchText.trim()) return list;
    const q = samsarSearchText.toLowerCase();
    return list.filter(
      s => s.name.toLowerCase().includes(q) ||
           s.alias.toLowerCase().includes(q) ||
           s.coffeeSpot.toLowerCase().includes(q) ||
           s.bioFrench.toLowerCase().includes(q) ||
           s.specialties.some(sp => sp.toLowerCase().includes(q))
    );
  }, [samsarScope, districtSamsars, citySamsars, allSamsars, samsarSearchText]);

  // Active Samsar
  const currentActiveSamsar = useMemo(() => {
    if (selectedSamsarId) {
      const found = allSamsars.find(s => s.id === selectedSamsarId);
      if (found) return found;
    }
    return displayedSamsars[0] || allSamsars[0];
  }, [selectedSamsarId, allSamsars, displayedSamsars]);

  // Index of active Samsar
  const currentSamsarIndex = useMemo(() => {
    const idx = displayedSamsars.findIndex(s => s.id === currentActiveSamsar?.id);
    return idx >= 0 ? idx : 0;
  }, [displayedSamsars, currentActiveSamsar]);

  const handleNextSamsar = () => {
    if (displayedSamsars.length <= 1) return;
    const nextIdx = (currentSamsarIndex + 1) % displayedSamsars.length;
    const next = displayedSamsars[nextIdx];
    setSelectedSamsarId(next.id);
    setSelectedCityId(next.city);
    if (next.districts[0]) {
      setSelectedDistrictId(next.districts[0]);
    }
  };

  const handlePrevSamsar = () => {
    if (displayedSamsars.length <= 1) return;
    const prevIdx = (currentSamsarIndex - 1 + displayedSamsars.length) % displayedSamsars.length;
    const prev = displayedSamsars[prevIdx];
    setSelectedSamsarId(prev.id);
    setSelectedCityId(prev.city);
    if (prev.districts[0]) {
      setSelectedDistrictId(prev.districts[0]);
    }
  };

  const handleSelectSpecificSamsar = (samsar: Samsar) => {
    setSelectedSamsarId(samsar.id);
    setSelectedCityId(samsar.city);
    if (samsar.districts[0]) {
      setSelectedDistrictId(samsar.districts[0]);
    }
  };

  const primarySamsar = useMemo(() => {
    if (buyCityId) {
      const match = allSamsars.find(
        s => s.city === buyCityId && (!buyDistrictId || s.districts.includes(buyDistrictId))
      ) || allSamsars.find(s => s.city === buyCityId);
      if (match) return match;
    }
    return currentActiveSamsar;
  }, [buyCityId, buyDistrictId, allSamsars, currentActiveSamsar]);

  // Normalization helper for reliable city/district/propertyType comparisons
  const normalizeFilterValue = (val?: string): string =>
    (val || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  // Filter listings based on buy search:
  // - If no city is selected ('' or 'all'), ALL cities are returned.
  // - If a city is selected, listings matching that city ID, city name, or any of its districts are returned.
  // - If no propertyType is selected ('' or 'all'), ALL property types are returned.
  // Filter listings based on buy search:
  // - If no city is selected ('' ou 'all'), ALL cities are returned.
  // - If a city is selected, listings matching that city ID, city name, or any of its districts are returned.
  // - If no propertyType is selected ('' ou 'all'), ALL property types are returned.
  const filteredListings = useMemo(() => {
    const normCityFilter = normalizeSearchText(buyCityId);
    const normDistrictFilter = normalizeSearchText(buyDistrictId);
    const normTypeFilter = normalizeSearchText(selectedPropertyType);
    const cleanKeyword = keywordSearch.trim();

    const targetCityObj = normCityFilter && normCityFilter !== 'all'
      ? CITIES_DATA.find(
          c =>
            normalizeSearchText(c.id) === normCityFilter ||
            normalizeSearchText(c.name) === normCityFilter ||
            normalizeSearchText(c.nameAr) === normCityFilter
        )
      : null;

    const targetDistrictObj = targetCityObj && normDistrictFilter && normDistrictFilter !== 'all'
      ? targetCityObj.districts.find(
          d =>
            normalizeSearchText(d.id) === normDistrictFilter ||
            normalizeSearchText(d.name) === normDistrictFilter ||
            normalizeSearchText(d.nameAr) === normDistrictFilter
        )
      : null;

    return listings.filter(item => {
      const itemCity = normalizeSearchText(item.city);
      const itemDistrict = normalizeSearchText(item.district);
      const itemType = normalizeSearchText(item.propertyType);

      // 1. Filtre Ville (si vide ou 'all', affiche toutes les villes)
      if (normCityFilter && normCityFilter !== 'all') {
        const matchesCityDirect =
          itemCity === normCityFilter ||
          (targetCityObj &&
            (itemCity === normalizeSearchText(targetCityObj.id) ||
             itemCity === normalizeSearchText(targetCityObj.name) ||
             itemCity === normalizeSearchText(targetCityObj.nameAr)));

        const matchesViaDistrict =
          targetCityObj &&
          targetCityObj.districts.some(
            d =>
              normalizeSearchText(d.id) === itemDistrict ||
              normalizeSearchText(d.name) === itemDistrict ||
              normalizeSearchText(d.nameAr) === itemDistrict
          );

        if (!matchesCityDirect && !matchesViaDistrict) {
          return false;
        }
      }

      // 2. Filtre Quartier (si vide ou 'all', affiche tous les quartiers de la ville)
      if (normDistrictFilter && normDistrictFilter !== 'all') {
        const matchesDistrictDirect =
          itemDistrict === normDistrictFilter ||
          (targetDistrictObj &&
            (itemDistrict === normalizeSearchText(targetDistrictObj.id) ||
             itemDistrict === normalizeSearchText(targetDistrictObj.name) ||
             itemDistrict === normalizeSearchText(targetDistrictObj.nameAr)));

        if (!matchesDistrictDirect) {
          return false;
        }
      }

      // 3. Filtre Type de bien (si vide ou 'all', affiche tous les types de biens)
      if (normTypeFilter && normTypeFilter !== 'all') {
        if (itemType !== normTypeFilter) {
          return false;
        }
      }

      // 4. Filtre Prix / Budget max
      if (maxBudget && !isNaN(Number(maxBudget)) && Number(maxBudget) > 0) {
        if (item.priceMad > Number(maxBudget)) {
          return false;
        }
      }

      // 5. Filtre Mots-clés (Français & Arabe, Insensible à la casse, Recherche partielle sur Titre, Description, Ville et Quartier)
      if (cleanKeyword) {
        const searchableText = buildListingSearchableText(item);
        if (!matchesSearchQuery(searchableText, cleanKeyword)) {
          return false;
        }
      }

      return true;
    });
  }, [listings, buyCityId, buyDistrictId, selectedPropertyType, maxBudget, keywordSearch]);

  const handleCitySelect = (cityId: string) => {
    setSelectedCityId(cityId);
    setSelectedDistrictId('');
    const matchingSamsar = allSamsars.find(s => s.city === cityId);
    if (matchingSamsar) {
      setSelectedSamsarId(matchingSamsar.id);
    }
  };

  const handleMapCitySelect = (cityId: string) => {
    if (cityId === 'all') {
      setMapCityId('all');
      setMapSelectedSamsarId(null);
      return;
    }
    setMapCityId(cityId);
    setSelectedCityId(cityId);
    setMapSelectedSamsarId(null);
    const matchingSamsar = allSamsars.find(s => s.city === cityId);
    if (matchingSamsar) {
      setSelectedSamsarId(matchingSamsar.id);
    }
  };

  const handleDistrictSelect = (districtId: string) => {
    setSelectedDistrictId(districtId);
    const matchingSamsar = allSamsars.find(s => s.city === selectedCityId && s.districts.includes(districtId))
      || allSamsars.find(s => s.city === selectedCityId);
    if (matchingSamsar) {
      setSelectedSamsarId(matchingSamsar.id);
    }
  };

  const handleConnectSamsar = (samsar: Samsar, contextReason?: string) => {
    playAudioBeep('whatsapp_sent');
    recordConnection({
      samsarId: samsar.id,
      samsarAlias: samsar.alias,
      city: buySelectedCityObj?.name || currentCity.name,
      district: buySelectedDistrictObj?.name || currentDistrict?.name || 'Maroc',
      propertyType: selectedPropertyType && selectedPropertyType !== 'all' ? selectedPropertyType : 'Tous les biens'
    });

    const reason = contextReason || `Kan9elleb f ${buySelectedDistrictObj?.name || buySelectedCityObj?.name || currentDistrict?.name || currentCity.name}`;
    const message = `Salam Si ${samsar.name.split(' ')[1] || samsar.name}, cheft DIRECTSAMSAR. ${reason}. Wach momkin nchoufou chi 3ard mzyan ? Chokran.`;
    const url = formatWhatsAppUrl(samsar.whatsapp, message);
    window.open(url, '_blank');
  };

  const handleContactListing = (listing: PropertyListing) => {
    playAudioBeep('whatsapp_sent');
    const message = `Salam, cheft l'annonce f DIRECTSAMSAR : "${listing.title}" (${listing.priceMad.toLocaleString('fr-FR')} MAD) f ${listing.district}. Wach l'bien ba9i disponibe l'ziyara ? Chokran.`;
    const url = formatWhatsAppUrl(listing.sellerPhone, message);
    window.open(url, '_blank');
  };

  const handlePlayVoice = (samsar: Samsar) => {
    if (activeVoicePlayingId === samsar.id) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setActiveVoicePlayingId(null);
      return;
    }

    setActiveVoicePlayingId(samsar.id);
    speakDarijaNatural(
      samsar.audioPromptDarija,
      samsar.audioDarijaArabic,
      () => setActiveVoicePlayingId(null)
    );
  };

  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellForm.propertyType || !sellForm.city || !sellForm.district || !sellForm.title || !sellForm.priceMad || !sellForm.sellerPhone) {
      alert('Veuillez renseigner la ville, le quartier, le titre, le prix et votre téléphone WhatsApp.');
      return;
    }

    const relevantSamsars = allSamsars.filter(
      s => s.city === sellForm.city && s.districts.includes(sellForm.district)
    );
    const assigned = relevantSamsars[0] || allSamsars.find(s => s.city === sellForm.city) || allSamsars[0];

    const cityObj = CITIES_DATA.find(c => c.id === sellForm.city);
    const distObj = cityObj?.districts.find(d => d.id === sellForm.district);

    const newListing = saveListing({
      title: sellForm.title,
      propertyType: sellForm.propertyType as 'appartement' | 'villa' | 'terrain' | 'commercial' | 'riad',
      city: sellForm.city,
      district: sellForm.district,
      priceMad: Number(sellForm.priceMad) || 0,
      areaM2: Number(sellForm.areaM2) || 0,
      description: sellForm.featuresText || sellForm.description || `${sellForm.title} situé à ${distObj?.name || sellForm.district} (${cityObj?.name || sellForm.city}).`,
      features: sellForm.featuresText
        ? sellForm.featuresText.split(',').map(f => f.trim()).filter(Boolean)
        : ['Bien vérifié'],
      imageUrl: (uploadedPhotos && uploadedPhotos.length > 0) ? uploadedPhotos[0] : '',
      saleMode: sellForm.saleMode,
      assignedSamsarId: assigned.id,
      assignedSamsarName: assigned.alias,
      sellerName: sellForm.sellerName || 'Propriétaire',
      sellerPhone: sellForm.sellerPhone,
    });

    const updatedListings = getStoredListings();
    setListings(updatedListings);
    setSellSuccessNotice({
      created: newListing,
      notifiedSamsars: relevantSamsars.length > 0 ? relevantSamsars : [assigned]
    });

    // Clear text inputs while keeping current propertyType on Step 2 so the success notice is visible
    setSellForm(prev => ({
      ...getInitialSellForm(),
      propertyType: prev.propertyType,
    }));
    setHasVoiceDescription(false);
    setUploadedPhotos([]);
  };

  // =========================================================================
  // COMPOSANT INTERNE : MENU BURGER LATÉRAL (SLIDE-OVER)
  // =========================================================================
  const renderBurgerDrawer = () => {
    if (!isMenuOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="fixed inset-0" onClick={() => setIsMenuOpen(false)} />
        <div className="relative w-full max-w-sm bg-white h-[100dvh] shadow-2xl p-6 pb-8 flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-200">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <img
                  src="https://postimg.cc/N5TKdpNv"
                  alt="Logo DirectSamsar"
                  className="h-10 w-auto object-contain shrink-0"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const directUrl = 'https://i.postimg.cc/wT4DTrLM/Cre-un-logo-minimaliste-et-moderne-Le-design-est-une-toile-5.jpg';
                    if (target.src !== directUrl) {
                      target.src = directUrl;
                    } else {
                      target.src = '/logo-etoile.png';
                    }
                  }}
                />
                <span className="text-xl font-black text-[#049A5B] font-serif tracking-tight">
                  Direct<span className="text-amber-600">Samsar</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-3">
                Navigation & Modules
              </p>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setCurrentScreen('home');
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-stone-100 text-stone-800 font-bold text-xs transition text-left cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                <span>Accueil Mobile</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenBroadcast();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-amber-50 hover:bg-amber-100/80 text-amber-950 font-bold text-xs transition text-left cursor-pointer"
              >
                <Send className="w-4 h-4 text-amber-700" />
                <span>Demande Flash Samsar</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setCurrentScreen('samsar_choice');
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-stone-100 text-stone-800 font-medium text-xs transition text-left cursor-pointer"
              >
                <Users className="w-4 h-4 text-stone-600" />
                <span>Trouver un Samsar</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setCurrentScreen('transact_choice');
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-stone-100 text-stone-800 font-medium text-xs transition text-left cursor-pointer"
              >
                <Building2 className="w-4 h-4 text-stone-600" />
                <span>Acheter / Vendre un bien</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onNavigateToTab('directory');
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-stone-100 text-stone-800 font-medium text-xs transition text-left cursor-pointer"
              >
                <Search className="w-4 h-4 text-stone-600" />
                <span>Annuaire & Recherche de Biens</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onNavigateToTab('samsar_mode');
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-stone-100 text-stone-800 font-medium text-xs transition text-left cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-stone-600" />
                <span>Espace Vocal Samsar (Darija)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onNavigateToTab('whatsapp_sim');
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-stone-100 text-stone-800 font-medium text-xs transition text-left cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-stone-600" />
                <span>Simulateur WhatsApp & IA</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onNavigateToTab('incubation_guide');
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-stone-100 text-stone-800 font-medium text-xs transition text-left cursor-pointer"
              >
                <Compass className="w-4 h-4 text-stone-600" />
                <span>Dossier Incubation & Financement</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onNavigateToTab('audit');
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-stone-100 text-stone-800 font-medium text-xs transition text-left cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-stone-600" />
                <span>Audit de Faisabilité Marché</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onNavigateToTab('discussion');
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-stone-100 text-stone-800 font-medium text-xs transition text-left cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-stone-600" />
                <span>Discussion & Thèmes Stratégiques</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 text-center">
            <p className="text-[11px] text-stone-400">
              DIRECTSAMSAR • Modèle mobile natif 🇲🇦
            </p>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // COMPOSANT INTERNE : HEADER ÉPURÉ POUR TOUTES LES PAGES INTÉRIEURES (SHRINK-0)
  // =========================================================================
  const renderInnerHeader = (backTarget: DirectSamsarScreen) => (
    <header className="shrink-0 w-full bg-white border-b border-stone-200/80 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setCurrentScreen(backTarget)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 text-xs font-bold transition shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-stone-700" />
          <span className="hidden sm:inline">Retour</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-2 cursor-pointer select-none active:opacity-80 transition"
        >
          <MoroccoFlagStarLogo />
          <span className="font-black text-[#049A5B] text-base sm:text-lg font-serif tracking-tight">
            Direct<span className="text-amber-600">Samsar</span>
          </span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => setIsMenuOpen(true)}
        aria-label="Menu"
        className="w-9 h-9 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 flex items-center justify-center transition shadow-2xs cursor-pointer"
      >
        <Menu className="w-5 h-5 text-stone-800" />
      </button>
    </header>
  );

  // =========================================================================
  // SCREEN 1 : ACCUEIL MOBILE NATIF (flex flex-col h-[100dvh] overflow-hidden + pb-6)
  // =========================================================================
  if (currentScreen === 'home') {
    return (
      <div className="flex flex-col h-[100dvh] overflow-hidden w-full max-w-md mx-auto bg-[#FAFAFA] px-4 pt-3 pb-6 font-sans select-none">
        
        {/* 1. Header dans le flux normal (shrink-0) */}
        <header className="flex items-center justify-between pt-1 pb-2.5 px-1 shrink-0">
          <div className="flex items-center gap-2.5">
            <MoroccoFlagStarLogo />
            <h1 className="text-2xl font-black tracking-tight text-[#049A5B] font-serif">
              Direct<span className="text-amber-600">Samsar</span>
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Menu"
            className="w-11 h-11 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:bg-stone-100 flex items-center justify-center text-stone-800 transition active:scale-95 cursor-pointer"
          >
            <Menu className="w-5 h-5 text-stone-800" />
          </button>
        </header>

        {/* 2. Les 2 cartes qui partagent l'espace 50/50 (flex-col flex-1) sans débordement */}
        <div className="flex-1 flex flex-col gap-3.5 mt-1 min-h-0 overflow-hidden">
          
          {/* Carte 1 (EN HAUT) : Trouver un Samsar (flex-1) */}
          <button
            type="button"
            onClick={() => setCurrentScreen('samsar_choice')}
            className="flex-1 min-h-0 bg-amber-50/60 hover:bg-amber-50/90 border border-amber-200/80 rounded-3xl p-5 sm:p-6 flex flex-col justify-between text-left shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.985] group relative overflow-hidden cursor-pointer"
          >
            <div className="flex items-start justify-between w-full">
              <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="w-9 h-9 rounded-full bg-amber-100/90 group-hover:bg-amber-200 flex items-center justify-center text-amber-800 transition">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <div className="space-y-1 my-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight group-hover:text-amber-900 transition">
                Trouver un Samsar
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-medium">
                Carte du Maroc & Samsars référents par quartier
              </p>
            </div>
          </button>

          {/* Carte 2 (EN BAS) : Acheter / Vendre (flex-1) */}
          <button
            type="button"
            onClick={() => setCurrentScreen('transact_choice')}
            className="flex-1 min-h-0 bg-white hover:bg-stone-50/90 border border-stone-200/90 rounded-3xl p-5 sm:p-6 flex flex-col justify-between text-left shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.985] group relative overflow-hidden cursor-pointer"
          >
            <div className="flex items-start justify-between w-full">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6 text-amber-400" />
              </div>
              <div className="w-9 h-9 rounded-full bg-stone-100 group-hover:bg-amber-100 flex items-center justify-center text-stone-400 group-hover:text-amber-800 transition">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <div className="space-y-1 my-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight group-hover:text-stone-950 transition">
                Acheter / Vendre
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-medium">
                Biens vérifiés & dépôt d'annonce
              </p>
            </div>
          </button>
        </div>

        {renderBurgerDrawer()}
      </div>
    );
  }

  // =========================================================================
  // ÉCRAN INTERMÉDIAIRE SAMSAR : 2 GRANDS CHOIX (flex flex-col h-[100dvh] overflow-hidden + pb-6)
  // =========================================================================
  if (currentScreen === 'samsar_choice') {
    return (
      <div className="flex flex-col h-[100dvh] overflow-hidden w-full max-w-md mx-auto bg-[#FAFAFA] px-4 pt-3 pb-6 font-sans select-none">
        
        {/* 1. Header dans le flux normal (shrink-0) */}
        <header className="flex items-center justify-between pt-1 pb-2.5 px-1 shrink-0">
          <button
            type="button"
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-stone-200/90 hover:bg-stone-100 active:scale-95 text-stone-800 text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-stone-700" />
            <span>Retour</span>
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentScreen('home')}>
            <img
              src="https://postimg.cc/N5TKdpNv"
              alt="Logo DirectSamsar"
              className="h-10 w-auto object-contain shrink-0"
              onError={(e) => {
                const target = e.currentTarget;
                const directUrl = 'https://i.postimg.cc/wT4DTrLM/Cre-un-logo-minimaliste-et-moderne-Le-design-est-une-toile-5.jpg';
                if (target.src !== directUrl) {
                  target.src = directUrl;
                } else {
                  target.src = '/logo-etoile.png';
                }
              }}
            />
            <h1 className="text-xl font-black tracking-tight text-[#049A5B] font-serif">
              Direct<span className="text-amber-600">Samsar</span>
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Menu"
            className="w-11 h-11 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:bg-stone-100 flex items-center justify-center text-stone-800 transition active:scale-95 cursor-pointer"
          >
            <Menu className="w-5 h-5 text-stone-800" />
          </button>
        </header>

        {/* 2. Les 2 cartes qui partagent l'espace 50/50 (flex-col flex-1) */}
        <div className="flex-1 flex flex-col gap-3.5 mt-1 min-h-0 overflow-hidden">
          
          {/* Choix A : Rechercher par Quartier (flex-1) */}
          <button
            type="button"
            onClick={() => {
              setSamsarScope('district');
              setSelectedCityId('');
              setSelectedDistrictId('');
              setCurrentScreen('samsar_city');
            }}
            className="flex-1 min-h-0 bg-amber-50/60 hover:bg-amber-50/90 border border-amber-200/80 rounded-3xl p-5 sm:p-6 flex flex-col justify-between text-left shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.985] group relative overflow-hidden cursor-pointer"
          >
            <div className="flex items-start justify-between w-full">
              <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <div className="relative flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center shadow-xs">
                    <Search className="w-2.5 h-2.5 text-amber-400 stroke-[2.5]" />
                  </div>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-amber-100/90 group-hover:bg-amber-200 flex items-center justify-center text-amber-800 transition">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <div className="my-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight group-hover:text-amber-900 transition">
                Rechercher par Quartier
              </h2>
            </div>
          </button>

          {/* Choix B : Voir la Carte Interactive (flex-1) */}
          <button
            type="button"
            onClick={() => {
              setMapCityId('all');
              setMapSelectedSamsarId(null);
              setCurrentScreen('samsar_map');
            }}
            className="flex-1 min-h-0 bg-white hover:bg-stone-50/90 border border-stone-200/90 rounded-3xl p-5 sm:p-6 flex flex-col justify-between text-left shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.985] group relative overflow-hidden cursor-pointer"
          >
            <div className="flex items-start justify-between w-full">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <div className="relative flex items-center justify-center">
                  <Compass className="w-6 h-6 text-amber-400" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-xs">
                    <MapPin className="w-2.5 h-2.5 text-white stroke-[2.5]" />
                  </div>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-stone-100 group-hover:bg-amber-100 flex items-center justify-center text-stone-400 group-hover:text-amber-800 transition">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <div className="my-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight group-hover:text-stone-950 transition">
                Voir la Carte Interactive
              </h2>
            </div>
          </button>
        </div>

        {renderBurgerDrawer()}
      </div>
    );
  }

  // =========================================================================
  // ARBORESCENCE ÉCRAN 1 : CHOIX DE LA VILLE (Compact, tient sur 1 seul écran)
  // =========================================================================
  if (currentScreen === 'samsar_city') {
    return (
      <div className="flex flex-col h-[100dvh] overflow-hidden w-full bg-[#FAFAFA] font-sans select-none">
        {/* 1. Header fixe en haut (shrink-0) */}
        {renderInnerHeader('samsar_choice')}

        {/* 2. Titre compact en haut (shrink-0) */}
        <div className="shrink-0 bg-[#FAFAFA] px-4 pt-3 pb-1.5">
          <div className="max-w-md sm:max-w-xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
              Étape 1 sur 3
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif tracking-tight">
              Choisissez la Ville
            </h2>
          </div>
        </div>

        {/* 3. Grille compacte de boutons proportionnés (2 par ligne mobile, 3 sur grand écran, aucun présélectionné) */}
        <div className="flex-1 overflow-y-auto px-4 py-2.5 flex flex-col justify-center">
          <div className="max-w-md sm:max-w-xl w-full mx-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {CITIES_DATA.map(city => (
              <button
                key={city.id}
                type="button"
                onClick={() => {
                  handleCitySelect(city.id);
                  setCurrentScreen('samsar_district');
                }}
                className="rounded-2xl py-3.5 px-3.5 flex items-center justify-between text-left transition-all duration-150 active:scale-[0.98] group cursor-pointer bg-white hover:bg-stone-50 text-stone-900 border border-stone-200/90 shadow-xs hover:shadow-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 bg-amber-50 text-amber-700">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black tracking-tight truncate text-stone-900">
                      {city.name}
                    </h3>
                    <p className="text-[10px] font-medium truncate text-stone-400">
                      {city.districts.length} quartiers
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 text-stone-300 group-hover:text-amber-700" />
              </button>
            ))}
          </div>
        </div>

        {/* 4. Bouton Retour fixe en bas (shrink-0 pb-6) */}
        <div className="shrink-0 bg-white border-t border-stone-200/80 px-4 pt-3 pb-6 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          <div className="max-w-md sm:max-w-xl mx-auto">
            <button
              type="button"
              onClick={() => setCurrentScreen('samsar_choice')}
              className="w-full py-3 px-5 bg-stone-100 hover:bg-stone-200 active:scale-[0.985] text-stone-800 font-bold text-sm rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-stone-700" />
              <span>Retour</span>
            </button>
          </div>
        </div>

        {renderBurgerDrawer()}
      </div>
    );
  }

  // =========================================================================
  // ARBORESCENCE ÉCRAN 2 : CHOIX DU QUARTIER (Compact, tient sur 1 seul écran)
  // =========================================================================
  if (currentScreen === 'samsar_district') {
    return (
      <div className="flex flex-col h-[100dvh] overflow-hidden w-full bg-[#FAFAFA] font-sans select-none">
        {/* 1. Header fixe en haut (shrink-0) */}
        {renderInnerHeader('samsar_city')}

        {/* 2. Titre compact en haut (shrink-0) */}
        <div className="shrink-0 bg-[#FAFAFA] px-4 pt-3 pb-1.5">
          <div className="max-w-md sm:max-w-xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
              Étape 2 sur 3 • {currentCity.name}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif tracking-tight">
              Choisissez le Quartier
            </h2>
          </div>
        </div>

        {/* 3. Grille compacte de boutons proportionnés (2 par ligne mobile, 3 sur grand écran, aucun présélectionné) */}
        <div className="flex-1 overflow-y-auto px-4 py-2.5 flex flex-col justify-center">
          <div className="max-w-md sm:max-w-xl w-full mx-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {currentCity.districts.map(dist => {
              const shortName = dist.name.split('&')[0].trim();

              return (
                <button
                  key={dist.id}
                  type="button"
                  onClick={() => {
                    handleDistrictSelect(dist.id);
                    setCurrentScreen('samsar_list');
                  }}
                  className="rounded-2xl py-3 px-3 flex items-center justify-between text-left transition-all duration-150 active:scale-[0.98] group cursor-pointer bg-white hover:bg-stone-50 text-stone-900 border border-stone-200/90 shadow-xs hover:shadow-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 bg-amber-50 text-amber-700">
                      <Home className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold tracking-tight truncate text-stone-900">
                        {shortName}
                      </h3>
                      <p className="text-[10px] truncate text-stone-400">
                        {dist.name}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-1 transition-transform group-hover:translate-x-0.5 text-stone-300 group-hover:text-amber-700" />
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Bouton Changer de ville fixe en bas (shrink-0 pb-6) */}
        <div className="shrink-0 bg-white border-t border-stone-200/80 px-4 pt-3 pb-6 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          <div className="max-w-md sm:max-w-xl mx-auto">
            <button
              type="button"
              onClick={() => {
                setSelectedCityId('');
                setSelectedDistrictId('');
                setCurrentScreen('samsar_city');
              }}
              className="w-full py-3 px-5 bg-stone-100 hover:bg-stone-200 active:scale-[0.985] text-stone-800 font-bold text-sm rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-stone-700" />
              <span>Changer de ville ({currentCity.name})</span>
            </button>
          </div>
        </div>

        {renderBurgerDrawer()}
      </div>
    );
  }

  // =========================================================================
  // ARBORESCENCE ÉCRAN 3 : LISTE DES SAMSARS DU QUARTIER
  // Titre fixe en haut + Liste scrollable au centre + Bouton fixe en bas
  // =========================================================================
  if (currentScreen === 'samsar_list') {
    return (
      <div className="flex flex-col h-[100dvh] overflow-hidden w-full bg-[#FAFAFA] font-sans">
        {/* 1. Header fixe en haut (shrink-0) */}
        {renderInnerHeader('samsar_district')}

        {/* 2. Titre fixe en haut (shrink-0) */}
        <div className="shrink-0 bg-[#FAFAFA] border-b border-stone-200/70 px-4 py-3.5">
          <div className="max-w-md sm:max-w-xl mx-auto flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                {currentCity.name} • Contact Direct
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif tracking-tight">
                Samsars à {currentDistrict?.name || currentCity.name}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs">
              {districtSamsars.length} {districtSamsars.length > 1 ? 'dispos' : 'dispo'}
            </span>
          </div>
        </div>

        {/* 3. Zone centrale scrollable : SEULE la liste des fiches Samsar défile (flex-1 overflow-y-auto) */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="max-w-md sm:max-w-xl mx-auto space-y-4">
            {districtSamsars.map(samsar => (
              <div
                key={samsar.id}
                className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-4"
              >
                {/* Infos épurées : Photo, Nom, Quartier, Café + Audio Darija */}
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={samsar.avatar}
                      alt={samsar.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-xs"
                    />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                      ✓
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-black text-stone-900 leading-tight truncate">
                      {samsar.alias}
                    </h3>
                    <p className="text-xs font-medium text-stone-500 truncate mt-0.5">
                      {samsar.name}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold mt-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="truncate">{currentDistrict?.name || currentCity.name}, {currentCity.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-0.5">
                      <Coffee className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      <span className="truncate">{samsar.coffeeSpot}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePlayVoice(samsar)}
                    className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 transition active:scale-95 shrink-0 cursor-pointer"
                    title="Écouter la présentation en Darija"
                  >
                    {activeVoicePlayingId === samsar.id ? (
                      <VolumeX className="w-5 h-5 text-amber-900 animate-pulse" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-amber-800" />
                    )}
                  </button>
                </div>

                {/* 2 gros boutons d'action : Appeler & WhatsApp */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <a
                    href={`tel:${samsar.phone}`}
                    className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-950 active:scale-[0.98] text-white font-bold text-sm rounded-2xl transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>Appeler</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleConnectSamsar(samsar)}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm rounded-2xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-white" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Bouton 'Changer de quartier' fixe en bas (shrink-0 pb-6) */}
        <div className="shrink-0 bg-white border-t border-stone-200/80 px-4 pt-3 pb-6 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          <div className="max-w-md sm:max-w-xl mx-auto">
            <button
              type="button"
              onClick={() => {
                setSelectedDistrictId('');
                setCurrentScreen('samsar_district');
              }}
              className="w-full py-3 px-5 bg-stone-900 hover:bg-stone-950 active:scale-[0.985] text-white font-bold text-sm rounded-2xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Changer de quartier</span>
            </button>
          </div>
        </div>

        {renderBurgerDrawer()}
      </div>
    );
  }

  // =========================================================================
  // CHOIX B : CARTE INTERACTIVE DU MAROC (Épurée, carte plein espace flex-1)
  // =========================================================================
  if (currentScreen === 'samsar_map') {
    return (
      <div className="flex flex-col h-[100dvh] overflow-hidden w-full bg-[#FAFAFA] font-sans">
        {/* 1. Barre fine en haut : ← Retour | Carte Interactive | ≡ Menu (shrink-0) */}
        <header className="shrink-0 w-full bg-white border-b border-stone-200/80 px-4 py-2.5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentScreen('samsar_choice')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 text-xs font-bold transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-stone-700" />
            <span>Retour</span>
          </button>

          <h1 className="font-black text-stone-900 text-sm sm:text-base font-serif tracking-tight">
            Carte <span className="text-amber-700">Interactive</span>
          </h1>

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Menu"
            className="w-9 h-9 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 flex items-center justify-center transition cursor-pointer"
          >
            <Menu className="w-5 h-5 text-stone-800" />
          </button>
        </header>

        {/* 2. Une seule ligne de boutons de villes tout en haut (juste sous le header, shrink-0) */}
        <div className="shrink-0 w-full bg-white border-b border-stone-200/80 px-3 py-2">
          <div className="max-w-4xl mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {CITIES_DATA.map(c => {
              const isSelected = mapCityId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleMapCitySelect(c.id)}
                  className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. La Carte : prend tout l'espace restant jusqu'aux boutons d'action du bas (flex-1 min-h-0) */}
        <div className="flex-1 min-h-0 w-full relative overflow-hidden">
          <MoroccoInteractiveMap
            selectedCityId={mapCityId}
            selectedDistrictId={selectedDistrictId}
            selectedSamsarId={mapSelectedSamsarId}
            onSelectCity={handleMapCitySelect}
            onSelectDistrict={(distId) => handleDistrictSelect(distId)}
            onSelectSamsar={(samsar) => {
              setMapSelectedSamsarId(samsar.id);
              handleSelectSpecificSamsar(samsar);
            }}
            samsars={allSamsars}
            listings={listings}
            onConnectSamsar={handleConnectSamsar}
          />
        </div>

        {/* 4. Boutons 'Appeler' et 'WhatsApp' fixes en bas avec padding de sécurité (shrink-0 pb-6) */}
        <div className="shrink-0 bg-white border-t border-stone-200/80 px-4 pt-3 pb-6 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          <div className="max-w-md sm:max-w-xl mx-auto grid grid-cols-2 gap-3">
            <a
              href={`tel:${currentActiveSamsar.phone}`}
              className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-950 active:scale-[0.98] text-white font-bold text-sm rounded-2xl transition flex items-center justify-center gap-2 shadow-xs"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Appeler</span>
            </a>

            <button
              type="button"
              onClick={() => handleConnectSamsar(currentActiveSamsar)}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm rounded-2xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {renderBurgerDrawer()}
      </div>
    );
  }

  // =========================================================================
  // ÉCRAN INTERMÉDIAIRE : 2 GRANDS CHOIX ACHETER / VENDRE (flex flex-col h-[100dvh] overflow-hidden + pb-6)
  // =========================================================================
  if (currentScreen === 'transact_choice' || currentScreen === 'transact') {
    return (
      <div className="flex flex-col h-[100dvh] overflow-hidden w-full max-w-md mx-auto bg-[#FAFAFA] px-4 pt-3 pb-6 font-sans select-none">
        
        {/* 1. Header dans le flux normal (shrink-0) */}
        <header className="flex items-center justify-between pt-1 pb-2.5 px-1 shrink-0">
          <button
            type="button"
            onClick={() => setCurrentScreen('home')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-stone-200/90 hover:bg-stone-100 active:scale-95 text-stone-800 text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-stone-700" />
            <span>Retour</span>
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentScreen('home')}>
            <img
              src="https://postimg.cc/N5TKdpNv"
              alt="Logo DirectSamsar"
              className="h-10 w-auto object-contain shrink-0"
              onError={(e) => {
                const target = e.currentTarget;
                const directUrl = 'https://i.postimg.cc/wT4DTrLM/Cre-un-logo-minimaliste-et-moderne-Le-design-est-une-toile-5.jpg';
                if (target.src !== directUrl) {
                  target.src = directUrl;
                } else {
                  target.src = '/logo-etoile.png';
                }
              }}
            />
            <h1 className="text-xl font-black tracking-tight text-[#049A5B] font-serif">
              Direct<span className="text-amber-600">Samsar</span>
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Menu"
            className="w-11 h-11 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:bg-stone-100 flex items-center justify-center text-stone-800 transition active:scale-95 cursor-pointer"
          >
            <Menu className="w-5 h-5 text-stone-800" />
          </button>
        </header>

        {/* 2. Les 2 cartes qui partagent l'espace 50/50 (flex-col flex-1) */}
        <div className="flex-1 flex flex-col gap-3.5 mt-1 min-h-0 overflow-hidden">
          
          {/* Carte 1 : Acheter un bien (flex-1) -> réinitialise tous les champs à vide */}
          <button
            type="button"
            onClick={() => {
              resetBuyForm();
              setCurrentScreen('transact_buy');
              setTransactMode('buy');
            }}
            className="flex-1 min-h-0 bg-amber-50/60 hover:bg-amber-50/90 border border-amber-200/80 rounded-3xl p-5 sm:p-6 flex flex-col justify-between text-left shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.985] group relative overflow-hidden cursor-pointer"
          >
            <div className="flex items-start justify-between w-full">
              <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <div className="relative flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center shadow-xs">
                    <Search className="w-2.5 h-2.5 text-amber-400 stroke-[2.5]" />
                  </div>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-amber-100/90 group-hover:bg-amber-200 flex items-center justify-center text-amber-800 transition">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <div className="my-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight group-hover:text-amber-900 transition">
                Acheter un bien
              </h2>
            </div>
          </button>

          {/* Carte 2 : Vendre un bien (flex-1) -> réinitialise tous les champs et types à vide */}
          <button
            type="button"
            onClick={() => {
              resetSellForm();
              setCurrentScreen('transact_sell');
              setTransactMode('sell');
            }}
            className="flex-1 min-h-0 bg-white hover:bg-stone-50/90 border border-stone-200/90 rounded-3xl p-5 sm:p-6 flex flex-col justify-between text-left shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.985] group relative overflow-hidden cursor-pointer"
          >
            <div className="flex items-start justify-between w-full">
              <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <div className="relative flex items-center justify-center">
                  <Key className="w-6 h-6 text-amber-400" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-xs">
                    <Tag className="w-2.5 h-2.5 text-white stroke-[2.5]" />
                  </div>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-stone-100 group-hover:bg-amber-100 flex items-center justify-center text-stone-400 group-hover:text-amber-800 transition">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            <div className="my-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight group-hover:text-stone-950 transition">
                Vendre un bien
              </h2>
            </div>
          </button>
        </div>

        {renderBurgerDrawer()}
      </div>
    );
  }

  // =========================================================================
  // SCREEN 3.A : ACHETER UN BIEN / RECHERCHE
  // Validation explicite via bouton "Rechercher un bien" + Type "Tous" par défaut
  // =========================================================================
  const isBuyMode = currentScreen === 'transact_buy' || (currentScreen !== 'transact_sell' && transactMode === 'buy');

  if (isBuyMode) {
    const activePropertyTypeLabel = selectedPropertyType && selectedPropertyType !== 'all'
      ? PROPERTY_TYPES.find(t => t.id === selectedPropertyType)?.name || selectedPropertyType
      : 'Tous les types de biens';

    return (
      <div className="flex flex-col h-[100dvh] overflow-hidden w-full bg-[#FAFAFA] font-sans">
        {/* 1. Header fixe en haut du flex */}
        {renderInnerHeader('transact_choice')}

        {/* 2. Zone de contenu centrale scrollable (flex-1 overflow-y-auto) */}
        <div className="flex-1 overflow-y-auto overscroll-contain scroll-smooth px-4 sm:px-6 py-4 pb-10">
          <div className="max-w-4xl mx-auto space-y-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif tracking-tight">
                Acheter un bien
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">
                {hasSearchedBuy
                  ? 'Filtrez par ville ou quartier pour affiner les résultats instantanément.'
                  : 'Sélectionnez une ville ou cliquez sur « Rechercher un bien » pour afficher les annonces.'}
              </p>
            </div>

            {/* Formulaire de recherche bilingue : Validation initiale via bouton + Mise à jour directe en temps réel */}
            <form
              onSubmit={handleExecuteBuySearch}
              className="bg-white border border-stone-200/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3.5"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block mb-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Ville</span>
                    <span className="text-[11px] text-amber-800 font-medium block" style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', sans-serif" }}>المدينة</span>
                  </label>
                  <select
                    value={buyCityId}
                    onChange={(e) => handleBuyCityChange(e.target.value)}
                    className={`w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2.5 text-xs font-bold outline-none ${
                      buyCityId ? 'text-stone-900' : 'text-stone-500'
                    }`}
                  >
                    <option value="">Sélectionnez une ville (Toutes)</option>
                    {CITIES_DATA.map(c => (
                      <option key={c.id} value={c.id} className="text-stone-900">{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Quartier</span>
                    <span className="text-[11px] text-amber-800 font-medium block" style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', sans-serif" }}>الحي</span>
                  </label>
                  <select
                    value={buyDistrictId}
                    disabled={!buyCityId}
                    onChange={(e) => handleBuyDistrictChange(e.target.value)}
                    className={`w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2.5 text-xs font-bold outline-none disabled:opacity-60 ${
                      buyDistrictId ? 'text-stone-900' : 'text-stone-500'
                    }`}
                  >
                    <option value="">
                      {buyCityId ? 'Tous les quartiers' : "Choisissez d'abord une ville"}
                    </option>
                    {buySelectedCityObj?.districts.map(d => (
                      <option key={d.id} value={d.id} className="text-stone-900">{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Type de bien</span>
                    <span className="text-[11px] text-amber-800 font-medium block" style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', sans-serif" }}>نوع العقار</span>
                  </label>
                  <select
                    value={selectedPropertyType}
                    onChange={(e) => handleBuyPropertyTypeChange(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2.5 text-xs font-bold text-stone-900 outline-none"
                  >
                    <option value="">Tous les types de biens (جميع العقارات)</option>
                    {PROPERTY_TYPES.filter(t => t.id !== 'all').map(t => (
                      <option key={t.id} value={t.id} className="text-stone-900">{t.name} ({t.nameAr})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Prix / Budget max</span>
                    <span className="text-[11px] text-amber-800 font-medium block" style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', sans-serif" }}>الثمن / الميزانية</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 500 000"
                    value={maxBudget}
                    onFocus={scrollInputIntoView}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2.5 text-xs text-stone-900 outline-none"
                  />
                </div>
              </div>

              {/* Bouton Vocal (Accessibilité) placé au-dessus du champ de texte — ne pollue pas le champ mots-clés */}
              <button
                type="button"
                onClick={() => {
                  playAudioBeep('record_start');
                  if (!isRecordingVoice) {
                    setIsRecordingVoice(true);
                    setTimeout(() => {
                      setIsRecordingVoice(false);
                      setHasBuyVoiceNote(true);
                    }, 2200);
                  } else {
                    setIsRecordingVoice(false);
                    setHasBuyVoiceNote(true);
                  }
                }}
                className={`w-full py-3 px-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isRecordingVoice
                    ? 'bg-red-50 border-red-400 text-red-900 animate-pulse'
                    : hasBuyVoiceNote
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : 'bg-amber-50/70 hover:bg-amber-100/70 border-amber-200/90 text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5 text-left">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isRecordingVoice
                      ? 'bg-red-600 text-white'
                      : hasBuyVoiceNote
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}>
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">
                      {isRecordingVoice
                        ? '🎙️ Écoute en cours... Parlez maintenant'
                        : hasBuyVoiceNote
                        ? '✅ Description vocale enregistrée'
                        : '🎙️ Enregistrer une description vocale (Optionnel)'}
                    </span>
                    <span
                      className="text-xs text-amber-900 font-semibold block"
                      style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', sans-serif" }}
                    >
                      تكلم بالعربية أو الفرنسية
                    </span>
                  </div>
                </div>
              </button>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    dir="auto"
                    placeholder="Mots-clés / كلمات البحث (Chouiter, 3 façades, شقة...)"
                    value={keywordSearch}
                    onFocus={scrollInputIntoView}
                    onChange={(e) => {
                      const val = e.target.value;
                      setKeywordSearch(val);
                      if (val.trim().length > 0) {
                        setHasSearchedBuy(true);
                      }
                    }}
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 outline-none"
                    style={{ fontFamily: "'Plus Jakarta Sans', 'Tajawal', 'Noto Sans Arabic', sans-serif" }}
                  />
                </div>
              </div>

              {/* BOUTON RECHERCHER : Visible uniquement avant la première recherche / sélection de ville */}
              {!hasSearchedBuy ? (
                <div className="pt-1.5">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-5 bg-amber-600 hover:bg-amber-700 active:scale-[0.985] text-white font-bold text-sm sm:text-base rounded-2xl shadow-md shadow-amber-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <span>Rechercher un bien • بحث عن عقار</span>
                  </button>
                </div>
              ) : (
                <div className="flex justify-end pt-0.5">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-amber-800 transition py-1 px-2.5 rounded-lg hover:bg-stone-100 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
                    <span>Actualiser • تحديث</span>
                  </button>
                </div>
              )}
            </form>

            {/* RÉSULTATS DE RECHERCHE : Affichés après la première validation, puis mis à jour en temps réel */}
            {hasSearchedBuy && (
              <div id="buy-results-section" className="space-y-4 pt-1 animate-in fade-in duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-stone-900 font-serif">
                        Biens correspondants ({filteredListings.length})
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Direct
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-medium">
                      {buySelectedCityObj ? buySelectedCityObj.name : 'Toutes les villes'}
                      {' • '}
                      {buySelectedDistrictObj ? buySelectedDistrictObj.name : 'Tous les quartiers'}
                      {' • '}
                      <span className="text-amber-800 font-bold">{activePropertyTypeLabel}</span>
                    </p>
                  </div>

                  {(buyCityId || buyDistrictId || selectedPropertyType || maxBudget || keywordSearch) && (
                    <button
                      type="button"
                      onClick={() => {
                        setBuyCityId('');
                        setBuyDistrictId('');
                        setSelectedPropertyType('');
                        setMaxBudget('');
                        setKeywordSearch('');
                        setListings(getStoredListings());
                      }}
                      className="text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
                    >
                      Tout afficher ({listings.length})
                    </button>
                  )}
                </div>

                {filteredListings.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredListings.map(item => {
                      const itemCityObj = CITIES_DATA.find(
                        c => normalizeFilterValue(c.id) === normalizeFilterValue(item.city)
                      );
                      const itemDistObj = itemCityObj?.districts.find(
                        d => normalizeFilterValue(d.id) === normalizeFilterValue(item.district)
                      );
                      const itemCityName = itemCityObj?.name || item.city || 'Maroc';
                      const itemDistName = itemDistObj?.name || item.district || 'Centre';

                      const isDiscreetMandate = item.saleMode === 'samsar_exclusive';

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (isDiscreetMandate) {
                              setSelectedDiscreetListing(item);
                            } else {
                              setSelectedDirectListing(item);
                            }
                          }}
                          className={`bg-white rounded-3xl border transition flex flex-col justify-between cursor-pointer group overflow-hidden ${
                            isDiscreetMandate 
                              ? 'border-amber-300 shadow-xs hover:shadow-md hover:border-amber-400' 
                              : 'border-stone-200 shadow-xs hover:shadow-md'
                          }`}
                        >
                          <div className="relative h-44 bg-stone-100 overflow-hidden">
                            <ListingImage 
                              src={item.imageUrl} 
                              alt={item.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                            />
                            
                            {/* Badges en haut de l'image */}
                            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center">
                              <span className="bg-stone-950/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase">
                                {item.propertyType}
                              </span>

                              {/* Badge Exclusivité Samsar (uniquement pour les mandats discrets) */}
                              {isDiscreetMandate && (
                                <span className="bg-amber-500 text-stone-950 font-black text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-md shadow-sm border border-amber-300 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 fill-stone-950 text-stone-950" />
                                  <span>Exclusivité Samsar</span>
                                </span>
                              )}
                            </div>

                            {/* Prix */}
                            <div className="absolute bottom-2.5 right-2.5 bg-stone-950/85 backdrop-blur-xs text-amber-300 font-black text-xs px-2.5 py-1 rounded-lg font-mono">
                              {item.priceMad.toLocaleString('fr-FR')} MAD
                            </div>
                          </div>

                          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
                                <span className="font-semibold text-stone-600">{itemCityName} • {itemDistName}</span>
                                {item.areaM2 > 0 && <span className="font-mono font-bold bg-stone-100 px-1.5 py-0.5 rounded">{item.areaM2} m²</span>}
                              </div>
                              <h4 className="font-bold text-stone-900 text-sm leading-snug group-hover:text-amber-800 transition" dir="auto">
                                {item.title}
                              </h4>
                              <p className="text-xs text-stone-500 line-clamp-2" dir="auto">
                                {item.description}
                              </p>
                            </div>

                            {/* Bouton d'action différencié selon le mode de vente */}
                            {isDiscreetMandate ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDiscreetListing(item);
                                }}
                                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                              >
                                <Lock className="w-3.5 h-3.5 text-amber-100" />
                                <span>Exclusivité Samsar • Contacter</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDirectListing(item);
                                }}
                                className="w-full bg-stone-900 hover:bg-stone-950 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-amber-400" />
                                <span>Voir la fiche détaillée</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white border border-stone-200/80 rounded-3xl p-6 text-center space-y-3 shadow-xs">
                    <h3 className="text-base font-bold text-stone-900">
                      Aucun bien trouvé pour cette recherche
                    </h3>
                    <p className="text-xs text-stone-500 max-w-md mx-auto">
                      Aucun bien publié ne correspond à ces critères dans {buySelectedDistrictObj?.name || buySelectedCityObj?.name || 'ce secteur'}. Vous pouvez élargir votre recherche ou contacter le Samsar référent.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setBuyCityId('');
                        setBuyDistrictId('');
                        setSelectedPropertyType('');
                        setMaxBudget('');
                        setKeywordSearch('');
                        setListings(getStoredListings());
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Afficher tous les biens ({listings.length})</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>



        {/* MODALE 1 : FICHE DÉTAILLÉE NORMALE (Vente Directe) */}
        {selectedDirectListing && (() => {
          const directCityObj = CITIES_DATA.find(
            c => normalizeFilterValue(c.id) === normalizeFilterValue(selectedDirectListing.city)
          );
          const directDistObj = directCityObj?.districts.find(
            d => normalizeFilterValue(d.id) === normalizeFilterValue(selectedDirectListing.district)
          );
          const directCityName = directCityObj?.name || selectedDirectListing.city || 'Maroc';
          const directDistName = directDistObj?.name || selectedDirectListing.district || 'Centre';

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
              <div className="fixed inset-0" onClick={() => setSelectedDirectListing(null)} />
              <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl max-h-[90dvh] flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="shrink-0 p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-600 text-white font-black text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-md">
                      Vente Directe
                    </span>
                    <span className="text-xs text-stone-600 font-bold uppercase tracking-wider">
                      {selectedDirectListing.propertyType}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedDirectListing(null)}
                    className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 flex items-center justify-center text-stone-700 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Content scrollable */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                  {/* Photo principale */}
                  <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden bg-stone-100 shadow-xs">
                    <ListingImage
                      src={selectedDirectListing.imageUrl}
                      alt={selectedDirectListing.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 right-3 bg-stone-950/85 backdrop-blur-xs text-amber-300 font-mono font-black text-sm px-3 py-1.5 rounded-xl shadow-md">
                      {selectedDirectListing.priceMad.toLocaleString('fr-FR')} MAD
                    </div>
                  </div>

                  {/* Titre & Localisation & Surface */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-stone-500 font-semibold">
                      <span className="flex items-center gap-1 text-amber-900 font-bold">
                        <MapPin className="w-3.5 h-3.5 text-amber-700" />
                        {directCityName} • {directDistName}
                      </span>
                      {selectedDirectListing.areaM2 > 0 && (
                        <span className="font-mono font-bold bg-stone-100 px-2 py-0.5 rounded-md text-stone-700">
                          {selectedDirectListing.areaM2} m²
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-stone-900 leading-snug" dir="auto">
                      {selectedDirectListing.title}
                    </h3>
                  </div>

                  {/* Description complète */}
                  <div className="space-y-1 bg-stone-50 rounded-2xl p-3.5 border border-stone-200/60">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Description détaillée</span>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line" dir="auto">
                      {selectedDirectListing.description}
                    </p>
                  </div>

                  {/* Caractéristiques */}
                  {selectedDirectListing.features && selectedDirectListing.features.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Caractéristiques du bien</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedDirectListing.features.map((feat, idx) => (
                          <span key={idx} className="bg-amber-50 text-amber-900 text-xs font-semibold px-2.5 py-1 rounded-xl border border-amber-200/80 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{feat}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Coordonnées Vendeur */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Contact Propriétaire</span>
                      <span className="text-sm font-black text-stone-900 block">{selectedDirectListing.sellerName}</span>
                      <span className="text-xs font-mono text-stone-600 block">{selectedDirectListing.sellerPhone}</span>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <Phone className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Footer modal */}
                <div className="shrink-0 p-4 border-t border-stone-100 bg-white grid grid-cols-2 gap-2.5">
                  <a
                    href={`tel:${selectedDirectListing.sellerPhone}`}
                    className="py-3 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition text-center"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Appeler</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      handleContactListing(selectedDirectListing);
                    }}
                    className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-white" />
                    <span>WhatsApp Direct</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* MODALE 2 : PAGE DE CONTACT DISCRÈTE (Mandat Discret Samsar) */}
        {selectedDiscreetListing && (() => {
          const discreetCityObj = CITIES_DATA.find(
            c => normalizeFilterValue(c.id) === normalizeFilterValue(selectedDiscreetListing.city)
          );
          const discreetDistObj = discreetCityObj?.districts.find(
            d => normalizeFilterValue(d.id) === normalizeFilterValue(selectedDiscreetListing.district)
          );
          const discreetCityName = discreetCityObj?.name || selectedDiscreetListing.city || 'Maroc';
          const discreetDistName = discreetDistObj?.name || selectedDiscreetListing.district || 'Centre';

          // Trouver le Samsar assigné ou le Samsar local du secteur
          const assignedSamsar = 
            (selectedDiscreetListing.assignedSamsarId && allSamsars.find(s => s.id === selectedDiscreetListing.assignedSamsarId)) ||
            allSamsars.find(s => s.city === selectedDiscreetListing.city && s.districts.includes(selectedDiscreetListing.district)) ||
            allSamsars.find(s => s.city === selectedDiscreetListing.city) ||
            primarySamsar;

          const assignedAlias = selectedDiscreetListing.assignedSamsarName || assignedSamsar.alias;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
              <div className="fixed inset-0" onClick={() => setSelectedDiscreetListing(null)} />
              <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl max-h-[90dvh] flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200">
                {/* Header discret avec badge exclusif */}
                <div className="shrink-0 p-4 border-b border-amber-100 flex items-center justify-between bg-amber-500/15">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500 text-stone-950 font-black text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-md flex items-center gap-1 shadow-2xs">
                      <Sparkles className="w-3 h-3 fill-stone-950" />
                      <span>Exclusivité Samsar</span>
                    </span>
                    <span className="text-xs text-amber-900 font-bold uppercase tracking-wider">
                      Mandat Discret
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedDiscreetListing(null)}
                    className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 flex items-center justify-center text-stone-700 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Corps de la modale */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                  {/* Message strict et explicite demandé par l'utilisateur */}
                  <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-300/80 text-center space-y-2">
                    <div className="w-11 h-11 mx-auto rounded-2xl bg-amber-500/20 text-amber-800 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-amber-700" />
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-stone-900 font-serif leading-snug">
                      Ce bien est réservé aux Samsars
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
                      Contactez un Samsar pour plus d'informations. Afin de préserver la confidentialité du propriétaire, les visites et la négociation sont déléguées exclusivement au Samsar référent du secteur.
                    </p>
                  </div>

                  {/* Aperçu sommaire sécurisé du bien (sans coordonnées privées) */}
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="font-bold text-amber-900 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-700" />
                        {discreetCityName} • {discreetDistName}
                      </span>
                      <span className="font-mono font-bold bg-stone-200/80 text-stone-800 px-2 py-0.5 rounded-md">
                        {selectedDiscreetListing.priceMad.toLocaleString('fr-FR')} MAD
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-900" dir="auto">
                      {selectedDiscreetListing.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span className="capitalize">{selectedDiscreetListing.propertyType}</span>
                      {selectedDiscreetListing.areaM2 > 0 && <span>• {selectedDiscreetListing.areaM2} m²</span>}
                      <span>• Mandat Exclusif Actif</span>
                    </div>
                  </div>

                  {/* Carte du Samsar référent en charge du dossier */}
                  <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Samsar référent détenteur des clés & du dossier
                    </span>
                    <div className="flex items-center gap-3">
                      <img
                        src={assignedSamsar.avatar}
                        alt={assignedSamsar.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500 shadow-2xs shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-black text-stone-900 truncate">
                          {assignedAlias}
                        </h5>
                        <p className="text-xs text-stone-500 truncate">{assignedSamsar.name}</p>
                        <p className="text-xs text-amber-800 font-semibold truncate mt-0.5">
                          ☕ {assignedSamsar.coffeeSpot}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer modal : Contact direct avec le Samsar */}
                <div className="shrink-0 p-4 border-t border-stone-100 bg-white grid grid-cols-2 gap-2.5">
                  <a
                    href={`tel:${assignedSamsar.phone}`}
                    className="py-3 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition text-center"
                  >
                    <Phone className="w-4 h-4 text-stone-700" />
                    <span>Appeler</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      playAudioBeep('whatsapp_sent');
                      const message = `Salam Si ${assignedSamsar.name.split(' ')[1] || assignedSamsar.name}, cheft l'bien en Exclusivité Samsar : "${selectedDiscreetListing.title}" (${selectedDiscreetListing.priceMad.toLocaleString('fr-FR')} MAD) f ${discreetDistName} (${discreetCityName}). Je souhaite obtenir plus d'informations et organiser une visite. Chokran.`;
                      const url = formatWhatsAppUrl(assignedSamsar.whatsapp, message);
                      window.open(url, '_blank');
                    }}
                    className="py-3 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer text-center"
                  >
                    <MessageSquare className="w-4 h-4 text-white" />
                    <span>Contacter le Samsar</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {renderBurgerDrawer()}
      </div>
    );
  }

  // =========================================================================
  // SCREEN 3.B : FORMULAIRE DE VENTE EN 2 ÉTAPES (Step-by-Step : 1 écran = 1 action)
  // =========================================================================
  const SELL_PROPERTY_TYPES = [
    { id: 'terrain', label: 'Terrain', labelAr: 'بقعة أرضية', icon: LandPlot },
    { id: 'appartement', label: 'Appartement', labelAr: 'شقة', icon: Building2 },
    { id: 'villa', label: 'Villa / Maison', labelAr: 'فيلا أو دار', icon: Home },
    { id: 'commercial', label: 'Commerce', labelAr: 'محل تجاري', icon: Store },
    { id: 'riad', label: 'Riad Traditionnel', labelAr: 'رياض تقليدي', icon: Sparkles }
  ];

  const selectedTypeObj = SELL_PROPERTY_TYPES.find(t => t.id === sellForm.propertyType) || null;
  const sellSelectedCityObj = CITIES_DATA.find(c => c.id === sellForm.city) || null;

  // -------------------------------------------------------------------------
  // ÉTAPE 1 : PAGE DÉDIÉE UNIQUEMENT AU CHOIX DU TYPE DE BIEN
  // Aucun type de bien n'est présélectionné par défaut (choix 100% neutre)
  // -------------------------------------------------------------------------
  if (sellStep === 'type' || !sellForm.propertyType) {
    return (
      <div className="flex flex-col h-[100dvh] overflow-hidden w-full bg-[#FAFAFA] font-sans select-none">
        {/* 1. Header fixe en haut (shrink-0) */}
        {renderInnerHeader('transact_choice')}

        {/* 2. Titre de l'étape 1 (shrink-0) */}
        <div className="shrink-0 bg-[#FAFAFA] px-4 pt-3 pb-1.5">
          <div className="max-w-md sm:max-w-xl mx-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
              Étape 1 sur 2 • Vendre un bien
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-serif tracking-tight">
              Quel type de bien vendez-vous ?
            </h2>
            <p
              className="text-xs font-semibold text-amber-800 mt-0.5"
              style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', sans-serif" }}
            >
              نوع العقار المعروض للبيع
            </p>
          </div>
        </div>

        {/* 3. Gros boutons de choix du type de bien (Aucun bouton actif par défaut) */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col justify-center">
          <div className="max-w-md sm:max-w-xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SELL_PROPERTY_TYPES.map(type => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => {
                    setSellForm({ ...sellForm, propertyType: type.id as any });
                    setSellStep('details');
                  }}
                  className="rounded-3xl p-4 sm:p-5 flex items-center justify-between text-left transition-all duration-150 active:scale-[0.98] group cursor-pointer bg-white hover:bg-stone-50 text-stone-900 border border-stone-200/90 shadow-xs hover:shadow-md"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 bg-amber-50 text-amber-700">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-black tracking-tight truncate text-stone-900">
                        {type.label}
                      </h3>
                      <p
                        className="text-xs font-semibold truncate text-stone-500"
                        style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', sans-serif" }}
                      >
                        {type.labelAr}
                      </p>
                    </div>
                  </div>

                  <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center transition bg-stone-100 text-stone-400 group-hover:bg-amber-100 group-hover:text-amber-800">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Bouton Retour en bas (shrink-0 pb-6) */}
        <div className="shrink-0 bg-white border-t border-stone-200/80 px-4 pt-3 pb-6 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          <div className="max-w-md sm:max-w-xl mx-auto">
            <button
              type="button"
              onClick={() => setCurrentScreen('transact_choice')}
              className="w-full py-3 px-5 bg-stone-100 hover:bg-stone-200 active:scale-[0.985] text-stone-800 font-bold text-sm rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-stone-700" />
              <span>Retour</span>
            </button>
          </div>
        </div>

        {renderBurgerDrawer()}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // ÉTAPE 2 : ÉCRAN DES DÉTAILS (Ergonomie iPhone : auto-scroll au focus,
  // champs compacts, Ville/Quartier vides par défaut, grand padding bas pb-56)
  // -------------------------------------------------------------------------
  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden w-full bg-[#FAFAFA] font-sans">
      {/* 1. Header fixe en haut : le bouton Retour ramène à l'Étape 1 avec choix neutre */}
      <header className="shrink-0 w-full bg-white border-b border-stone-200/80 px-4 py-2.5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setSellForm({ ...sellForm, propertyType: '' });
            setSellStep('type');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 text-xs font-bold transition shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-stone-700" />
          <span>Type de bien</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none active:opacity-80 transition"
        >
          <img
            src="https://postimg.cc/N5TKdpNv"
            alt="Logo DirectSamsar"
            className="h-10 w-auto object-contain shrink-0"
            onError={(e) => {
              const target = e.currentTarget;
              const directUrl = 'https://i.postimg.cc/wT4DTrLM/Cre-un-logo-minimaliste-et-moderne-Le-design-est-une-toile-5.jpg';
              if (target.src !== directUrl) {
                target.src = directUrl;
              } else {
                target.src = '/logo-etoile.png';
              }
            }}
          />
          <span className="font-black text-[#049A5B] text-base font-serif tracking-tight">
            Direct<span className="text-amber-600">Samsar</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Menu"
          className="w-9 h-9 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 flex items-center justify-center transition shadow-2xs cursor-pointer"
        >
          <Menu className="w-5 h-5 text-stone-800" />
        </button>
      </header>

      {/* 2. Zone de formulaire scrollable avec grand espace de respiration en bas (pb-56) pour le clavier iOS */}
      <form
        onSubmit={handleSellSubmit}
        className="flex-1 overflow-y-auto overscroll-contain scroll-smooth px-4 sm:px-6 pt-3 pb-56 sm:pb-24"
      >
        <div className="max-w-md sm:max-w-xl mx-auto space-y-3">
          {/* En-tête compact avec rappel du type choisi à l'Étape 1 */}
          <div className="flex items-center justify-between gap-2 bg-white border border-stone-200/90 rounded-2xl px-3.5 py-2.5 shadow-2xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                Étape 2 sur 2 • Détails du bien
              </span>
              {selectedTypeObj && (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-black text-stone-900">
                    {selectedTypeObj.label}
                  </span>
                  <span
                    className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg"
                    style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', sans-serif" }}
                  >
                    {selectedTypeObj.labelAr}
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setSellForm({ ...sellForm, propertyType: '' });
                setSellStep('type');
              }}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition cursor-pointer"
            >
              Changer
            </button>
          </div>

          {/* Notification de succès */}
          {sellSuccessNotice && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 space-y-2.5 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Annonce enregistrée avec succès !</span>
              </div>
              <p className="text-xs text-emerald-800">
                "{sellSuccessNotice.created.title}" a été enregistrée et apparaît désormais dans la liste des biens.
              </p>
              <button
                type="button"
                onClick={() => {
                  setListings(getStoredListings());
                  setBuyCityId(sellSuccessNotice.created.city);
                  setBuyDistrictId(sellSuccessNotice.created.district);
                  setSelectedPropertyType('');
                  setMaxBudget('');
                  setKeywordSearch('');
                  setHasSearchedBuy(true);
                  setCurrentScreen('transact_buy');
                  setTransactMode('buy');
                }}
                className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-2 rounded-xl cursor-pointer transition"
              >
                Voir mon annonce dans Acheter
              </button>
            </div>
          )}

          {/* BOUTON VOCAL (ACCESSIBILITÉ) placé au-dessus des champs de texte */}
          <button
            type="button"
            onClick={() => {
              playAudioBeep('record_start');
              if (!isRecordingVoice) {
                setIsRecordingVoice(true);
                setTimeout(() => {
                  setIsRecordingVoice(false);
                  setHasVoiceDescription(true);
                }, 2500);
              } else {
                setIsRecordingVoice(false);
                setHasVoiceDescription(true);
              }
            }}
            className={`w-full p-3 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 shadow-2xs cursor-pointer ${
              isRecordingVoice
                ? 'bg-red-50 border-red-500 text-red-900 animate-pulse'
                : hasVoiceDescription
                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                : 'bg-amber-50/80 hover:bg-amber-100/80 border-amber-300 text-stone-900'
            }`}
          >
            <div className="flex items-center gap-2.5 text-left">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                isRecordingVoice
                  ? 'bg-red-600 text-white'
                  : hasVoiceDescription
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}>
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black block">
                  {isRecordingVoice
                    ? '🎙️ Enregistrement vocal en cours...'
                    : hasVoiceDescription
                    ? '✅ Description vocale enregistrée'
                    : '🎙️ Enregistrer une description vocale (Optionnel)'}
                </span>
                <span
                  className="text-xs font-bold text-amber-900 block"
                  style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', sans-serif" }}
                >
                  تكلم بالعربية أو الفرنسية
                </span>
              </div>
            </div>
          </button>

          {/* TITRE DE L'ANNONCE */}
          <div className="space-y-1">
            <label className="flex items-baseline justify-between px-1">
              <span className="text-xs font-black text-stone-900">Titre de l'annonce</span>
              <span
                className="text-xs font-semibold text-amber-800"
                style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', sans-serif" }}
              >
                عنوان الإعلان
              </span>
            </label>
            <input
              type="text"
              dir="auto"
              required
              placeholder="Ex: Terrain titré 3 façades / بقعة أرضية محفظة..."
              value={sellForm.title}
              onFocus={scrollInputIntoView}
              onChange={(e) => setSellForm({ ...sellForm, title: e.target.value })}
              className="scroll-mt-24 w-full bg-white border border-stone-200/90 focus:border-amber-600 focus:ring-2 focus:ring-amber-600/15 rounded-xl px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 shadow-2xs outline-none transition"
              style={{ fontFamily: "'Plus Jakarta Sans', 'Tajawal', 'Noto Sans Arabic', sans-serif" }}
            />
          </div>

          {/* LOCALISATION (VILLE & QUARTIER) — Vides par défaut avec placeholders */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="flex items-baseline justify-between px-1">
                <span className="text-[11px] font-black text-stone-900 uppercase tracking-wider">Ville</span>
                <span
                  className="text-[11px] font-semibold text-amber-800"
                  style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', sans-serif" }}
                >
                  المدينة
                </span>
              </label>
              <select
                required
                value={sellForm.city}
                onFocus={scrollInputIntoView}
                onChange={(e) => {
                  setSellForm({
                    ...sellForm,
                    city: e.target.value,
                    district: ''
                  });
                }}
                className={`scroll-mt-24 w-full bg-white border border-stone-200/90 focus:border-amber-600 focus:ring-2 focus:ring-amber-600/15 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold shadow-2xs outline-none transition ${
                  sellForm.city ? 'text-stone-900' : 'text-stone-400'
                }`}
              >
                <option value="" disabled>Sélectionnez une ville</option>
                {CITIES_DATA.map(c => (
                  <option key={c.id} value={c.id} className="text-stone-900">{c.name} ({c.nameAr})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="flex items-baseline justify-between px-1">
                <span className="text-[11px] font-black text-stone-900 uppercase tracking-wider">Quartier</span>
                <span
                  className="text-[11px] font-semibold text-amber-800"
                  style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', sans-serif" }}
                >
                  الحي
                </span>
              </label>
              <select
                required
                disabled={!sellForm.city}
                value={sellForm.district}
                onFocus={scrollInputIntoView}
                onChange={(e) => setSellForm({ ...sellForm, district: e.target.value })}
                className={`scroll-mt-24 w-full bg-white border border-stone-200/90 focus:border-amber-600 focus:ring-2 focus:ring-amber-600/15 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold shadow-2xs outline-none transition disabled:opacity-60 ${
                  sellForm.district ? 'text-stone-900' : 'text-stone-400'
                }`}
              >
                <option value="" disabled>
                  {sellForm.city ? 'Sélectionnez un quartier' : "Choisissez d'abord une ville"}
                </option>
                {sellSelectedCityObj?.districts.map(d => (
                  <option key={d.id} value={d.id} className="text-stone-900">{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* PRIX & SURFACE */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="flex items-baseline justify-between px-1">
                <span className="text-[11px] font-black text-stone-900 uppercase tracking-wider">Prix (MAD)</span>
                <span
                  className="text-[11px] font-semibold text-amber-800"
                  style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', sans-serif" }}
                >
                  الثمن
                </span>
              </label>
              <input
                type="number"
                required
                placeholder="Ex: 390 000"
                value={sellForm.priceMad}
                onFocus={scrollInputIntoView}
                onChange={(e) => setSellForm({ ...sellForm, priceMad: e.target.value })}
                className="scroll-mt-24 w-full bg-white border border-stone-200/90 focus:border-amber-600 focus:ring-2 focus:ring-amber-600/15 rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-stone-900 placeholder:text-stone-400 shadow-2xs outline-none transition"
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-baseline justify-between px-1">
                <span className="text-[11px] font-black text-stone-900 uppercase tracking-wider">Surface (m²)</span>
                <span
                  className="text-[11px] font-semibold text-amber-800"
                  style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', sans-serif" }}
                >
                  المساحة
                </span>
              </label>
              <input
                type="number"
                placeholder="Ex: 420"
                value={sellForm.areaM2}
                onFocus={scrollInputIntoView}
                onChange={(e) => setSellForm({ ...sellForm, areaM2: e.target.value })}
                className="scroll-mt-24 w-full bg-white border border-stone-200/90 focus:border-amber-600 focus:ring-2 focus:ring-amber-600/15 rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-stone-900 placeholder:text-stone-400 shadow-2xs outline-none transition"
              />
            </div>
          </div>

          {/* DESCRIPTION & CARACTÉRISTIQUES (Support RTL dir="auto", vide par défaut) */}
          <div className="space-y-1">
            <label className="flex items-baseline justify-between px-1">
              <span className="text-xs font-black text-stone-900">Description & Caractéristiques</span>
              <span
                className="text-xs font-semibold text-amber-800"
                style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', sans-serif" }}
              >
                تفاصيل العقار
              </span>
            </label>
            <textarea
              rows={2}
              dir="auto"
              placeholder="Ex: 3 façades dégagées, Titré, Voie 16m / محفظ، 3 واجهات..."
              value={sellForm.featuresText}
              onFocus={scrollInputIntoView}
              onChange={(e) => setSellForm({ ...sellForm, featuresText: e.target.value })}
              className="scroll-mt-24 w-full bg-white border border-stone-200/90 focus:border-amber-600 focus:ring-2 focus:ring-amber-600/15 rounded-xl px-3.5 py-2 text-sm text-stone-900 placeholder:text-stone-400 shadow-2xs outline-none transition"
              style={{ fontFamily: "'Plus Jakarta Sans', 'Tajawal', 'Noto Sans Arabic', sans-serif" }}
            />
          </div>

          {/* MODE DE DIFFUSION */}
          <div className="space-y-1.5">
            <label className="flex items-baseline justify-between px-1">
              <span className="text-xs font-black text-stone-900">Mode de diffusion</span>
              <span
                className="text-xs font-semibold text-amber-800"
                style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', sans-serif" }}
              >
                طريقة النشر
              </span>
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              <div
                onClick={() => setSellForm({ ...sellForm, saleMode: 'direct' })}
                className={`p-3 rounded-xl cursor-pointer transition-all shadow-2xs ${
                  sellForm.saleMode === 'direct'
                    ? 'border-2 border-amber-600 bg-amber-50/60 text-stone-900'
                    : 'border border-stone-200/80 bg-white hover:bg-stone-50/60 text-stone-700'
                }`}
              >
                <span className="font-black text-xs sm:text-sm block">Vente Directe</span>
                <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                  Visible publiquement et par les Samsars.
                </p>
              </div>

              <div
                onClick={() => setSellForm({ ...sellForm, saleMode: 'samsar_exclusive' })}
                className={`p-3 rounded-xl cursor-pointer transition-all shadow-2xs ${
                  sellForm.saleMode === 'samsar_exclusive'
                    ? 'border-2 border-amber-600 bg-amber-50/60 text-stone-900'
                    : 'border border-stone-200/80 bg-white hover:bg-stone-50/60 text-stone-700'
                }`}
              >
                <span className="font-black text-xs sm:text-sm block">Mandat Discret Samsar</span>
                <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                  Numéro confidentiel confié au Samsar.
                </p>
              </div>
            </div>
          </div>

          {/* AJOUT DE PHOTOS DU BIEN (OPTIONNEL) + AVERTISSEMENT MANDAT DISCRET */}
          <div className="space-y-1.5">
            <label className="w-full p-3 rounded-2xl bg-white hover:bg-stone-50 border border-dashed border-stone-300 hover:border-amber-600 transition flex items-center justify-between gap-3 cursor-pointer shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-stone-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black text-stone-900 block">
                    📷 Ajouter des photos du bien (Optionnel)
                  </span>
                  <span
                    className="text-[11px] font-semibold text-stone-500 block"
                    style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', sans-serif" }}
                  >
                    إضافة صور العقار (اختياري) {uploadedPhotos.length > 0 ? `• ${uploadedPhotos.length} photo(s)` : ''}
                  </span>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 0) {
                    files.forEach(file => {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          setUploadedPhotos(prev => [...prev, event.target!.result as string]);
                        }
                      };
                      reader.readAsDataURL(file);
                    });
                  }
                }}
              />
            </label>

            {sellForm.saleMode === 'samsar_exclusive' && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-[11px] font-semibold">
                <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Vos photos ne seront visibles que par le Samsar, pas publiquement.</span>
              </div>
            )}
          </div>

          {/* VOS COORDONNÉES */}
          <div className="space-y-1.5">
            <h3 className="text-xs sm:text-sm font-black text-stone-900 tracking-tight px-1">
              Vos coordonnées • <span style={{ fontFamily: "'Tajawal', 'Noto Sans Arabic', sans-serif" }}>معلومات الاتصال</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block px-1">Votre Nom (الاسم)</span>
                <input
                  type="text"
                  dir="auto"
                  required
                  placeholder="Ex: Si Abdelaziz"
                  value={sellForm.sellerName}
                  onFocus={scrollInputIntoView}
                  onChange={(e) => setSellForm({ ...sellForm, sellerName: e.target.value })}
                  className="scroll-mt-24 w-full bg-white border border-stone-200/90 focus:border-amber-600 focus:ring-2 focus:ring-amber-600/15 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 shadow-2xs outline-none transition"
                  style={{ fontFamily: "'Plus Jakarta Sans', 'Tajawal', 'Noto Sans Arabic', sans-serif" }}
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block px-1">WhatsApp (الهاتف)</span>
                <input
                  type="tel"
                  required
                  placeholder="06 61 23 45 67"
                  value={sellForm.sellerPhone}
                  onFocus={scrollInputIntoView}
                  onChange={(e) => setSellForm({ ...sellForm, sellerPhone: e.target.value })}
                  className="scroll-mt-24 w-full bg-white border border-stone-200/90 focus:border-amber-600 focus:ring-2 focus:ring-amber-600/15 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-mono font-bold text-stone-900 placeholder:text-stone-400 shadow-2xs outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* BOUTON PUBLIER TOUT EN BAS DU FORMULAIRE (En fin de scroll, non fixé, pour ne pas gêner le clavier iPhone) */}
          <div className="pt-3 pb-6">
            <button
              type="submit"
              className="w-full py-3.5 px-5 bg-amber-600 hover:bg-amber-700 active:scale-[0.985] text-white font-bold text-sm sm:text-base rounded-2xl shadow-md shadow-amber-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 text-white" />
              <span>Publier l'annonce • نشر الإعلان</span>
            </button>
          </div>
        </div>
      </form>

      {renderBurgerDrawer()}
    </div>
  );
};
