import React from 'react';
import { AppHeader } from './AppHeader';
import { Mic, Keyboard, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ModeScreenProps {
  language?: string;
  onSelect: (mode: 'vocal' | 'classic') => void;
  onBack?: () => void;
  onToggleLanguage?: () => void;
}

export const ModeScreen: React.FC<ModeScreenProps> = ({
  language = 'fr',
  onSelect,
  onBack,
  onToggleLanguage
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
        language={isAr ? 'ar' : 'fr'}
        onToggleLanguage={onToggleLanguage}
        currentStep="mode"
      />

      <main className="flex-1 flex flex-col items-center justify-center p-6 pt-24 pb-12 w-full max-w-md mx-auto text-center">
        {/* Titre minimaliste exigé */}
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
          {isAr ? 'كيف تفضل البحث ؟' : 'Comment souhaitez-vous chercher ?'}
        </h1>
        <p className="text-gray-500 text-sm mb-8 font-medium">
          {isAr 
            ? 'اختر طريقة التفاعل المفضلة لديك' 
            : 'Choisissez votre mode de navigation préféré'}
        </p>

        {/* Deux options cliquables calibrées à min-h-[88px] */}
        <div className="w-full space-y-4">
          {/* Option 1 : Mode Vocal */}
          <button
            type="button"
            onClick={() => onSelect('vocal')}
            className={`w-full min-h-[88px] p-5 rounded-2xl bg-white border-2 border-stone-200 ${themeConfig.accentHoverBorderClass} hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-between text-start group cursor-pointer shadow-sm`}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className={`w-12 h-12 rounded-xl ${themeConfig.iconBgClass} ${themeConfig.iconTextClass} flex items-center justify-center group-hover:scale-105 transition-all shrink-0`}>
                <Mic className="w-6 h-6" />
              </div>
              <div className="text-start min-w-0" dir={isAr ? 'rtl' : 'ltr'}>
                <h3 className={`font-bold text-gray-900 text-lg ${themeConfig.accentHoverTextClass} transition-colors truncate`}>
                  {isAr ? '🎤 الوضع الصوتي (ميكروفون)' : '🎤 Mode Vocal (Microphone)'}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5 truncate">
                  {isAr ? 'تحدث بالدارجة أو بالفرنسية' : 'Parlez en Darija ou en Français'}
                </p>
              </div>
            </div>
            {isAr ? (
              <ArrowLeft className={`w-5 h-5 text-gray-400 ${themeConfig.arrowHoverTextClass} group-hover:-translate-x-0.5 transition-all shrink-0`} />
            ) : (
              <ArrowRight className={`w-5 h-5 text-gray-400 ${themeConfig.arrowHoverTextClass} group-hover:translate-x-0.5 transition-all shrink-0`} />
            )}
          </button>

          {/* Option 2 : Mode Classique */}
          <button
            type="button"
            onClick={() => onSelect('classic')}
            className={`w-full min-h-[88px] p-5 rounded-2xl bg-white border-2 border-stone-200 ${themeConfig.accentHoverBorderClass} hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-between text-start group cursor-pointer shadow-sm`}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-stone-200 group-hover:scale-105 transition-all shrink-0">
                <Keyboard className="w-6 h-6" />
              </div>
              <div className="text-start min-w-0" dir={isAr ? 'rtl' : 'ltr'}>
                <h3 className={`font-bold text-gray-900 text-lg ${themeConfig.accentHoverTextClass} transition-colors truncate`}>
                  {isAr ? '⌨️ الوضع الكلاسيكي (نص)' : '⌨️ Mode Classique (Texte)'}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5 truncate">
                  {isAr ? 'تصفح القوائم والمعايير' : 'Recherche par menus & filtres'}
                </p>
              </div>
            </div>
            {isAr ? (
              <ArrowLeft className={`w-5 h-5 text-gray-400 ${themeConfig.arrowHoverTextClass} group-hover:-translate-x-0.5 transition-all shrink-0`} />
            ) : (
              <ArrowRight className={`w-5 h-5 text-gray-400 ${themeConfig.arrowHoverTextClass} group-hover:translate-x-0.5 transition-all shrink-0`} />
            )}
          </button>
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-gray-400 font-medium">
        DirectSamsar Maroc • L'immobilier réinventé
      </footer>
    </div>
  );
};
