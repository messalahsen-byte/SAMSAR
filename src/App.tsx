import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { LanguageScreen } from './components/LanguageScreen';
import { ModeScreen } from './components/ModeScreen';
import { MainMenu } from './components/MainMenu';
import { SamsarChoiceScreen } from './components/SamsarChoiceScreen';
import { StartNavigation } from './components/StartNavigation';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeSwitcher } from './components/ThemeSwitcher';

function MainAppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentStep, setCurrentStep] = useState<'language' | 'mode' | 'home'>('language');
  const [subPage, setSubPage] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<'fr' | 'ar'>('fr');
  const [selectedMode, setSelectedMode] = useState<'vocal' | 'classic'>('classic');

  useEffect(() => {
    const handleGlobalNav = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const option = customEvent.detail;
      if (option === 'vocal' || option === 'voice-search') {
        setSelectedMode('vocal');
        setCurrentStep('home');
        setSubPage('voice-search');
      } else if (option === 'classic' || option === 'home') {
        setSelectedMode('classic');
        setCurrentStep('home');
        setSubPage(null);
      } else if (option === 'find_samsar' || option === 'samsar_choice' || option === 'samsar-choice') {
        setCurrentStep('home');
        setSubPage('samsar-choice');
      } else if (option === 'samsar_map' || option === 'samsar-map') {
        setCurrentStep('home');
        setSubPage('samsar-map');
      } else if (option === 'samsar_list' || option === 'samsar-list') {
        setCurrentStep('home');
        setSubPage('samsar-list');
      } else if (option === 'search_property' || option === 'buy') {
        setCurrentStep('home');
        setSubPage('buy');
      } else if (option === 'post_listing' || option === 'sell') {
        setCurrentStep('home');
        setSubPage('sell');
      }
    };

    const handleGlobalLang = (e: Event) => {
      const customEvent = e as CustomEvent<'fr' | 'ar'>;
      if (customEvent.detail === 'fr' || customEvent.detail === 'ar') {
        setSelectedLang(customEvent.detail);
      }
    };

    window.addEventListener('dsamsar:navigate', handleGlobalNav);
    window.addEventListener('dsamsar:language', handleGlobalLang);
    return () => {
      window.removeEventListener('dsamsar:navigate', handleGlobalNav);
      window.removeEventListener('dsamsar:language', handleGlobalLang);
    };
  }, []);

  const handleResetToStart = () => {
    setCurrentStep('language');
    setSubPage(null);
    setSelectedLang('fr');
  };

  const handleToggleLanguage = () => {
    setSelectedLang((prev) => (prev === 'ar' ? 'fr' : 'ar'));
  };

  return (
    <div className="relative min-h-screen">
      {/* SPLASHSCREEN (se superpose en plein écran au-dessus) */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* SÉLECTEUR INTERACTIF DE PALETTE (visible dès que le splash s'estompe) */}
      {!showSplash && <ThemeSwitcher />}

      {/* CONTENU PRINCIPAL (déjà monté et prêt en arrière-plan, se dévoile en fondu naturel) */}
      <div className={`min-h-screen bg-white ${showSplash ? 'h-screen max-h-screen overflow-hidden pointer-events-none' : ''}`}>
        {/* ÉCRAN 1 : CHOIX DE LA LANGUE */}
        {currentStep === 'language' && (
          <LanguageScreen 
            language={selectedLang}
            onSelect={(lang) => {
              setSelectedLang(lang);
              setCurrentStep('mode');
            }}
          />
        )}

        {/* ÉCRAN 2 : CHOIX DU MODE (VOCAL / CLASSIQUE) */}
        {currentStep === 'mode' && (
          <ModeScreen 
            language={selectedLang}
            onSelect={(mode) => {
              setSelectedMode(mode);
              setCurrentStep('home');
              if (mode === 'vocal') {
                setSubPage('voice-search');
              } else {
                setSubPage(null);
              }
            }}
            onBack={() => setCurrentStep('language')}
            onToggleLanguage={handleToggleLanguage}
          />
        )}

        {/* ÉCRAN 3 : MENU PRINCIPAL (ACCUEIL 3 CARTES) */}
        {currentStep === 'home' && !subPage && (
          <MainMenu 
            language={selectedLang} 
            mode={selectedMode}
            onNavigate={(page) => setSubPage(page)}
            onBackToMode={() => setCurrentStep('mode')}
            onGoHome={handleResetToStart}
            onToggleLanguage={handleToggleLanguage}
          />
        )}

        {/* ÉCRAN INTERMÉDIAIRE : CHOIX SAMSAR (CARTE MAP VS LISTE / FORMULAIRE) */}
        {currentStep === 'home' && subPage === 'samsar-choice' && (
          <SamsarChoiceScreen 
            language={selectedLang}
            onBack={() => setSubPage(null)}
            onGoHome={handleResetToStart}
            onSelectMap={() => setSubPage('samsar-map')}
            onSelectList={() => setSubPage('samsar-list')}
            onToggleLanguage={handleToggleLanguage}
          />
        )}

        {/* SOUS-PAGE : CARTE INTERACTIVE DES SAMSARS */}
        {currentStep === 'home' && subPage === 'samsar-map' && (
          <StartNavigation
            key="samsar-map"
            initialStep="samsar_map"
            language={selectedLang}
            mode={selectedMode}
            onBack={() => setSubPage('samsar-choice')}
            onBackToMode={() => setSubPage('samsar-choice')}
            onGoHome={handleResetToStart}
          />
        )}

        {/* SOUS-PAGE : LISTE ET RECHERCHE DES SAMSARS */}
        {currentStep === 'home' && subPage === 'samsar-list' && (
          <StartNavigation
            key="samsar-list"
            initialStep="find_samsar"
            language={selectedLang}
            mode={selectedMode}
            onBack={() => setSubPage('samsar-choice')}
            onBackToMode={() => setSubPage('samsar-choice')}
            onGoHome={handleResetToStart}
          />
        )}

        {/* SOUS-PAGE : RECHERCHER UN BIEN (ACHETER / LOUER) */}
        {currentStep === 'home' && subPage === 'buy' && (
          <StartNavigation
            key="buy"
            initialStep="search_property"
            language={selectedLang}
            mode={selectedMode}
            onBack={() => setSubPage(null)}
            onBackToMode={() => setSubPage(null)}
            onGoHome={handleResetToStart}
          />
        )}

        {/* SOUS-PAGE : DÉPOSER UNE ANNONCE (VENDRE / LOUER) */}
        {currentStep === 'home' && subPage === 'sell' && (
          <StartNavigation
            key="sell"
            initialStep="post_listing"
            language={selectedLang}
            mode={selectedMode}
            onBack={() => setSubPage(null)}
            onBackToMode={() => setSubPage(null)}
            onGoHome={handleResetToStart}
          />
        )}

        {/* SOUS-PAGE : RECHERCHE VOCALE */}
        {currentStep === 'home' && subPage === 'voice-search' && (
          <StartNavigation
            key="voice-search"
            initialStep="vocal"
            language={selectedLang}
            mode={selectedMode}
            onBack={() => {
              if (selectedMode === 'vocal') {
                setCurrentStep('mode');
              } else {
                setSubPage(null);
              }
            }}
            onBackToMode={() => setCurrentStep('mode')}
            onGoHome={handleResetToStart}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainAppContent />
    </ThemeProvider>
  );
}

