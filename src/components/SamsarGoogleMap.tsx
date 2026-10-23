import React, { useState, useEffect } from 'react';
import { 
  APIProvider, 
  Map as GoogleMap, 
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  InfoWindow 
} from '@vis.gl/react-google-maps';
import { CITIES_DATA, SAMSARS_DATA } from '../data/samsars';
import { PageTitle } from './PageTitle';
import { 
  Phone, 
  MessageCircle, 
  Star, 
  Check, 
  MapPin, 
  Compass, 
  Layers, 
  Navigation,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';

export interface MapSamsarPin {
  id: string;
  name: string;
  nameAr: string;
  city: string;
  quarter: string;
  cityId: string;
  lat: number;
  lng: number;
  avatar: string;
  rating: number;
  reviewCount: number;
  phone: string;
  whatsappPhone: string;
  specialty: string;
  specialtyAr: string;
}

export const MOCK_SAMSARS_PINS: MapSamsarPin[] = [
  {
    id: 'samsar-karim',
    name: 'Karim El Fassi',
    nameAr: 'كريم الفاسي',
    city: 'Casablanca',
    quarter: 'Maârif',
    cityId: 'casablanca',
    lat: 33.5883,
    lng: -7.6331,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviewCount: 48,
    phone: '+212 661 12 34 56',
    whatsappPhone: '212661123456',
    specialty: 'Appartements haut standing & locaux commerciaux',
    specialtyAr: 'شقق راقية ومحلات تجارية'
  },
  {
    id: 'samsar-youssef',
    name: 'Youssef Benzakour',
    nameAr: 'يوسف بنزاكور',
    city: 'Casablanca',
    quarter: 'Gauthier',
    cityId: 'casablanca',
    lat: 33.5912,
    lng: -7.6256,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviewCount: 42,
    phone: '+212 661 23 45 67',
    whatsappPhone: '212661234567',
    specialty: 'Studios modernes & bureaux d\'affaires',
    specialtyAr: 'استوديوهات عصرية ومكاتب أعمال'
  },
  {
    id: 'samsar-hassan',
    name: 'Hassan Berrada',
    nameAr: 'حسن برادة',
    city: 'Casablanca',
    quarter: 'Aïn Diab',
    cityId: 'casablanca',
    lat: 33.5878,
    lng: -7.6698,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviewCount: 35,
    phone: '+212 661 33 44 55',
    whatsappPhone: '212661334455',
    specialty: 'Vente résidentielle & front de mer',
    specialtyAr: 'بيع سكني وإطلالات بحرية'
  },
  {
    id: 'samsar-driss',
    name: 'Driss Benjelloun',
    nameAr: 'إدريس بنجلون',
    city: 'Rabat',
    quarter: 'Agdal',
    cityId: 'rabat',
    lat: 33.9981,
    lng: -6.8488,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviewCount: 39,
    phone: '+212 661 55 66 77',
    whatsappPhone: '212661556677',
    specialty: 'Location & Achat résidentiel haut de gamme',
    specialtyAr: 'كراء وشراء سكني راقي'
  },
  {
    id: 'samsar-mohamed',
    name: 'Si Mohamed Amrani',
    nameAr: 'سي محمد العمراني',
    city: 'Marrakech',
    quarter: 'Guéliz',
    cityId: 'marrakech',
    lat: 31.6342,
    lng: -8.0122,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviewCount: 62,
    phone: '+212 661 11 22 33',
    whatsappPhone: '212661112233',
    specialty: 'Spécialiste Riads & Maisons traditionnelles',
    specialtyAr: 'مختص رياضات ومنازل تقليدية'
  }
];

// Marqueurs Samsars combinant les mocks et toutes les données de la base
export const ALL_SAMSARS_PINS: MapSamsarPin[] = [
  ...MOCK_SAMSARS_PINS,
  ...SAMSARS_DATA.filter(s => !MOCK_SAMSARS_PINS.some(m => m.id === s.id)).map(s => {
    const cityObj = CITIES_DATA.find(c => c.id === s.city);
    return {
      id: s.id,
      name: s.name,
      nameAr: s.alias || s.name,
      city: cityObj ? cityObj.name : s.city,
      quarter: s.districts[0] || (cityObj ? cityObj.districts[0]?.name || '' : ''),
      cityId: s.city,
      lat: s.lat || (cityObj?.lat ?? 33.5731),
      lng: s.lng || (cityObj?.lng ?? -7.5898),
      avatar: s.avatar,
      rating: s.rating,
      reviewCount: s.reviewsCount,
      phone: s.phone,
      whatsappPhone: s.whatsapp.replace(/\+/g, ''),
      specialty: s.bioFrench ? (s.bioFrench.length > 55 ? s.bioFrench.slice(0, 55) + '...' : s.bioFrench) : 'Samsar Référent',
      specialtyAr: s.bioDarija ? (s.bioDarija.length > 55 ? s.bioDarija.slice(0, 55) + '...' : s.bioDarija) : 'سمسار معتمد'
    };
  })
];

export interface CityViewItem {
  id: string;
  name: string;
  nameAr: string;
  center: { lat: number; lng: number };
  zoom: number;
  icon: string;
}

// Génération dynamique de toutes les villes disponibles dans la base de données
export const GET_CITY_VIEWS = (): CityViewItem[] => [
  {
    id: 'morocco',
    name: 'Tout le Maroc',
    nameAr: 'المغرب كامل',
    center: { lat: 32.0, lng: -6.0 },
    zoom: 6,
    icon: '🇲🇦'
  },
  ...CITIES_DATA.map(c => ({
    id: c.id,
    name: c.name,
    nameAr: c.nameAr,
    center: { lat: c.lat, lng: c.lng },
    zoom: c.defaultZoom || 12,
    icon: '📍'
  }))
];

interface SamsarGoogleMapProps {
  language?: 'fr' | 'ar';
  onBack?: () => void;
  onSwitchToList?: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}

export const SamsarGoogleMap: React.FC<SamsarGoogleMapProps> = ({ 
  language = 'fr',
  onBack,
  onSwitchToList,
  title,
  subtitle
}) => {
  const isAr = language === 'ar';
  const displayTitle = title ?? (isAr ? 'خريطة السماسرة' : 'Carte des Samsars');
  const displaySubtitle = subtitle ?? (isAr ? 'حدد موقع السماسرة المعتمدين عبر الخريطة التفاعلية' : 'Localisez les professionnels certifiés autour de vous');
  const apiKey = (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyCP4nVZwtEyxb1RxipK4LOlvTCHy1qc4TM";
  const cityViews = GET_CITY_VIEWS();

  // 1. POSITION INITIALE FORCÉE : Maroc ({ lat: 32.0, lng: -6.0 }) et Zoom 6
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 32.0, lng: -6.0 });
  const [zoom, setZoom] = useState<number>(6);
  const [activeCityKey, setActiveCityKey] = useState<string>('morocco');
  const [selectedPin, setSelectedPin] = useState<MapSamsarPin | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid'>('roadmap');

  // 2. DÉSACTIVER LE RECENTRAGE AUTOMATIQUE :
  // Aucun panTo ni fitBounds automatique n'est exécuté après le chargement des marqueurs.

  // 3. FORCER LA RÉINITIALISATION AU MONTAGE :
  useEffect(() => {
    // Force le center et zoom au premier chargement uniquement
    setCenter({ lat: 32.0, lng: -6.0 });
    setZoom(6);
  }, []); // Tableau vide = s'exécute une seule fois

  return (
    <div className="w-full h-full flex-1 relative flex flex-col overflow-hidden bg-stone-50">
      {/* BLOC D'EN-TÊTE PRINCIPAL : Titre, Description, puis Barre de filtres (non-superposée au-dessus de la carte) */}
      <div className="w-full shrink-0 pt-2 sm:pt-4 px-3 sm:px-6 z-10 bg-white/80 backdrop-blur-xs border-b border-stone-200/60 shadow-2xs">
        <PageTitle 
          title={displayTitle} 
          subtitle={displaySubtitle}
          className="mb-3 sm:mb-4"
        />

        {/* Barre de filtres des villes : juste en dessous de la description et au-dessus de la carte */}
        <div className="w-full mb-4 sm:mb-6">
          <div className="flex items-center justify-between gap-2 bg-stone-100/90 backdrop-blur-md shadow-xs border border-stone-200/90 rounded-2xl p-1.5 max-w-5xl mx-auto">
            <div className="overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2 px-3 py-1.5 flex-1 min-w-0">
              {cityViews.map((city) => {
                const isSelected = activeCityKey === city.id;
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => {
                      setActiveCityKey(city.id);
                      setSelectedPin(null);
                      setCenter(city.center);
                      setZoom(city.zoom);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#006233] text-white shadow-xs'
                        : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/80'
                    }`}
                  >
                    <span>{city.icon}</span>
                    <span>{isAr ? city.nameAr : city.name}</span>
                  </button>
                );
              })}
            </div>

            {onSwitchToList && (
              <button
                type="button"
                onClick={onSwitchToList}
                className="px-3 py-1.5 mr-1 rounded-xl bg-[#006233] hover:bg-emerald-800 text-white text-xs font-bold transition active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
                title={isAr ? 'عرض القائمة' : 'Voir la liste'}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? 'عرض القائمة' : 'Liste'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CARTE INTERACTIVE : Remplissant tout l'espace disponible sous le header */}
      <div className="w-full flex-1 relative min-h-0">
        {/* Bouton Satellite discret */}
        <button
          type="button"
          onClick={() => setMapType(prev => prev === 'roadmap' ? 'satellite' : 'roadmap')}
          className="absolute bottom-6 right-4 z-10 bg-white hover:bg-stone-50 rounded-full p-2.5 shadow-lg border border-stone-200/80 text-stone-800 transition active:scale-90 cursor-pointer flex items-center justify-center pointer-events-auto"
          title={mapType === 'roadmap' ? (isAr ? 'التبديل إلى القمر الصناعي' : 'Passer en vue Satellite') : (isAr ? 'التبديل إلى الخريطة' : 'Passer en vue Plan')}
          aria-label="Basculer Plan / Satellite"
        >
          <span className="text-xl leading-none select-none" role="img" aria-label="Carte">
            🗺️
          </span>
        </button>
        <APIProvider apiKey={apiKey}>
          <GoogleMap
            mapId="DEMO_MAP_ID"
            defaultCenter={{ lat: 32.0, lng: -6.0 }}
            defaultZoom={6}
            center={center}
            zoom={zoom}
            onCameraChanged={(ev) => {
              setCenter(ev.detail.center);
              setZoom(ev.detail.zoom);
            }}
            mapTypeId={mapType}
            gestureHandling="greedy"
            disableDefaultUI={false}
            style={{ width: '100%', height: '100%' }}
          >

            {/* Marqueurs (Pins) de nos Samsars avec photo de profil directe */}
            {ALL_SAMSARS_PINS.map((pin) => {
              const isSelected = selectedPin?.id === pin.id;
              return (
                <AdvancedMarker
                  key={pin.id}
                  position={{ lat: pin.lat, lng: pin.lng }}
                  title={`${pin.name} - ${pin.quarter}, ${pin.city}`}
                  onClick={() => setSelectedPin(pin)}
                  anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
                >
                  <div 
                    className={`w-10 h-10 rounded-full border-2 ${
                      isSelected 
                        ? 'border-amber-500 ring-4 ring-amber-300 shadow-xl scale-110' 
                        : 'border-white shadow-lg hover:border-emerald-600'
                    } overflow-hidden bg-white cursor-pointer hover:scale-110 transition-transform`}
                  >
                    <img 
                      src={pin.avatar} 
                      alt={pin.name} 
                      className="w-full h-full object-cover pointer-events-none" 
                    />
                  </div>
                </AdvancedMarker>
              );
            })}

            {/* InfoWindow quand on clique sur un Samsar */}
            {selectedPin && (
              <InfoWindow
                position={{ lat: selectedPin.lat, lng: selectedPin.lng }}
                onCloseClick={() => setSelectedPin(null)}
              >
                <div 
                  className="p-1 max-w-[280px] text-stone-900 font-sans"
                  dir={isAr ? 'rtl' : 'ltr'}
                >
                  <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200">
                    <img
                      src={selectedPin.avatar}
                      alt={selectedPin.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-600 shadow-xs shrink-0"
                    />
                    <div className="text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                        {isAr ? 'سمسار معتمد' : 'Samsar Référent'}
                      </span>
                      <h4 className="text-xs font-black text-stone-900 leading-snug">
                        {isAr ? selectedPin.nameAr : selectedPin.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 font-medium flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{selectedPin.city} - {selectedPin.quarter}</span>
                      </p>
                    </div>
                  </div>

                  <div className="my-2 flex items-center justify-between text-[11px] bg-stone-50 p-2 rounded-xl border border-stone-200">
                    <div>
                      <span className="text-amber-500 font-bold">★ {selectedPin.rating}</span>
                      <span className="text-stone-400 text-[10px]"> ({selectedPin.reviewCount} avis)</span>
                    </div>
                    <span className="font-bold text-emerald-700 text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Vérifié
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-600 font-medium mb-3">
                    {isAr ? selectedPin.specialtyAr : selectedPin.specialty}
                  </p>

                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <a
                      href={`https://wa.me/${selectedPin.whatsappPhone}?text=${encodeURIComponent(
                        isAr 
                          ? `السلام عليكم، شفت الحساب ديالك على DirectSamsar وبغيت نستفسر على العقارات فـ ${selectedPin.quarter}.`
                          : `Bonjour ${selectedPin.name}, j'ai vu votre profil sur DirectSamsar et je recherche un bien à ${selectedPin.quarter}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-black flex items-center justify-center gap-1 shadow-xs transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${selectedPin.phone}`}
                      className="w-full py-2 bg-stone-900 hover:bg-stone-950 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isAr ? 'اتصال' : 'Appeler'}</span>
                    </a>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </APIProvider>

        {/* Infobulle guide flottante en bas de la carte */}
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-lg text-[11px] text-stone-700 font-semibold">
          <span className="text-[#006233] font-bold">👤 {MOCK_SAMSARS_PINS.length} {isAr ? 'سماسرة معتمدون' : 'Samsars'}</span>
          <span className="text-stone-300">•</span>
          <span>{isAr ? 'انقر على أي نقطة للتواصل عبر واتساب أو الهاتف' : 'Touchez un marqueur vert pour contacter directement par WhatsApp ou Appel'}</span>
        </div>
      </div>
    </div>
  );
};
