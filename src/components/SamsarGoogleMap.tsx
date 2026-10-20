import React, { useState, useEffect } from 'react';
import { 
  APIProvider, 
  Map as GoogleMap, 
  Marker, 
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
  ExternalLink
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
}

export const SamsarGoogleMap: React.FC<SamsarGoogleMapProps> = ({ language = 'fr' }) => {
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
    <div className="w-full flex-1 flex flex-col bg-white rounded-3xl border border-stone-200/90 shadow-md overflow-hidden">
      {/* Barre de contrôle supérieure (Vue Rapide & Type de Carte) */}
      <div className="p-3 bg-stone-900 text-white flex flex-wrap items-center justify-between gap-2.5 z-10">
        {/* Sélecteurs de vue de ville */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 mr-1 shrink-0">
            <Compass className="w-3.5 h-3.5 animate-pulse" />
            <span>{isAr ? 'المدن :' : 'Vue :'}</span>
          </div>
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
                className={`px-3 py-1 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1 ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700'
                }`}
              >
                <span>{key === 'morocco' ? '🇲🇦' : '📍'}</span>
                <span>{isAr ? view.labelAr : view.label}</span>
              </button>
            );
          })}
        </div>

        {/* Boutons Plan / Satellite */}
        <div className="bg-stone-800 p-0.5 rounded-xl border border-stone-700 flex text-[11px] font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setMapType('roadmap')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              mapType === 'roadmap' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            {isAr ? 'خريطة' : 'Plan'}
          </button>
          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              mapType === 'satellite' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-300 hover:text-white'
            }`}
          >
            {isAr ? 'قمر صناعي' : 'Satellite'}
          </button>
        </div>
      </div>

      {/* Conteneur de la Carte Google Maps : prend toute la largeur et la hauteur */}
      <div className="relative w-full h-[58vh] sm:h-[64vh] min-h-[460px] bg-stone-100">
        <APIProvider apiKey={apiKey}>
          <GoogleMap
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

            {/* Marqueurs (Pins) de nos Samsars */}
            {MOCK_SAMSARS_PINS.map((pin) => {
              const isSelected = selectedPin?.id === pin.id;
              return (
                <Marker
                  key={pin.id}
                  position={{ lat: pin.lat, lng: pin.lng }}
                  title={`${pin.name} - ${pin.quarter}, ${pin.city}`}
                  onClick={() => setSelectedPin(pin)}
                  icon={{
                    url: isSelected
                      ? 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="%23b45309" stroke="%23ffffff" stroke-width="3.5"/><circle cx="28" cy="28" r="16" fill="%23ffffff"/><text x="28" y="34" font-size="14" font-family="sans-serif" font-weight="900" fill="%23b45309" text-anchor="middle">S</text></svg>'
                      : 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="%23006233" stroke="%23ffffff" stroke-width="3"/><text x="24" y="31" font-size="16" font-family="sans-serif" font-weight="bold" fill="%23ffffff" text-anchor="middle">👤</text></svg>'
                  }}
                />
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

        {/* Infobulle guide flottante en haut à gauche */}
        <div className="absolute top-3 left-3 bg-stone-900/90 backdrop-blur-xs text-white border border-stone-700/80 rounded-2xl px-3 py-2 shadow-lg text-[11px] max-w-xs pointer-events-auto flex items-center gap-2">
          <span className="text-base">📍</span>
          <div>
            <span className="font-bold text-amber-300 block">
              {isAr ? 'انقر على أي نقطة على الخريطة :' : 'Touchez un marqueur vert :'}
            </span>
            <span className="text-[10px] text-stone-300">
              {isAr 
                ? 'لإظهار بيانات السمسار، رقمه والتواصل معه مباشرة'
                : 'Pour afficher sa fiche et le contacter directement par WhatsApp ou appel'}
            </span>
          </div>
        </div>
      </div>

      {/* Barre de statut inférieure */}
      <div className="p-3 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-800">
            {isAr ? 'السماسرة المتاحون على الخريطة :' : 'Samsars géolocalisés :'}
          </span>
          <span className="font-bold text-emerald-800">
            {MOCK_SAMSARS_PINS.length} {isAr ? 'سماسرة معتمدون' : 'agents référents'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-stone-400">
          <span>Google Maps Platform</span>
          <span>•</span>
          <span>Maroc</span>
        </div>
      </div>
    </div>
  );
};
