import React from 'react';
import { AppHeader } from './AppHeader';
import { Map, SlidersHorizontal, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface SamsarChoiceScreenProps {
  language?: 'fr' | 'ar';
  onBack: () => void;
  onGoHome?: () => void;
  onSelectMap: () => void;
  onSelectList: () => void;
}

export const SamsarChoiceScreen: React.FC<SamsarChoiceScreenProps> = ({
  language = 'fr',
  onBack,
  onGoHome,
  onSelectMap,
  onSelectList
}) => {
  const { themeConfig } = useTheme();
  const isAr = language === 'ar';

  return (
    <div 
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between font-sans"
    >
      <AppHeader
        showBackButton={true}
        onBack={onBack}
        language={language}
        showHomeButton={true}
        onGoHome={onGoHome || onBack}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-6 pt-24 pb-12 w-full max-w-md mx-auto text-center">
        {/* Titre épuré harmonisé avec ModeScreen et MainMenu */}
        <div className="w-full mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {isAr ? 'البحث عن سمسار' : 'Trouver un Samsar'}
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            {isAr
              ? 'اختر طريقة البحث المفضلة لديك'
              : 'Choisissez votre mode de recherche'}
          </p>
        </div>

        {/* 2 BOUTONS HARMONISÉS DE TAILLE STANDARD (1 SEULE LIGNE DE DESCRIPTION CHACUN) */}
        <div className="w-full space-y-4">
          {/* Bouton 1 : "Voir sur la Carte" */}
          <button
            type="button"
            onClick={onSelectMap}
            className="w-full min-h-[88px] bg-white rounded-2xl p-5 shadow-sm border-2 border-stone-200 hover:border-[#006233] hover:shadow-lg active:scale-[0.98] transition-all flex items-center gap-4 text-start group cursor-pointer"
            dir={isAr ? 'rtl' : 'ltr'}
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 group-hover:scale-105 transition-all">
              <Map className="w-6 h-6 text-[#006233]" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#006233] transition-colors truncate">
                {isAr ? '1. على الخريطة (GPS)' : '1. Voir sur la Carte'}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5 truncate">
                {isAr
                  ? 'خريطة تفاعلية وموقع GPS'
                  : 'Carte interactive & GPS'}
              </p>
            </div>

            <div className="shrink-0 text-gray-400 group-hover:text-[#006233] group-hover:translate-x-0.5 transition-all">
              {isAr ? (
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              ) : (
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              )}
            </div>
          </button>

          {/* Bouton 2 : "Voir la Liste / Formulaire" */}
          <button
            type="button"
            onClick={onSelectList}
            className={`w-full min-h-[88px] bg-white rounded-2xl p-5 shadow-sm border-2 border-stone-200 ${themeConfig.accentHoverBorderClass} hover:shadow-lg active:scale-[0.98] transition-all flex items-center gap-4 text-start group cursor-pointer`}
            dir={isAr ? 'rtl' : 'ltr'}
          >
            <div className={`w-12 h-12 ${themeConfig.iconBgClass} ${themeConfig.iconTextClass} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all`}>
              <SlidersHorizontal className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-gray-900 text-lg ${themeConfig.accentHoverTextClass} transition-colors truncate`}>
                {isAr ? '2. حسب المدينة والحي' : '2. Voir la Liste / Formulaire'}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5 truncate">
                {isAr
                  ? 'بحث حسب المدينة والحي'
                  : 'Recherche par ville et quartier'}
              </p>
            </div>

            <div className={`shrink-0 text-gray-400 ${themeConfig.arrowHoverTextClass} group-hover:translate-x-0.5 transition-all`}>
              {isAr ? (
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              ) : (
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              )}
            </div>
          </button>
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-gray-400 font-medium">
        DirectSamsar Maroc • L'immobilier réinventé
      </footer>
    </div>
  );
};
