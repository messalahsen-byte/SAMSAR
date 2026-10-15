import React, { useState } from 'react';
import { 
  Building2, 
  Mic, 
  MessageSquareCode, 
  Rocket, 
  MapPin, 
  Sparkles, 
  Volume2, 
  ShieldCheck,
  Send,
  Compass
} from 'lucide-react';
import { speakDarija, playAudioBeep } from '../utils/audioDarija';

interface HeaderProps {
  activeTab: 'directory' | 'samsar_mode' | 'whatsapp_sim' | 'incubation_guide' | 'audit';
  setActiveTab: (tab: 'directory' | 'samsar_mode' | 'whatsapp_sim' | 'incubation_guide' | 'audit') => void;
  onOpenBroadcast: () => void;
  selectedCity: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenBroadcast,
  selectedCity
}) => {
  const [isPlayingWelcome, setIsPlayingWelcome] = useState(false);

  const handlePlayWelcomeVoice = () => {
    playAudioBeep('notification');
    setIsPlayingWelcome(true);
    speakDarija(
      "Salam o 3alaykom ! Marhba bikom f Daleel Samsar. Hna katl9aw a7san samsara d kol 7ouma f l'Maghrib, direct b WhatsApp w bla makhzen d l'bi3 w chra.",
      () => setIsPlayingWelcome(false)
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-linear-to-r from-amber-700 via-amber-600 to-emerald-700 text-white text-xs font-medium px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-5xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-amber-900/60 text-amber-200 px-1.5 py-0.5 rounded text-[11px] font-bold tracking-wider">
              MAROC PROPTECH
            </span>
            <span className="truncate">
              L'annuaire des figures de confiance du quartier • Pas de biens publics, mise en relation directe avec les Samsars de terrain
            </span>
          </div>

          <button
            onClick={handlePlayWelcomeVoice}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition shrink-0 ${
              isPlayingWelcome 
                ? 'bg-emerald-400 text-emerald-950 animate-pulse' 
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            title="Écouter la présentation en Darija"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isPlayingWelcome ? 'Kayhder...' : 'Sma3 b Darija (Audio)'}</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-amber-600/20 ring-2 ring-amber-500/30">
            <span>د</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-stone-900 text-lg tracking-tight font-serif">
                Daleel Samsar
              </h1>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-sans">
                دليل السمسار
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Réseau hyper-local des agents de quartier au Maroc
            </p>
          </div>
        </div>

        {/* Action Button: Broadcast to Samsars */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBroadcast}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition active:scale-95"
          >
            <Send className="w-4 h-4 text-emerald-100" />
            <span className="hidden sm:inline">Lancer Demande Flash</span>
            <span className="sm:hidden">Demande Flash</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto border-t border-stone-100 scrollbar-none">
        <nav className="flex space-x-2 py-2">
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
              activeTab === 'directory'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-500" />
            <span>Annuaire Acquéreur</span>
            <span className="text-[10px] opacity-70 ml-1">بحت عن سمسار</span>
          </button>

          <button
            onClick={() => setActiveTab('samsar_mode')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
              activeTab === 'samsar_mode'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Mic className="w-4 h-4 text-amber-300" />
            <span>Espace Samsar Vocal</span>
            <span className="bg-amber-200 text-amber-900 text-[10px] px-1.5 py-0.2 rounded font-bold">
              وضع السمسار
            </span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp_sim')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
              activeTab === 'whatsapp_sim'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <MessageSquareCode className="w-4 h-4 text-emerald-300" />
            <span>Simulateur Bot WhatsApp</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
              Audio IA
            </span>
          </button>

          <button
            onClick={() => setActiveTab('incubation_guide')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
              activeTab === 'incubation_guide'
                ? 'bg-indigo-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Rocket className="w-4 h-4 text-indigo-400" />
            <span>Guide Accompagnement</span>
            <span className="bg-indigo-100 text-indigo-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
              Pour vous
            </span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
              activeTab === 'audit'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Audit & Faisabilité</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
              Simulateur
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
