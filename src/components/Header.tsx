import React, { useState } from 'react';
import { MoroccoFlagStarLogo } from './MoroccoFlagStarLogo';
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
  activeTab?: 'search' | 'directory' | 'samsar_mode' | 'whatsapp_sim' | 'incubation_guide' | 'audit' | 'discussion';
  setActiveTab?: (tab: 'search' | 'directory' | 'samsar_mode' | 'whatsapp_sim' | 'incubation_guide' | 'audit' | 'discussion') => void;
  onOpenBroadcast?: () => void;
  selectedCity?: string;
  onGoHome?: () => void;
  onHomeClick?: () => void;
  currentStep?: 'language' | 'mode' | 'home' | string;
  subPage?: string | null;
  setCurrentStep?: (step: 'language' | 'mode' | 'home') => void;
  setSubPage?: (page: string | null) => void;
  setSelectedLang?: (lang: 'fr' | 'ar' | string) => void;
  onNavigateDirectScreen?: (screen: 'home' | 'samsar_choice' | 'samsar_city' | 'samsar_district' | 'samsar_list' | 'samsar_map' | 'transact' | 'transact_choice' | 'transact_buy' | 'transact_sell', mode?: 'buy' | 'sell') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab = 'search',
  setActiveTab = () => {},
  onOpenBroadcast = () => {},
  onGoHome,
  onHomeClick,
  currentStep = 'home',
  subPage = null,
  setCurrentStep,
  setSubPage,
  setSelectedLang,
  onNavigateDirectScreen
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleHomeReset = () => {
    if (setCurrentStep) setCurrentStep('language');
    if (setSubPage) setSubPage(null);
    if (setSelectedLang) setSelectedLang('fr');
    if (onHomeClick) onHomeClick();
    else if (onGoHome) onGoHome();
  };

  const handleBack = () => {
    if (onGoHome) {
      onGoHome();
    } else if (setActiveTab) {
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
        {/* En haut à gauche : Logo DIRECTSAMSAR et éventuel bouton retour */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 text-xs font-bold transition shadow-2xs"
            title="Retourner à l'accueil"
          >
            <ArrowLeft className="w-4 h-4 text-stone-700" />
            <span className="hidden sm:inline">Retour</span>
          </button>

          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 cursor-pointer select-none active:opacity-80 transition"
          >
            <MoroccoFlagStarLogo />
            <span className="font-black text-[#049A5B] text-base sm:text-lg font-serif tracking-tight">
              Direct<span className="text-amber-600">Samsar</span>
            </span>
          </button>
        </div>

        {/* DROITE : Bouton Accueil (Home) entre le logo et le menu hamburger */}
        <div className="flex items-center gap-2">
          {currentStep === 'home' && (
            <button
              type="button"
              onClick={() => {
                if (setCurrentStep) {
                  setCurrentStep('language'); // Retour forcé à l'Écran 1
                }
                if (setSubPage) {
                  setSubPage(null);           // Nettoyage des sous-pages
                }
                if (setSelectedLang) {
                  setSelectedLang('fr');      // Reset optionnel de la langue
                }
                if (onHomeClick) {
                  onHomeClick();
                } else if (onGoHome) {
                  onGoHome();
                }
              }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1 text-sm font-medium text-gray-700 cursor-pointer active:scale-95"
              title="Retour à l'accueil"
              aria-label="Accueil"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden sm:inline font-medium">Accueil</span>
            </button>
          )}

          {/* Bouton ≡ (Menu) */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="w-9 h-9 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 flex items-center justify-center transition shadow-2xs"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5 text-stone-800" />
          </button>
        </div>
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
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://postimg.cc/N5TKdpNv"
                    alt="Logo DirectSamsar"
                    className="h-10 w-auto object-contain shrink-0"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const directUrl = 'https://i.postimg.cc/wT4DTrLM/Cre-un-logo-minimaliste-et-moderne-Le-design-est-une-toile-5.jpg';
                      if (target.src !== directUrl) {
                        target.src = directUrl;
                      } else {
                        target.src = '/logo-etoile.png';
                      }
                    }}
                  />
                  <span className="font-black text-[#049A5B] text-sm font-serif">
                    Direct<span className="text-amber-600">Samsar</span>
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

