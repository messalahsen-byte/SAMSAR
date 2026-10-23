import React, { useState } from 'react';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { Palette, Check, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside 
      aria-label="Sélecteur de palette graphique"
      className="fixed bottom-4 right-4 z-50 font-sans select-none"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-200/80 p-2 sm:p-2.5 transition-all">
        {/* En-tête compact du sélecteur */}
        <div className="flex items-center justify-between gap-3 px-2 py-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
            <Palette className="w-3.5 h-3.5 text-amber-500" />
            <span>Harmonie & Couleurs</span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-stone-400 hover:text-stone-600 p-0.5 rounded transition"
            title={isOpen ? "Réduire le sélecteur" : "Ouvrir le sélecteur"}
          >
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {isOpen && (
          <div className="mt-2 flex flex-col gap-1.5 min-w-[240px]">
            {/* Option 1 : Émeraude Royal & Or Atlas */}
            <button
              type="button"
              onClick={() => setTheme('emerald-gold')}
              className={`flex items-center justify-between p-2 rounded-xl text-left transition-all border ${
                theme === 'emerald-gold'
                  ? 'bg-emerald-50/70 border-emerald-500/40 shadow-sm'
                  : 'bg-stone-50/60 border-transparent hover:bg-stone-100/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {/* Pastilles de couleur */}
                <div className="flex -space-x-1.5 shrink-0">
                  <span className="w-4 h-4 rounded-full bg-[#004d40] ring-2 ring-white shadow-xs" title="Vert Émeraude (#004d40)" />
                  <span className="w-4 h-4 rounded-full bg-[#D4AF37] ring-2 ring-white shadow-xs" title="Or Atlas (#D4AF37)" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1">
                    Option 1 : Émeraude & Or
                    {theme === 'emerald-gold' && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-semibold">
                        Actif
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    Prestige, confiance & ADN marocain
                  </div>
                </div>
              </div>

              {theme === 'emerald-gold' && (
                <Check className="w-4 h-4 text-emerald-700 shrink-0 ml-2" />
              )}
            </button>

            {/* Option 2 : Terre d'Ocre & Bleu Majorelle */}
            <button
              type="button"
              onClick={() => setTheme('ochre-majorelle')}
              className={`flex items-center justify-between p-2 rounded-xl text-left transition-all border ${
                theme === 'ochre-majorelle'
                  ? 'bg-orange-50/70 border-orange-500/40 shadow-sm'
                  : 'bg-stone-50/60 border-transparent hover:bg-stone-100/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {/* Pastilles de couleur */}
                <div className="flex -space-x-1.5 shrink-0">
                  <span className="w-4 h-4 rounded-full bg-[#EA580C] ring-2 ring-white shadow-xs" title="Terre d'Ocre (#EA580C)" />
                  <span className="w-4 h-4 rounded-full bg-[#1E293B] ring-2 ring-white shadow-xs" title="Bleu Nuit (#1E293B)" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1">
                    Option 2 : Terre d'Ocre
                    {theme === 'ochre-majorelle' && (
                      <span className="text-[10px] bg-orange-100 text-orange-800 px-1 py-0.2 rounded font-semibold">
                        Actif
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-500">
                    Chaleur moderne & contemporaine
                  </div>
                </div>
              </div>

              {theme === 'ochre-majorelle' && (
                <Check className="w-4 h-4 text-orange-600 shrink-0 ml-2" />
              )}
            </button>

            {/* Micro indication */}
            <div className="px-1 pt-1 text-[10px] text-stone-400 text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Cliquez pour basculer instantanément</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
