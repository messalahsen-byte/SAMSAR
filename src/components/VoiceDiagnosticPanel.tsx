import React, { useState } from 'react';
import { Mic, Sparkles, Filter, ChevronDown, ChevronUp } from 'lucide-react';

export interface VoiceDiagnosticData {
  texteBrut: string;
  texteNettoye: string;
  actionDeclenchee: string;
}

interface VoiceDiagnosticPanelProps {
  diagnostic: VoiceDiagnosticData;
  isListening?: boolean;
  initialExpanded?: boolean;
  voiceLanguage?: 'darija' | 'fr';
}

export const VoiceDiagnosticPanel: React.FC<VoiceDiagnosticPanelProps> = ({
  diagnostic,
  isListening = false,
  initialExpanded = false,
  voiceLanguage = 'darija'
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(initialExpanded);

  return (
    <div className="w-full max-w-lg mx-auto px-1 sm:px-2">
      <div className="bg-stone-900/95 backdrop-blur-md rounded-2xl border border-stone-700/80 shadow-xl overflow-hidden transition-all text-left">
        {/* En-tête du panneau élégant & repliable */}
        <button 
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-stone-950/90 border-b border-stone-800 hover:bg-stone-900/90 transition cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-emerald-400 animate-pulse' : 'bg-[#006233]'}`} />
            <span className="text-xs font-bold tracking-wide text-white">
              Diagnostic Vocal
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
              {voiceLanguage === 'darija' ? '🇲🇦 Darija' : '🇫🇷 Français'}
            </span>
            {isListening && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold animate-pulse">
                Écoute...
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-stone-400 hover:text-white transition">
            <span className="text-[10px] font-semibold text-stone-400 hidden sm:inline">
              {isExpanded ? 'Masquer' : 'Voir l\'analyse'}
            </span>
            <div className="p-1 rounded-md text-stone-400 hover:text-white">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-stone-300" />
              ) : (
                <ChevronDown className="w-4 h-4 text-stone-300" />
              )}
            </div>
          </div>
        </button>

        {/* Contenu : Les 3 lignes en temps réel */}
        {isExpanded && (
          <div className="p-3.5 space-y-2.5 text-xs animate-fade-in">
            {/* 1. LIGNE 1 : Texte brut capté */}
            <div className="bg-stone-950/80 rounded-xl p-2.5 border border-stone-800/80">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                <span className="flex items-center gap-1.5 text-[#006233] dark:text-emerald-400">
                  <Mic className="w-3.5 h-3.5" />
                  1. Texte brut capté
                </span>
                <span className="text-[10px] text-stone-500 font-mono">
                  Microphone ({voiceLanguage === 'darija' ? 'ar-MA' : 'fr-FR'})
                </span>
              </div>
              <div className="font-mono text-xs sm:text-[13px] text-emerald-300 font-bold break-words bg-black/50 px-2.5 py-1.5 rounded-lg border border-emerald-950/80 min-h-[30px] flex items-center">
                {diagnostic.texteBrut ? (
                  <span>"{diagnostic.texteBrut}"</span>
                ) : (
                  <span className="text-stone-500 italic font-normal text-[11px]">
                    (En attente d'écoute vocale...)
                  </span>
                )}
              </div>
            </div>

            {/* 2. LIGNE 2 : Traduction & Dictionnaire */}
            <div className="bg-stone-950/80 rounded-xl p-2.5 border border-stone-800/80">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                <span className="flex items-center gap-1.5 text-[#F97316]">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  2. Traduction & Détection ({voiceLanguage === 'darija' ? 'Dictionnaire Darija' : 'Dictionnaire Français'})
                </span>
              </div>
              <div className="font-mono text-xs text-orange-200 font-semibold break-words bg-black/50 px-2.5 py-1.5 rounded-lg border border-orange-950/60 min-h-[30px] flex items-center">
                {diagnostic.texteNettoye ? (
                  <span>{diagnostic.texteNettoye}</span>
                ) : (
                  <span className="text-stone-500 italic font-normal text-[11px]">
                    (Analyse syntaxique & mots-clés...)
                  </span>
                )}
              </div>
            </div>

            {/* 3. LIGNE 3 : Action déclenchée & Filtres */}
            <div className="bg-stone-950/80 rounded-xl p-2.5 border border-stone-800/80">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                <span className="flex items-center gap-1.5 text-[#C1272D] dark:text-rose-400">
                  <Filter className="w-3.5 h-3.5" />
                  3. Action déclenchée (Filtres appliqués)
                </span>
                <span className="text-[10px] text-stone-500 font-mono">
                  Reset & MAJ
                </span>
              </div>
              <div className="font-mono text-xs text-rose-200 font-bold break-words bg-black/50 px-2.5 py-1.5 rounded-lg border border-rose-950/60 min-h-[30px] flex items-center">
                {diagnostic.actionDeclenchee ? (
                  <span>{diagnostic.actionDeclenchee}</span>
                ) : (
                  <span className="text-stone-500 italic font-normal text-[11px]">
                    (En attente d'application des filtres...)
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
