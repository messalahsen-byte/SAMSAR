import React, { useState } from 'react';
import { 
  ArrowLeft,
  Menu,
  X,
  Send,
  Building2, 
  Mic, 
  MessageSquareCode, 
  Rocket, 
  Compass,
  BookOpen,
  Search,
  PlusCircle,
  MapPin,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'search' | 'directory' | 'samsar_mode' | 'whatsapp_sim' | 'incubation_guide' | 'audit' | 'discussion';
  setActiveTab: (tab: 'search' | 'directory' | 'samsar_mode' | 'whatsapp_sim' | 'incubation_guide' | 'audit' | 'discussion') => void;
  onOpenBroadcast: () => void;
  selectedCity?: string;
  onGoHome?: () => void;
  onNavigateDirectScreen?: (screen: 'home' | 'samsar_choice' | 'samsar_city' | 'samsar_district' | 'samsar_list' | 'samsar_map' | 'transact' | 'transact_choice' | 'transact_buy' | 'transact_sell', mode?: 'buy' | 'sell') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenBroadcast,
  onGoHome,
  onNavigateDirectScreen
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleBack = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      setActiveTab('search');
    }
  };

  const handleMenuSelect = (action: () => void) => {
    setIsMenuOpen(false);
    action();
  };

  return (
    <>
      {/* Navigation Mobile Épurée (Flux normal, pas de barre fixe lourde avec onglets) */}
      <div className="w-full bg-white border-b border-stone-200/80 px-4 py-3 flex items-center justify-between shrink-0">
        {/* Gauche : Bouton ← Retour */}
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 text-xs font-bold transition shadow-2xs"
          title="Retourner à l'accueil"
        >
          <ArrowLeft className="w-4 h-4 text-stone-700" />
          <span>Retour</span>
        </button>

        {/* Centre : Logo DIRECTSAMSAR épuré */}
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 cursor-pointer select-none active:opacity-80 transition"
        >
          <div className="w-7 h-7 rounded-xl bg-amber-700 text-white flex items-center justify-center font-black text-xs shadow-2xs">
            DS
          </div>
          <span className="font-black text-stone-900 text-sm sm:text-base font-serif tracking-tight">
            DIRECT<span className="text-amber-700">SAMSAR</span>
          </span>
        </button>

        {/* Droite : Bouton ≡ (Menu) */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className="w-9 h-9 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 flex items-center justify-center transition shadow-2xs"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5 text-stone-800" />
        </button>
      </div>

      {/* Menu Latéral Mobile (Slide-over Drawer) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop sombre */}
          <div 
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Panneau latéral */}
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl z-10 p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Header Menu */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-700 text-white flex items-center justify-center font-black text-xs">
                    DS
                  </div>
                  <span className="font-black text-stone-900 text-sm font-serif">
                    DIRECT<span className="text-amber-700">SAMSAR</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 rounded-xl bg-stone-100 text-stone-600 hover:text-stone-950 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Bouton Action Rapide : Alerte Flash */}
              <button
                type="button"
                onClick={() => handleMenuSelect(onOpenBroadcast)}
                className="w-full py-3 px-4 bg-stone-950 hover:bg-stone-900 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
              >
                <Send className="w-4 h-4 text-amber-400" />
                <span>Demande Flash Samsar</span>
              </button>

              {/* Navigation Items */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block px-2 mb-1">
                  Navigation Rapide
                </span>

                <button
                  type="button"
                  onClick={() => handleMenuSelect(() => {
                    if (onNavigateDirectScreen) onNavigateDirectScreen('home');
                    setActiveTab('search');
                  })}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-800 hover:bg-stone-100 font-bold transition text-left"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span>Accueil Mobile (2 Choix)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMenuSelect(() => {
                    if (onNavigateDirectScreen) onNavigateDirectScreen('samsar_map');
                    setActiveTab('search');
                  })}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-800 hover:bg-stone-100 font-semibold transition text-left"
                >
                  <MapPin className="w-4 h-4 text-amber-700" />
                  <span>Trouver un Samsar (Carte)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMenuSelect(() => {
                    if (onNavigateDirectScreen) onNavigateDirectScreen('transact', 'buy');
                    setActiveTab('search');
                  })}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-800 hover:bg-stone-100 font-semibold transition text-left"
                >
                  <Search className="w-4 h-4 text-amber-700" />
                  <span>Acheter un bien (Offres)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMenuSelect(() => {
                    if (onNavigateDirectScreen) onNavigateDirectScreen('transact', 'sell');
                    setActiveTab('search');
                  })}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-800 hover:bg-stone-100 font-semibold transition text-left"
                >
                  <PlusCircle className="w-4 h-4 text-amber-700" />
                  <span>Vendre un bien (Déposer annonce)</span>
                </button>

                <div className="pt-2 border-t border-stone-100">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block px-2 mb-1">
                    Modules Avancés & Investisseurs
                  </span>

                  <button
                    type="button"
                    onClick={() => handleMenuSelect(() => setActiveTab('samsar_mode'))}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-100 font-medium transition text-left"
                  >
                    <Mic className="w-4 h-4 text-amber-700" />
                    <span>Espace Vocal Samsar (Darija)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMenuSelect(() => setActiveTab('whatsapp_sim'))}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-100 font-medium transition text-left"
                  >
                    <MessageSquareCode className="w-4 h-4 text-emerald-700" />
                    <span>Simulateur WhatsApp & IA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMenuSelect(() => setActiveTab('incubation_guide'))}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-100 font-medium transition text-left"
                  >
                    <Rocket className="w-4 h-4 text-indigo-700" />
                    <span>Guide Incubateurs (212 Founders)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMenuSelect(() => setActiveTab('audit'))}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-100 font-medium transition text-left"
                  >
                    <Compass className="w-4 h-4 text-emerald-700" />
                    <span>Audit de Faisabilité Marché</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMenuSelect(() => setActiveTab('discussion'))}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-100 font-medium transition text-left"
                  >
                    <BookOpen className="w-4 h-4 text-amber-700" />
                    <span>Discussion & Thèmes Stratégiques</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 text-center">
              <p className="text-[11px] text-stone-400">
                DIRECTSAMSAR • Modèle mobile épuré 🇲🇦
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

