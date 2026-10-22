import React from 'react';
import { CITIES_DATA } from '../data/samsars';
import { Navigation, MapPin, ExternalLink } from 'lucide-react';

interface CityPoint {
  id: string;
  name: string;
  nameAr: string;
  x: number; // SVG coordinate
  y: number;
  samsarsCount: number;
}

interface MoroccoMapProps {
  selectedCityId: string;
  selectedDistrictId?: string;
  onSelectCity: (cityId: string) => void;
  onSelectDistrict?: (districtId: string) => void;
  onSwitchToGoogleMap?: () => void;
}

const CITIES_PINS: CityPoint[] = [
  { id: 'tanger', name: 'Tanger', nameAr: 'طنجة', x: 285, y: 72, samsarsCount: 4 },
  { id: 'rabat', name: 'Rabat', nameAr: 'الرباط', x: 260, y: 130, samsarsCount: 6 },
  { id: 'casablanca', name: 'Casablanca', nameAr: 'الدار البيضاء', x: 235, y: 165, samsarsCount: 14 },
  { id: 'marrakech', name: 'Marrakech', nameAr: 'مراكش', x: 215, y: 250, samsarsCount: 9 },
  { id: 'fes', name: 'Fès', nameAr: 'فاس', x: 310, y: 140, samsarsCount: 5 },
  { id: 'agadir', name: 'Agadir', nameAr: 'أكادير', x: 170, y: 325, samsarsCount: 4 },
  { id: 'oujda', name: 'Oujda', nameAr: 'وجدة', x: 420, y: 125, samsarsCount: 3 },
  { id: 'laayoune', name: 'Laâyoune', nameAr: 'العيون', x: 110, y: 450, samsarsCount: 2 },
  { id: 'dakhla', name: 'Dakhla', nameAr: 'الداخلة', x: 70, y: 560, samsarsCount: 2 },
];

