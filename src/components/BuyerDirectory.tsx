import React, { useState, useEffect, useRef } from 'react';
import { 
  CITIES_DATA, 
  INITIAL_DEMO_SAMSARS, 
  Samsar,
  getCustomSamsars,
  deleteCustomSamsar
} from '../data/samsars';
import { 
  buildSamsarSearchableText, 
  matchesSearchQuery 
} from '../utils/searchUtils';
import { 
  MapPin, 
  Phone, 
  Star, 
  ShieldCheck, 
  Clock, 
  Coffee, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  Search,
  Filter,
  Send,
  Building,
  Key,
  Info,
  UserPlus,
  Trash2,
  HelpCircle,
  Play,
  Pause
} from 'lucide-react';
import { speakDarijaNatural, playAudioBeep, formatWhatsAppUrl } from '../utils/audioDarija';
import { AddSamsarModal } from './AddSamsarModal';

interface BuyerDirectoryProps {
  onOpenBroadcastWithDistrict?: (city: string, district: string) => void;
}

export const BuyerDirectory: React.FC<BuyerDirectoryProps> = ({ onOpenBroadcastWithDistrict }) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('casablanca');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'custom' | 'demo'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [selectedSamsarForModal, setSelectedSamsarForModal] = useState<Samsar | null>(null);
  const [customBuyerNote, setCustomBuyerNote] = useState<string>('');
  
  // Custom Samsars list from localStorage
  const [allSamsars, setAllSamsars] = useState<Samsar[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const activeAudioElementRef = useRef<HTMLAudioElement | null>(null);

  // Load custom Samsars on mount
  useEffect(() => {
    const customList = getCustomSamsars();
    setAllSamsars([...customList, ...INITIAL_DEMO_SAMSARS]);
  }, []);

  const currentCity = CITIES_DATA.find(c => c.id === selectedCityId) || CITIES_DATA[0];

  // Filter Samsars
  const filteredSamsars = allSamsars.filter(samsar => {
    if (samsar.city !== selectedCityId) return false;
    
    if (selectedDistrictId !== 'all' && !samsar.districts.includes(selectedDistrictId)) {
      return false;
    }

    if (selectedSpecialty !== 'all' && !samsar.specialties.includes(selectedSpecialty as any)) {
      return false;
    }

    if (sourceFilter === 'custom' && !samsar.isCustom) return false;
    if (sourceFilter === 'demo' && samsar.isCustom) return false;

    if (searchQuery.trim() !== '') {
      const searchable = buildSamsarSearchableText(samsar);
      if (!matchesSearchQuery(searchable, searchQuery)) {
        return false;
      }
    }

    return true;
  });

  const handlePlayVoice = (samsar: Samsar) => {
    // If playing custom blob audio
    if (samsar.customVoiceAudioUrl) {
      if (activePlayingId === samsar.id && activeAudioElementRef.current) {
        activeAudioElementRef.current.pause();
        setActivePlayingId(null);
        return;
      }

      if (activeAudioElementRef.current) {
        activeAudioElementRef.current.pause();
      }

      playAudioBeep('notification');
      const audio = new Audio(samsar.customVoiceAudioUrl);
      activeAudioElementRef.current = audio;
      setActivePlayingId(samsar.id);

      audio.onended = () => setActivePlayingId(null);
      audio.onerror = () => setActivePlayingId(null);
      audio.play().catch(() => setActivePlayingId(null));
      return;
    }

    // Otherwise use authentic Arabic phonetic Moroccan synthesis
    if (activePlayingId === samsar.id) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setActivePlayingId(null);
      return;
    }

    playAudioBeep('notification');
    setActivePlayingId(samsar.id);
    speakDarijaNatural(samsar.audioDarijaArabic || '', samsar.audioPromptDarija, () => {
      setActivePlayingId(null);
    });
  };

  const handleDeleteCustom = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Voulez-vous supprimer ce profil de Samsar de votre annuaire ?")) {
      deleteCustomSamsar(id);
      setAllSamsars(prev => prev.filter(s => s.id !== id));
      if (selectedSamsarForModal?.id === id) {
        setSelectedSamsarForModal(null);
      }
    }
  };

  const handleSamsarAdded = (newSamsar: Samsar) => {
    setAllSamsars(prev => [newSamsar, ...prev]);
    setSelectedCityId(newSamsar.city);
    if (newSamsar.districts[0]) {
      setSelectedDistrictId(newSamsar.districts[0]);
    }
  };

  const getDistrictName = (distId: string) => {
    const d = currentCity.districts.find(item => item.id === distId);
    return d ? d.name : distId;
  };

  const generateWhatsAppMessage = (samsar: Samsar, customText?: string) => {
    const districtLabel = selectedDistrictId !== 'all' ? getDistrictName(selectedDistrictId) : currentCity.name;
    const baseText = customText && customText.trim().length > 0 
      ? customText 
      : `Salam Si ${samsar.name.split(' ')[1] || samsar.name}, cheft l'profil dialk f Daleel Samsar. Ana chary serieu baghi nchouf chno 3ndk f ${districtLabel}. Wach momkin ntfahmou f l'WhatsApp wla ntla9aw f l'9ahwa ? Chokran bzaf.`;
    return baseText;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Notice addressing the user's question about demo vs real profiles */}
      <div className="bg-amber-100/70 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-5 h-5 text-amber-800 shrink-0" />
          <div>
            <strong className="block text-amber-900 font-bold">
              Profils de démonstration & Ajout de vos vrais Samsars :
            </strong>
            <span>
              Les fiches initiales sont des <strong>profils modèles représentatifs</strong> pour tester le parcours. 
              Vous pouvez <strong className="underline cursor-pointer" onClick={() => setIsAddModalOpen(true)}>ajouter dès maintenant les vrais Samsars de votre quartier</strong> avec leurs coordonnées réelles et enregistrer leur vraie voix en Darija !
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="whitespace-nowrap px-3.5 py-2 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl flex items-center gap-1.5 shrink-0 shadow-xs transition active:scale-95"
        >
          <UserPlus className="w-3.5 h-3.5 text-amber-300" />
          <span>+ Ajouter un Vrai Samsar</span>
        </button>
      </div>

      {/* Hero Explainer & Value Proposition */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-amber-900 via-stone-900 to-emerald-950 text-white p-6 sm:p-10 shadow-xl border border-amber-900/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-4 border border-amber-400/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>L'annuaire de confiance des hommes de terrain au Maroc</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-serif text-amber-50 leading-tight mb-3">
            Trouvez le Samsar qui détient les clés de votre futur quartier.
          </h2>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
            Ne perdez plus votre temps sur des annonces périmées. Contactez directement la référence locale de chaque Derb, écoutez sa présentation en Darija et rencontrez-le à son café habituel.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2 text-stone-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Vocal Darija naturel & authentique</span>
            </div>
            <div className="flex items-center gap-2 text-stone-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Bouton WhatsApp direct pré-rempli</span>
            </div>
            <div className="flex items-center gap-2 text-stone-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Respect strict de l'exclusivité du Samsar</span>
            </div>
          </div>
        </div>
      </div>

      {/* City & Filters Box */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-stone-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              1. Choisissez la ville :
            </label>
            <div className="flex flex-wrap gap-2">
              {CITIES_DATA.map(city => (
                <button
                  key={city.id}
                  onClick={() => {
                    setSelectedCityId(city.id);
                    setSelectedDistrictId('all');
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
                    selectedCityId === city.id
                      ? 'bg-amber-700 text-white shadow-md shadow-amber-900/20'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>{city.name}</span>
                  <span className="text-xs opacity-75 font-normal">({city.nameAr})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Source toggle */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl self-start sm:self-center">
            <button
              onClick={() => setSourceFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                sourceFilter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              Tous ({allSamsars.length})
            </button>
            <button
              onClick={() => setSourceFilter('custom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                sourceFilter === 'custom' ? 'bg-emerald-700 text-white shadow-xs' : 'text-stone-600'
              }`}
            >
              <span>Vrais Profils Ajoutés</span>
              <span className="bg-emerald-100 text-emerald-900 text-[10px] px-1.5 py-0.2 rounded-full">
                {allSamsars.filter(s => s.isCustom).length}
              </span>
            </button>
            <button
              onClick={() => setSourceFilter('demo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                sourceFilter === 'demo' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              Profils Modèles ({INITIAL_DEMO_SAMSARS.length})
            </button>
          </div>
        </div>

        {/* Districts Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            2. Quartier / Derb à {currentCity.name} :
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedDistrictId('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedDistrictId === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              Tous les quartiers ({currentCity.name})
            </button>
            {currentCity.districts.map(dist => (
              <button
                key={dist.id}
                onClick={() => setSelectedDistrictId(dist.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                  selectedDistrictId === dist.id
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <span>{dist.name}</span>
                <span className="text-[11px] opacity-70">({dist.nameAr})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Specialty Filter and Search */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-stone-100 items-stretch sm:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Spécialité :
            </span>
            {[
              { id: 'all', label: 'Toutes' },
              { id: 'appartement', label: '🏢 Appartements' },
              { id: 'villa', label: '🏡 Villas & Terrains' },
              { id: 'commercial', label: '🏬 Magasins & Commerces' },
              { id: 'riad', label: '🕌 Riads (Médina)' },
              { id: 'location', label: '🔑 Location' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedSpecialty(type.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                  selectedSpecialty === type.id
                    ? 'bg-stone-800 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher par nom, café..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Samsars Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-stone-900 flex items-center gap-2">
            <span>Samsars disponibles ({filteredSamsars.length})</span>
            <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-medium">
              {currentCity.name} {selectedDistrictId !== 'all' ? `• ${getDistrictName(selectedDistrictId)}` : ''}
            </span>
          </h3>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 hover:bg-amber-100 transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Ajouter un Samsar</span>
          </button>
        </div>

        {filteredSamsars.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 text-stone-500 space-y-4">
            <Building className="w-10 h-10 text-stone-300 mx-auto" />
            <div>
              <p className="text-sm font-semibold text-stone-800">Aucun Samsar ne correspond à ces critères.</p>
              <p className="text-xs text-stone-400 mt-1">Vous pouvez en ajouter un dès maintenant pour ce quartier !</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-amber-700 text-white rounded-xl text-xs font-bold hover:bg-amber-800 transition"
            >
              + Ajouter le premier Samsar ici
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSamsars.map(samsar => {
              const isPlaying = activePlayingId === samsar.id;
              const waUrl = formatWhatsAppUrl(samsar.whatsapp, generateWhatsAppMessage(samsar));

              return (
                <div 
                  key={samsar.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between group relative overflow-hidden ${
                    samsar.isCustom ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-stone-200'
                  }`}
                >
                  {/* Custom badge or Demo badge */}
                  <div className="flex items-center justify-between mb-2">
                    {samsar.isCustom ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Vrai Profil Ajouté par Vous</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                        Profil Modèle Démo
                      </span>
                    )}

                    {samsar.isCustom && (
                      <button
                        onClick={(e) => handleDeleteCustom(samsar.id, e)}
                        className="text-stone-400 hover:text-red-600 p-1 rounded-md transition"
                        title="Supprimer ce profil ajouté"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Header info */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={samsar.avatar} 
                          alt={samsar.name} 
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-stone-100"
                        />
                        {samsar.status === 'vip_derb' && (
                          <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 shadow-xs" title="Doyen du quartier">
                            <Star className="w-3.5 h-3.5 fill-white" />
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-stone-900 text-base leading-tight group-hover:text-amber-800 transition">
                            {samsar.name}
                          </h4>
                        </div>
                        <p className="text-xs font-semibold text-amber-700 font-serif">
                          {samsar.alias}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>{samsar.experienceYears} ans de présence</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        <span>{samsar.rating}</span>
                        <span className="text-[10px] text-stone-400 font-normal">({samsar.reviewsCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Reputation Badge */}
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{samsar.reputationBadge}</span>
                    </span>
                  </div>

                  {/* Darija Vocal Player with Arabic Script */}
                  <div className="mb-4 bg-amber-50/80 rounded-2xl p-3 border border-amber-200/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                        <Volume2 className="w-3 h-3" />
                        <span>Vocal Darija (صوت السمسار)</span>
                      </span>
                      {samsar.customVoiceAudioUrl && (
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                          Voix Réelle Micro
                        </span>
                      )}
                    </div>

                    {/* Arabic script text for natural phrasing */}
                    {samsar.audioDarijaArabic && (
                      <p className="text-xs font-semibold text-stone-800 text-right font-sans leading-relaxed line-clamp-2" dir="rtl">
                        "{samsar.audioDarijaArabic}"
                      </p>
                    )}

                    <button
                      onClick={() => handlePlayVoice(samsar)}
                      className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition shadow-xs ${
                        isPlaying 
                          ? 'bg-amber-600 text-white animate-pulse' 
                          : 'bg-white hover:bg-stone-50 text-stone-800 border border-amber-300'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <VolumeX className="w-4 h-4" />
                          <span>Arrêter le vocal</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-amber-600" />
                          <span>Sma3 b Darija (Écouter l'accent marocain)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Details summary */}
                  <div className="space-y-2 text-xs text-stone-600 mb-4 border-t border-stone-100 pt-3">
                    <div className="flex items-center gap-2">
                      <Coffee className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="truncate"><strong>Permanence :</strong> {samsar.coffeeSpot}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Key className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span><strong>Portefeuille exclusif :</strong> {samsar.activeListingsEstimate}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                      onClick={() => playAudioBeep('whatsapp_sent')}
                    >
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.288.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.087-.179.182-.077.357.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.087.275.072.376-.043.101-.116.433-.506.549-.68.116-.174.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.044.073.044.42-.1.825z" />
                      </svg>
                      <span>WhatsApp Direct</span>
                    </a>

                    <button
                      onClick={() => setSelectedSamsarForModal(samsar)}
                      className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition"
                      title="Voir la fiche détaillée & permanence"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Samsar Details Modal */}
      {selectedSamsarForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedSamsarForModal.avatar} 
                  alt={selectedSamsarForModal.name} 
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-500/20"
                />
                <div>
                  <h3 className="font-bold text-xl text-stone-900">{selectedSamsarForModal.name}</h3>
                  <p className="text-sm font-semibold text-amber-700">{selectedSamsarForModal.alias}</p>
                  <p className="text-xs text-stone-500">{selectedSamsarForModal.experienceYears} ans de réputation locale</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSamsarForModal(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Reputation & Guarantee */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Règle de confiance Daleel Samsar :</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                Ce Samsar est une référence de son quartier. La visite se fait toujours avec lui en direct. Il détient les clés de biens exclusifs non visibles en agence conventionnelle.
              </p>
            </div>

            {/* Darija script voice preview */}
            {selectedSamsarForModal.audioDarijaArabic && (
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 space-y-1 text-right" dir="rtl">
                <span className="text-[11px] font-bold text-amber-900 block">نص الصوت بالدارجة :</span>
                <p className="text-sm font-semibold text-stone-800 leading-relaxed">
                  "{selectedSamsarForModal.audioDarijaArabic}"
                </p>
              </div>
            )}

            {/* Bio */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                Présentation en Darija & Parcours :
              </h4>
              <p className="text-sm text-stone-800 bg-stone-50 p-3 rounded-xl border border-stone-200 font-serif italic mb-2">
                "{selectedSamsarForModal.bioDarija}"
              </p>
              <p className="text-xs text-stone-600">
                {selectedSamsarForModal.bioFrench}
              </p>
            </div>

            {/* Coffee permanence */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="text-stone-400 font-bold block mb-1">Café de permanence :</span>
                <span className="font-semibold text-stone-800">{selectedSamsarForModal.coffeeSpot}</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="text-stone-400 font-bold block mb-1">Commission usuelle :</span>
                <span className="font-semibold text-stone-800">{selectedSamsarForModal.typicalCommission}</span>
              </div>
            </div>

            {/* Custom WhatsApp Note Sender */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <label className="block text-xs font-bold text-stone-700">
                Personnaliser votre message WhatsApp :
              </label>
              <textarea
                rows={3}
                placeholder="Exemple : Salam Si Mohamed, bghit bpartma 3 biout f Maarif m3a l'garage, budget max 120 mlyoun..."
                value={customBuyerNote}
                onChange={(e) => setCustomBuyerNote(e.target.value)}
                className="w-full text-xs p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 pt-2">
              <a
                href={formatWhatsAppUrl(
                  selectedSamsarForModal.whatsapp, 
                  generateWhatsAppMessage(selectedSamsarForModal, customBuyerNote)
                )}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playAudioBeep('whatsapp_sent')}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-center text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Envoyer sur WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${selectedSamsarForModal.phone}`}
                className="px-5 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Appeler</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Add Real Samsar Modal */}
      <AddSamsarModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSamsarAdded={handleSamsarAdded}
        defaultCity={selectedCityId}
      />
    </div>
  );
};
