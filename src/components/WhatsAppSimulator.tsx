import React, { useState, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff,
  Volume2, 
  Sparkles, 
  CheckCheck, 
  Bot, 
  User, 
  Coffee, 
  Smartphone, 
  Cpu, 
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Play
} from 'lucide-react';
import { speakDarijaNatural, playAudioBeep, LiveVoiceRecorder } from '../utils/audioDarija';

interface MessageItem {
  id: string;
  sender: 'buyer' | 'bot' | 'samsar';
  senderName: string;
  time: string;
  type: 'text' | 'voice' | 'card';
  text?: string;
  audioText?: string;
  audioArabicText?: string;
  voiceDuration?: string;
  blobAudioUrl?: string;
}

const INITIAL_MESSAGES: MessageItem[] = [
  {
    id: 'm1',
    sender: 'buyer',
    senderName: 'Acquéreur (Mehdi)',
    time: '10:41',
    type: 'voice',
    text: '🎤 Note Vocale (0:09) : "سلام خويا، كنقلب على برطمة ف المعاريف، ف حدود 95 مليون سنتيم، تكون فيها 2 بيوت وصالون مزيان."',
    audioText: 'Salam khoya, kan9elleb 3la bpartma f Maarif, f 7odoud 95 mlyoun centime, tkoun fiha 2 biout w salon mzyan.',
    audioArabicText: 'سلام خويا، كنقلب على برطمة ف المعاريف، ف حدود خمسة وتسعين مليون سنتيم، تكون فيها جوج بيوت وصالون مزيان.',
    voiceDuration: '0:09'
  },
  {
    id: 'm2',
    sender: 'bot',
    senderName: 'Daleel Samsar AI Bot 🤖',
    time: '10:41',
    type: 'card',
    text: '🧠 [Compréhension IA Darija instantanée]\n• Ville : Casablanca\n• Quartier : Maârif\n• Type : Appartement (2 chambres + salon)\n• Budget : 950 000 MAD\n\n📢 Demande transmise aux 2 Samsars référents du Maârif (Si Mohamed & Si Hamid).'
  },
  {
    id: 'm3',
    sender: 'samsar',
    senderName: 'Si Mohamed Moul L\'Maârif',
    time: '10:43',
    type: 'voice',
    text: '🎤 Note Vocale Samsar (0:12) : "مرحبا سيدي مهدي، عندي شي حاجة نقية ف بئر أنزران عاد خرجات اليوم ف الطابق 3 بالأسانسور والباركينغ. أجي تشوفها معايا ف التلاتة د العشية ف كافي دو فرانس."',
    audioText: 'Marhba sidi Mehdi, 3andi chi 7aja n9ia f Bir Anzarane 3ad kherjat lyoum f l etage 3 bel ascenseur w parking. Aji tchoufha m3aya f 15h f Café de France.',
    audioArabicText: 'مرحبا سيدي مهدي، عندي شي حاجة نقية ف بئر أنزران عاد خرجات اليوم ف الطبقة التالتة ب الأسانسور و الباركينغ. أجي تشوفها معايا ف التلاتة د العشية ف كافي دو فرانس.',
    voiceDuration: '0:12'
  }
];

