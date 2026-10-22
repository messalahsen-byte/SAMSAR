import React, { useEffect, useRef, useState } from 'react';
import fondAnimImg from '/fond-anim.jpg';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // - 0s à 1.3s   : Dézoom cinématique géant du Logo Maison (scale 4 -> scale 1)
  // - 0s à 2.8s   : Parallaxe douce et souffle vivant sur les dunes (/fond-anim.jpg)
  // - 1.5s        : La grande vague d'énergie démarre de la gauche
  // - 1.54s       : Impact instantané : le bord de la vague frappe le logo et déclenche la rotation 3D sans délai
  // - 1.74s       : L'Étoile entre en rotation 3D propulsée par le cœur de la vague + onde morphRing dorée
  // - 1.95s       : Stabilisation de l'Étoile au centre pendant que la vague termine à droite
  // - 2.1s        : Déclenchement du fondu global (Fade Out 700ms)
  // - 2.8s        : La vague s'efface à droite, l'accueil est déjà entièrement dévoilé, appel de onFinish()
  const [hasEntered, setHasEntered] = useState(false);
  const [isWaveActive, setIsWaveActive] = useState(false);
  const [flipStep, setFlipStep] = useState<'idle' | 'flippingOut' | 'flippingIn' | 'settled'>('idle');
  const [morphRingActive, setMorphRingActive] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [progress, setProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Bloque le défilement de la page sur mobile/web et applique le fond de sécurité sable
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyTouchAction = document.body.style.touchAction;
    const originalBg = document.body.style.backgroundColor;

    // Bloque le défilement sur body et html + fond sable/doré d'urgence
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.body.style.backgroundColor = '#eab308';

    // Libère le défilement et restaure le fond à la destruction du composant
    return () => {
      document.body.style.overflow = originalBodyOverflow || 'unset';
      document.documentElement.style.overflow = originalHtmlOverflow || 'unset';
      document.body.style.touchAction = originalBodyTouchAction || 'unset';
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  // 1. Canvas de particules dorées & émeraudes (subtiles, préservant la netteté du fond)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      alpha: number;
      alphaSpeed: number;
      vx: number;
      vy: number;
      wobbleSpeed: number;
      wobbleAngle: number;
    }

    const goldColors = ['#EABF52', '#FDE047', '#F59E0B', '#FACC15'];
    const emeraldColors = ['#10B981', '#059669', '#34D399'];

    const particleCount = Math.min(44, Math.max(20, Math.floor((width * height) / 21000)));
    const particles: Particle[] = Array.from({ length: particleCount }, () => {
      const isGold = Math.random() > 0.35;
      const palette = isGold ? goldColors : emeraldColors;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 1.0,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: Math.random() * 0.45 + 0.2,
        alphaSpeed: (Math.random() * 0.015 + 0.008) * (Math.random() > 0.5 ? 1 : -1),
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.35 + 0.2), // Flottement ascendant doux
        wobbleSpeed: Math.random() * 0.02 + 0.01,
        wobbleAngle: Math.random() * Math.PI * 2,
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.wobbleAngle += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobbleAngle) * 0.3;
        p.y += p.vy;

        p.alpha += p.alphaSpeed;
        if (p.alpha >= 0.75 || p.alpha <= 0.15) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 2. Barre de progression continue dorée (0s à 2.1s)
  useEffect(() => {
    let startTime: number | null = null;
    const duration = 2100;

    let animId: number;
    const updateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed < duration) {
        animId = requestAnimationFrame(updateProgress);
      }
    };

    animId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animId);
  }, []);

  // 3. Chronologie synchronisée : Dézoom initial -> Vague d'énergie -> Rotation 3D -> Fondu global
  useEffect(() => {
    // 0s à 40ms : Déclenchement du dézoom cinématique (scale 4 -> scale 1 en 1200ms)
    const enterTimer = setTimeout(() => {
      setHasEntered(true);
    }, 40);

    // 1.5s : La grande vague d'énergie démarre de la gauche
    const waveTimer = setTimeout(() => {
      setIsWaveActive(true);
    }, 1500);

    // 1.54s : Impact instantané : dès que le bord de la vague percute le logo, déclenchement immédiat de la rotation 3D
    const flipOutTimer = setTimeout(() => {
      setFlipStep('flippingOut');
    }, 1540);

    // 1.74s : L'Étoile entre en rotation 3D propulsée par le cœur de la vague + onde morphRing dorée
    const flipInTimer = setTimeout(() => {
      setFlipStep('flippingIn');
      setMorphRingActive(true);
    }, 1740);

    // 1.95s : Stabilisation de l'Étoile au centre pendant que la vague continue vers la droite
    const settleTimer = setTimeout(() => {
      setFlipStep('settled');
    }, 1950);

    // 2.1s : Déclenche immédiatement le fondu de sortie global pendant que la vague termine à droite
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2100);

    // 2.8s : Fin de l'intro, l'écran d'accueil est déjà entièrement dévoilé sous les yeux de l'utilisateur
    const doneTimer = setTimeout(() => {
      setIsDone(true);
      if (onFinish) onFinish();
    }, 2800);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(waveTimer);
      clearTimeout(flipOutTimer);
      clearTimeout(flipInTimer);
      clearTimeout(settleTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinish]);

  if (isDone) {
    return null;
  }

  return (
    <div
      aria-label="DirectSamsar Intro Splash"
      className={`fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center select-none bg-[#eab308] transition-opacity duration-700 ease-out touch-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      {/* 1. Arrière-plan animé plein écran : étirement physique 4 coins sans calcul de hauteur */}
      <img
        src={fondAnimImg}
        alt="Arrière-plan DirectSamsar"
        className="absolute inset-0 w-full h-full object-cover object-bottom -z-10 pointer-events-none will-change-transform opacity-100"
        loading="eager"
        decoding="sync"
        style={{
          objectPosition: 'center bottom',
          transformOrigin: 'center bottom',
          animation: 'duneBreezeAnim 3000ms cubic-bezier(0.25, 1, 0.5, 1) forwards',
        }}
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src !== window.location.origin + '/fond-anim.jpg') {
            target.src = '/fond-anim.jpg';
          }
        }}
      />

      {/* Styles keyframes pour l'onde de choc, la brise sur les dunes et la vague d'énergie */}
      <style>{`
        @keyframes morphRingAnim {
          0% {
            opacity: 0.95;
            transform: scale(0.85);
          }
          100% {
            opacity: 0;
            transform: scale(1.75);
          }
        }

        @keyframes duneBreezeAnim {
          0% {
            transform: scale(1.0);
          }
          100% {
            transform: scale(1.05);
          }
        }

        @keyframes energyWaveSweep {
          0% {
            transform: translateX(-110%) skewX(-20deg);
            opacity: 0;
          }
          15% {
            opacity: 0.95;
          }
          85% {
            opacity: 0.95;
          }
          100% {
            transform: translateX(220%) skewX(-20deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* 2. Grande vague d'énergie lumineuse plein écran (traverse de gauche à droite en ~1200ms) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-[5] overflow-hidden">
        {isWaveActive && (
          <div
            className="absolute top-0 bottom-0 w-[60vw] h-full pointer-events-none blur-xl will-change-transform"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.25) 15%, rgba(253, 224, 71, 0.4) 38%, rgba(255, 255, 255, 0.55) 50%, rgba(253, 224, 71, 0.4) 62%, rgba(16, 185, 129, 0.2) 85%, transparent 100%)',
              animation: 'energyWaveSweep 1200ms cubic-bezier(0.22, 0.9, 0.35, 1) forwards',
              mixBlendMode: 'screen',
            }}
          />
        )}
      </div>

      {/* 3. Canvas Particules Subtiles (Dorées & Vert Émeraude) au premier plan */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      />

      {/* Conteneur principal centré */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4">
        
        {/* Zone Logo : Rotation 3D centrée */}
        <div className="relative flex items-center justify-center">
          
          {/* Onde de choc circulaire dorée (morphRing déployé au basculement 3D) */}
          {morphRingActive && !isFadingOut && (
            <div
              className="absolute inset-0 rounded-3xl border-2 border-amber-300 pointer-events-none"
              style={{
                animation: 'morphRingAnim 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
                boxShadow:
                  '0 0 35px rgba(234, 191, 82, 0.85), inset 0 0 18px rgba(234, 191, 82, 0.55)',
              }}
            />
          )}

          {/* Halo doré lumineux lors du basculement 3D */}
          <div
            className={`absolute -inset-6 rounded-full bg-amber-400/40 blur-2xl pointer-events-none transition-all duration-700 ${
              isFadingOut
                ? 'opacity-0 scale-75'
                : flipStep === 'flippingIn' || flipStep === 'settled'
                ? 'opacity-100 scale-125'
                : 'opacity-0 scale-75'
            }`}
          />

          {/* Conteneur 3D du Logo avec perspective matérielle 1200px (dézoom cinématique initial scale 4 -> scale 1) */}
          <div
            id="splashLogoWrap"
            className="relative will-change-transform"
            style={{
              width: '112px',
              height: '112px',
              perspective: '1200px',
              transformStyle: 'preserve-3d',
              transform: hasEntered ? 'scale(1)' : 'scale(4)',
              opacity: 1,
              transition: 'transform 1200ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* FACE 1 : Maison (/logo-maison-finale.jpg - Rotation 3D instantanée à 1.54s à l'impact de la vague) */}
            <div
              className="absolute inset-0 rounded-3xl overflow-hidden bg-[#B50A10] border-2 border-white/20 flex items-center justify-center p-0.5 select-none will-change-transform shadow-2xl"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d',
                boxShadow:
                  '0 14px 40px -6px rgba(234, 191, 82, 0.45), 0 0 25px rgba(181, 10, 16, 0.55)',
                transition:
                  flipStep === 'flippingOut' || flipStep === 'flippingIn' || flipStep === 'settled'
                    ? 'transform 200ms cubic-bezier(0.3, 0, 0.5, 1), opacity 180ms ease-in'
                    : 'none',
                transform:
                  flipStep === 'flippingOut' || flipStep === 'flippingIn' || flipStep === 'settled'
                    ? 'perspective(1200px) rotateY(90deg) scale(0.92)'
                    : 'perspective(1200px) rotateY(0deg) scale(1)',
                opacity:
                  flipStep === 'flippingOut' || flipStep === 'flippingIn' || flipStep === 'settled'
                    ? 0
                    : 1,
                pointerEvents: 'none',
              }}
            >
              <img
                src="/logo-maison-finale.jpg"
                alt="DirectSamsar Maison"
                className="w-full h-full object-cover pointer-events-none"
                loading="eager"
                decoding="sync"
                draggable={false}
              />
            </div>

            {/* FACE 2 : Étoile (/logo-etoile.png - Basculement 3D entrant à 1.74s propulsé par le cœur de la vague) */}
            <div
              className="absolute inset-0 rounded-3xl overflow-hidden bg-[#B50A10] border-2 border-white/20 flex items-center justify-center p-0.5 select-none will-change-transform shadow-2xl"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d',
                boxShadow:
                  '0 0 45px 12px rgba(234, 191, 82, 0.65), 0 16px 36px -6px rgba(0, 0, 0, 0.5)',
                transition:
                  flipStep === 'settled'
                    ? 'transform 200ms ease-out'
                    : flipStep === 'flippingIn'
                    ? 'transform 240ms cubic-bezier(0.2, 0.85, 0.35, 1.2), opacity 200ms ease-out'
                    : 'none',
                transform:
                  flipStep === 'settled'
                    ? 'perspective(1200px) rotateY(0deg) scale(1)'
                    : flipStep === 'flippingIn'
                    ? 'perspective(1200px) rotateY(0deg) scale(1.05)'
                    : 'perspective(1200px) rotateY(-90deg) scale(0.92)',
                opacity:
                  flipStep === 'flippingIn' || flipStep === 'settled' ? 1 : 0,
                borderRadius: '26px',
              }}
            >
              <img
                src="/logo-etoile.png"
                alt="DirectSamsar Étoile"
                className="w-full h-full object-cover pointer-events-none"
                loading="eager"
                decoding="sync"
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* Textes et barre de progression (Lisibilité optimale sur fond naturel) */}
        <div
          className={`flex flex-col items-center mt-7 space-y-3 px-5 py-3 rounded-2xl bg-black/30 backdrop-blur-xs border border-white/15 shadow-lg transition-all duration-500 ${
            hasEntered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Titre Principal DIRECTSAMSAR.MA */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.2em] text-white uppercase font-serif drop-shadow-md flex items-center justify-center">
              Direct<span className="text-amber-400">Samsar</span>
              <span className="text-amber-300 text-sm sm:text-base font-bold ml-1 opacity-90 tracking-widest">
                .ma
              </span>
            </h1>
            <p className="text-amber-200/90 text-xs sm:text-sm font-medium tracking-wide mt-1.5 drop-shadow-sm max-w-xs">
              L'Immobilier en Confiance • Agents Référencés
            </p>
          </div>

          {/* Fine barre de progression dorée */}
          <div className="w-48 sm:w-56 h-[3px] bg-black/40 rounded-full overflow-hidden border border-amber-400/30 mt-2">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-emerald-400 transition-all duration-150 ease-out rounded-full"
              style={{
                width: `${progress}%`,
                boxShadow: '0 0 10px #EABF52, 0 0 4px #10B981',
              }}
            />
          </div>

          {/* Sceau d'authenticité discret */}
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-amber-300/90 pt-1">
            <span>🇲🇦</span>
            <span>Réseau National Direct</span>
          </div>
        </div>
      </div>
    </div>
  );
};
