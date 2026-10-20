import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// ⚙️ CONFIGURATION DU SPLASH SCREEN (POUR VOUS ET VOTRE FILS)
// ============================================================================

/**
 * ⏱️ 1. DURÉE D'AFFICHAGE DU SPLASH SCREEN (en millisecondes)
 * Par défaut : 3000 ms = exactement 3 secondes.
 * - Pour 4 secondes : mettez 4000
 * - Pour 2 secondes : mettez 2000
 */
export const SPLASH_DURATION_MS = 3000;

/**
 * 🔘 2. ACTIVER OU DÉSACTIVER LE SPLASH SCREEN
 * - Mettez à 'true' : splash screen actif (3 secondes au démarrage).
 * - Mettez à 'false' : désactive le splash pour tester plus vite.
 */
export const IS_SPLASH_ENABLED = true;

/**
 * 📁 3. FUTUR FICHIER LOTTIE DU FREELANCE
 * Dès que le freelance livre son fichier :
 * 1. Collez-le dans /public/animations/ (ex: /public/animations/logo-animation.json)
 * 2. La librairie 'lottie-react' est déjà installée dans le projet.
 */
export const LOTTIE_FILE_PATH = '/animations/logo-animation.json';

// ============================================================================

interface SplashScreenProps {
  onFinish?: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = SPLASH_DURATION_MS
}) => {
  const [isFinished, setIsFinished] = useState(false);

  // Minuteur automatique de 3 secondes avant de basculer vers l'application
  useEffect(() => {
    if (!IS_SPLASH_ENABLED) {
      onFinish?.();
      return;
    }

    const timer = setTimeout(() => {
      setIsFinished(true);
      onFinish?.();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onFinish]);

  // Possibilité de passer le splash screen en 1 clic
  const handleSkip = () => {
    setIsFinished(true);
    onFinish?.();
  };

  if (isFinished || !IS_SPLASH_ENABLED) {
    return null;
  }

  return (
    <motion.div
      key="directsamsar-splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-between overflow-hidden font-sans select-none"
      style={{
        // Fond rouge officiel (#C1272D) avec un dégradé chaleureux
        background: 'linear-gradient(180deg, #C1272D 0%, #A81E23 65%, #8B181C 82%, #B8894A 100%)'
      }}
    >
      {/* Bouton pour passer rapidement l'animation si besoin */}
      <div className="w-full p-4 flex justify-end items-center z-50">
        <button
          type="button"
          onClick={handleSkip}
          className="text-white/80 hover:text-white text-xs font-semibold px-3.5 py-1.5 rounded-full bg-black/25 hover:bg-black/40 backdrop-blur-md border border-white/10 transition active:scale-95 cursor-pointer"
        >
          Passer ›
        </button>
      </div>

      {/* Halo lumineux d'ambiance marocain */}
      <div className="absolute inset-0 bg-radial from-amber-400/20 via-transparent to-black/35 pointer-events-none" />

      {/* Conteneur central : La Maison Rouge avec les lettres D et S */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 w-full max-w-sm sm:max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0.82, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 140,
            damping: 16,
            duration: 0.7
          }}
          className="relative flex flex-col items-center justify-center"
        >
          {/* Lueur dorée sous la maison */}
          <div className="absolute -inset-4 bg-amber-400/25 rounded-3xl blur-2xl pointer-events-none" />

          {/* Maison avec toit vert marocain et lettres D et S */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl bg-white/10 backdrop-blur-md border border-white/25 shadow-2xl p-4 flex flex-col items-center justify-center">
            
            {/* SVG Maison restaurée avec Toit vert (#006233) et lettres D (#006233) et S (#F97316) */}
            <svg
              viewBox="0 0 512 512"
              className="w-full h-full drop-shadow-xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Structure de la maison */}
              <g id="house-structure">
                {/* Toit vert marocain (#006233) */}
                <polygon
                  points="256,65 440,210 384,210 256,108 128,210 72,210"
                  fill="#006233"
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
                />
                <path
                  d="M256 65 L440 210 L384 210 L256 108 L128 210 L72 210 Z"
                  fill="#006233"
                />

                {/* Murs et contours de la maison en blanc net */}
                <path
                  d="M136 210 V420 H376 V210"
                  fill="#FFFFFF"
                  fillOpacity="0.08"
                  stroke="#FFFFFF"
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Petite ligne de seuil / base */}
                <line
                  x1="110"
                  y1="420"
                  x2="402"
                  y2="420"
                  stroke="#FFFFFF"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
              </g>

              {/* Lettres DS à l'intérieur de la maison */}
              <g
                fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
                fontWeight="900"
                fontSize="148"
              >
                {/* Lettre D en Vert Marocain (#006233) */}
                <text
                  x="180"
                  y="360"
                  fill="#006233"
                  stroke="#FFFFFF"
                  strokeWidth="8"
                  paintOrder="stroke fill"
                  textAnchor="middle"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))"
                >
                  D
                </text>

                {/* Lettre S en Orange Marocain (#F97316) */}
                <text
                  x="332"
                  y="360"
                  fill="#F97316"
                  stroke="#FFFFFF"
                  strokeWidth="8"
                  paintOrder="stroke fill"
                  textAnchor="middle"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.4))"
                >
                  S
                </text>
              </g>
            </svg>
          </div>
        </motion.div>

        {/* Titre & Typographie DIRECTSAMSAR */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="text-center mt-7 space-y-1.5"
        >
          <h1 className="text-3xl sm:text-4xl font-black text-white font-serif tracking-tight drop-shadow-lg">
            DIRECT<span className="text-amber-300">SAMSAR</span>
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90 font-medium tracking-wide">
            L'immobilier marocain • 100% Direct & Transparent
          </p>
        </motion.div>
      </div>

      {/* Bas de page avec indicateur discret et nuance sableuse */}
      <div className="relative z-10 pb-7 text-center">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/25 backdrop-blur-sm text-[11px] text-amber-100/90 border border-white/10 font-semibold shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Chargement de DirectSamsar...</span>
        </div>
      </div>
    </motion.div>
  );
};