export const MoroccoMap: React.FC<MoroccoMapProps> = ({
  selectedCityId,
  selectedDistrictId,
  onSelectCity,
  onSelectDistrict,
  onSwitchToGoogleMap
}) => {
  const currentCityData = CITIES_DATA.find(c => c.id === selectedCityId);

  return (
    <div className="relative w-full bg-white rounded-3xl border-2 border-stone-200 p-4 sm:p-5 shadow-xs flex flex-col items-center">
      {/* Header bar */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div>
          <span className="text-[11px] font-bold text-amber-700 tracking-wider uppercase block">
            Schéma National Géolocalisé
          </span>
          <h3 className="text-sm font-bold text-stone-900">
            Touchez une ville directement sur la carte pour explorer les Samsars
          </h3>
        </div>
        {onSwitchToGoogleMap && (
          <button
            type="button"
            onClick={onSwitchToGoogleMap}
            className="px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Passer en Google Map (Zoom rue)</span>
          </button>
        )}
      </div>

      {/* SVG Container with Morocco simplified stylized outline */}
      <div className="relative w-full max-w-[500px] aspect-[4/5] flex items-center justify-center select-none">
        <svg 
          viewBox="0 0 500 620" 
          className="w-full h-full drop-shadow-sm"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Moroccan Borders stylized landmass polygon */}
          <path
            d="M 270 50 
               L 315 65 
               L 350 80 
               L 410 90 
               L 445 110 
               L 435 150 
               L 400 200 
               L 360 250 
               L 300 290 
               L 250 330 
               L 210 370 
               L 180 410 
               L 150 470 
               L 110 540 
               L 65 600 
               L 40 580 
               L 55 520 
               L 85 450 
               L 125 380 
               L 155 330 
               L 190 280 
               L 205 230 
               L 225 175 
               L 250 135 
               L 270 85 
               Z"
            className="fill-stone-100 stroke-stone-300 hover:fill-stone-50 transition duration-300"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Internal gentle region lines */}
          <path 
            d="M 235 165 L 290 210 L 350 240" 
            stroke="#e7e5e4" 
            strokeWidth="1.5" 
            strokeDasharray="4 4" 
          />
          <path 
            d="M 215 250 L 270 310" 
            stroke="#e7e5e4" 
            strokeWidth="1.5" 
            strokeDasharray="4 4" 
          />
          <path 
            d="M 170 325 L 210 370" 
            stroke="#e7e5e4" 
            strokeWidth="1.5" 
            strokeDasharray="4 4" 
          />

          {/* Ocean labeling */}
          <text x="60" y="240" className="fill-stone-300 text-[13px] font-serif tracking-widest uppercase">
            Océan Atlantique
          </text>
          <text x="310" y="45" className="fill-stone-300 text-[11px] font-serif tracking-widest uppercase">
            Mer Méditerranée
          </text>

          {/* City Interactive Pins */}
          {CITIES_PINS.map((city) => {
            const isSelected = selectedCityId === city.id;
            return (
              <g 
                key={city.id} 
                className="cursor-pointer group"
                onClick={() => onSelectCity(city.id)}
              >
                {/* Glow ring if selected */}
                {isSelected && (
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r="18"
                    className="fill-amber-600/20 stroke-amber-600/50 animate-ping"
                    strokeWidth="1.5"
                  />
                )}

                {/* Base outer circle */}
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isSelected ? 11 : 7.5}
                  className={`transition-all duration-200 ${
                    isSelected 
                      ? 'fill-amber-700 stroke-white' 
                      : 'fill-stone-800 hover:fill-amber-600 stroke-white'
                  }`}
                  strokeWidth="2.5"
                />

                {/* Center dot */}
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isSelected ? 4 : 2}
                  className="fill-white"
                />

                {/* City Name Label Box */}
                <g transform={`translate(${city.x + 14}, ${city.y - 10})`}>
                  <rect
                    rx="6"
                    ry="6"
                    x="0"
                    y="0"
                    width={city.name.length * 7.5 + 46}
                    height="24"
                    className={`transition-all ${
                      isSelected 
                        ? 'fill-amber-900 stroke-amber-400' 
                        : 'fill-white/95 group-hover:fill-stone-900 stroke-stone-300 group-hover:stroke-stone-900 shadow-sm'
                    }`}
                    strokeWidth="1.5"
                  />
                  <text
                    x="7"
                    y="16"
                    className={`text-[11px] font-bold ${
                      isSelected 
                        ? 'fill-white font-extrabold' 
                        : 'fill-stone-800 group-hover:fill-white'
                    }`}
                  >
                    {city.name}
                  </text>
                  <text
                    x={city.name.length * 7.5 + 12}
                    y="16"
                    className={`text-[9.5px] font-mono font-bold ${
                      isSelected ? 'fill-amber-300' : 'fill-stone-400 group-hover:fill-amber-300'
                    }`}
                  >
                    ({city.samsarsCount})
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* District drilldown row directly below map if city has districts */}
      {currentCityData && currentCityData.districts.length > 0 && (
        <div className="w-full mt-3 pt-3 border-t border-stone-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-800 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              <span>Quartiers de {currentCityData.name} :</span>
            </span>
            {onSwitchToGoogleMap && (
              <button
                type="button"
                onClick={onSwitchToGoogleMap}
                className="text-[11px] text-amber-800 font-bold hover:underline flex items-center gap-1"
              >
                <span>Voir les cafés & Samsars sur Google Map</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {currentCityData.districts.map(dist => {
              const isDistSelected = selectedDistrictId === dist.id;
              const isChouiter = dist.id === 'chwiter';

              return (
                <button
                  key={dist.id}
                  type="button"
                  onClick={() => {
                    if (onSelectDistrict) onSelectDistrict(dist.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                    isDistSelected
                      ? 'bg-amber-700 text-white shadow-xs font-bold'
                      : isChouiter
                      ? 'bg-amber-100/90 text-amber-900 border border-amber-300 font-bold'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <span>{dist.name.split('&')[0].trim()}</span>
                  {isChouiter && <span>⭐</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick City Buttons Strip below map */}
      <div className="w-full mt-3 pt-2.5 border-t border-stone-100 flex flex-wrap items-center justify-center gap-1.5">
        <span className="text-[11px] text-stone-500 font-semibold mr-1">Villes :</span>
        {CITIES_PINS.slice(0, 6).map((city) => (
          <button
            key={city.id}
            type="button"
            onClick={() => onSelectCity(city.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              selectedCityId === city.id
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  );
};
