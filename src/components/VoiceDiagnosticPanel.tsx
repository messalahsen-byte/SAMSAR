import React, { useState } from 'react';

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
  // 2. Par défaut, le contenu du diagnostic doit être CACHÉ (fermé)
  const [isExpanded, setIsExpanded] = useState<boolean>(initialExpanded);
  const isAr = voiceLanguage === 'darija';

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      {/* 2. Petit lien/bouton discret en bas de la zone vocale */}
      <button 
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition cursor-pointer select-none active:scale-95"
      >
        <span>
          {isExpanded
            ? 'Masquer les détails de l\'analyse ▲'
            : 'Voir les détails de l\'analyse ▼'}
        </span>
        {isListening && (
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        )}
      </button>

      {/* 1. Fond clair : bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm */}
      {isExpanded && (
        <div 
          className="w-full mt-2.5 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm space-y-3 text-left animate-fade-in"
        >
          {/* Ligne 1 : 🎤 Phrase entendue : (titre en text-gray-700) */}
          <div className="space-y-1">
            <div className="text-xs font-bold text-gray-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span>🎤</span>
                <span>Phrase entendue :</span>
              </span>
              <span className="text-[10px] text-gray-400 font-normal">
                {voiceLanguage === 'darija' ? 'الدارجة (ar-MA)' : 'Français (fr-FR)'}
              </span>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-gray-800 font-medium break-words min-h-[34px] flex items-center shadow-2xs">
              {diagnostic.texteBrut ? (
                <span>"{diagnostic.texteBrut}"</span>
              ) : (
                <span className="text-gray-400 italic font-normal text-xs">
                  (En attente de votre voix...)
                </span>
              )}
            </div>
          </div>

          {/* Ligne 2 : 🧠 Demande comprise : (titre en text-gray-700, résultat en Orange charte) */}
          <div className="space-y-1">
            <div className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <span>🧠</span>
              <span>Demande comprise :</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-amber-600 font-semibold break-words min-h-[34px] flex items-center shadow-2xs">
              {diagnostic.texteNettoye ? (
                <span>{diagnostic.texteNettoye}</span>
              ) : (
                <span className="text-gray-400 italic font-normal text-xs">
                  (Analyse de la demande...)
                </span>
              )}
            </div>
          </div>

          {/* Ligne 3 : 🔍 Recherche effectuée : (titre en text-gray-700, résultat en Vert charte #006233) */}
          <div className="space-y-1">
            <div className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <span>🔍</span>
              <span>Recherche effectuée :</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-[#006233] font-bold break-words min-h-[34px] flex items-center shadow-2xs">
              {diagnostic.actionDeclenchee ? (
                <span>{diagnostic.actionDeclenchee}</span>
              ) : (
                <span className="text-gray-400 italic font-normal text-xs">
                  (Filtres prêts à être appliqués...)
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
