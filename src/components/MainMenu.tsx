import React from 'react';
import { AppHeader } from './AppHeader';
import { useTheme } from '../context/ThemeContext';

export interface MainMenuProps {
  language?: 'fr' | 'ar';
  mode?: string;
  onNavigate: (page: string) => void;
  onBackToMode?: () => void;
  onGoHome?: () => void;
  onToggleLanguage?: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  language = 'fr',
  mode = 'classic',
  onNavigate,
  onBackToMode,
  onGoHome,
  onToggleLanguage
}) => {
  const { themeConfig } = useTheme();
  const isAr = language === 'ar';

  return (
    <div 
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-start px-6 pt-16 pb-8 font-sans"
    >
      <AppHeader
        showBackButton={true}
        onBack={onBackToMode}
        language={language}
        currentStep="home"
        onGoHome={onGoHome}
        onToggleLanguage={onToggleLanguage}
        onSelectMenuOption={(opt) => {
          if (opt === 'vocal') onNavigate('voice-search');
          else if (opt === 'samsar_choice' || opt === 'find_samsar' || opt === 'samsar-choice') onNavigate('samsar-choice');
          else if (opt === 'samsar_map' || opt === 'samsar-map') onNavigate('samsar-map');
          else if (opt === 'search_property' || opt === 'buy') onNavigate('buy');
          else if (opt === 'post_listing' || opt === 'sell') onNavigate('sell');
        }}
      />

      {/* Titre de section simple et discret */}
      <div className="w-full max-w-md pt-20 pb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          {isAr ? 'الخدمات العقارية' : 'Services Immobiliers'}
        </h1>
        <p className="text-sm text-gray-500 font-medium mt-1">
          {isAr ? 'اختر الخدمة المطلوبة للمتابعة' : 'Trouver un Samsar, acheter ou vendre un bien'}
        </p>
      </div>

      {/* MENU PRINCIPAL */}
      <div className="w-full max-w-md space-y-4">
        
        {/* CARTE 1 : TROUVER UN SAMSAR -> OUVRE TOUJOURS SAMSAR-CHOICE */}
        <button 
          type="button"
          onClick={() => onNavigate('samsar-choice')}
          className={`w-full min-h-[88px] bg-white rounded-2xl p-5 shadow-sm border-2 border-stone-200 ${themeConfig.accentHoverBorderClass} hover:shadow-lg active:scale-[0.98] transition-all flex items-center gap-4 text-start group cursor-pointer`}
          dir={isAr ? 'rtl' : 'ltr'}
        >
          <div className={`w-12 h-12 ${themeConfig.iconBgClass} ${themeConfig.iconTextClass} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-gray-900 text-lg ${themeConfig.accentHoverTextClass} transition-colors truncate`}>
              {isAr ? '1. البحث عن سمسار' : '1. Trouver un Samsar'}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5 truncate">
              {isAr ? 'سماسرة معتمدون حسب الأحياء' : 'Agents certifiés par quartier'}
            </p>
          </div>
          <svg className={`w-5 h-5 text-gray-400 ${themeConfig.arrowHoverTextClass} group-hover:translate-x-0.5 transition-all ${isAr ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* CARTE 2 : ACHETER UN BIEN */}
        <button 
          type="button"
          onClick={() => onNavigate('buy')}
          className="w-full min-h-[88px] bg-white rounded-2xl p-5 shadow-sm border-2 border-stone-200 hover:border-green-500 hover:shadow-lg active:scale-[0.98] transition-all flex items-center gap-4 text-start group cursor-pointer"
          dir={isAr ? 'rtl' : 'ltr'}
        >
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 group-hover:scale-105 transition-all">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-600 transition-colors truncate">
              {isAr ? '2. شراء عقار' : '2. Acheter un bien'}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5 truncate">
              {isAr ? 'شقق، فيلات، أراضي' : 'Appartements, villas, terrains'}
            </p>
          </div>
          <svg className={`w-5 h-5 text-gray-400 group-hover:text-green-500 group-hover:translate-x-0.5 transition-all ${isAr ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* CARTE 3 : VENDRE UN BIEN */}
        <button 
          type="button"
          onClick={() => onNavigate('sell')}
          className="w-full min-h-[88px] bg-white rounded-2xl p-5 shadow-sm border-2 border-stone-200 hover:border-red-500 hover:shadow-lg active:scale-[0.98] transition-all flex items-center gap-4 text-start group cursor-pointer"
          dir={isAr ? 'rtl' : 'ltr'}
        >
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 group-hover:scale-105 transition-all">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg group-hover:text-red-600 transition-colors truncate">
              {isAr ? '3. بيع / نشر عقار' : '3. Vendre un bien'}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5 truncate">
              {isAr ? 'انشر إعلانك بكل سهولة' : 'Publiez votre annonce'}
            </p>
          </div>
          <svg className={`w-5 h-5 text-gray-400 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all ${isAr ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

      </div>

      {/* FOOTER */}
      <div className="mt-auto pt-8 text-center">
        <p className="text-xs text-gray-400 font-medium">
          DirectSamsar Maroc • L'immobilier réinventé
        </p>
      </div>

    </div>
  );
};
