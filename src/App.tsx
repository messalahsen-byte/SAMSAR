import React, { useState } from 'react';
import { Header } from './components/Header';
import { BuyerDirectory } from './components/BuyerDirectory';
import { SamsarVoiceSpace } from './components/SamsarVoiceSpace';
import { WhatsAppSimulator } from './components/WhatsAppSimulator';
import { StartupAccompanimentGuide } from './components/StartupAccompanimentGuide';
import { FeasibilityAudit } from './components/FeasibilityAudit';
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
  Compass
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'directory' | 'samsar_mode' | 'whatsapp_sim' | 'incubation_guide' | 'audit'>('directory');
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastCity, setBroadcastCity] = useState('casablanca');
  const [broadcastDistrict, setBroadcastDistrict] = useState('maarif');

  const handleOpenBroadcastWithTarget = (city: string, district: string) => {
    setBroadcastCity(city);
    setBroadcastDistrict(district);
    setIsBroadcastOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBroadcast={() => setIsBroadcastOpen(true)}
        selectedCity={broadcastCity}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {activeTab === 'directory' && (
          <BuyerDirectory
            onOpenBroadcastWithDistrict={handleOpenBroadcastWithTarget}
          />
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
      </main>

      {/* Broadcast Flash Modal */}
      <BroadcastModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        defaultCity={broadcastCity}
        defaultDistrict={broadcastDistrict}
      />

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 text-xs py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-800/80 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg">
                د
              </div>
              <div>
                <span className="font-bold text-sm text-stone-100 font-serif">Daleel Samsar • دليل السمسار</span>
                <p className="text-[11px] text-stone-400">
                  Réseau d'intermédiation immobilière hyper-local par la voix et WhatsApp au Maroc
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <button 
                onClick={() => setActiveTab('incubation_guide')}
                className="text-amber-400 hover:text-amber-300 font-semibold"
              >
                Dossier Candidature Incubateurs (212 Founders, Tamwilcom)
              </button>
              <button 
                onClick={() => setActiveTab('samsar_mode')}
                className="text-stone-400 hover:text-white"
              >
                Espace Vocal Samsar
              </button>
              <button 
                onClick={() => setActiveTab('whatsapp_sim')}
                className="text-stone-400 hover:text-white"
              >
                Architecture WhatsApp & IA
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-400 text-[11px]">
            <p>
              Conçu pour résoudre le paradoxe du marché immobilier informel au Maroc : valoriser l'humain et le terrain sans court-circuiter le Samsar.
            </p>
            <div className="flex items-center gap-1.5 text-stone-300 shrink-0">
              <span>Fait avec passion pour l'écosystème entrepreneurial marocain 🇲🇦</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
