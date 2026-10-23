import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  APIProvider, 
  Map as GoogleMap, 
  useMap,
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
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

declare const google: any;

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

/**
 * Composant OverlayView personnalisé pour Google Maps
 * Permet d'afficher des pastilles HTML (photos de profil rondes) sans nécessiter de Map ID
 */
interface MapOverlayProps {
  position: { lat: number; lng: number };
  children: React.ReactNode;
  onClick?: () => void;
  zIndex?: number;
}

const MapOverlay: React.FC<MapOverlayProps> = ({
  position,
  children,
  onClick,
  zIndex = 10
}) => {
  const map = useMap();
  const [container] = useState(() => {
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.transform = 'translate(-50%, -50%)';
    return el;
  });

  useEffect(() => {
    container.style.zIndex = String(zIndex);
  }, [zIndex, container]);

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps || !google.maps.OverlayView) return;

    class Overlay extends google.maps.OverlayView {
      onAdd() {
        const panes = this.getPanes();
        panes?.overlayMouseTarget.appendChild(container);
      }

      draw() {
        const projection = this.getProjection();
        if (!projection) return;
        const point = projection.fromLatLngToDivPixel(
          new google.maps.LatLng(position.lat, position.lng)
        );
        if (point) {
          container.style.left = `${point.x}px`;
          container.style.top = `${point.y}px`;
        }
      }

      onRemove() {
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      }
    }

    const overlay = new Overlay();
    overlay.setMap(map);

    return () => {
      overlay.setMap(null);
    };
  }, [map, position.lat, position.lng, container]);

  return createPortal(
    <div onClick={onClick} className="cursor-pointer">
      {children}
    </div>,
    container
  );
};

/**
 * Contrôleur Google Maps pour la gestion dynamique :
 * 1. Visibilité des légendes via styles (sans mapId)
 * 2. Basculement natif roadmap / terrain / satellite / hybrid
 * 3. Désactivation des contrôles caméra / rotation natifs pour éviter toute superposition
 */
interface MapControllerProps {
  mapType: 'plan' | 'satellite';
  showRelief: boolean;
  showLegends: boolean;
}

