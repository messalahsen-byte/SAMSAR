import React, { useState } from 'react';
import { ArrowLeft, X, Mic, Home, User, Search, PlusCircle, MapPin, Globe } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export interface AppHeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
  language?: 'ar' | 'fr';
  onToggleLanguage?: () => void;
  onSelectMenuOption?: (option: string) => void;
  currentStep?: 'language' | 'mode' | 'home' | string;
  subPage?: string | null;
  showHomeButton?: boolean;
  onGoHome?: () => void;
  setCurrentStep?: (step: 'language' | 'mode' | 'home') => void;
  setSubPage?: (page: string | null) => void;
  setSelectedLang?: (lang: 'fr' | 'ar' | string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  showBackButton = false,
  onBack,
  language = 'fr',
  onToggleLanguage,
  onSelectMenuOption,
  currentStep,
  subPage,
  showHomeButton,
  onGoHome,
  setCurrentStep,
  setSubPage,
  setSelectedLang
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAr = language === 'ar';

  const handleMenuClick = (option: string) => {
    setIsMenuOpen(false);
    if (onSelectMenuOption) {
      onSelectMenuOption(option);
    }
  };

  const handleHomeReset = () => {
    if (setCurrentStep) setCurrentStep('language');
    if (setSubPage) setSubPage(null);
    if (setSelectedLang) setSelectedLang('fr');
    if (onGoHome) onGoHome();
  };

  const shouldDisplayHomeButton = showHomeButton !== undefined
    ? showHomeButton
    : (currentStep === 'home');

  return (
    <header className="w-full h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 shadow-sm fixed top-0 left-0 z-50">
      {/* GAUCHE : Logo DIRECTSAMSAR avec sigle étoile (et bouton retour si actif) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {showBackButton && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 text-gray-700 hover:text-gray-950 font-bold text-sm sm:text-base transition active:scale-95 cursor-pointer py-1.5 px-1 select-none"
            title="Retour"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 stroke-[2.5]" />
            <span className="hidden sm:inline text-xs font-semibold">{isAr ? 'رجوع' : 'Retour'}</span>
          </button>
        )}

        <div 
          id="app-header-logo"
          onClick={onBack}
          className="flex items-center gap-2 select-none cursor-pointer hover:opacity-90 active:scale-98 transition"
        >
          <img 
            src="/logo-etoile.png" 
            alt="DirectSamsar" 
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain shrink-0" 
          />
          <span className="text-xl font-bold tracking-tight text-stone-900 font-serif">
            DIRECT<span className="text-orange-500">SAMSAR</span>
          </span>
        </div>
      </div>

      {/* DROITE : BOUTON ACCUEIL ENTRE LOGO ET MENU HAMBURGER + BOUTON HAMBURGER */}
      <div className="flex items-center gap-1 sm:gap-2">
        {shouldDisplayHomeButton && (
          <button
            type="button"
            onClick={handleHomeReset}
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

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg text-stone-800 hover:text-stone-950 hover:bg-gray-100 transition active:scale-95 cursor-pointer flex items-center justify-center"
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-stone-800 stroke-[2]" />
            ) : (
              <svg className="w-6 h-6 text-stone-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

        {/* Dropdown Menu Flottant */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" 
                onClick={() => setIsMenuOpen(false)} 
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2.5 right-0 w-64 bg-white rounded-3xl shadow-2xl border border-stone-200/90 p-2 z-50 space-y-1 font-sans text-left"
                dir={isAr ? 'rtl' : 'ltr'}
              >
                <div className="px-3 py-2 border-b border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-stone-400">
                    {isAr ? 'القائمة الرئيسية' : 'Menu Principal'}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-stone-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Mode Vocal */}
                <button
                  type="button"
                  onClick={() => handleMenuClick('vocal')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                    currentStep === 'vocal' 
                      ? 'bg-emerald-50 text-[#006233] font-black' 
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Mic className="w-4 h-4 text-[#006233] shrink-0" />
                  <span>{isAr ? 'البحث الصوتي 🎤' : 'Mode Vocal 🎤'}</span>
                </button>

                {/* Mode Classique */}
                <button
                  type="button"
                  onClick={() => handleMenuClick('classic')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                    currentStep === 'classic' 
                      ? 'bg-amber-50 text-amber-900 font-black' 
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Home className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{isAr ? 'القائمة الرئيسية' : 'Mode Classique (Menu)'}</span>
                </button>

                {/* Trouver un Samsar */}
                <button
                  type="button"
                  onClick={() => handleMenuClick('find_samsar')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                    currentStep === 'samsar_choice' || currentStep === 'find_samsar'
                      ? 'bg-amber-50 text-amber-900 font-black' 
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <User className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{isAr ? 'سماسرتنا المعتمدون' : 'Trouver un Samsar'}</span>
                </button>

                {/* Carte des Samsars */}
                <button
                  type="button"
                  onClick={() => handleMenuClick('samsar_map')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer text-stone-700 hover:bg-stone-50"
                >
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{isAr ? 'خريطة السماسرة' : 'Carte des Samsars'}</span>
                </button>

                {/* Acheter */}
                <button
                  type="button"
                  onClick={() => handleMenuClick('search_property')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                    currentStep === 'search_property' 
                      ? 'bg-emerald-50 text-[#006233] font-black' 
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Search className="w-4 h-4 text-[#006233] shrink-0" />
                  <span>{isAr ? 'شراء عقار' : 'Acheter un bien'}</span>
                </button>

                {/* Vendre */}
                <button
                  type="button"
                  onClick={() => handleMenuClick('post_listing')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                    currentStep === 'post_listing' 
                      ? 'bg-amber-50 text-amber-900 font-black' 
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{isAr ? 'نشر عقاري (بيع / كراء)' : 'Déposer mon bien (Vendre)'}</span>
                </button>

                {/* Option discrète de changement de langue dans le menu si besoin */}
                {onToggleLanguage && (
                  <div className="pt-1.5 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onToggleLanguage();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-stone-500" />
                        <span>{isAr ? 'اللغة' : 'Langue'}</span>
                      </span>
                      <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                        {isAr ? 'Passer en Français 🇫🇷' : 'التحويل للعربية 🇲🇦'}
                      </span>
                    </button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
