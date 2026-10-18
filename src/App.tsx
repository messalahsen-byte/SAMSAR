import React, { useState } from 'react';
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

export default function App() {
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

  return (
    <div className="bg-[#FAFAFA] text-stone-900 flex flex-col h-[100dvh] overflow-hidden font-sans selection:bg-amber-600 selection:text-white">
      {/* Header uniquement pour les onglets secondaires hors parcours principal */}
      {activeTab !== 'search' && (
        <Header
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onOpenBroadcast={() => setIsBroadcastOpen(true)}
          selectedCity={broadcastCity}
          onGoHome={handleBack}
          onNavigateDirectScreen={(sc) => {
            setDirectScreen(sc);
            setActiveTab('search');
          }}
        />
      )}

      {/* Main Container */}
      <main className={activeTab === 'search' ? 'flex-1 w-full h-[100dvh] overflow-hidden p-0' : 'flex-1 overflow-y-auto max-w-4xl w-full mx-auto px-3 sm:px-6 pt-3 sm:pt-5 pb-6'}>
        {activeTab === 'search' && (
          <DirectSamsarApp 
            onOpenBroadcast={handleOpenBroadcastWithTarget}
            onNavigateToTab={handleTabChange}
            screen={directScreen}
            onScreenChange={setDirectScreen}
          />
        )}

        {activeTab === 'directory' && (
          <CleanBuyerFlow />
        )}

        {activeTab === 'samsar_mode' && (
          <SamsarVoiceSpace />
        )}

        {activeTab === 'whatsapp_sim' && (
          <WhatsAppSimulator />
        )}

        {activeTab === 'incubation_guide' && (
          <StartupAccompanimentGuide />
        )}

        {activeTab === 'audit' && (
          <FeasibilityAudit />
        )}

        {activeTab === 'discussion' && (
          <FullDiscussionViewer />
        )}
      </main>

      {/* Broadcast Flash Modal */}
      <BroadcastModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        defaultCity={broadcastCity}
        defaultDistrict={broadcastDistrict}
      />
    </div>
  );
}
