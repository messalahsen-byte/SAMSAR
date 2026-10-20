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
  ArrowRight, 
  Filter, 
  Send, 
  Lock, 
  Eye, 
  SlidersHorizontal,
  BellRing,
  HelpCircle,
  Tag,
  Share2
} from 'lucide-react';
import { formatWhatsAppUrl, playAudioBeep, speakDarijaNatural } from '../utils/audioDarija';
import { recordConnection } from '../utils/connectionsTracker';
import { 
  normalizeSearchText, 
  buildListingSearchableText, 
  matchesSearchQuery 
} from '../utils/searchUtils';

const PROPERTY_TYPE_CONFIG = [
  { id: 'all', name: 'Tous les biens', icon: Building2 },
  { id: 'appartement', name: 'Appartement', icon: Building2 },
  { id: 'villa', name: 'Villa & Maison', icon: Home },
  { id: 'terrain', name: 'Terrain', icon: LandPlot },
  { id: 'commercial', name: 'Commerce & Local', icon: Store },
  { id: 'riad', name: 'Riad traditionnel', icon: Sparkles },
];

interface GoogleHomeSearchProps {
  onOpenBroadcast: (city?: string, district?: string) => void;
  onNavigateToTab: (tab: any) => void;
}

export const GoogleHomeSearch: React.FC<GoogleHomeSearchProps> = ({ 
  onOpenBroadcast,
  onNavigateToTab 
}) => {
  // Main mode: 'buy' (Acheter) vs 'sell' (Vendre)
  const [mainMode, setMainMode] = useState<'buy' | 'sell'>('buy');

  // Search Filters (Buy mode)
  const [selectedCityId, setSelectedCityId] = useState<string>('marrakech');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('chwiter');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [maxBudget, setMaxBudget] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(true);

  // Audio preview state
  const [activeVoicePlayingId, setActiveVoicePlayingId] = useState<string | null>(null);

  // Listings store
  const [listings, setListings] = useState<PropertyListing[]>(() => getStoredListings());

  // Form state for Sell mode (Déposer une annonce)
  const [sellForm, setSellForm] = useState({
    title: '',
    propertyType: 'terrain' as 'appartement' | 'villa' | 'terrain' | 'commercial' | 'riad',
    city: 'marrakech',
    district: 'chwiter',
    priceMad: '',
    areaM2: '',
    description: '',
    featuresText: '3 façades dégagées, Titré, Voie principale 16m',
    saleMode: 'samsar_exclusive' as 'direct' | 'samsar_exclusive',
    sellerName: '',
    sellerPhone: '',
  });

  const [sellSuccessNotice, setSellSuccessNotice] = useState<{
    created: PropertyListing;
    notifiedSamsars: Samsar[];
  } | null>(null);

  // All Samsars list
  const allSamsars = useMemo(() => {
    return [...getCustomSamsars(), ...INITIAL_DEMO_SAMSARS];
  }, []);

  // Current selected city & district metadata
  const currentCity = useMemo(() => {
    return CITIES_DATA.find(c => c.id === selectedCityId) || CITIES_DATA[1]; // default marrakech
  }, [selectedCityId]);

  const currentDistrict = useMemo(() => {
    return currentCity.districts.find(d => d.id === selectedDistrictId) || currentCity.districts[0];
  }, [currentCity, selectedDistrictId]);

  // District Samsar referent (for fallback when no direct offers or discreet mandate)
  const districtSamsars = useMemo(() => {
    return allSamsars.filter(s => s.city === selectedCityId && s.districts.includes(selectedDistrictId));
  }, [allSamsars, selectedCityId, selectedDistrictId]);

  const primarySamsar = districtSamsars[0] || allSamsars.find(s => s.city === selectedCityId) || allSamsars[0];

  // Filter listings based on buy search criteria
  const filteredListings = useMemo(() => {
    const cleanQuery = searchQuery.trim();
    return listings.filter(item => {
      if (selectedCityId && item.city !== selectedCityId) return false;
      if (selectedDistrictId && selectedDistrictId !== 'all' && item.district !== selectedDistrictId) return false;
      if (selectedType !== 'all' && item.propertyType !== selectedType) return false;
      if (maxBudget && !isNaN(Number(maxBudget)) && item.priceMad > Number(maxBudget)) return false;
      if (cleanQuery) {
        const searchableText = buildListingSearchableText(item);
        if (!matchesSearchQuery(searchableText, cleanQuery)) return false;
      }
      return true;
    });
  }, [listings, selectedCityId, selectedDistrictId, selectedType, maxBudget, searchQuery]);

  // Update district when city changes in buy mode
  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    const city = CITIES_DATA.find(c => c.id === cityId);
    if (city && city.districts[0]) {
      setSelectedDistrictId(city.districts[0].id);
    }
  };

  // Connect to Samsar via WhatsApp
  const handleConnectSamsar = (samsar: Samsar, contextReason?: string) => {
    playAudioBeep('whatsapp_sent');
    recordConnection({
      samsarId: samsar.id,
      samsarAlias: samsar.alias,
      city: currentCity.name,
      district: currentDistrict?.name || 'Maroc',
      propertyType: selectedType !== 'all' ? selectedType : 'Immobilier'
    });

    const reason = contextReason || `Kan9elleb 3la ${selectedType !== 'all' ? selectedType : '3iqar'} f quartier ${currentDistrict?.name || currentCity.name}`;
    const message = `Salam Si ${samsar.name.split(' ')[1] || samsar.name}, cheft Daleel Samsar. ${reason}. Mal9itch 3ard mzyan f site, wach 3ndek chi 7aja ta7t yeddek ? Chokran.`;
    const url = formatWhatsAppUrl(samsar.whatsapp, message);
    window.open(url, '_blank');
  };

  // Connect for specific listing
  const handleContactForListing = (listing: PropertyListing) => {
    playAudioBeep('whatsapp_sent');
    const message = `Salam, cheft l'annonce f Daleel Samsar : "${listing.title}" (${listing.priceMad.toLocaleString('fr-FR')} MAD) f ${listing.district}. Wach l'bien ba9i disponibe l'ziyara ? Chokran.`;
    const url = formatWhatsAppUrl(listing.sellerPhone, message);
    window.open(url, '_blank');
  };

  // Play Samsar voice
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

  // Submit new listing
  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellForm.title || !sellForm.priceMad || !sellForm.sellerPhone) {
      alert('Veuillez renseigner au minimum le titre, le prix et votre téléphone WhatsApp.');
      return;
    }

    const relevantSamsars = allSamsars.filter(
      s => s.city === sellForm.city && s.districts.includes(sellForm.district)
    );

    const assigned = relevantSamsars[0] || allSamsars.find(s => s.city === sellForm.city) || allSamsars[0];

    const newListing = saveListing({
      title: sellForm.title,
      propertyType: sellForm.propertyType,
      city: sellForm.city,
      district: sellForm.district,
      priceMad: Number(sellForm.priceMad) || 0,
      areaM2: Number(sellForm.areaM2) || 0,
      description: sellForm.description || `${sellForm.title} situé à ${sellForm.district}.`,
      features: sellForm.featuresText.split(',').map(f => f.trim()).filter(Boolean),
      imageUrl: sellForm.propertyType === 'terrain'
        ? 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80'
        : sellForm.propertyType === 'villa'
        ? 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
      saleMode: sellForm.saleMode,
      assignedSamsarId: assigned.id,
      assignedSamsarName: assigned.alias,
      sellerName: sellForm.sellerName || 'Propriétaire',
      sellerPhone: sellForm.sellerPhone,
    });

    setListings(getStoredListings());
    setSellSuccessNotice({
      created: newListing,
      notifiedSamsars: relevantSamsars.length > 0 ? relevantSamsars : [assigned]
    });

    // Reset form
    setSellForm({
      title: '',
      propertyType: 'terrain',
      city: 'marrakech',
      district: 'chwiter',
      priceMad: '',
      areaM2: '',
      description: '',
      featuresText: '3 façades dégagées, Titré, Voie 16m',
      saleMode: 'samsar_exclusive',
      sellerName: '',
      sellerPhone: '',
    });
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Google-like Hero & Brand Container */}
      <section className="text-center pt-4 sm:pt-10 max-w-3xl mx-auto px-4">
        {/* Main Logo & Title */}
        <div className="inline-flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white flex items-center justify-center font-bold text-2xl shadow-md">
            د
          </div>
          <div className="text-left">
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight font-serif flex items-center gap-2">
              Daleel Samsar
              <span className="text-sm font-arabic font-normal text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                دليل السمسار
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Le moteur de recherche immobilier simple & direct au Maroc
            </p>
          </div>
        </div>

        <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto mt-2 leading-relaxed">
          Trouvez un bien sur place ou déposez votre annonce. Et si l'offre idéale n'existe pas en ligne, 
          les Samsars de quartier prennent le relais immédiatement.
        </p>

        {/* Mode Selector: Acheter vs Vendre */}
        <div className="mt-6 inline-flex p-1.5 bg-stone-100 rounded-2xl border border-stone-200 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setMainMode('buy');
              setSellSuccessNotice(null);
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              mainMode === 'buy'
                ? 'bg-white text-stone-950 shadow-sm border border-stone-200/80 scale-102'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Search className="w-4 h-4 text-amber-700" />
            <span>Acheter un bien</span>
            <span className="text-[11px] font-normal text-stone-400 hidden sm:inline">(Chercher les offres)</span>
          </button>

          <button
            type="button"
            onClick={() => setMainMode('sell')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              mainMode === 'sell'
                ? 'bg-amber-700 text-white shadow-sm scale-102'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-amber-200" />
            <span>Vendre un bien</span>
            <span className="text-[11px] font-normal text-amber-100 hidden sm:inline">(Déposer annonce)</span>
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* MODE 1: ACHETER (GOOGLE SEARCH & SAMSAR FALLBACK) */}
      {/* ========================================================= */}
      {mainMode === 'buy' && (
        <div className="space-y-8 max-w-5xl mx-auto">
          {/* Google-like Search Card */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-lg shadow-stone-200/40 p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Ville */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  1. Ville
                </label>
                <select
                  value={selectedCityId}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
                >
                  {CITIES_DATA.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.nameAr})</option>
                  ))}
                </select>
              </div>

              {/* Quartier */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-700" />
                  2. Quartier / Zone
                </label>
                <select
                  value={selectedDistrictId}
                  onChange={(e) => setSelectedDistrictId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
                >
                  <option value="all">Tous les quartiers</option>
                  {currentCity.districts.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Type de bien */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-700" />
                  3. Type de bien
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
                >
                  {PROPERTY_TYPE_CONFIG.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Budget Max */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-700" />
                  4. Budget max (MAD)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 500 000"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
                />
              </div>
            </div>

            {/* Quick Keyword / Google Search Input */}
            <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher par mot-clé (ex: 3 façades, Chouiter, vue Koutoubia, Bir Anzarane, terrasse...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-50/80 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/20"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setHasSearched(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition active:scale-95 shadow-sm"
                >
                  <Search className="w-3.5 h-3.5 text-amber-400" />
                  <span>Rechercher</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCityId('marrakech');
                    setSelectedDistrictId('chwiter');
                    setSelectedType('terrain');
                    setSearchQuery('3 façades');
                    setHasSearched(true);
                  }}
                  title="Voir le terrain d'angle à Chouiter (Cas réel)"
                  className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3 py-2.5 rounded-xl text-xs font-semibold transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden md:inline">Cas Chouiter</span>
                  <span className="md:hidden">Chouiter</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search Results Summary Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-serif flex items-center gap-2">
                <span>Offres disponibles sur place</span>
                <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  {filteredListings.length} {filteredListings.length > 1 ? 'résultats' : 'résultat'}
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                {currentCity.name} {selectedDistrictId !== 'all' ? `• Quartier ${currentDistrict?.name}` : ''}
              </p>
            </div>

            {/* Direct Samsar Relay Button */}
            <button
              onClick={() => handleConnectSamsar(primarySamsar, `Kan9elleb f ${currentDistrict?.name || currentCity.name}`)}
              className="flex items-center gap-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl shadow-xs transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contacter le Samsar local ({primarySamsar.alias})</span>
            </button>
          </div>

          {/* ========================================================= */}
          {/* CASE A: LISTINGS ARE FOUND */}
          {/* ========================================================= */}
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredListings.map(listing => (
                <div 
                  key={listing.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group"
                >
                  {/* Image & Badges */}
                  <div className="relative h-44 bg-stone-100 overflow-hidden">
                    <img 
                      src={listing.imageUrl} 
                      alt={listing.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                      <span className="bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                        {listing.propertyType}
                      </span>
                      {listing.saleMode === 'samsar_exclusive' ? (
                        <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                          <ShieldCheck className="w-3 h-3" />
                          Mandat Discret Samsar
                        </span>
                      ) : (
                        <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                          <Eye className="w-3 h-3" />
                          Direct sur place
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 bg-stone-950/85 backdrop-blur-md text-amber-300 font-extrabold text-sm px-2.5 py-1 rounded-lg font-mono">
                      {listing.priceMad.toLocaleString('fr-FR')} MAD
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-stone-500">
                        <span className="flex items-center gap-1 font-semibold text-stone-700">
                          <MapPin className="w-3 h-3 text-amber-700" />
                          {listing.city === 'marrakech' ? 'Marrakech' : 'Casablanca'} • {listing.district}
                        </span>
                        <span className="font-mono">{listing.areaM2} m²</span>
                      </div>

                      <h3 className="font-bold text-stone-900 text-sm leading-snug group-hover:text-amber-800 transition">
                        {listing.title}
                      </h3>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {listing.description}
                      </p>

                      {/* Feature pills */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {listing.features.slice(0, 3).map((f, idx) => (
                          <span 
                            key={idx}
                            className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200/60 font-medium"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer & Action */}
                    <div className="pt-3 border-t border-stone-100 space-y-2">
                      {listing.saleMode === 'samsar_exclusive' ? (
                        <div className="flex items-center justify-between text-[11px] text-stone-500 bg-amber-50/70 p-2 rounded-xl border border-amber-200/60">
                          <div>
                            <span className="font-semibold text-amber-950 block">Géré par {listing.assignedSamsarName || 'Samsar local'}</span>
                            <span className="text-[10px] text-amber-800/80">Filtrage acheteurs sérieux • Clés disponibles</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleContactForListing(listing)}
                            className="bg-amber-700 hover:bg-amber-800 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Visiter</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-[11px] text-stone-500">
                          <div>
                            <span className="text-stone-700 font-semibold">{listing.sellerName}</span>
                            <span className="text-[10px] text-stone-400 block">Notifié à {listing.notifiedSamsarsCount} Samsars locaux</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleContactForListing(listing)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Contacter</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ========================================================= */
            /* CASE B: NO OFFERS ON THE SPOT -> IMMEDIATE SAMSAR RELAY */
            /* ========================================================= */
            <div className="bg-amber-50/80 border-2 border-dashed border-amber-300 rounded-3xl p-6 sm:p-8 text-center space-y-5">
              <div className="w-14 h-14 bg-amber-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <HelpCircle className="w-7 h-7" />
              </div>
              <div className="max-w-xl mx-auto space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-amber-950 font-serif">
                  Aucune offre adéquate publiée sur place pour cette recherche
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Au Maroc, <strong>80% des meilleures affaires immobilières</strong> (terrains titrés, maisons d'angle, bonnes affaires) 
                  ne sont jamais affichées publiquement sur internet. Elles sont sous le coude du Samsar du quartier.
                </p>
              </div>

              {/* Samsar Highlight Box */}
              <div className="max-w-md mx-auto bg-white rounded-2xl p-4 border border-amber-200 shadow-xs flex items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3">
                  <img 
                    src={primarySamsar.avatar} 
                    alt={primarySamsar.name} 
                    className="w-12 h-12 rounded-xl object-cover border border-amber-200"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">{primarySamsar.alias}</span>
                    <span className="text-[11px] text-stone-500 block">
                      Expert {currentDistrict?.name || currentCity.name} • {primarySamsar.reputationBadge}
                    </span>
                    <span className="text-[10px] text-amber-700 flex items-center gap-1 font-medium mt-0.5">
                      <Coffee className="w-2.5 h-2.5" /> {primarySamsar.coffeeSpot}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePlayVoice(primarySamsar)}
                    className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                    title="Écouter le Samsar en Darija"
                  >
                    {activeVoicePlayingId === primarySamsar.id ? (
                      <VolumeX className="w-4 h-4 text-amber-900 animate-pulse" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConnectSamsar(primarySamsar, `Recherche infructueuse sur le site pour ${selectedType} f ${currentDistrict?.name}`)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Activer sur WhatsApp</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onOpenBroadcast(selectedCityId, selectedDistrictId)}
                  className="bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Lancer une alerte Flash aux {districtSamsars.length || 3} Samsars du quartier</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedType('all');
                    setSelectedDistrictId('all');
                    setMaxBudget('');
                    setSearchQuery('');
                  }}
                  className="text-xs text-stone-600 hover:text-stone-900 font-semibold underline underline-offset-4"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          )}

          {/* Always Visible Safety Net Banner */}
          {filteredListings.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 via-stone-50 to-amber-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                    Vous cherchez un bien spécifique ou hors-marché dans ce quartier ?
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Les Samsars de {currentDistrict?.name || currentCity.name} reçoivent quotidiennement de nouveaux propriétaires. 
                    Décrivez votre besoin en 30 secondes.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenBroadcast(selectedCityId, selectedDistrictId)}
                className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl whitespace-nowrap transition shadow-xs flex items-center gap-2 shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>Diffuser ma demande aux Samsars</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 2: VENDRE UN BIEN (DÉPÔT & DOUBLE CANAL SAMSAR) */}
      {/* ========================================================= */}
      {mainMode === 'sell' && (
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header of Sell Flow */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-stone-900 font-serif">
              Déposez votre bien & Choisissez votre stratégie de vente
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
              Deux options adaptées à votre situation : vendez en direct aux acheteurs ou déléguez à un Samsar vérifié 
              pour éviter les curieux et le harcèlement d'appels.
            </p>
          </div>

          {/* Sell Form */}
          <form onSubmit={handleSellSubmit} className="bg-white rounded-3xl border border-stone-200/90 shadow-lg p-6 sm:p-8 space-y-6">
            
            {/* Step 1: Property Basics */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px]">1</span>
                Détails de votre bien
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Type de bien</label>
                  <select
                    value={sellForm.propertyType}
                    onChange={(e) => setSellForm({ ...sellForm, propertyType: e.target.value as any })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
                  >
                    <option value="terrain">Terrain (titré ou constructible)</option>
                    <option value="appartement">Appartement</option>
                    <option value="villa">Villa / Maison</option>
                    <option value="commercial">Local Commercial / Magasin</option>
                    <option value="riad">Riad Médina</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Titre de l'annonce</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Terrain d'angle 3 façades à Chouiter, Marrakech"
                    value={sellForm.title}
                    onChange={(e) => setSellForm({ ...sellForm, title: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
                  />
                </div>
              </div>

              {/* Ville et Quartier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Ville</label>
                  <select
                    value={sellForm.city}
                    onChange={(e) => {
                      const cId = e.target.value;
                      const c = CITIES_DATA.find(x => x.id === cId);
                      setSellForm({ 
                        ...sellForm, 
                        city: cId, 
                        district: c?.districts[0]?.id || 'centre' 
                      });
                    }}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
                  >
                    {CITIES_DATA.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Quartier / Zone</label>
                  <select
                    value={sellForm.district}
                    onChange={(e) => setSellForm({ ...sellForm, district: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
                  >
                    {(CITIES_DATA.find(c => c.id === sellForm.city) || CITIES_DATA[1]).districts.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prix & Surface */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Prix souhaité (en Dirhams MAD)</label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 380 000"
                    value={sellForm.priceMad}
                    onChange={(e) => setSellForm({ ...sellForm, priceMad: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Surface (en m²)</label>
                  <input
                    type="number"
                    placeholder="Ex: 420"
                    value={sellForm.areaM2}
                    onChange={(e) => setSellForm({ ...sellForm, areaM2: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
                  />
                </div>
              </div>

              {/* Points forts */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Caractéristiques clés & atouts (séparés par des virgules)
                </label>
                <input
                  type="text"
                  placeholder="Ex: 3 façades ouvertes, Voie 16m, Titré, Eau et Électricité proches"
                  value={sellForm.featuresText}
                  onChange={(e) => setSellForm({ ...sellForm, featuresText: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description libre</label>
                <textarea
                  rows={3}
                  placeholder="Décrivez l'historique, le voisinage, la disponibilité pour les visites..."
                  value={sellForm.description}
                  onChange={(e) => setSellForm({ ...sellForm, description: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
                />
              </div>
            </div>

            {/* ========================================================= */}
            {/* Step 2: Strategic Choice (Les 2 Possibilités de vente demandées) */}
            {/* ========================================================= */}
            <div className="pt-4 border-t border-stone-200 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px]">2</span>
                Comment souhaitez-vous vendre ? (Choisissez votre modalité)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option 1: Direct Sur Place */}
                <div
                  onClick={() => setSellForm({ ...sellForm, saleMode: 'direct' })}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition relative flex flex-col justify-between ${
                    sellForm.saleMode === 'direct'
                      ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-emerald-600" />
                        1. Sur place (Direct Acheteurs)
                      </span>
                      <input
                        type="radio"
                        checked={sellForm.saleMode === 'direct'}
                        onChange={() => setSellForm({ ...sellForm, saleMode: 'direct' })}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Votre annonce est publiée directement sur la vitrine publique du site. 
                      Les acheteurs voient votre offre et vous contactent en direct.
                    </p>
                    <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200/70 text-[10px] text-emerald-900 space-y-1">
                      <span className="font-bold block flex items-center gap-1">
                        <BellRing className="w-3 h-3 text-emerald-700" />
                        Bonus Réseau Daleel Samsar :
                      </span>
                      <span>
                        Votre annonce est <strong>automatiquement transmise</strong> aux Samsars agréés de votre quartier pour activer leurs acheteurs qualifiés.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Option 2: Mise en relation Samsar Exclusive */}
                <div
                  onClick={() => setSellForm({ ...sellForm, saleMode: 'samsar_exclusive' })}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition relative flex flex-col justify-between ${
                    sellForm.saleMode === 'samsar_exclusive'
                      ? 'border-amber-700 bg-amber-50/50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-700" />
                        2. Mise en relation discrète Samsar
                      </span>
                      <input
                        type="radio"
                        checked={sellForm.saleMode === 'samsar_exclusive'}
                        onChange={() => setSellForm({ ...sellForm, saleMode: 'samsar_exclusive' })}
                        className="text-amber-700 focus:ring-amber-500"
                      />
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      <strong>Recommandé pour MRE & propriétaires occupés :</strong> Aucun numéro public affiché sur internet. 
                      Zéro harcèlement d'appels sauvages.
                    </p>
                    <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 text-[10px] text-amber-950 space-y-1">
                      <span className="font-bold block flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-800" />
                        Mandat Sérénité & Filtre :
                      </span>
                      <span>
                        Le bien est confié exclusivement au Samsar référent noté de la zone (ex: Ba Houssine à Chouiter) qui filtre les curieux, 
                        fait visiter et négocie au vrai prix.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Contact Details */}
            <div className="pt-4 border-t border-stone-200 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px]">3</span>
                Vos coordonnées
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Votre Nom / Prénom</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Si Abdelaziz M."
                    value={sellForm.sellerName}
                    onChange={(e) => setSellForm({ ...sellForm, sellerName: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Numéro WhatsApp / Téléphone
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: +212 661 XX XX XX (ou +33 pour MRE)"
                    value={sellForm.sellerPhone}
                    onChange={(e) => setSellForm({ ...sellForm, sellerPhone: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-stone-950 hover:bg-stone-900 text-white font-bold py-3 px-6 rounded-2xl text-xs sm:text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>
                  {sellForm.saleMode === 'direct' 
                    ? 'Publier mon annonce sur place & Alerter les Samsars' 
                    : 'Confier mon bien en Mandat Discret au Samsar de quartier'}
                </span>
              </button>
            </div>
          </form>

          {/* Success Banner if listing just created */}
          {sellSuccessNotice && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-3xl p-6 space-y-4 animate-in fade-in">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-emerald-950">
                    Annonce enregistrée avec succès !
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Votre bien <strong>"{sellSuccessNotice.created.title}"</strong> est pris en charge.
                  </p>
                </div>
              </div>

              {/* Samsar notification alert proof */}
              <div className="bg-white rounded-2xl p-4 border border-emerald-200 space-y-2">
                <span className="text-[11px] font-bold text-stone-800 flex items-center gap-1.5 uppercase tracking-wider">
                  <BellRing className="w-3.5 h-3.5 text-amber-700" />
                  Samsars notifiés dans la zone ({sellSuccessNotice.created.district}) :
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {sellSuccessNotice.notifiedSamsars.map(s => (
                    <div key={s.id} className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl text-xs">
                      <img src={s.avatar} alt={s.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="font-semibold text-stone-800">{s.alias}</span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded-md">Notifié ✓</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-stone-500 pt-1">
                  {sellSuccessNotice.created.saleMode === 'samsar_exclusive'
                    ? 'Votre numéro reste secret. Le Samsar prendra contact directement via WhatsApp pour valider les conditions.'
                    : 'Votre annonce est désormais visible dans le moteur de recherche pour tous les acheteurs.'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMainMode('buy');
                    setSelectedCityId(sellSuccessNotice.created.city);
                    setSelectedDistrictId(sellSuccessNotice.created.district);
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Voir mon annonce dans la recherche</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
