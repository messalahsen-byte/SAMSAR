import React, { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { LanguageScreen } from './components/LanguageScreen';
import { ModeScreen } from './components/ModeScreen';
import { MainMenu } from './components/MainMenu';
import { SamsarChoiceScreen } from './components/SamsarChoiceScreen';
import { StartNavigation } from './components/StartNavigation';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentStep, setCurrentStep] = useState<'language' | 'mode' | 'home'>('language');
  const [subPage, setSubPage] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<'fr' | 'ar'>('fr');
  const [selectedMode, setSelectedMode] = useState<'vocal' | 'classic'>('classic');

  const handleResetToStart = () => {
    setCurrentStep('language');
    setSubPage(null);
    setSelectedLang('fr');
  };

  return (
    <div className="relative min-h-screen">
      {/* SPLASHSCREEN (se superpose en plein écran au-dessus) */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* CONTENU PRINCIPAL (déjà monté et prêt en arrière-plan, se dévoile en fondu naturel) */}
      <div className={`min-h-screen bg-white ${showSplash ? 'h-screen max-h-screen overflow-hidden pointer-events-none' : ''}`}>
        {/* ÉCRAN 1 : CHOIX DE LA LANGUE */}
        {currentStep === 'language' && (
          <LanguageScreen 
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
          />
        )}

        {/* SOUS-PAGE : CARTE INTERACTIVE DES SAMSARS */}
        {currentStep === 'home' && subPage === 'samsar-map' && (
          <StartNavigation
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

