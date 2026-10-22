import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Samsar, 
  CITIES_DATA, 
  CityData, 
  DistrictData 
} from '../data/samsars';
import { PropertyListing } from '../data/listings';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Home, 
  ArrowLeft, 
  Compass, 
  Phone, 
  MessageSquare, 
  Coffee, 
  Volume2, 
  Maximize2 
} from 'lucide-react';

interface MoroccoInteractiveMapProps {
  selectedCityId: string;
  selectedDistrictId: string;
  selectedSamsarId: string | null;
  onSelectCity: (cityId: string) => void;
  onSelectDistrict: (districtId: string) => void;
  onSelectSamsar: (samsar: Samsar) => void;
  samsars: Samsar[];
  listings?: PropertyListing[];
  onConnectSamsar: (samsar: Samsar, contextReason?: string) => void;
}

const MOROCCO_CENTER: [number, number] = [31.7917, -7.0926];
const MOROCCO_ZOOM = 6;

export const MoroccoInteractiveMap: React.FC<MoroccoInteractiveMapProps> = ({
  selectedCityId,
  selectedDistrictId,
  selectedSamsarId,
  onSelectCity,
  onSelectDistrict,
  onSelectSamsar,
  samsars,
  listings = [],
  onConnectSamsar
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Map settings
  const [tileMode, setTileMode] = useState<'streets' | 'satellite'>('streets');
  const [navLevel, setNavLevel] = useState<'morocco' | 'city' | 'district'>('morocco');
  const [showListings, setShowListings] = useState(true);

  // Find current city & district data
  const currentCity = CITIES_DATA.find(c => c.id === selectedCityId) || CITIES_DATA[1];
  const currentDistrict = currentCity.districts.find(d => d.id === selectedDistrictId) || currentCity.districts[0];

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: MOROCCO_CENTER,
      zoom: MOROCCO_ZOOM,
      zoomControl: false,
      attributionControl: false
    });

    // Default Streets layer (OpenStreetMap)
    const initialTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    tileLayerRef.current = initialTiles;

    // Layer group for dynamic markers
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    mapInstanceRef.current = map;

    // Invalidate size to ensure map fills container properly
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Tile Mode switch (Plan vs Satellite)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    if (tileMode === 'satellite') {
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19 }
      ).addTo(map);
    } else {
      tileLayerRef.current = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 19 }
      ).addTo(map);
    }
  }, [tileMode]);

  // Handle external selection change (flying map to location)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (navLevel === 'morocco' || selectedCityId === 'all' || !selectedCityId) {
      map.flyTo(MOROCCO_CENTER, MOROCCO_ZOOM, { duration: 1.1 });
      return;
    }

    if (selectedSamsarId) {
      const activeSamsar = samsars.find(s => s.id === selectedSamsarId);
      if (activeSamsar && activeSamsar.lat && activeSamsar.lng) {
        map.flyTo([activeSamsar.lat, activeSamsar.lng], 16, { duration: 1.1 });
        return;
      }
    }

    if (navLevel === 'district' && currentDistrict && currentDistrict.lat && currentDistrict.lng) {
      map.flyTo([currentDistrict.lat, currentDistrict.lng], currentDistrict.zoom || 15, { duration: 1 });
      return;
    }

    if (navLevel === 'city' && currentCity) {
      map.flyTo([currentCity.lat, currentCity.lng], currentCity.defaultZoom || 12, { duration: 1.1 });
    }
  }, [navLevel, selectedCityId, selectedDistrictId, selectedSamsarId, currentCity, currentDistrict]);

  // Re-render markers when level, city, district, or samsars change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. NATIONAL LEVEL (Vue globale du Maroc): Render ONLY City Pins with Samsar counts
    if (navLevel === 'morocco' || selectedCityId === 'all' || !selectedCityId) {
      CITIES_DATA.forEach(city => {
        const count = samsars.filter(s => s.city === city.id).length;
        const isCurrentCity = city.id === selectedCityId;

        const cityHtml = `
          <div class="cursor-pointer transition transform hover:scale-110 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div class="px-3 py-1.5 rounded-2xl ${
              isCurrentCity 
                ? 'bg-amber-800 text-white shadow-lg ring-2 ring-amber-400' 
                : 'bg-stone-900 text-white shadow-md hover:bg-amber-700'
            } border-2 border-white flex items-center gap-1.5 whitespace-nowrap text-xs font-bold">
              <span>📍 ${city.name}</span>
              <span class="bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-full text-[10px] font-black">${count}</span>
            </div>
            <div class="w-2.5 h-2.5 bg-amber-800 transform rotate-45 -mt-1.5 border-r border-b border-white"></div>
          </div>
        `;

        const icon = L.divIcon({
          html: cityHtml,
          className: 'city-marker-icon',
          iconSize: [100, 36]
        });

        const marker = L.marker([city.lat, city.lng], { icon })
          .addTo(markersGroup)
          .on('click', () => {
            onSelectCity(city.id);
            onSelectDistrict('all');
            setNavLevel('city');
            map.flyTo([city.lat, city.lng], city.defaultZoom || 12, { duration: 1.2 });
          });

        marker.bindTooltip(`<b>${city.name} (${city.nameAr})</b><br>${count} Samsars actifs • Cliquez pour entrer`, {
          direction: 'top',
          offset: [0, -18]
        });
      });
    }

    // 2. CITY / DISTRICT LEVEL: Render District markers & Samsars & Properties ONLY when zoomed into a city
    if (navLevel !== 'morocco' && selectedCityId !== 'all' && Boolean(selectedCityId)) {
      // District markers
      currentCity.districts.forEach(district => {
        if (!district.lat || !district.lng) return;
        const isSelected = selectedDistrictId === district.id;
        const isChouiter = district.id === 'chwiter';
        const districtSamsarsCount = samsars.filter(s => s.city === currentCity.id && s.districts.includes(district.id)).length;

        const distHtml = `
          <div class="cursor-pointer transition transform hover:scale-105 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div class="px-2.5 py-1 rounded-xl ${
              isSelected 
                ? 'bg-amber-700 text-white ring-2 ring-white shadow-lg font-black' 
                : isChouiter 
                ? 'bg-emerald-700 text-white shadow-md font-bold' 
                : 'bg-stone-800/90 text-stone-100 shadow-sm'
            } border border-white text-[11px] whitespace-nowrap flex items-center gap-1">
              <span>${district.name.split('&')[0].trim()}</span>
              ${isChouiter ? '<span>⭐</span>' : ''}
              ${districtSamsarsCount > 0 ? `<span class="bg-amber-300 text-amber-950 font-black px-1.5 rounded-full text-[9px]">${districtSamsarsCount}</span>` : ''}
            </div>
          </div>
        `;

        const distIcon = L.divIcon({
          html: distHtml,
          className: 'district-marker-icon',
          iconSize: [90, 30]
        });

        L.marker([district.lat, district.lng], { icon: distIcon })
          .addTo(markersGroup)
          .on('click', () => {
            onSelectDistrict(district.id);
            setNavLevel('district');
            map.flyTo([district.lat, district.lng], district.zoom || 15, { duration: 1 });
          });
      });

      // Samsar markers (All Samsars in this city)
      samsars
        .filter(s => s.city === selectedCityId && s.lat && s.lng)
        .forEach(samsar => {
          const isSelected = selectedSamsarId === samsar.id;
          const isChouiter = samsar.id === 'samsar-chwiter';

          const samsarHtml = `
            <div class="cursor-pointer transition transform hover:scale-115 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div class="relative">
                <img 
                  src="${samsar.avatar}" 
                  class="w-11 h-11 rounded-2xl object-cover border-2 ${
                    isSelected ? 'border-amber-400 ring-4 ring-amber-500 shadow-xl' : 'border-white shadow-md'
                  }" 
                  alt="${samsar.alias}"
                />
                <span class="absolute -bottom-1 -right-1 text-xs bg-stone-900 text-white rounded-full p-0.5 border border-white">
                  ${isChouiter ? '☕' : '👤'}
                </span>
              </div>
              <div class="mt-1 px-2 py-0.5 rounded-lg bg-stone-900/95 text-white text-[10px] font-bold border border-white/60 shadow whitespace-nowrap">
                ${samsar.alias}
              </div>
            </div>
          `;

          const samsarIcon = L.divIcon({
            html: samsarHtml,
            className: 'samsar-marker-icon',
            iconSize: [60, 60]
          });

          const marker = L.marker([samsar.lat!, samsar.lng!], { icon: samsarIcon })
            .addTo(markersGroup)
            .on('click', () => {
              onSelectSamsar(samsar);
              if (samsar.districts[0]) {
                onSelectDistrict(samsar.districts[0]);
              }
              setNavLevel('district');
            });

          // Popup with photo, name, bio, call, and WhatsApp
          const popupContent = document.createElement('div');
          popupContent.className = 'p-1 text-stone-900 font-sans max-w-[260px]';
          popupContent.innerHTML = `
            <div class="flex items-center gap-2.5 pb-2 border-b border-stone-200">
              <img src="${samsar.avatar}" class="w-12 h-12 rounded-xl object-cover border-2 border-amber-600 shadow-xs" />
              <div>
                <span class="text-[9px] font-bold uppercase tracking-wider text-amber-700 block">Samsar de Référence</span>
                <h4 class="text-xs font-black text-stone-900">${samsar.alias}</h4>
                <p class="text-[10px] text-stone-500">${samsar.name} • ${samsar.experienceYears} ans</p>
              </div>
            </div>
            <div class="py-2 text-[11px] text-stone-600 leading-snug">
              <p class="font-medium text-amber-900 flex items-center gap-1">
                <span>☕ Café :</span> <span>${samsar.coffeeSpot}</span>
              </p>
              <p class="italic text-stone-500 text-[10px] mt-1">"${samsar.bioFrench}"</p>
            </div>
            <div class="flex items-center gap-1.5 pt-1">
              <a href="tel:${samsar.phone}" class="flex-1 py-1.5 bg-stone-900 text-white rounded-lg text-center text-[10px] font-bold flex items-center justify-center gap-1">
                📞 Appel
              </a>
              <a href="https://wa.me/${samsar.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" rel="noopener noreferrer" class="flex-1 py-1.5 bg-emerald-600 text-white rounded-lg text-center text-[10px] font-bold flex items-center justify-center gap-1">
                💬 WhatsApp
              </a>
            </div>
          `;

          marker.bindPopup(popupContent);
        });

      // Properties markers
      if (showListings) {
        listings
          .filter(l => l.city === selectedCityId && l.lat && l.lng)
          .forEach(listing => {
            const isChouiterTerrain = listing.id === 'listing-chouiter-terrain';

            const propHtml = `
              <div class="cursor-pointer transition transform hover:scale-110 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div class="px-2 py-1 rounded-xl ${
                  isChouiterTerrain ? 'bg-emerald-600 text-white ring-2 ring-emerald-300' : 'bg-blue-600 text-white'
                } border border-white text-[10px] font-bold shadow-md whitespace-nowrap flex items-center gap-1">
                  <span>${isChouiterTerrain ? '📐 Terrain 3 faces' : '🏠 Bien'}</span>
                  <span>${(listing.priceMad / 1000).toFixed(0)}k DH</span>
                </div>
              </div>
            `;

            const propIcon = L.divIcon({
              html: propHtml,
              className: 'prop-marker-icon',
              iconSize: [80, 26]
            });

            const marker = L.marker([listing.lat!, listing.lng!], { icon: propIcon })
              .addTo(markersGroup);

            marker.bindPopup(`
              <div class="p-1 font-sans text-xs">
                <span class="text-[9px] font-bold uppercase tracking-wider text-emerald-700 block">Opportunité</span>
                <h4 class="font-bold text-stone-900">${listing.title}</h4>
                <p class="text-amber-800 font-bold my-1">${listing.priceMad.toLocaleString('fr-FR')} MAD • ${listing.areaM2} m²</p>
                <p class="text-[10px] text-stone-600">${listing.features ? listing.features.join(' • ') : ''}</p>
              </div>
            `);
          });
      }
    }
  }, [navLevel, selectedCityId, selectedDistrictId, selectedSamsarId, samsars, listings, showListings]);

  // Sync navLevel when selectedCityId changes from the single top city bar
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedCityId === 'all') {
      setNavLevel('morocco');
      map.flyTo(MOROCCO_CENTER, MOROCCO_ZOOM, { duration: 1.1 });
      return;
    }

    setNavLevel('city');
    const city = CITIES_DATA.find(c => c.id === selectedCityId);
    if (city) {
      map.flyTo([city.lat, city.lng], city.defaultZoom || 12, { duration: 1.1 });
    }
  }, [selectedCityId]);

  const handleMoroccoView = () => {
    setNavLevel('morocco');
    onSelectCity('all');
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo(MOROCCO_CENTER, MOROCCO_ZOOM, { duration: 1.1 });
    }
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-stone-100 flex flex-col">
      {/* Carte plein écran qui prend tout l'espace disponible */}
      <div
        ref={mapContainerRef}
        className="w-full h-full flex-1 z-0"
      />

      {/* Contrôles flottants discrets sur la carte (Vue Maroc + Zoom +/-) */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col gap-2">
        {navLevel !== 'morocco' && (
          <button
            type="button"
            onClick={handleMoroccoView}
            className="px-3 py-1.5 rounded-2xl bg-white/95 backdrop-blur-xs hover:bg-white text-stone-900 text-xs font-bold flex items-center gap-1.5 border border-stone-200/90 shadow-md transition active:scale-95 cursor-pointer"
            title="Voir toute la carte du Maroc"
          >
            <span>🇲🇦</span>
            <span>Vue Maroc</span>
          </button>
        )}

        <div className="flex flex-col bg-white/95 backdrop-blur-xs rounded-2xl border border-stone-200/90 shadow-md overflow-hidden self-end">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2.5 hover:bg-stone-100 text-stone-800 transition border-b border-stone-200/70 cursor-pointer"
            title="Zoomer (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2.5 hover:bg-stone-100 text-stone-800 transition cursor-pointer"
            title="Dézoomer (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
