import React from 'react';
import { motion } from 'framer-motion';

interface MoroccoFlagStarLogoProps {
  className?: string;
  imgClassName?: string;
  showDsLayout?: boolean;
}

/**
 * Composant Logo Header : Le drapeau marocain avec l'étoile verte.
 * Au centre de l'étoile verte, un récepteur avec layoutId="ds-letters"
 * permet aux lettres "DS" de voler depuis la maison (Écran 1) et de venir
 * se loger parfaitement à l'intérieur de l'étoile du drapeau (Écran 2)
 * grâce à Framer Motion.
 */
export const MoroccoFlagStarLogo: React.FC<MoroccoFlagStarLogoProps> = ({
  className = "relative flex items-center justify-center shrink-0",
  imgClassName = "h-7 max-h-[28px] w-auto object-contain shrink-0",
  showDsLayout = true
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Animation CSS Sinusoïdale subtile "Drapeau dans le vent" */}
      <style>{`
        @keyframes moroccoFlagWave {
          0% {
            transform: perspective(300px) rotateY(0deg) skewY(0deg) translateY(0px);
          }
          25% {
            transform: perspective(300px) rotateY(4.5deg) skewY(-2deg) translateY(-0.7px);
          }
          50% {
            transform: perspective(300px) rotateY(-3deg) skewY(1.8deg) translateY(0.5px);
          }
          75% {
            transform: perspective(300px) rotateY(3.5deg) skewY(-1.2deg) translateY(-0.3px);
          }
          100% {
            transform: perspective(300px) rotateY(0deg) skewY(0deg) translateY(0px);
          }
        }

        .flag-wind-wave {
          transform-origin: 10% 50%;
          animation: moroccoFlagWave 2.8s cubic-bezier(0.42, 0, 0.58, 1) infinite;
          will-change: transform;
        }
      `}</style>

      {/* Conteneur animé flottant au vent */}
      <div className="flag-wind-wave relative flex items-center justify-center shrink-0">
        {/* Image du drapeau marocain / étoile (hauteur restreinte à 26-28px max pour s'aligner au texte) */}
        <img
          src="https://i.postimg.cc/wT4DTrLM/Cre-un-logo-minimaliste-et-moderne-Le-design-est-une-toile-5.jpg"
          alt="Drapeau Marocain DirectSamsar"
          className={imgClassName}
          style={{ height: '26px', maxHeight: '28px', width: 'auto' }}
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== window.location.origin + '/logo-etoile.svg') {
              target.src = '/logo-etoile.svg';
            } else {
              target.src = '/logo-etoile.png';
            }
          }}
        />

        {/* Emplacement réservé au centre de l'étoile verte du drapeau avec le même layoutId */}
        {showDsLayout && (
          <motion.div
            layoutId="ds-letters"
            transition={{
              type: "spring",
              stiffness: 70,
              damping: 15,
              mass: 0.9
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10"
          >
            <div className="flex items-center justify-center scale-[0.4] sm:scale-[0.45]">
              <span className="font-serif font-black text-xs text-emerald-200 tracking-tighter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                D
              </span>
              <span className="font-serif font-black text-xs text-amber-300 tracking-tighter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                S
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
