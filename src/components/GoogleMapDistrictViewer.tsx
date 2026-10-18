import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  APIProvider, 
  Map, 
  Marker, 
  InfoWindow, 
  useMap 
} from '@vis.gl/react-google-maps';
import { 
  Samsar, 
  CITIES_DATA, 
  CityData, 
  DistrictData 
} from '../data/samsars';
import { PropertyListing } from '../data/listings';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  Volume2, 
  Coffee, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Home, 
  CheckCircle2,
  ExternalLink,
  Navigation,
  ArrowLeft,
  Compass,
  Star,
  Users
} from 'lucide-react';

interface GoogleMapDistrictViewerProps {
  selectedCityId: string;
  selectedDistrictId: string;
  onSelectCity: (cityId: string) => void;
  onSelectDistrict: (districtId: string) => void;
  samsars: Samsar[];
  listings?: PropertyListing[];
  onConnectSamsar: (samsar: Samsar, contextReason?: string) => void;
  onSelectListing?: (listing: PropertyListing) => void;
  onSelectSamsarCard?: (samsar: Samsar) => void;
}

// Controller to smoothly pan & zoom map
function MapCameraController({ 
  center, 
  zoom 
}: { 
  center: { lat: number; lng: number }; 
  zoom: number; 
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    map.panTo(center);
    map.setZoom(zoom);
  }, [map, center.lat, center.lng, zoom]);

  return null;
}

// Morocco center
const MOROCCO_CENTER = { lat: 31.7917, lng: -7.0926 };
const MOROCCO_ZOOM = 6;

