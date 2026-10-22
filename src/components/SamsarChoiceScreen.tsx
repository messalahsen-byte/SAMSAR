import React from 'react';
import { AppHeader } from './AppHeader';
import { PageTitle } from './PageTitle';
import { Map, SlidersHorizontal, ArrowLeft, ArrowRight } from 'lucide-react';

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

      <main className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full px-4 sm:px-6 py-8 pt-20">
        <PageTitle
          title={isAr ? 'البحث عن سمسار' : 'Trouver un Samsar'}
          subtitle={
            isAr
              ? 'اختر طريقة البحث المفضلة لديك'
              : 'Choisissez votre mode de recherche'
          }
        />

        {/* 2 GRANDES CARTES / BOUTONS BIEN DISTINCTS */}
        <div className="w-full flex flex-col gap-5 mt-6">
          {/* Carte 1 : "Par Carte (Map)" */}
          <button
            type="button"
            onClick={onSelectMap}
            className="w-full bg-white hover:bg-emerald-50/40 border-2 border-stone-200 hover:border-[#006233] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl shadow-stone-200/70 hover:shadow-2xl transition-all duration-200 active:scale-[0.985] group relative overflow-hidden cursor-pointer text-left"
            dir={isAr ? 'rtl' : 'ltr'}
          >
            <div className="flex items-start justify-between w-full">
              <div className="w-14 h-14 rounded-2xl bg-[#006233] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Map className="w-7 h-7 text-white" />
              </div>

              <div className="w-10 h-10 rounded-full bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center text-emerald-800 transition">
                {isAr ? (
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                ) : (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                )}
              </div>
            </div>

            <div className="space-y-1 mt-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-[11px] font-bold uppercase tracking-wider text-emerald-900 mb-1">
                <span>{isAr ? 'تفاعلي ومباشر' : 'Géolocalisation'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight group-hover:text-[#006233] transition">
                {isAr ? '🗺️ على الخريطة (Map)' : '🗺️ Voir sur la Carte'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-medium">
                {isAr
                  ? 'استكشف مواقع السماسرة الأقرب إليك على خريطة تفاعلية'
                  : 'Localiser les Samsars de confiance directement sur la carte interactive'}
              </p>
            </div>
          </button>

          {/* Carte 2 : "Par Ville et Quartier / Liste" */}
          <button
            type="button"
            onClick={onSelectList}
            className="w-full bg-white hover:bg-orange-50/40 border-2 border-stone-200 hover:border-orange-500 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl shadow-stone-200/70 hover:shadow-2xl transition-all duration-200 active:scale-[0.985] group relative overflow-hidden cursor-pointer text-left"
            dir={isAr ? 'rtl' : 'ltr'}
          >
            <div className="flex items-start justify-between w-full">
              <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <SlidersHorizontal className="w-7 h-7 text-white" />
              </div>

              <div className="w-10 h-10 rounded-full bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center text-orange-800 transition">
                {isAr ? (
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                ) : (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                )}
              </div>
            </div>

            <div className="space-y-1 mt-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100/70 text-[11px] font-bold uppercase tracking-wider text-orange-900 mb-1">
                <span>{isAr ? 'فلاتر دقيقة' : 'Filtres & Quartiers'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight group-hover:text-orange-600 transition">
                {isAr ? '📋 حسب المدينة والحي' : '📋 Voir la Liste / Formulaire'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-medium">
                {isAr
                  ? 'قائمة مفصلة بسماسرة ثقات مع تقييمات وفلاتر حسب المدن والأحياء'
                  : 'Consulter la liste complète de nos Samsars avec filtres par ville et quartier'}
              </p>
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
