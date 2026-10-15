import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  CheckCircle, 
  Coffee, 
  PhoneCall, 
  Play, 
  Pause, 
  Sparkles,
  ArrowRight,
  Send,
  Lock,
  Headphones,
  RotateCcw
} from 'lucide-react';
import { speakDarijaNatural, playAudioBeep, LiveVoiceRecorder } from '../utils/audioDarija';

interface ClientAudioRequest {
  id: string;
  district: string;
  buyerName: string;
  budget: string;
  propertyType: string;
  darijaAudioText: string;
  darijaArabicText: string;
  timeAgo: string;
}

const SAMPLE_REQUESTS: ClientAudioRequest[] = [
  {
    id: 'req-1',
    district: 'Maârif (Casablanca)',
    buyerName: 'Si Mehdi (Cadre f Casanearshore)',
    budget: '95 Mlyoun Centimes (MAD)',
    propertyType: 'Appartement 2 biout + salon + ascenseur',
    darijaAudioText: 'Salam Si Mohamed, ana baghi nchri bpartma f Maarif wla 9riba l Bir Anzarane, fiha salon w jouj biout, budget dyali max 95 mlyoun. Ila kan chi 7aja n9ia 3ayt lia.',
    darijaArabicText: 'السلام عليكم السي محمد، أنا باغي نشري برطمة ف المعاريف ولا قريبة ل بئر أنزران، فيها صالون و جوج بيوت، الميزانية ديالي ماكسيموم خمسة وتسعين مليون. إلا كان شي همزة نقية عيط ليا فالحين.',
    timeAgo: 'Il y a 14 min'
  },
  {
    id: 'req-2',
    district: 'Hay Hassani (Casablanca)',
    buyerName: 'Lalla Fatima',
    budget: '60 Mlyoun Centimes',
    propertyType: 'Appartement R+2 wla mchahed',
    darijaAudioText: 'Salam o 3alaykom a Ba Bouchaib, kan9ellbou 3la dar f Hay Hassani l l3a2ila, fiha 3 dyal lbiout w budget 60 mlyoun cash. Chouf lina chi 7aja mzyana lah yr7em lwalidin.',
    darijaArabicText: 'السلام عليكم ورحمة الله أ با بوشعيب، كنقلبو على دار ف الحي الحسني للعائلة، فيها تلاتة د البيوت و البودجي ستين مليون كاش. شوف لينا شي حاجة نقية الله يرحم الوالدين.',
    timeAgo: 'Il y a 42 min'
  },
  {
    id: 'req-3',
    district: 'Guéliz (Marrakech)',
    buyerName: 'Karim (Investisseur Airbnb)',
    budget: '80 Mlyoun Centimes',
    propertyType: 'Studio meublé avec piscine',
    darijaAudioText: 'Salam Si Rachid, bghit studio f Gueliz bla intermediation, ykon n9i w 3ndo rendement mzyan f location touristique. 3andi budget mojod.',
    darijaArabicText: 'السلام سي رشيد، بغيت ستوديو ف گيليز بلا وسيط زايد، يكون نقي وعندو مدخول كراء سياحي مزيان. عندي البودجي واجد فلوس كاش.',
    timeAgo: 'Il y a 1 heure'
  }
];