export function GoogleMapDistrictViewer({
  selectedCityId,
  selectedDistrictId,
  onSelectCity,
  onSelectDistrict,
  samsars,
  listings = [],
  onConnectSamsar,
  onSelectListing,
  onSelectSamsarCard
}: GoogleMapDistrictViewerProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyCP4nVZwtEyxb1RxipK4LOlvTCHy1qc4TM";

  // Map visual hierarchy: 'morocco' (all country) | 'city' (e.g. Marrakech) | 'district' (e.g. Chouiter)
  const [navLevel, setNavLevel] = useState<'morocco' | 'city' | 'district'>('district');

  // Map state
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');
  const [showProperties, setShowProperties] = useState(true);
  const [activeSamsarPopup, setActiveSamsarPopup] = useState<Samsar | null>(null);
  const [activeListingPopup, setActiveListingPopup] = useState<PropertyListing | null>(null);
  const [activeDistrictPopup, setActiveDistrictPopup] = useState<DistrictData | null>(null);
  const [activeCityPopup, setActiveCityPopup] = useState<CityData | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  // Sync internal level when props change
  useEffect(() => {
    if (selectedDistrictId && selectedDistrictId !== 'all') {
      setNavLevel('district');
    } else if (selectedCityId && selectedCityId !== 'all') {
      setNavLevel('city');
    }
  }, [selectedCityId, selectedDistrictId]);

  // Current City and District info
  const currentCity = useMemo(() => {
    return CITIES_DATA.find(c => c.id === selectedCityId) || CITIES_DATA[1]; // default Marrakech
  }, [selectedCityId]);

  const currentDistrict = useMemo(() => {
    return currentCity.districts.find(d => d.id === selectedDistrictId) || currentCity.districts[0];
  }, [currentCity, selectedDistrictId]);

  // Determine current center & zoom based on navigation level
  const { mapCenter, currentZoom } = useMemo(() => {
    if (navLevel === 'morocco') {
      return { mapCenter: MOROCCO_CENTER, currentZoom: MOROCCO_ZOOM };
    }
    if (navLevel === 'city') {
      return { 
        mapCenter: { lat: currentCity.lat, lng: currentCity.lng }, 
        currentZoom: currentCity.defaultZoom || 12 
      };
    }
    // District level
    const dist = currentCity.districts.find(d => d.id === selectedDistrictId) || currentCity.districts[0];
    if (dist && dist.lat && dist.lng) {
      return {
        mapCenter: { lat: dist.lat, lng: dist.lng },
        currentZoom: dist.zoom || 15
      };
    }
    return {
      mapCenter: { lat: currentCity.lat, lng: currentCity.lng },
      currentZoom: currentCity.defaultZoom || 12
    };
  }, [navLevel, currentCity, selectedDistrictId]);

  // Helper to get Samsars count per city
  const getCitySamsarsCount = (cityId: string) => {
    return samsars.filter(s => s.city === cityId).length;
  };

  // Helper to get Samsars count per district
  const getDistrictSamsarsCount = (cityId: string, districtId: string) => {
    return samsars.filter(s => s.city === cityId && s.districts.includes(districtId)).length;
  };

  // Helper to get listings in district
  const getDistrictListingsCount = (districtId: string) => {
    return listings.filter(l => l.district === districtId).length;
  };

  // Audio preview in Darija
  const playSamsarVoice = (samsar: Samsar) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(samsar.audioDarijaArabic || samsar.audioPromptDarija);
      utterance.lang = 'ar-MA';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(null);
      utterance.onerror = () => setIsPlayingAudio(null);
      setIsPlayingAudio(samsar.id);
      window.speechSynthesis.speak(utterance);
    }
  };

  // User clicks a City marker on the map
  const handleCityMarkerClick = (city: CityData) => {
    onSelectCity(city.id);
    onSelectDistrict('all');
    setNavLevel('city');
    setActiveCityPopup(null);
    setActiveDistrictPopup(null);
    setActiveSamsarPopup(null);
  };

  // User clicks a District marker on the map
  const handleDistrictMarkerClick = (district: DistrictData) => {
    onSelectDistrict(district.id);
    setNavLevel('district');
    setActiveDistrictPopup(null);
    setActiveCityPopup(null);

    // If there is a Samsar in this district, auto-open their popup
    const firstSamsar = samsars.find(s => s.city === selectedCityId && s.districts.includes(district.id));
    if (firstSamsar) {
      setActiveSamsarPopup(firstSamsar);
      if (onSelectSamsarCard) onSelectSamsarCard(firstSamsar);
    }
  };

  // Filter listings with coordinates
  const mappedListings = useMemo(() => {
    return listings.filter(l => l.lat && l.lng);
  }, [listings]);

  return (
    <div className="bg-white border-2 border-stone-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">
      {/* Map Header Toolbar with Visual Breadcrumb */}
      <div className="p-3 sm:p-4 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Navigation Visuelle sur Carte
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {navLevel === 'morocco' ? 'Vue Tout le Maroc' : navLevel === 'city' ? `Pôle ${currentCity.name}` : `Quartier ${currentDistrict?.name}`}
              </span>
            </div>

            {/* Clickable Breadcrumbs: Tout le Maroc > Ville > Quartier */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-200 mt-0.5 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setNavLevel('morocco');
                  setActiveSamsarPopup(null);
                  setActiveDistrictPopup(null);
                }}
                className={`transition hover:text-amber-400 flex items-center gap-1 ${
                  navLevel === 'morocco' ? 'text-amber-400 underline' : 'text-stone-300'
                }`}
                title="Cliquez pour dézoomer et voir tout le Maroc"
              >
                <span>🇲🇦 Tout le Maroc</span>
              </button>
              
              <span className="text-stone-500">›</span>

              <button
                type="button"
                onClick={() => {
                  setNavLevel('city');
                  onSelectDistrict('all');
                  setActiveSamsarPopup(null);
                  setActiveDistrictPopup(null);
                }}
                className={`transition hover:text-amber-400 ${
                  navLevel === 'city' ? 'text-amber-400 underline' : 'text-stone-300'
                }`}
                title="Cliquez pour revenir au niveau de la ville"
              >
                <span>📍 {currentCity.name}</span>
              </button>

              {navLevel === 'district' && currentDistrict && (
                <>
                  <span className="text-stone-500">›</span>
                  <span className="text-amber-300 font-serif">
                    🏘️ {currentDistrict.name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls: Satellite / Roadmap & Biens toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Back Button if zoomed in */}
          {navLevel !== 'morocco' && (
            <button
              type="button"
              onClick={() => {
                if (navLevel === 'district') {
                  setNavLevel('city');
                  onSelectDistrict('all');
                } else {
                  setNavLevel('morocco');
                }
                setActiveSamsarPopup(null);
                setActiveDistrictPopup(null);
              }}
              className="px-2.5 py-1 rounded-xl bg-amber-700/80 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center gap-1 border border-amber-600 transition"
              title="Dézoomer d'un niveau"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>{navLevel === 'district' ? 'Vue Ville' : 'Vue Maroc'}</span>
            </button>
          )}

          {/* Map Type Switcher */}
          <div className="bg-stone-800 p-0.5 rounded-xl border border-stone-700 flex text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setMapType('roadmap')}
              className={`px-2 py-1 rounded-lg transition ${
                mapType === 'roadmap' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
              }`}
            >
              Plan
            </button>
            <button
              type="button"
              onClick={() => setMapType('satellite')}
              className={`px-2 py-1 rounded-lg transition ${
                mapType === 'satellite' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              type="button"
              onClick={() => setMapType('hybrid')}
              className={`px-2 py-1 rounded-lg transition ${
                mapType === 'hybrid' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
              }`}
            >
              Hybride
            </button>
          </div>

          {/* Toggle Properties Pins */}
          <button
            type="button"
            onClick={() => setShowProperties(!showProperties)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1 border transition ${
              showProperties
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Home className="w-3 h-3" />
            <span>Biens ({mappedListings.length})</span>
          </button>
        </div>
      </div>

      {/* Visual Navigation Strip directly below header: Tap directly on city or district without dropdowns */}
      <div className="bg-amber-50/80 border-b border-amber-200/60 px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto text-[11px]">
        <div className="flex items-center gap-1.5 shrink-0 text-amber-900 font-bold">
          <Navigation className="w-3.5 h-3.5 text-amber-700" />
          <span>{navLevel === 'morocco' ? 'Touchez une ville sur la carte :' : `Quartiers de ${currentCity.name} :`}</span>
        </div>

        {/* If Morocco view: Show city buttons */}
        {navLevel === 'morocco' ? (
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {CITIES_DATA.map(c => {
              const count = getCitySamsarsCount(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleCityMarkerClick(c)}
                  className="px-2.5 py-1 rounded-xl bg-white border border-stone-300 hover:border-amber-600 text-stone-800 font-bold flex items-center gap-1 transition shadow-2xs shrink-0"
                >
                  <span>📍 {c.name}</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          /* If City view or District view: Show district buttons of current city */
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => {
                setNavLevel('city');
                onSelectDistrict('all');
                setActiveSamsarPopup(null);
              }}
              className={`px-2 py-1 rounded-xl border text-[11px] font-bold shrink-0 transition ${
                navLevel === 'city' && selectedDistrictId === 'all'
                  ? 'bg-amber-800 text-white border-amber-800 shadow-2xs'
                  : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
              }`}
            >
              🏙️ Tout {currentCity.name}
            </button>

            {currentCity.districts.map(d => {
              const isSelected = navLevel === 'district' && selectedDistrictId === d.id;
              const samsarCount = getDistrictSamsarsCount(currentCity.id, d.id);
              const isChouiter = d.id === 'chwiter';

              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleDistrictMarkerClick(d)}
                  className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold shrink-0 transition flex items-center gap-1 ${
                    isSelected
                      ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                      : isChouiter
                      ? 'bg-amber-100/80 text-amber-900 border-amber-300 hover:bg-amber-200'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-amber-50'
                  }`}
                >
                  <span>{d.name.split('&')[0].trim()}</span>
                  {isChouiter && <span className="text-[9px]">⭐</span>}
                  {samsarCount > 0 && (
                    <span className={`text-[9px] px-1 rounded-full ${isSelected ? 'bg-amber-900 text-amber-100' : 'bg-stone-100 text-stone-600'}`}>
                      {samsarCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Google Map Container */}
      <div className="relative w-full h-[500px] sm:h-[560px] bg-stone-100">
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={mapCenter}
            defaultZoom={currentZoom}
            center={mapCenter}
            zoom={currentZoom}
            mapTypeId={mapType}
            gestureHandling="greedy"
            disableDefaultUI={false}
            style={{ width: '100%', height: '100%' }}
          >
            {/* Smooth Camera Controller */}
            <MapCameraController center={mapCenter} zoom={currentZoom} />

            {/* LEVEL 1: City Markers (Visible when at Morocco level or zoomed out) */}
            {navLevel === 'morocco' &&
              CITIES_DATA.map(city => {
                const samsarCount = getCitySamsarsCount(city.id);
                return (
                  <Marker
                    key={`city-${city.id}`}
                    position={{ lat: city.lat, lng: city.lng }}
                    title={`Ville : ${city.name} (${samsarCount} Samsars)`}
                    onClick={() => handleCityMarkerClick(city)}
                    icon={{
                      url: `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="90" height="52" viewBox="0 0 90 52"><rect x="2" y="2" width="86" height="34" rx="10" fill="%23b45309" stroke="%23ffffff" stroke-width="2.5"/><polygon points="45,48 37,36 53,36" fill="%23b45309"/><text x="45" y="16" font-size="11" font-family="sans-serif" font-weight="900" fill="%23ffffff" text-anchor="middle">${city.name}</text><text x="45" y="28" font-size="8.5" font-family="sans-serif" font-weight="bold" fill="%23fef3c7" text-anchor="middle">${samsarCount} Samsars</text></svg>`,
                    }}
                  />
                );
              })}

            {/* LEVEL 2: District Markers for Current City (Visible when in City or District view) */}
            {navLevel !== 'morocco' &&
              currentCity.districts.map(district => {
                const isSelected = selectedDistrictId === district.id;
                const samsarCount = getDistrictSamsarsCount(currentCity.id, district.id);
                const hasListings = getDistrictListingsCount(district.id) > 0;
                const isChouiter = district.id === 'chwiter';

                return (
                  <Marker
                    key={`dist-${district.id}`}
                    position={{ lat: district.lat, lng: district.lng }}
                    title={`Quartier : ${district.name} - Touchez pour zoomer`}
                    onClick={() => handleDistrictMarkerClick(district)}
                    icon={{
                      url: isSelected
                        ? `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="110" height="56" viewBox="0 0 110 56"><rect x="2" y="2" width="106" height="38" rx="12" fill="%23b45309" stroke="%23ffffff" stroke-width="3"/><polygon points="55,54 45,40 65,40" fill="%23b45309"/><text x="55" y="18" font-size="11" font-family="sans-serif" font-weight="900" fill="%23ffffff" text-anchor="middle">${district.name.split('&')[0].trim().slice(0, 14)}</text><text x="55" y="32" font-size="9" font-family="sans-serif" font-weight="bold" fill="%23fef3c7" text-anchor="middle">🎯 Quartier Actif</text></svg>`
                        : isChouiter
                        ? `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="110" height="56" viewBox="0 0 110 56"><rect x="2" y="2" width="106" height="38" rx="12" fill="%23059669" stroke="%23ffffff" stroke-width="2.5"/><polygon points="55,54 45,40 65,40" fill="%23059669"/><text x="55" y="17" font-size="10.5" font-family="sans-serif" font-weight="900" fill="%23ffffff" text-anchor="middle">Chouiter ⭐</text><text x="55" y="31" font-size="8.5" font-family="sans-serif" font-weight="bold" fill="%23d1fae5" text-anchor="middle">Terrain 3 faces • Samsar</text></svg>`
                        : `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="90" height="46" viewBox="0 0 90 46"><rect x="2" y="2" width="86" height="30" rx="9" fill="%2344403c" stroke="%23ffffff" stroke-width="2"/><polygon points="45,44 38,32 52,32" fill="%2344403c"/><text x="45" y="15" font-size="9.5" font-family="sans-serif" font-weight="bold" fill="%23ffffff" text-anchor="middle">${district.name.split('&')[0].trim().slice(0, 12)}</text><text x="45" y="26" font-size="7.5" font-family="sans-serif" fill="%23e7e5e4" text-anchor="middle">${samsarCount} Samsar${samsarCount > 1 ? 's' : ''}</text></svg>`,
                    }}
                  />
                );
              })}

            {/* LEVEL 3: Samsar Markers (Pinpoint on their exact cafe or spot) */}
            {samsars
              .filter(s => s.lat && s.lng && (navLevel === 'morocco' || s.city === selectedCityId))
              .map(samsar => {
                const isSelected = activeSamsarPopup?.id === samsar.id;
                const isCurrentDistrictSamsar = samsar.districts.includes(selectedDistrictId);
                const isChouiter = samsar.id === 'samsar-chwiter';

                return (
                  <Marker
                    key={samsar.id}
                    position={{ lat: samsar.lat!, lng: samsar.lng! }}
                    title={`Samsar : ${samsar.name} (${samsar.alias}) - Café : ${samsar.coffeeSpot}`}
                    onClick={() => {
                      setActiveSamsarPopup(samsar);
                      setActiveListingPopup(null);
                      if (onSelectSamsarCard) onSelectSamsarCard(samsar);
                    }}
                    icon={{
                      url: isSelected
                        ? 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="%23b45309" stroke="%23ffffff" stroke-width="3.5"/><circle cx="28" cy="28" r="16" fill="%23ffffff"/><text x="28" y="34" font-size="14" font-family="sans-serif" font-weight="900" fill="%23b45309" text-anchor="middle">S</text></svg>'
                        : isChouiter
                        ? 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><circle cx="25" cy="25" r="23" fill="%23059669" stroke="%23ffffff" stroke-width="3"/><text x="25" y="32" font-size="16" font-family="sans-serif" font-weight="bold" fill="%23ffffff" text-anchor="middle">☕</text></svg>'
                        : isCurrentDistrictSamsar
                        ? 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="20" fill="%23d97706" stroke="%23ffffff" stroke-width="2.5"/><text x="22" y="28" font-size="15" font-family="sans-serif" font-weight="bold" fill="%23ffffff" text-anchor="middle">👤</text></svg>'
                        : 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="%2378716c" stroke="%23ffffff" stroke-width="2"/><text x="18" y="23" font-size="13" font-family="sans-serif" fill="%23ffffff" text-anchor="middle">👤</text></svg>',
                    }}
                  />
                );
              })}

            {/* LEVEL 4: Property Listings Markers */}
            {showProperties &&
              mappedListings
                .filter(l => navLevel === 'morocco' || l.city === selectedCityId)
                .map(item => {
                  const isChouiter = item.id === 'listing-chouiter-terrain';

                  return (
                    <Marker
                      key={item.id}
                      position={{ lat: item.lat!, lng: item.lng! }}
                      title={`${item.title} - ${item.priceMad.toLocaleString('fr-FR')} MAD`}
                      onClick={() => {
                        setActiveListingPopup(item);
                        setActiveSamsarPopup(null);
                      }}
                      icon={{
                        url: isChouiter
                          ? 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><polygon points="25,3 47,43 3,43" fill="%23059669" stroke="%23ffffff" stroke-width="3"/><text x="25" y="37" font-size="15" font-family="sans-serif" font-weight="bold" fill="%23ffffff" text-anchor="middle">📐</text></svg>'
                          : 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38"><rect x="4" y="4" width="30" height="30" rx="9" fill="%232563eb" stroke="%23ffffff" stroke-width="2.5"/><text x="19" y="25" font-size="15" font-family="sans-serif" font-weight="bold" fill="%23ffffff" text-anchor="middle">🏠</text></svg>',
                      }}
                    />
                  );
                })}

            {/* POPUP: Clicked Samsar Action Card */}
            {activeSamsarPopup && activeSamsarPopup.lat && activeSamsarPopup.lng && (
              <InfoWindow
                position={{ lat: activeSamsarPopup.lat, lng: activeSamsarPopup.lng }}
                onCloseClick={() => setActiveSamsarPopup(null)}
              >
                <div className="p-1 max-w-[280px] text-stone-900 font-sans">
                  {/* Samsar Header with Photo & Badge */}
                  <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200">
                    <img
                      src={activeSamsarPopup.avatar}
                      alt={activeSamsarPopup.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-amber-600 shadow-xs"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                        Samsar Local de Référence
                      </span>
                      <h4 className="text-xs font-black text-stone-900 leading-snug">
                        {activeSamsarPopup.alias}
                      </h4>
                      <p className="text-[11px] text-stone-500">{activeSamsarPopup.name}</p>
                    </div>
                  </div>

                  {/* Rating & Exp */}
                  <div className="my-2 flex items-center justify-between text-[11px] bg-stone-50 p-2 rounded-xl border border-stone-200">
                    <div>
                      <span className="text-amber-500 font-bold">★ {activeSamsarPopup.rating}</span>
                      <span className="text-stone-400 text-[10px]"> ({activeSamsarPopup.reviewsCount} avis)</span>
                    </div>
                    <span className="font-bold text-stone-700">{activeSamsarPopup.experienceYears} ans sur le terrain</span>
                  </div>

                  {/* Coffee Spot - Essential Moroccan Landmark */}
                  <div className="flex items-start gap-1.5 text-[11px] text-stone-700 bg-amber-50/70 p-2 rounded-xl border border-amber-200/60 mb-2">
                    <Coffee className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-stone-900 block">Café de repère :</span>
                      <span className="leading-tight text-stone-600">{activeSamsarPopup.coffeeSpot}</span>
                    </div>
                  </div>

                  {/* Audio Darija preview button */}
                  <div className="mb-2">
                    <button
                      type="button"
                      onClick={() => playSamsarVoice(activeSamsarPopup)}
                      className={`w-full py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition ${
                        isPlayingAudio === activeSamsarPopup.id
                          ? 'bg-amber-100 text-amber-800 border border-amber-400 animate-pulse'
                          : 'bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-200'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                      <span>{isPlayingAudio === activeSamsarPopup.id ? 'Lecture Darija en cours...' : 'Écouter vocal Darija'}</span>
                    </button>
                  </div>

                  {/* Direct WhatsApp & Call Action Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => onConnectSamsar(activeSamsarPopup, `Contact via carte quartier ${currentDistrict?.name}`)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-black flex items-center justify-center gap-1 shadow-xs transition"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </button>
                    <a
                      href={`tel:${activeSamsarPopup.phone}`}
                      className="w-full py-2 bg-stone-900 hover:bg-stone-950 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition"
                    >
                      <Phone className="w-3 h-3 text-amber-400" />
                      <span>Appeler</span>
                    </a>
                  </div>
                </div>
              </InfoWindow>
            )}

            {/* POPUP: Clicked Property Listing */}
            {activeListingPopup && activeListingPopup.lat && activeListingPopup.lng && (
              <InfoWindow
                position={{ lat: activeListingPopup.lat, lng: activeListingPopup.lng }}
                onCloseClick={() => setActiveListingPopup(null)}
              >
                <div className="p-1 max-w-[280px] text-stone-900 font-sans">
                  <div className="relative rounded-xl overflow-hidden mb-2">
                    <img
                      src={activeListingPopup.imageUrl}
                      alt={activeListingPopup.title}
                      className="w-full h-24 object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-stone-900/90 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                      {activeListingPopup.propertyType}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-stone-900 line-clamp-2 leading-snug">
                    {activeListingPopup.title}
                  </h4>

                  <div className="flex items-center justify-between my-1.5 text-xs">
                    <span className="font-black text-amber-800 text-sm">
                      {activeListingPopup.priceMad.toLocaleString('fr-FR')} MAD
                    </span>
                    <span className="text-stone-500 font-semibold">{activeListingPopup.areaM2} m²</span>
                  </div>

                  {activeListingPopup.id === 'listing-chouiter-terrain' && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-1.5 rounded-lg text-[10px] font-bold mb-2">
                      ⭐ Angle rare 3 faces (16m, 12m, 6m)
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectListing) onSelectListing(activeListingPopup);
                    }}
                    className="w-full py-1.5 bg-stone-900 hover:bg-stone-950 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5"
                  >
                    <span>Voir l'annonce complète</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>

        {/* Floating User Guide: Touch anywhere to drill down */}
        <div className="absolute top-3 left-3 bg-stone-900/90 backdrop-blur-xs text-white border border-stone-700/80 rounded-2xl px-3 py-2 shadow-lg text-[11px] max-w-xs pointer-events-auto flex items-center gap-2">
          <span className="text-base">👆</span>
          <div>
            <span className="font-bold text-amber-300 block">Navigation 100% sur carte :</span>
            <span className="text-[10px] text-stone-300">
              {navLevel === 'morocco'
                ? 'Touchez une ville pour zoomer.'
                : navLevel === 'city'
                ? 'Touchez un quartier pour afficher son Samsar.'
                : 'Touchez l’icône 👤 ou ☕ du Samsar pour le contacter.'}
            </span>
          </div>
        </div>

        {/* Legend Overlay at bottom-left */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs border border-stone-300 rounded-2xl p-2.5 shadow-md text-[11px] space-y-1.5 pointer-events-auto hidden sm:block">
          <div className="font-bold text-stone-900 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-700" />
            <span>Repères sur la carte</span>
          </div>
          <div className="flex items-center gap-2 text-stone-700">
            <span className="w-4 h-4 rounded-full bg-amber-600 border border-white flex items-center justify-center text-[9px] text-white font-black">
              S
            </span>
            <span>Samsar du quartier</span>
          </div>
          <div className="flex items-center gap-2 text-stone-700">
            <span className="w-4 h-4 rounded-full bg-emerald-600 border border-white flex items-center justify-center text-[9px] text-white font-bold">
              ☕
            </span>
            <span>Café de repère local</span>
          </div>
          <div className="flex items-center gap-2 text-stone-700">
            <span className="w-4 h-4 rounded-md bg-emerald-600 border border-white flex items-center justify-center text-[8px] text-white font-bold">
              📐
            </span>
            <span>Terrain / Parcelle en vente</span>
          </div>
        </div>
      </div>

      {/* Map Footer Bar with Location Details & Quick Reset */}
      <div className="p-3 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-900">Niveau de navigation :</span>
          <span className="font-medium text-amber-800">
            {navLevel === 'morocco'
              ? 'Vue nationale (cliquez sur une ville)'
              : navLevel === 'city'
              ? `${currentCity.name} (cliquez sur un quartier)`
              : `${currentDistrict?.name} - ${currentCity.name} (${currentDistrict?.lat.toFixed(4)}° N, ${currentDistrict?.lng.toFixed(4)}° W)`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {navLevel !== 'morocco' && (
            <button
              type="button"
              onClick={() => {
                setNavLevel('morocco');
                setActiveSamsarPopup(null);
                setActiveDistrictPopup(null);
              }}
              className="text-[11px] font-bold text-amber-800 hover:text-amber-900 underline"
            >
              🗺️ Revenir à la vue Maroc entier
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