export const WhatsAppSimulator: React.FC = () => {
  const [messages, setMessages] = useState<MessageItem[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  // Live recording state in WhatsApp
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [micSeconds, setMicSeconds] = useState(0);
  const recorderRef = useRef<LiveVoiceRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayVoiceMessage = (msg: MessageItem) => {
    if (msg.blobAudioUrl) {
      if (playingMessageId === msg.id && audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        setPlayingMessageId(null);
        return;
      }

      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      const audio = new Audio(msg.blobAudioUrl);
      audioPlayerRef.current = audio;
      setPlayingMessageId(msg.id);
      audio.onended = () => setPlayingMessageId(null);
      audio.play();
      return;
    }

    if (!msg.audioArabicText && !msg.audioText) return;

    if (playingMessageId === msg.id) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setPlayingMessageId(null);
      return;
    }

    playAudioBeep('notification');
    setPlayingMessageId(msg.id);
    speakDarijaNatural(msg.audioArabicText || '', msg.audioText || '', () => {
      setPlayingMessageId(null);
    });
  };

  const handleStartMicRecording = async () => {
    recorderRef.current = new LiveVoiceRecorder();
    const success = await recorderRef.current.start();
    if (success) {
      playAudioBeep('record_start');
      setIsRecordingMic(true);
      setMicSeconds(0);
      timerRef.current = setInterval(() => {
        setMicSeconds(s => s + 1);
      }, 1000);
    }
  };

  const handleStopMicRecordingAndSend = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    playAudioBeep('record_end');
    
    let audioUrl = '';
    if (recorderRef.current) {
      audioUrl = await recorderRef.current.stop();
    }

    setIsRecordingMic(false);
    playAudioBeep('whatsapp_sent');

    const durationStr = `0:0${Math.min(micSeconds, 9)}`;
    const newMsg: MessageItem = {
      id: `m-voice-${Date.now()}`,
      sender: 'buyer',
      senderName: 'Vous (Note Vocale Réelle Micro)',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'voice',
      text: `🎤 Votre note vocale enregistrée (${durationStr})`,
      blobAudioUrl: audioUrl,
      voiceDuration: durationStr
    };

    setMessages(prev => [...prev, newMsg]);
    triggerBotAnswer();
  };

  const triggerBotAnswer = () => {
    setIsProcessingAI(true);
    setTimeout(() => {
      const botReply: MessageItem = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        senderName: 'Daleel Samsar AI Bot 🤖',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'card',
        text: '✅ Note vocale en Darija bien analysée ! Les critères ont été transmis directement aux Samsars vérifiés de votre zone.'
      };
      setMessages(prev => [...prev, botReply]);

      setTimeout(() => {
        const samsarReply: MessageItem = {
          id: `sam-${Date.now()}`,
          sender: 'samsar',
          senderName: 'Si Mohamed Moul L\'Maârif',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'voice',
          text: '🎤 Note vocale (0:08) : "سلام سيدي، سمعت الأوديو ديالك. عندي جوج فرص واجدين، صيفط ليا النمرة ديالك ولا دوز عندي للقهوة."',
          audioText: 'Salam sidi, sma3t l audio dialk. 3andi 2 opportunités mojoudin. Sift lia n-nemra dialk wla dwez l3andi l 9ahwa.',
          audioArabicText: 'سلام سيدي، سمعت الأوديو ديالك. عندي جوج فرص واجدين، صيفط ليا النمرة ديالك ولا دوز عندي للقهوة.',
          voiceDuration: '0:08'
        };
        playAudioBeep('notification');
        setMessages(prev => [...prev, samsarReply]);
        setIsProcessingAI(false);
      }, 1500);
    }, 1000);
  };

  const handleSendCustomMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    playAudioBeep('whatsapp_sent');
    const newMsg: MessageItem = {
      id: `m-${Date.now()}`,
      sender: 'buyer',
      senderName: 'Vous (Acquéreur)',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      text: text.trim()
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    triggerBotAnswer();
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Intro Header */}
      <div className="bg-linear-to-r from-emerald-950 via-stone-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-800/40">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-400/20">
            <Cpu className="w-3.5 h-3.5" />
            <span>Architecture Technique : WhatsApp Cloud API + Modèle IA Darija</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
            Le Bot WhatsApp Intelligent sans Friction
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Pour réussir auprès des Samsars, <strong>il ne faut surtout pas leur imposer de télécharger une nouvelle application</strong>. 
            Tout se passe sur leur canal naturel : <strong>WhatsApp</strong>. L'IA écoute la note vocale en Darija de l'acheteur, en extrait les critères et les pousse aux Samsars du quartier en quelques secondes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive WhatsApp Phone View (7 cols) */}
        <div className="lg:col-span-7 bg-stone-900 p-3 sm:p-4 rounded-[40px] shadow-2xl border-4 border-stone-800 max-w-md mx-auto w-full">
          {/* Phone Speaker Notch */}
          <div className="w-32 h-4 bg-stone-800 rounded-full mx-auto mb-2" />

          {/* WhatsApp Header */}
          <div className="bg-[#075e54] text-white px-4 py-3 rounded-2xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-sm ring-1 ring-white/20">
                <Bot className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  <span>Daleel Samsar Bot</span>
                  <span className="text-[10px] bg-emerald-800 px-1.5 py-0.2 rounded font-normal">Officiel</span>
                </h4>
                <p className="text-[11px] text-emerald-200">En ligne • Passerelle Quartiers Maroc</p>
              </div>
            </div>

            <button
              onClick={handleResetChat}
              className="p-1.5 hover:bg-white/10 rounded-full text-emerald-100 transition text-xs flex items-center gap-1"
              title="Réinitialiser la conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="text-[10px]">Recommencer</span>
            </button>
          </div>

          {/* WhatsApp Messages Container */}
          <div className="bg-[#e5ddd5] p-3 sm:p-4 rounded-b-2xl h-[460px] overflow-y-auto space-y-3.5 text-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-center">
                <span className="bg-[#dcf8c6] text-stone-700 px-3 py-1 rounded-md text-[10px] shadow-2xs font-medium">
                  Aujourd'hui • Chiffrement de bout en bout
                </span>
              </div>

              {messages.map((msg) => {
                const isBuyer = msg.sender === 'buyer';
                const isBot = msg.sender === 'bot';
                const isPlaying = playingMessageId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isBuyer ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 shadow-xs space-y-1.5 relative ${
                        isBuyer
                          ? 'bg-[#dcf8c6] text-stone-900 rounded-tr-xs'
                          : isBot
                          ? 'bg-white text-stone-800 rounded-tl-xs border border-emerald-200'
                          : 'bg-[#ffffff] text-stone-900 rounded-tl-xs border-l-4 border-amber-600'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] font-bold text-stone-500 border-b border-stone-100/80 pb-1">
                        <span className={isBuyer ? 'text-emerald-900' : isBot ? 'text-teal-800' : 'text-amber-800'}>
                          {msg.senderName}
                        </span>
                        <span>{msg.time}</span>
                      </div>

                      {/* Content */}
                      {msg.type === 'voice' && (
                        <div className="space-y-2">
                          <p className="text-[11px] leading-relaxed text-stone-800 font-sans">
                            {msg.text}
                          </p>

                          <button
                            onClick={() => handlePlayVoiceMessage(msg)}
                            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-bold text-xs transition ${
                              isPlaying
                                ? 'bg-amber-600 text-white animate-pulse'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                            <span>{isPlaying ? 'Écoute en cours...' : 'Écouter le vocal Darija'}</span>
                          </button>
                        </div>
                      )}

                      {msg.type === 'card' && (
                        <div className="text-[11px] leading-relaxed whitespace-pre-line text-stone-700 font-mono bg-stone-50 p-2 rounded-lg">
                          {msg.text}
                        </div>
                      )}

                      {msg.type === 'text' && (
                        <p className="text-[11px] leading-relaxed text-stone-800">
                          {msg.text}
                        </p>
                      )}

                      <div className="flex justify-end items-center gap-1 text-[9px] text-stone-400">
                        <span>{msg.time}</span>
                        <CheckCheck className="w-3 h-3 text-blue-500" />
                      </div>
                    </div>
                  </div>
                );
              })}

              {isProcessingAI && (
                <div className="flex items-center gap-2 bg-white/90 p-2.5 rounded-xl text-stone-600 text-xs w-fit shadow-xs animate-pulse">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Traitement IA du vocal Darija & diffusion aux Samsars...</span>
                </div>
              )}
            </div>

            {/* Input Bar with Live Microphone */}
            <div className="bg-white p-2 rounded-2xl flex items-center gap-2 shadow-sm border border-stone-200">
              {isRecordingMic ? (
                <div className="flex-1 flex items-center justify-between px-3 py-1 bg-red-50 text-red-700 rounded-xl animate-pulse text-xs font-bold">
                  <span>Enregistrement au micro ({micSeconds}s)...</span>
                  <button
                    onClick={handleStopMicRecordingAndSend}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs"
                  >
                    Envoyer
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Écrivez un message en Darija..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendCustomMessage()}
                    className="flex-1 text-xs px-3 py-1.5 bg-stone-100 rounded-xl focus:outline-none"
                  />
                  
                  {/* Real Mic button */}
                  <button
                    type="button"
                    onClick={handleStartMicRecording}
                    className="w-8 h-8 rounded-xl bg-amber-500 text-amber-950 flex items-center justify-center hover:bg-amber-400 transition"
                    title="Enregistrer une vraie note vocale au micro"
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleSendCustomMessage()}
                    className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick Preset Prompts */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="text-[10px] text-stone-400 font-bold uppercase w-full">
              Tester des scénarios rapides en Darija :
            </span>
            <button
              onClick={() => handleSendCustomMessage("Salam, bghit villa f Ain Diab avec piscine, budget 600 mlyoun")}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1 rounded-lg text-[10px] transition"
            >
              Villa Aïn Diab
            </button>
            <button
              onClick={() => handleSendCustomMessage("Salam Si Mohamed, wach kayna chi bpartma f Bourgogne khedama l location ?")}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1 rounded-lg text-[10px] transition"
            >
              Location Bourgogne
            </button>
            <button
              onClick={() => handleSendCustomMessage("Bghit chi m7al tijari f Guéliz f blasa 3amra")}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-2.5 py-1 rounded-lg text-[10px] transition"
            >
              Commerce Guéliz
            </button>
          </div>
        </div>

        {/* Right: Technical Explanation & Why This Works (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-700" />
              <h3 className="font-extrabold text-base text-stone-900">
                Pourquoi WhatsApp + Audio est la seule tech viable ?
              </h3>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Les concurrents échouent parce qu'ils demandent à des agents informels de remplir 15 champs (titre foncier, superficie exacte, photos HD de la salle de bain).
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex items-start gap-2.5">
                <CheckCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950 block">0% d'effort de saisie pour le Samsar</strong>
                  <span className="text-stone-600">Il écoute un vocal de 10 secondes et répond en 5 secondes.</span>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-950 block">Respect du secret commercial</strong>
                  <span className="text-stone-600">Le Samsar ne donne les détails et le rendez-vous au café qu'une fois qu'il a parlé de vive voix à l'acquéreur.</span>
                </div>
              </div>

              <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-indigo-950 block">Compréhension Multimodale Darija</strong>
                  <span className="text-stone-600">L'IA comprend l'Arabizi (95 mlyoun, bpartma, dar, souk) et extrait automatiquement le budget et le secteur.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-stone-100 p-5 rounded-2xl border border-stone-200 text-xs space-y-2">
            <span className="font-bold text-stone-700 block">Stack Technique Recommandée :</span>
            <ul className="list-disc pl-4 space-y-1 text-stone-600">
              <li><strong>Meta WhatsApp Cloud API</strong> (Numéro officiel vérifié marocain)</li>
              <li><strong>Node.js / Express Webhook</strong> pour la réception et la redistribution des audios</li>
              <li><strong>Modèle Gemini 2.5 Flash Multimodal Audio</strong> pour la transcription & extraction en Darija</li>
              <li><strong>Annuaire React mobile-first</strong> pour la consultation par les acquéreurs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
