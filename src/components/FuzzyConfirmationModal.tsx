import React, { useEffect } from 'react';
import { Volume2, AlertCircle, X, Check, HelpCircle } from 'lucide-react';
import { FuzzyCandidate } from '../utils/fuzzyMatch';

export interface FuzzyConfirmationModalProps {
  isOpen: boolean;
  originalWord: string;
  originalSentence?: string;
  candidates: FuzzyCandidate[];
  onSelectCandidate: (candidate: FuzzyCandidate) => void;
  onCancel: () => void;
  language?: 'fr' | 'ar';
}

export const FuzzyConfirmationModal: React.FC<FuzzyConfirmationModalProps> = ({
  isOpen,
  originalWord,
  originalSentence,
  candidates,
  onSelectCandidate,
  onCancel,
  language = 'fr'
}) => {
  const isAr = language === 'ar';

  const speakPrompt = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const topWord = candidates[0]?.label || candidates[0]?.word || '';
    const textToSpeak = isAr
      ? `لم أفهم جيدا كلمة "${originalWord}". هل تقصد "${topWord}"؟`
      : `Je n'ai pas bien compris "${originalWord}". Vouliez-vous dire "${topWord}" ?`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = isAr ? 'ar-MA' : 'fr-FR';
    utterance.rate = 0.9;

    const voices = window.speechSynthesis.getVoices();
    if (isAr) {
      const arVoice = voices.find(v => v.lang.toLowerCase() === 'ar-ma' || v.lang.startsWith('ar'));
      if (arVoice) utterance.voice = arVoice;
    } else {
      const frVoice = voices.find(v => v.lang.startsWith('fr'));
      if (frVoice) utterance.voice = frVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isOpen && candidates.length > 0) {
      speakPrompt();
    }
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen, originalWord, candidates]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[3px] animate-fade-in"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all p-5 sm:p-6"
        role="dialog"
        aria-modal="true"
      >
        {/* En-tête vert DirectSamsar */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#049A5B]/10 border border-[#049A5B]/20 flex items-center justify-center text-[#049A5B] shrink-0">
              <HelpCircle className="w-5 h-5 text-[#049A5B]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
                {isAr ? 'تأكيد الكلمة المنطوقة' : 'Précision vocale'}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {isAr ? 'ساعدنا في تأكيد ما تقصده' : 'DirectSamsar a un léger doute'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition cursor-pointer"
            title={isAr ? 'إغلاق' : 'Fermer'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question & Mot entendu */}
        <div className="py-4 space-y-2.5 text-center sm:text-left">
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {isAr ? 'الكلمة الملتقطة :' : 'Mot entendu :'} <span className="font-black underline decoration-amber-500 text-stone-900">"{originalWord}"</span>
              </span>
            </div>
            <button
              type="button"
              onClick={speakPrompt}
              className="p-1.5 bg-white text-stone-600 hover:text-[#049A5B] border border-amber-200 rounded-xl shadow-2xs hover:shadow-xs transition cursor-pointer shrink-0"
              title={isAr ? 'إعادة الاستماع' : 'Réécouter la question'}
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 font-medium px-1">
            {isAr
              ? 'هل كنت تقصد أحد الخيارات التالية ؟'
              : 'Vouliez-vous dire l\'une de ces suggestions ?'}
          </p>
        </div>

        {/* Liste des 2 ou 3 candidats avec score de similarité */}
        <div className="space-y-2.5">
          {candidates.slice(0, 3).map((candidate, idx) => (
            <button
              key={`${candidate.word}-${idx}`}
              type="button"
              onClick={() => onSelectCandidate(candidate)}
              className="w-full flex items-center justify-between p-3.5 bg-stone-50 hover:bg-[#049A5B]/5 border-2 border-stone-200/80 hover:border-[#049A5B] rounded-2xl transition-all duration-150 active:scale-[0.98] cursor-pointer group text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white border border-stone-200 group-hover:border-[#049A5B] flex items-center justify-center text-xs font-bold text-stone-700 group-hover:text-[#049A5B] transition-colors">
                  {idx + 1}
                </div>
                <div>
                  <div className="text-sm font-bold text-stone-900 group-hover:text-[#049A5B] capitalize transition-colors">
                    {candidate.label || candidate.word}
                  </div>
                  {candidate.category && (
                    <div className="text-[10px] text-stone-400 font-medium">
                      {candidate.category === 'city' && (isAr ? 'مدينة' : 'Ville')}
                      {candidate.category === 'type' && (isAr ? 'نوع العقار' : 'Type de bien')}
                      {candidate.category === 'operation' && (isAr ? 'العملية' : 'Opération')}
                      {candidate.category === 'quarter' && (isAr ? 'حي' : 'Quartier')}
                    </div>
                  )}
                </div>
              </div>

              {/* Badge de pourcentage de similitude */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100/80 text-[#049A5B] border border-emerald-200 shadow-2xs">
                  {candidate.score}%
                </span>
                <Check className="w-4 h-4 text-[#049A5B] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>

        {/* Bouton d'annulation "Aucun de ces choix" */}
        <div className="pt-4 mt-3 border-t border-stone-100">
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-2xl transition cursor-pointer text-center"
          >
            {isAr ? '✖ لا شيء مما سبق (إلغاء)' : '✖ Aucun de ces choix'}
          </button>
        </div>
      </div>
    </div>
  );
};
