import React, { useState, useEffect } from 'react';
import { 
  APIProvider, 
  Map as GoogleMap, 
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  InfoWindow 
} from '@vis.gl/react-google-maps';
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

const CITY_VIEWS: Record<string, { center: { lat: number; lng: number }; zoom: number; label: string; labelAr: string }> = {
  morocco: { center: { lat: 32.0, lng: -6.0 }, zoom: 6, label: 'Tout le Maroc', labelAr: 'المغرب كامل' },
  casablanca: { center: { lat: 33.5731, lng: -7.5898 }, zoom: 12, label: 'Casablanca', labelAr: 'الدار البيضاء' },
  rabat: { center: { lat: 33.9981, lng: -6.8488 }, zoom: 13, label: 'Rabat', labelAr: 'الرباط' },
  marrakech: { center: { lat: 31.6342, lng: -8.0122 }, zoom: 13, label: 'Marrakech', labelAr: 'مراكش' }
};

interface SamsarGoogleMapProps {
  language?: 'fr' | 'ar';
  onBack?: () => void;
  onSwitchToList?: () => void;
}

export const SamsarGoogleMap: React.FC<SamsarGoogleMapProps> = ({ 
  language = 'fr',
  onBack,
  onSwitchToList
}) => {
  const isAr = language === 'ar';
  const apiKey = (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyCP4nVZwtEyxb1RxipK4LOlvTCHy1qc4TM";

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
    <div className="w-full h-full flex-1 relative flex flex-col overflow-hidden bg-stone-100">
      {/* 2. RENDRE LA BARRE DE FILTRES SCROLLABLE HORIZONTALEMENT */}
      <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-10 flex items-center justify-between gap-2 bg-white/95 backdrop-blur-md shadow-xl border border-stone-200/90 rounded-2xl p-1 pointer-events-auto">
        <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-none flex-1 min-w-0 items-center">
          {Object.entries(CITY_VIEWS).map(([key, view]) => {
            const isSelected = activeCityKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveCityKey(key);
                  setSelectedPin(null);
                  setCenter(view.center);
                  setZoom(view.zoom);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#006233] text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200/80'
                }`}
              >
                <span>{key === 'morocco' ? '🇲🇦' : '📍'}</span>
                <span>{isAr ? view.labelAr : view.label}</span>
              </button>
            );
          })}
        </div>

        {onSwitchToList && (
          <button
            type="button"
            onClick={onSwitchToList}
            className="px-3 py-1.5 mr-1.5 rounded-xl bg-[#006233] hover:bg-emerald-800 text-white text-xs font-bold transition active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
            title={isAr ? 'عرض القائمة' : 'Voir la liste'}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'عرض القائمة' : 'Liste'}</span>
          </button>
        )}
      </div>

      {/* 3. DISCRÉTISER LE BOUTON PLAN/SATELLITE : petite icône flottante (🗺️) en bas à droite au-dessus du zoom */}
      <button
        type="button"
        onClick={() => setMapType(prev => prev === 'roadmap' ? 'satellite' : 'roadmap')}
        className="absolute bottom-20 right-4 z-10 bg-white hover:bg-stone-50 rounded-full p-2 shadow-lg border border-stone-200/80 text-stone-800 transition active:scale-90 cursor-pointer flex items-center justify-center pointer-events-auto"
        title={mapType === 'roadmap' ? (isAr ? 'التبديل إلى القمر الصناعي' : 'Passer en vue Satellite') : (isAr ? 'التبديل إلى الخريطة' : 'Passer en vue Plan')}
        aria-label="Basculer Plan / Satellite"
      >
        <span className="text-xl leading-none select-none" role="img" aria-label="Carte">
          🗺️
        </span>
      </button>

      {/* 1. FORCER LA HAUTEUR PLEIN ÉCRAN DE LA CARTE : occupe 100% de l'espace restant sous le header */}
      <div className="w-full h-full flex-1 relative">
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
            {MOCK_SAMSARS_PINS.map((pin) => {
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