export const SamsarVoiceSpace: React.FC = () => {
  const [playingRequestId, setPlayingRequestId] = useState<string | null>(null);
  const [isRecordingReply, setIsRecordingReply] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedVoiceForRequest, setRecordedVoiceForRequest] = useState<string | null>(null);
  const [recordedAudioUrls, setRecordedAudioUrls] = useState<Record<string, string>>({});
  const [sentReplies, setSentReplies] = useState<Record<string, boolean>>({});
  const [playingRecordedUrl, setPlayingRecordedUrl] = useState<string | null>(null);

  const recorderRef = useRef<LiveVoiceRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayClientAudio = (req: ClientAudioRequest) => {
    if (playingRequestId === req.id) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setPlayingRequestId(null);
      return;
    }

    playAudioBeep('notification');
    setPlayingRequestId(req.id);
    speakDarijaNatural(req.darijaArabicText, req.darijaAudioText, () => {
      setPlayingRequestId(null);
    });
  };

  const handleStartRecord = async (requestId: string) => {
    recorderRef.current = new LiveVoiceRecorder();
    const success = await recorderRef.current.start();
    
    playAudioBeep('record_start');
    setIsRecordingReply(true);
    setRecordedVoiceForRequest(requestId);
    setRecordingSeconds(0);

    timerRef.current = setInterval(() => {
      setRecordingSeconds(s => s + 1);
    }, 1000);
  };

  const handleStopRecordAndSend = async (requestId: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    playAudioBeep('record_end');
    
    let audioUrl = '';
    if (recorderRef.current) {
      audioUrl = await recorderRef.current.stop();
    }

    setIsRecordingReply(false);
    
    if (audioUrl) {
      setRecordedAudioUrls(prev => ({ ...prev, [requestId]: audioUrl }));
    }

    playAudioBeep('whatsapp_sent');
    setSentReplies(prev => ({ ...prev, [requestId]: true }));
    setRecordedVoiceForRequest(null);
  };

  const handlePlayRecordedAudio = (url: string) => {
    if (playingRecordedUrl === url) {
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      setPlayingRecordedUrl(null);
      return;
    }

    if (audioPlayerRef.current) audioPlayerRef.current.pause();
    const audio = new Audio(url);
    audioPlayerRef.current = audio;
    setPlayingRecordedUrl(url);

    audio.onended = () => setPlayingRecordedUrl(null);
    audio.play();
  };

  const handlePlayVoiceExplanation = () => {
    playAudioBeep('notification');
    speakDarijaNatural(
      "هادا هو الحيز د السمسار، مصاوب بالدارجة وبلا صداع الراس. السمسار مغادي يكتب والو، كيسمع الطلب بالصوت وكيجاوب بالصوت ف الواتساب، والسرية د مول الدار كتبقى مية فالمية مع السمسار بوحدو.",
      "Hada houwa l'Espace dial Samsar. Ma ghadich tktb walo ! Katwerrek ghi 3la l'bouton bach tsm3 chno bgha l'chary, w katjawbou b l'vocal f WhatsApp. Bla ma tgoul lina fin kayna dar wla nemra d moulaha."
    );
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Banner dedicated to the illiterate / voice-first approach */}
      <div className="bg-linear-to-r from-amber-900 via-stone-900 to-amber-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-amber-700/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/20">
              <Headphones className="w-3.5 h-3.5" />
              <span>Démonstrateur Ergonomie Samsar (Non-lecteur & 100% Vocal)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-50 font-serif">
              L'Interface conçue pour le Samsar du Derb
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Le Samsar marocain n'a pas besoin de savoir lire ou écrire un formulaire complexe. 
              Il écoute avec ses oreilles, répond avec sa voix en Darija sur WhatsApp, et <strong className="text-amber-300">ne divulgue jamais l'adresse de son propriétaire</strong>.
            </p>
          </div>

          <button
            onClick={handlePlayVoiceExplanation}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-950 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-lg transition active:scale-95 shrink-0"
          >
            <Volume2 className="w-4 h-4 text-amber-950" />
            <span>Sma3 Chra7 b Darija (Écouter l'explication)</span>
          </button>
        </div>
      </div>

      {/* The 4 Trust Pillars (Le Pacte de Confiance) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Lock,
            titleDarija: 'Sirriat L\'Moul (سريّة المالك)',
            titleFr: 'Zéro adresse de propriétaire demandée',
            desc: 'On ne demande jamais l\'adresse précise ni le numéro du propriétaire. Votre exclusivité reste 100% protégée.'
          },
          {
            icon: Mic,
            titleDarija: 'Khedma Ghi b Sawt (خدمة غير بالصوت)',
            titleFr: '100% Vocal en Darija',
            desc: 'Pas de texte à taper. Vous appuyez sur le micro pour écouter le besoin du client et vous lui répondez en vocal WhatsApp.'
          },
          {
            icon: Coffee,
            titleDarija: 'Blastek f L\'9ahwa (جلستك فالقهوة)',
            titleFr: 'Votre bureau reste votre café',
            desc: 'Les acquéreurs sérieux viennent vous rencontrer directement à votre table de café habituelle.'
          },
          {
            icon: ShieldCheck,
            titleDarija: 'L\'Kalma w L\'Amanna (الكلمة و الأمانة)',
            titleFr: 'Votre réputation récompensée',
            desc: 'Plus vous êtes sérieux, plus votre profil est recommandé dans le quartier. Vos honoraires vous reviennent à 100%.'
          }
        ].map((pillar, i) => {
          const IconComp = pillar.icon;
          return (
            <div 
              key={i} 
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2 hover:border-amber-400 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <IconComp className="w-5 h-5 text-amber-700" />
              </div>
              <h4 className="font-extrabold text-stone-900 text-sm">{pillar.titleDarija}</h4>
              <p className="text-xs font-semibold text-amber-800">{pillar.titleFr}</p>
              <p className="text-xs text-stone-600 leading-relaxed">{pillar.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Interactive Voice Demo Box: "Sma3 Demandes li jaw lyoum" */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-extrabold text-lg sm:text-xl text-stone-900">
                Simulateur : Écoutez les demandes d'acheteurs reçues aujourd'hui
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Voici comment le Samsar écoute en Darija et répond au microphone en direct
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-100 text-amber-900 font-bold text-xs rounded-full">
            3 Nouvelles demandes vocales
          </span>
        </div>

        {/* Requests list */}
        <div className="space-y-4">
          {SAMPLE_REQUESTS.map((req) => {
            const isPlaying = playingRequestId === req.id;
            const isRecordingThis = isRecordingReply && recordedVoiceForRequest === req.id;
            const hasReplied = sentReplies[req.id];
            const recordedAudioUrl = recordedAudioUrls[req.id];

            return (
              <div 
                key={req.id}
                className={`p-5 rounded-2xl border transition ${
                  hasReplied 
                    ? 'bg-emerald-50/70 border-emerald-300' 
                    : 'bg-stone-50 border-stone-200 hover:border-amber-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold text-stone-900 bg-white px-2.5 py-1 rounded-md border border-stone-200">
                        {req.district}
                      </span>
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                        Budget : {req.budget}
                      </span>
                      <span className="text-xs text-stone-400">
                        {req.timeAgo}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-stone-800">
                      {req.propertyType}
                    </p>
                    <p className="text-xs text-stone-500">
                      Client : <span className="text-stone-700 font-medium">{req.buyerName}</span>
                    </p>

                    {/* Darija Transcript in Arabic script */}
                    <div className="bg-white/90 p-3 rounded-xl border border-stone-200 space-y-1 text-right" dir="rtl">
                      <span className="text-[10px] uppercase font-bold text-amber-800 block text-left" dir="ltr">
                        Message Vocal Darija (الصوت بالدارجة المغربية) :
                      </span>
                      <p className="text-xs font-semibold text-stone-800 leading-relaxed font-sans">
                        "{req.darijaArabicText}"
                      </p>
                    </div>
                  </div>

                  {/* Audio Controls for the Samsar */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-2 shrink-0 min-w-[220px]">
                    {/* Play Buyer Voice Button */}
                    <button
                      onClick={() => handlePlayClientAudio(req)}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs transition shadow-xs ${
                        isPlaying
                          ? 'bg-amber-600 text-white animate-pulse'
                          : 'bg-white hover:bg-stone-100 text-stone-800 border border-stone-300'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <VolumeX className="w-4 h-4 text-white" />
                          <span>Arrêter l'audio</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-amber-600" />
                          <span>1. Sma3 (Écouter le vocal)</span>
                        </>
                      )}
                    </button>

                    {/* Record Voice Reply Button */}
                    {hasReplied ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-200" />
                          <span>Réponse vocale transmise</span>
                        </div>
                        {recordedAudioUrl && (
                          <button
                            onClick={() => handlePlayRecordedAudio(recordedAudioUrl)}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-semibold hover:bg-emerald-200 transition"
                          >
                            <Play className="w-3 h-3" />
                            <span>Réécouter votre réponse</span>
                          </button>
                        )}
                      </div>
                    ) : isRecordingThis ? (
                      <button
                        onClick={() => handleStopRecordAndSend(req.id)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl font-bold text-xs shadow-md animate-pulse"
                      >
                        <MicOff className="w-4 h-4" />
                        <span>Arrêter & Envoyer ({recordingSeconds}s)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartRecord(req.id)}
                        disabled={isRecordingReply}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md transition active:scale-95 disabled:opacity-50"
                      >
                        <Mic className="w-4 h-4 text-emerald-200" />
                        <span>2. Répondre au Micro</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
