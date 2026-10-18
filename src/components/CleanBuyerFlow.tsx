import React, { useState, useEffect } from 'react';
import { 
  CITIES_DATA, 
  INITIAL_DEMO_SAMSARS, 
  Samsar,
  getCustomSamsars
} from '../data/samsars';
import { 
  MapPin, 
  Building2, 
  Home, 
  Store, 
  LandPlot, 
  Sparkles, 
  Coffee, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  Phone, 
  Volume2, 
  VolumeX, 
  Check, 
  ArrowRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { speakDarijaNatural, playAudioBeep, formatWhatsAppUrl } from '../utils/audioDarija';
import { recordConnection, getStoredConnections, ConnectionEvent } from '../utils/connectionsTracker';

const PROPERTY_TYPES = [
  { id: 'appartement', name: 'Appartement', icon: Building2, desc: 'Résidentiel, 1 à 4 chambres' },
  { id: 'villa', name: 'Villa & Maison', icon: Home, desc: 'Indépendant, avec jardin / terrasse' },
  { id: 'commercial', name: 'Commerce & Local', icon: Store, desc: 'Boutique, magasin, bureau' },
  { id: 'terrain', name: 'Terrain', icon: LandPlot, desc: 'Titré ou zone de construction' },
  { id: 'riad', name: 'Riad & Caractère', icon: Sparkles, desc: 'Traditionnel, Médina' },
];

export const CleanBuyerFlow: React.FC = () => {
  const [selectedCityId, setSelectedCityId] = useState<string>('casablanca');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('maarif');
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('appartement');
  
  // Connection events & state
  const [connections, setConnections] = useState<ConnectionEvent[]>([]);
  const [lastConnectedSamsarId, setLastConnectedSamsarId] = useState<string | null>(null);
  const [activeVoicePlayingId, setActiveVoicePlayingId] = useState<string | null>(null);

  // Load all Samsars
  const [samsars, setSamsars] = useState<Samsar[]>([]);

  useEffect(() => {
    const custom = getCustomSamsars();
    setSamsars([...custom, ...INITIAL_DEMO_SAMSARS]);
    setConnections(getStoredConnections());
  }, []);

  const currentCity = CITIES_DATA.find(c => c.id === selectedCityId) || CITIES_DATA[0];
  const currentDistrict = currentCity?.districts?.find(d => d.id === selectedDistrictId) || currentCity?.districts?.[0] || { id: 'default', name: currentCity?.name || 'Centre', nameAr: '' };

  // Samsars that match city, district and specialty
  const matchingSamsars = samsars.filter(s => {
    const matchCity = s.city === selectedCityId;
    const matchDistrict = s.districts.includes(selectedDistrictId);
    const matchSpecialty = s.specialties.includes(selectedPropertyType as any);
    return matchCity && matchDistrict && matchSpecialty;
  });

  // Fallback to district samsars if no strict specialty match
  const districtSamsars = matchingSamsars.length > 0 
    ? matchingSamsars 
    : samsars.filter(s => s.city === selectedCityId && s.districts.includes(selectedDistrictId));

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    const city = CITIES_DATA.find(c => c.id === cityId);
    if (city && city.districts[0]) {
      setSelectedDistrictId(city.districts[0].id);
    }
  };

  const handleConnectWithSamsar = (samsar: Samsar) => {
    playAudioBeep('whatsapp_sent');

    // 1. Record connection for monetization & proof of value
    const updated = recordConnection({
      samsarId: samsar.id,
      samsarAlias: samsar.alias,
      city: currentCity.name,
      district: currentDistrict.name,
      propertyType: PROPERTY_TYPES.find(p => p.id === selectedPropertyType)?.name || selectedPropertyType
    });

    setConnections(updated);
    setLastConnectedSamsarId(samsar.id);

    // 2. Format respectful message in Darija
    const message = `Salam Si ${samsar.name.split(' ')[1] || samsar.name}, cheft Daleel Samsar f secteur ${currentDistrict.name}. Kan9elleb 3la ${selectedPropertyType}. Wach momkin ntfahmou f WhatsApp wla ntla9aw f l'9ahwa ? Chokran.`;
    const url = formatWhatsAppUrl(samsar.whatsapp, message);

    // 3. Open WhatsApp in new tab
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePlayVoice = (samsar: Samsar) => {
    if (activeVoicePlayingId === samsar.id) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setActiveVoicePlayingId(null);
      return;
    }

    playAudioBeep('notification');
    setActiveVoicePlayingId(samsar.id);
    speakDarijaNatural(samsar.audioDarijaArabic || '', samsar.audioPromptDarija, () => {
      setActiveVoicePlayingId(null);
    });
  };

  const currentConnectionsCount = connections.filter(c => c.city === currentCity.name).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Quiet Header (Noisy banners removed) */}
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Accès direct aux détenteurs de clés sans commission d'agence</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-serif">
          Quel bien cherchez-vous et dans quel quartier ?
        </h2>
        <p className="text-stone-500 text-xs sm:text-sm max-w-lg mx-auto">
          Sélectionnez la zone et la catégorie pour entrer en relation directe avec le référent local du Derb.
        </p>
      </div>

      {/* Step 1 : Ville & Quartier */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[11px] font-extrabold">1</span>
            <span>Localisation : Ville & Quartier</span>
          </span>
          <span className="text-xs text-stone-400">
            {currentCity.name} • {currentDistrict.name}
          </span>
        </div>

        {/* City pills */}
        <div className="flex flex-wrap gap-2">
          {CITIES_DATA.map(c => (
            <button
              key={c.id}
              onClick={() => handleCityChange(c.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                selectedCityId === c.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* District horizontal chips */}
        <div className="pt-2 border-t border-stone-100">
          <span className="block text-[11px] font-semibold text-stone-400 mb-2">
            Quartier ciblé à {currentCity.name} :
          </span>
          <div className="flex flex-wrap gap-1.5">
            {currentCity.districts.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDistrictId(d.id)}
                className={`px-3 py-1.5 rounded-lg text-xs transition font-medium ${
                  selectedDistrictId === d.id
                    ? 'bg-amber-700 text-white font-bold shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200/60'
                }`}
              >
                <span>{d.name}</span>
                <span className="text-[10px] opacity-70 ml-1">({d.nameAr})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step 2 : Type de Bien */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[11px] font-extrabold">2</span>
            <span>Catégorie du bien recherché</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {PROPERTY_TYPES.map(prop => {
            const Icon = prop.icon;
            const isSelected = selectedPropertyType === prop.id;
            return (
              <button
                key={prop.id}
                onClick={() => setSelectedPropertyType(prop.id)}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/60 text-stone-900 ring-2 ring-amber-500/20 shadow-xs'
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-xs font-bold leading-tight">{prop.name}</strong>
                  <span className="text-[10px] text-stone-400 block line-clamp-1 mt-0.5">{prop.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3 : Les Clés Disponibles dans ce Quartier (Épuré, SANS insister sur la photo du Samsar) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[11px] font-extrabold">3</span>
              <span>Opportunités identifiées à {currentDistrict.name}</span>
            </span>
            <p className="text-xs text-stone-500 mt-0.5">
              Contact direct avec l'homme de confiance du quartier détenteur des clés actuelles
            </p>
          </div>

          <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            {districtSamsars.length} Référent(s) actif(s) sur ce Derb
          </span>
        </div>

        {/* Discreet Cards : Focused on the Derb, portfolio, and coffee spot (NOT intrusive photos) */}
        <div className="space-y-4">
          {districtSamsars.map(samsar => {
            const isJustConnected = lastConnectedSamsarId === samsar.id;
            const isPlayingVoice = activeVoicePlayingId === samsar.id;

            return (
              <div
                key={samsar.id}
                className="bg-stone-50 rounded-2xl p-5 border border-stone-200 hover:border-amber-400 transition flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Left: Discret badge & local credentials */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-stone-900 text-white text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>{samsar.alias}</span>
                    </span>

                    <span className="text-xs text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>{samsar.experienceYears} ans de présence à {currentDistrict.name}</span>
                    </span>

                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.2 rounded">
                      {samsar.activeListingsEstimate}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {samsar.bioFrench}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-stone-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Coffee className="w-3.5 h-3.5 text-amber-700" />
                      <span><strong>Café :</strong> {samsar.coffeeSpot}</span>
                    </span>
                  </div>

                  {/* Discrete Voice Preview in Arabic Script */}
                  {samsar.audioDarijaArabic && (
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => handlePlayVoice(samsar)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          isPlayingVoice 
                            ? 'bg-amber-600 text-white animate-pulse' 
                            : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-200'
                        }`}
                        title="Écouter la voix du Samsar en Darija"
                      >
                        {isPlayingVoice ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-amber-600" />}
                        <span>{isPlayingVoice ? 'Arrêter' : 'Écouter en Darija'}</span>
                      </button>
                      <span className="text-[11px] text-stone-400 italic font-mono truncate max-w-xs">
                        "{samsar.audioPromptDarija.substring(0, 35)}..."
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: The Essential Action Button (With Click Tracking) */}
                <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2 min-w-[210px]">
                  <button
                    onClick={() => handleConnectWithSamsar(samsar)}
                    className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>Contacter sur WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`tel:${samsar.phone}`}
                    className="w-full py-2.5 px-4 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-stone-500" />
                    <span>Appel direct</span>
                  </a>

                  {isJustConnected && (
                    <div className="text-[11px] text-emerald-800 bg-emerald-100/80 p-1.5 rounded-lg text-center font-medium flex items-center justify-center gap-1">
                      <Check className="w-3 h-3 text-emerald-700" />
                      <span>Mise en relation enregistrée !</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Answer to user's question: Live Metrics & Why counting clicks is essential */}
      <div className="bg-stone-100 rounded-2xl p-5 border border-stone-200 text-xs text-stone-600 space-y-3">
        <div className="flex items-center justify-between">
          <strong className="text-stone-900 font-bold flex items-center gap-1.5 text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Compteur de Mises en Relation en Temps Réel :</span>
          </strong>
          <span className="bg-white px-2.5 py-1 rounded-md border border-stone-200 font-bold text-stone-800">
            {connections.length} Mises en relation enregistrées au total
          </span>
        </div>

        <p className="leading-relaxed">
          <strong>Pourquoi comptabiliser chaque clic est capital ?</strong>  
          À la fin du mois, vous pouvez montrer au Samsar : <em>« Si Mohamed, ce mois-ci vous avez reçu 14 acquéreurs sérieux via Daleel Samsar à votre café »</em>. 
          C'est cette preuve tangible qui justifie son abonnement (100-150 MAD/mois) et démontre la traction aux investisseurs (Tamwilcom / 212 Founders).
        </p>
      </div>
    </div>
  );
};
