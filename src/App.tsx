import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { CleanBuyerFlow } from './components/CleanBuyerFlow';
import { BuyerDirectory } from './components/BuyerDirectory';
import { SamsarVoiceSpace } from './components/SamsarVoiceSpace';
import { WhatsAppSimulator } from './components/WhatsAppSimulator';
import { StartupAccompanimentGuide } from './components/StartupAccompanimentGuide';
import { FeasibilityAudit } from './components/FeasibilityAudit';
import { FullDiscussionViewer } from './components/FullDiscussionViewer';
import { BroadcastModal } from './components/BroadcastModal';
import { 
  Building2, 
  Mic, 
  MessageSquareCode, 
  Rocket, 
  Heart, 
  ShieldCheck, 
  Coffee,
  CheckCircle2,
  Sparkles,
  Compass,
  BookOpen
} from 'lucide-react';

import { DirectSamsarApp } from './components/DirectSamsarApp';
import { SplashScreen } from './components/SplashScreen';
import { StartNavigation } from './components/StartNavigation';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'search' | 'directory' | 'samsar_mode' | 'whatsapp_sim' | 'incubation_guide' | 'audit' | 'discussion'>('search');
  const [directScreen, setDirectScreen] = useState<'home' | 'samsar_choice' | 'samsar_city' | 'samsar_district' | 'samsar_list' | 'samsar_map' | 'transact_choice' | 'transact_buy' | 'transact_sell' | 'transact'>('home');
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastCity, setBroadcastCity] = useState('marrakech');
  const [broadcastDistrict, setBroadcastDistrict] = useState('chwiter');

  const handleOpenBroadcastWithTarget = (city?: string, district?: string) => {
    if (city) setBroadcastCity(city);
    if (district) setBroadcastDistrict(district);
    setIsBroadcastOpen(true);
  };

  // Les écrans d'accueil et de choix (Samsar ou Acheter/Vendre) sont plein écran sans sticky header
  const isFullScreenMobile = activeTab === 'search' && (
    directScreen === 'home' || 
    directScreen === 'samsar_choice' || 
    directScreen === 'transact_choice' || 
    directScreen === 'transact'
  );

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    if (tab === 'search') {
      setDirectScreen('home');
    }
  };

  const handleBack = () => {
    if (activeTab !== 'search') {
      setActiveTab('search');
      setDirectScreen('home');
    } else if (directScreen === 'samsar_list') {
      setDirectScreen('samsar_district');
    } else if (directScreen === 'samsar_district') {
      setDirectScreen('samsar_city');
    } else if (directScreen === 'samsar_city' || directScreen === 'samsar_map') {
      setDirectScreen('samsar_choice');
    } else if (directScreen === 'transact_buy' || directScreen === 'transact_sell') {
      setDirectScreen('transact_choice');
    } else {
      setDirectScreen('home');
    }
  };

  // --------------------------------------------------------------------------
  // GESTION DU SPLASH SCREEN AU CHARGEMENT DE L'APPLICATION
  // --------------------------------------------------------------------------

  return (
    <div className="bg-[#FAFAFA] text-stone-900 flex flex-col h-[100dvh] overflow-hidden font-sans selection:bg-amber-600 selection:text-white">
      {/* Application principale DirectSamsar (Dashboard, Recherche, Samsars, Mode Vocal) */}
      <div className="flex-1 w-full h-[100dvh] overflow-y-auto">
        <StartNavigation onRestartSplash={() => setShowSplash(true)} />
      </div>

      {/* 🚀 SPLASH SCREEN PLEIN ÉCRAN AU DÉMARRAGE (Animation Lottie JSON) */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen 
            key="app-splash-screen" 
            onFinish={() => setShowSplash(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
