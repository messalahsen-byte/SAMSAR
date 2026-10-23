import React from 'react';
import { AppHeader } from './AppHeader';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LanguageScreenProps {
  language?: 'fr' | 'ar';
  onSelect: (lang: 'fr' | 'ar') => void;
}

export const LanguageScreen: React.FC<LanguageScreenProps> = ({ language = 'fr', onSelect }) => {
  const { themeConfig } = useTheme();

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between font-sans">
      {/* Header minimaliste avec logo pour point d'ancrage de l'animation */}
      <AppHeader
        showBackButton={false}
        language={language}
        currentStep="language"
      />

      {/* Contenu minimaliste Écran 1 */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 pt-24 pb-12 w-full max-w-md mx-auto text-center">
        {/* Logo subtil */}
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border-2 border-stone-100 mx-auto">
            <img src="/logo-etoile.png" alt="DirectSamsar" className="w-16 h-16 object-contain" />
          </div>
        </div>

        {/* Titre minimaliste exigé */}
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2">
          Bienvenue <span className={`${themeConfig.accentTextClass} font-serif transition-colors`}>/</span> مرحبا
        </h1>

        <p className="text-gray-500 text-sm mb-8 font-medium">
          Choisissez votre langue • اختر لغة الاستخدام
        </p>

        {/* Deux boutons calibrés à min-h-[88px] avec ligne descriptive harmonisée */}
        <div className="w-full space-y-4">
          <button
            type="button"
            onClick={() => onSelect('fr')}
            className={`w-full min-h-[88px] p-5 rounded-2xl bg-white border-2 border-stone-200 ${themeConfig.accentHoverBorderClass} hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-between text-start group cursor-pointer shadow-sm`}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className={`w-12 h-12 rounded-xl ${themeConfig.accentBgClass} text-2xl flex items-center justify-center ${themeConfig.accentHoverBgClass} group-hover:scale-105 transition-all shrink-0`}>
                🇫🇷
              </div>
              <div className="text-start min-w-0">
                <h3 className={`font-bold text-gray-900 text-lg ${themeConfig.accentHoverTextClass} transition-colors truncate`}>
                  Français
                </h3>
                <p className="text-sm text-gray-500 mt-0.5 truncate">
                  Continuer en langue française
                </p>
              </div>
            </div>
            <ArrowRight className={`w-5 h-5 text-gray-400 ${themeConfig.arrowHoverTextClass} group-hover:translate-x-0.5 transition-all shrink-0`} />
          </button>

          <button
            type="button"
            onClick={() => onSelect('ar')}
            className={`w-full min-h-[88px] p-5 rounded-2xl bg-white border-2 border-stone-200 ${themeConfig.accentHoverBorderClass} hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-between text-start group cursor-pointer shadow-sm`}
            dir="rtl"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className={`w-12 h-12 rounded-xl ${themeConfig.accentBgClass} text-2xl flex items-center justify-center ${themeConfig.accentHoverBgClass} group-hover:scale-105 transition-all shrink-0`}>
                🇲🇦
              </div>
              <div className="text-start min-w-0">
                <h3 className={`font-bold text-gray-900 text-lg ${themeConfig.accentHoverTextClass} transition-colors truncate`}>
                  العربية
                </h3>
                <p className="text-sm text-gray-500 mt-0.5 truncate">
                  المتابعة باللغة العربية
                </p>
              </div>
            </div>
            <ArrowLeft className={`w-5 h-5 text-gray-400 ${themeConfig.arrowHoverTextClass} group-hover:-translate-x-0.5 transition-all shrink-0`} />
          </button>
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-gray-400 font-medium">
        DirectSamsar Maroc • L'immobilier réinventé
      </footer>
    </div>
  );
};
