import React, { useState, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  CheckCircle, 
  UserPlus, 
  Coffee, 
  Phone, 
  MapPin, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { CITIES_DATA, Samsar, saveCustomSamsar } from '../data/samsars';
import { LiveVoiceRecorder, playAudioBeep, speakDarijaNatural } from '../utils/audioDarija';

interface AddSamsarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSamsarAdded: (newSamsar: Samsar) => void;
  defaultCity?: string;
}

export const AddSamsarModal: React.FC<AddSamsarModalProps> = ({
  isOpen,
  onClose,
  onSamsarAdded,
  defaultCity = 'casablanca'
}) => {
  const [cityId, setCityId] = useState(defaultCity);
  const [districtId, setDistrictId] = useState('maarif');
  const [fullName, setFullName] = useState('');
  const [alias, setAlias] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [years, setYears] = useState('15');
  const [coffeeSpot, setCoffeeSpot] = useState('');
  const [bioDarija, setBioDarija] = useState('');
  const [audioPromptArabic, setAudioPromptArabic] = useState('');
  
  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);

  const recorderRef = useRef<LiveVoiceRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  const currentCity = CITIES_DATA.find(c => c.id === cityId) || CITIES_DATA[0];

  const handleStartRecording = async () => {
    recorderRef.current = new LiveVoiceRecorder();
    const success = await recorderRef.current.start();
    if (success) {
      playAudioBeep('record_start');
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    } else {
      alert("Accès au microphone refusé ou non supporté. Vous pouvez taper le texte de présentation en Darija.");
    }
  };

  const handleStopRecording = async () => {
    if (!recorderRef.current) return;
    if (timerRef.current) clearInterval(timerRef.current);
    const audioUrl = await recorderRef.current.stop();
    playAudioBeep('record_end');
    setIsRecording(false);
    if (audioUrl) {
      setRecordedAudioUrl(audioUrl);
    }
  };

  const handlePlayRecorded = () => {
    if (!recordedAudioUrl) return;
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio(recordedAudioUrl);
      audioPlayerRef.current.onended = () => setIsPlayingRecorded(false);
    }
    
    if (isPlayingRecorded) {
      audioPlayerRef.current.pause();
      setIsPlayingRecorded(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingRecorded(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    playAudioBeep('whatsapp_sent');

    const formattedPhone = phone.startsWith('+') ? phone : `+212${phone.replace(/^0/, '')}`;
    const formattedWa = whatsapp.trim() ? (whatsapp.startsWith('+') ? whatsapp : `+212${whatsapp.replace(/^0/, '')}`) : formattedPhone;

    const newSamsar: Samsar = {
      id: `custom-samsar-${Date.now()}`,
      name: fullName.trim(),
      alias: alias.trim() || `${fullName.trim()} Moul L'Derb`,
      city: cityId,
      districts: [districtId],
      experienceYears: parseInt(years) || 10,
      phone: formattedPhone,
      whatsapp: formattedWa,
      rating: 5.0,
      reviewsCount: 1,
      specialties: ['appartement', 'commercial'],
      languages: ['Darija marocaine'],
      status: 'verified',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      bioDarija: bioDarija.trim() || 'Samsar d confianza f l7ouma. Bi3 w chra direct.',
      bioFrench: 'Samsar de terrain ajouté par vous. Référent local disponible sur WhatsApp.',
      audioPromptDarija: bioDarija.trim() || `Salam, ana ${fullName.trim()} f ${currentCity.name}. Marhba bikom f WhatsApp.`,
      audioDarijaArabic: audioPromptArabic.trim() || `السلام عليكم، أنا ${fullName.trim()} ف ${currentCity.name}. مرحبا بكم ف الواتساب.`,
      activeListingsEstimate: '~10 biens exclusifs',
      reputationBadge: 'Profil Réel Ajouté (Votre Contact)',
      typicalCommission: '2.5% négociable',
      coffeeSpot: coffeeSpot.trim() || 'Café habituel du quartier',
      isCustom: true,
      customVoiceAudioUrl: recordedAudioUrl || undefined
    };

    saveCustomSamsar(newSamsar);
    onSamsarAdded(newSamsar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-sm"
        >
          ✕
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold mb-2">
              <UserPlus className="w-3.5 h-3.5 text-amber-700" />
              <span>Ajouter un Vrai Samsar de votre Entourage</span>
            </div>
            <h3 className="text-xl font-bold text-stone-900">
              Enregistrer un Samsar réel dans l'annuaire
            </h3>
            <p className="text-xs text-stone-500">
              Testez avec de vraies coordonnées de votre quartier pour manipuler l'application avec vos propres contacts.
            </p>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Ville</label>
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
              >
                {CITIES_DATA.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Quartier / Derb</label>
              <select
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
              >
                {currentCity.districts.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.nameAr})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Identity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Nom & Prénom</label>
              <input
                type="text"
                required
                placeholder="Ex : Si Abdellah"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Surnom / Alias local</label>
              <input
                type="text"
                placeholder="Ex : Ba Abdellah Moul L'kherga"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
          </div>

          {/* Phone & WhatsApp */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">N° Téléphone Réel</label>
              <input
                type="tel"
                required
                placeholder="06 61 XX XX XX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">N° WhatsApp (si différent)</label>
              <input
                type="tel"
                placeholder="06 XX XX XX XX"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
          </div>

          {/* Café and Experience */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Café de permanence</label>
              <input
                type="text"
                placeholder="Ex : Café Al Wifaq (9h - 13h)"
                value={coffeeSpot}
                onChange={(e) => setCoffeeSpot(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Années d'ancienneté</label>
              <input
                type="number"
                min="1"
                max="50"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
          </div>

          {/* Audio Recording Section in Real Darija */}
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-amber-700" />
                  <span>Enregistrer la voix réelle en Darija :</span>
                </span>
                <p className="text-[11px] text-stone-500">
                  Parlez directement au micro pour un résultat 100% authentique marocain.
                </p>
              </div>

              {recordedAudioUrl && (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  ✓ Audio enregistré
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isRecording ? (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold animate-pulse shadow-sm"
                >
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Arrêter ({recordingSeconds}s)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{recordedAudioUrl ? 'Ré-enregistrer' : 'Enregistrer au microphone'}</span>
                </button>
              )}

              {recordedAudioUrl && (
                <button
                  type="button"
                  onClick={handlePlayRecorded}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-stone-800 border border-stone-300 rounded-xl text-xs font-bold transition hover:bg-stone-50"
                >
                  {isPlayingRecorded ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>Écouter l'enregistrement</span>
                </button>
              )}
            </div>

            {/* Fallback Arabic script text */}
            <div className="pt-2 border-t border-amber-200/60">
              <label className="block text-[11px] font-bold text-amber-900 mb-1">
                Ou texte de présentation en Arabe/Darija (pour la synthèse vocale) :
              </label>
              <input
                type="text"
                dir="rtl"
                placeholder="السلام عليكم، أنا السي محمد د المعاريف. عندي برطمات نقيين..."
                value={audioPromptArabic}
                onChange={(e) => setAudioPromptArabic(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-stone-200 rounded-xl text-right font-sans"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-emerald-200" />
              <span>Sauvegarder ce Vrai Samsar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
