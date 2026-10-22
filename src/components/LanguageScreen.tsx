import React from 'react';
import { AppHeader } from './AppHeader';

interface LanguageScreenProps {
  onSelect: (lang: 'fr' | 'ar') => void;
}

export const LanguageScreen: React.FC<LanguageScreenProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between font-sans">
      {/* Header minimaliste avec logo pour point d'ancrage de l'animation */}
      <AppHeader
        showBackButton={false}
        language="fr"
      />

      {/* Contenu minimaliste Écran 1 */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 pt-24 pb-12 w-full max-w-md mx-auto text-center">
        {/* Logo subtil */}
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border-2 border-orange-100 mx-auto overflow-hidden">
            <img src="/logo-etoile.png" alt="DirectSamsar" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Titre minimaliste exigé */}
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2">
          Bienvenue <span className="text-orange-500 font-serif">/</span> مرحبا
        </h1>

        <p className="text-gray-500 text-sm mb-10 font-medium">
          Choisissez votre langue • اختر لغة الاستخدام
        </p>

        {/* Deux gros boutons centrés */}
        <div className="w-full space-y-4">
          <button
            type="button"
            onClick={() => onSelect('fr')}
            className="w-full p-5 min-h-[92px] rounded-2xl bg-white border-2 border-stone-200 hover:border-orange-500 hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-between text-stone-900 font-bold text-xl cursor-pointer group shadow-sm"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">🇫🇷</span>
              <span className="group-hover:text-orange-600 transition-colors">Français</span>
            </div>
            <span className="text-xs font-semibold text-gray-400 group-hover:text-orange-500 transition-colors">Continuer →</span>
          </button>

          <button
            type="button"
            onClick={() => onSelect('ar')}
            className="w-full p-5 min-h-[92px] rounded-2xl bg-white border-2 border-stone-200 hover:border-orange-500 hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-between text-stone-900 font-bold text-xl cursor-pointer group shadow-sm"
            dir="rtl"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">🇲🇦</span>
              <span className="group-hover:text-orange-600 transition-colors">العربية</span>
            </div>
            <span className="text-xs font-semibold text-gray-400 group-hover:text-orange-500 transition-colors">متابعة ←</span>
          </button>
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-gray-400 font-medium">
        DirectSamsar Maroc • L'immobilier réinventé
      </footer>
    </div>
  );
};