const MapController: React.FC<MapControllerProps> = ({
  mapType,
  showRelief,
  showLegends
}) => {
  const map = useMap();

  // 1. Appliquer dynamiquement la visibilité des légendes via styles et désactiver les contrôles natifs
  useEffect(() => {
    if (!map || typeof google === 'undefined') return;
    const styles: any[] = [
      {
        featureType: 'all',
        elementType: 'labels',
        stylers: [{ visibility: showLegends ? 'on' : 'off' }]
      }
    ];
    map.setOptions({ 
      styles,
      cameraControl: false,
      rotateControl: false,
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: typeof google !== 'undefined' && google?.maps?.ControlPosition?.RIGHT_TOP
          ? google.maps.ControlPosition.RIGHT_TOP
          : 7
      },
      tilt: 0
    });
  }, [map, showLegends]);

  // 2. Basculer le type de carte natif Google
  useEffect(() => {
    if (!map || typeof google === 'undefined') return;
    let targetType = 'roadmap';
    if (mapType === 'satellite') {
      targetType = showLegends ? 'hybrid' : 'satellite';
    } else {
      targetType = showRelief ? 'terrain' : 'roadmap';
    }
    map.setMapTypeId(targetType);
  }, [map, mapType, showRelief, showLegends]);

  return null;
};

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
  // Trois états distincts et totalement indépendants (zéro effet de bord)
  const [mapType, setMapType] = useState<'plan' | 'satellite'>('plan');
  const [showRelief, setShowRelief] = useState<boolean>(false);
  const [showLegends, setShowLegends] = useState<boolean>(true);

  // Défilement horizontal fluide et drag-to-scroll sur PC pour la barre des villes
  const cityScrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // de 0 à 1
  const [thumbRatio, setThumbRatio] = useState(0.25); // ratio visible
  const isMouseDownRef = useRef(false);
  const isTrackDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollStartRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const checkScroll = () => {
    const el = cityScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      setScrollProgress(0);
      setThumbRatio(1);
      return;
    }

    const ratio = Math.max(0.15, Math.min(1, clientWidth / scrollWidth));
    setThumbRatio(ratio);

    if (isAr) {
      const absScroll = Math.abs(scrollLeft);
      setCanScrollRight(absScroll > 5);
      setCanScrollLeft(absScroll < maxScroll - 5);
      setScrollProgress(Math.min(1, Math.max(0, absScroll / maxScroll)));
    } else {
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < maxScroll - 5);
      setScrollProgress(Math.min(1, Math.max(0, scrollLeft / maxScroll)));
    }
  };

  useEffect(() => {
    checkScroll();
    const el = cityScrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [cityViews, isAr]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = cityScrollRef.current;
    if (!el) return;
    const delta = direction === 'left' ? -250 : 250;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  // Glissement sur la petite barre défilante (slider / scrollbar personnalisée)
  const scrollFromTrackEvent = (clientX: number) => {
    const track = trackRef.current;
    const container = cityScrollRef.current;
    if (!track || !container) return;

    const rect = track.getBoundingClientRect();
    const trackWidth = rect.width;
    if (trackWidth <= 0) return;

    const clickX = clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / trackWidth));
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (isAr) {
      container.scrollLeft = -(ratio * maxScroll);
    } else {
      container.scrollLeft = ratio * maxScroll;
    }
  };

  const handleTrackMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isTrackDraggingRef.current = true;
    scrollFromTrackEvent(e.clientX);

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isTrackDraggingRef.current) return;
      scrollFromTrackEvent(moveEvent.clientX);
    };

    const onMouseUp = () => {
      isTrackDraggingRef.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleTrackTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    isTrackDraggingRef.current = true;
    scrollFromTrackEvent(e.touches[0].clientX);

    const onTouchMove = (moveEvent: TouchEvent) => {
      if (!isTrackDraggingRef.current || moveEvent.touches.length !== 1) return;
      scrollFromTrackEvent(moveEvent.touches[0].clientX);
    };

    const onTouchEnd = () => {
      isTrackDraggingRef.current = false;
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const el = cityScrollRef.current;
    if (!el) return;
    isMouseDownRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollStartRef.current = el.scrollLeft;
    hasDraggedRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDownRef.current) return;
    const el = cityScrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = x - startXRef.current;
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
      if (!isDragging) setIsDragging(true);
      el.scrollLeft = scrollStartRef.current - walk;
    }
  };

  const handleMouseUp = () => {
    if (!isMouseDownRef.current) return;
    isMouseDownRef.current = false;
    setIsDragging(false);
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 80);
  };

  const handleMouseLeave = () => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      setIsDragging(false);
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 80);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0 && e.deltaX === 0) {
      const el = cityScrollRef.current;
      if (!el) return;
      el.scrollLeft += e.deltaY;
    }
  };

  // Fonctions de bascule strictement isolées
  const handleToggleMapType = () => {
    setMapType(prev => (prev === 'plan' ? 'satellite' : 'plan'));
  };

  const handleToggleRelief = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowRelief(e.target.checked);
  };

  const handleToggleLegends = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowLegends(e.target.checked);
  };

  // Type de carte actif dérivé dynamiquement selon mapType et les options
  const activeMapTypeId = mapType === 'satellite'
    ? (showLegends ? 'hybrid' : 'satellite')
    : (showRelief ? 'terrain' : 'roadmap');

  // Styles pour masquer les légendes en mode Plan si l'option Légendes est désactivée
  const mapStyles = (!showLegends && mapType === 'plan')
    ? [
        {
          featureType: 'all',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    : undefined;

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
            <div className="flex flex-col flex-1 min-w-0">
              <div className="relative flex-1 min-w-0 flex items-center">
                {/* Bouton fléché gauche (Desktop uniquement, masqué tout au début) */}
                {canScrollLeft && (
                  <button
                    type="button"
                    onClick={() => handleScroll('left')}
                    className="hidden md:flex absolute start-0.5 z-20 items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border border-stone-200/90 hover:bg-stone-50 text-stone-700 transition cursor-pointer active:scale-90"
                    title={isAr ? 'السابق' : 'Défiler vers la gauche'}
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}

                {/* Conteneur défilable et glissable (Drag-to-scroll & molette sur PC, swipe tactile sur mobile) */}
                <div
                  ref={cityScrollRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  onWheel={handleWheel}
                  className={`overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2 px-3 py-1.5 flex-1 min-w-0 select-none ${
                    isDragging ? 'cursor-grabbing' : 'md:cursor-grab'
                  }`}
                >
                  {cityViews.map((city) => {
                    const isSelected = activeCityKey === city.id;
                    return (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => {
                          if (hasDraggedRef.current) return;
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

                {/* Bouton fléché droite (Desktop uniquement, masqué tout au bout) */}
                {canScrollRight && (
                  <button
                    type="button"
                    onClick={() => handleScroll('right')}
                    className="hidden md:flex absolute end-0.5 z-20 items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border border-stone-200/90 hover:bg-stone-50 text-stone-700 transition cursor-pointer active:scale-90"
                    title={isAr ? 'التالي' : 'Défiler vers la droite'}
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Petite barre défilante interactive à glisser pour parcourir toutes les villes */}
              {thumbRatio < 0.99 && (
                <div className="flex items-center justify-center pt-1 pb-0.5">
                  <div
                    ref={trackRef}
                    onMouseDown={handleTrackMouseDown}
                    onTouchStart={handleTrackTouchStart}
                    className="w-48 sm:w-72 max-w-[85%] h-1.5 sm:h-2 bg-stone-300/80 hover:bg-stone-300 rounded-full cursor-pointer relative overflow-hidden select-none transition-all group"
                    title={isAr ? 'اسحب للتنقل بين جميع المدن' : 'Glissez cette petite barre pour voir toutes les villes'}
                  >
                    <div
                      style={{
                        width: `${thumbRatio * 100}%`,
                        left: `${scrollProgress * (100 - thumbRatio * 100)}%`
                      }}
                      className="absolute top-0 bottom-0 bg-[#006233] group-hover:bg-emerald-700 rounded-full cursor-grab active:cursor-grabbing shadow-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {onSwitchToList && (
              <button
                type="button"
                onClick={onSwitchToList}
                className="px-3 py-1.5 mr-1 rounded-xl bg-[#006233] hover:bg-emerald-800 text-white text-xs font-bold transition active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0 self-center"
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
        {/* Panneau de configuration & couches de la carte en haut à gauche */}
        <div 
          className="absolute top-3 sm:top-4 start-3 sm:start-4 z-10 bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl shadow-lg p-1.5 sm:px-3 sm:py-2 flex items-center gap-2 sm:gap-3 text-xs font-semibold text-stone-800 pointer-events-auto transition hover:bg-white"
          title={isAr ? 'خيارات وطبقات الخريطة' : 'Configuration et couches de la carte'}
        >
          {/* Bouton bascule Plan / Satellite (Caméra) */}
          <button
            type="button"
            onClick={handleToggleMapType}
            className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs ${
              mapType === 'satellite' 
                ? 'bg-stone-900 text-white' 
                : 'bg-[#006233] text-white'
            }`}
            title={mapType === 'plan' ? (isAr ? 'التبديل إلى القمر الصناعي' : 'Passer en vue Satellite') : (isAr ? 'التبديل إلى الخريطة' : 'Passer en vue Plan')}
            aria-label="Basculer Plan / Satellite"
          >
            <span className="text-base leading-none select-none">
              {mapType === 'satellite' ? '🛰️' : '🗺️'}
            </span>
            <span className="text-[11px] font-bold">
              {mapType === 'satellite' ? (isAr ? 'قمر صناعي' : 'Satellite') : (isAr ? 'خريطة' : 'Plan')}
            </span>
          </button>

          {/* Option Relief : affichée uniquement en vue Plan */}
          {mapType === 'plan' && (
            <>
              <span className="text-stone-300 select-none">|</span>
              <label className="flex items-center gap-1.5 cursor-pointer select-none px-0.5">
                <input
                  type="checkbox"
                  checked={showRelief}
                  onChange={handleToggleRelief}
                  className="w-4 h-4 rounded text-[#006233] focus:ring-[#006233] border-stone-300 accent-[#006233] cursor-pointer"
                />
                <span className={showRelief ? 'text-[#006233] font-bold' : 'text-stone-700'}>
                  {isAr ? 'تضاريس' : 'Relief'}
                </span>
              </label>
            </>
          )}

          <span className="text-stone-300 select-none">|</span>

          {/* Option Légendes */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none px-0.5">
            <input
              type="checkbox"
              checked={showLegends}
              onChange={handleToggleLegends}
              className="w-4 h-4 rounded text-[#006233] focus:ring-[#006233] border-stone-300 accent-[#006233] cursor-pointer"
            />
            <span className={showLegends ? 'text-[#006233] font-bold' : 'text-stone-700'}>
              {isAr ? 'تسميات' : 'Légendes'}
            </span>
          </label>
        </div>

        {/* Contrôles de zoom (+ et -) rabaissés tout en bas à droite (bottom-6) sans superposition */}
        <div className="absolute bottom-6 end-4 z-10 flex flex-col bg-white rounded-2xl shadow-lg border border-stone-200/90 overflow-hidden pointer-events-auto">
          <button
            type="button"
            onClick={() => setZoom(prev => Math.min(prev + 1, 20))}
            className="w-10 h-10 hover:bg-stone-50 text-stone-700 transition border-b border-stone-200/80 flex items-center justify-center cursor-pointer active:scale-90"
            title={isAr ? 'تكبير' : 'Zoom avant (+)'}
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(prev => Math.max(prev - 1, 3))}
            className="w-10 h-10 hover:bg-stone-50 text-stone-700 transition flex items-center justify-center cursor-pointer active:scale-90"
            title={isAr ? 'تصغير' : 'Zoom arrière (-)'}
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

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
            mapTypeId={activeMapTypeId}
            styles={mapStyles}
            mapTypeControl={false}
            zoomControl={false}
            streetViewControl={false}
            cameraControl={false}
            rotateControl={false}
            fullscreenControl={true}
            fullscreenControlOptions={{
              position: typeof google !== 'undefined' && google?.maps?.ControlPosition?.RIGHT_TOP
                ? google.maps.ControlPosition.RIGHT_TOP
                : 7
            }}
            gestureHandling="greedy"
            disableDefaultUI={false}
            style={{ width: '100%', height: '100%' }}
          >
            {/* Contrôleur dynamique des styles et calques de relief/légendes */}
            <MapController 
              mapType={mapType} 
              showRelief={showRelief} 
              showLegends={showLegends} 
            />

            {/* Marqueurs (Pins) de nos Samsars avec photo de profil directe */}
            {ALL_SAMSARS_PINS.map((pin) => {
              const isSelected = selectedPin?.id === pin.id;
              return (
                <MapOverlay
                  key={pin.id}
                  position={{ lat: pin.lat, lng: pin.lng }}
                  onClick={() => setSelectedPin(pin)}
                >
                  <div 
                    title={`${pin.name} - ${pin.quarter}, ${pin.city}`}
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
                </MapOverlay>
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
        <div className="absolute bottom-4 start-4 z-10 pointer-events-none hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-lg text-[11px] text-stone-700 font-semibold">
          <span className="text-[#006233] font-bold">👤 {ALL_SAMSARS_PINS.length} {isAr ? 'سماسرة معتمدون' : 'Samsars'}</span>
          <span className="text-stone-300">•</span>
          <span>{isAr ? 'انقر على أي نقطة للتواصل عبر واتساب أو الهاتف' : 'Touchez un marqueur vert pour contacter directement par WhatsApp ou Appel'}</span>
        </div>
      </div>
    </div>
  );
};
