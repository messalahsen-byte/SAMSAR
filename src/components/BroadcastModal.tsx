import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  CheckCircle2, 
  Building, 
  Coins, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { CITIES_DATA, SAMSARS_DATA } from '../data/samsars';
import { speakDarija, playAudioBeep } from '../utils/audioDarija';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCity?: string;
  defaultDistrict?: string;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  isOpen,
  onClose,
  defaultCity = 'casablanca',
  defaultDistrict = 'maarif'
}) => {
  const [cityId, setCityId] = useState(defaultCity);
  const [districtId, setDistrictId] = useState(defaultDistrict);
  const [propertyType, setPropertyType] = useState('appartement');
  const [budgetRange, setBudgetRange] = useState('80 - 120 Mlyoun Centimes');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [hasRecordedVoice, setHasRecordedVoice] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentCity = CITIES_DATA.find(c => c.id === cityId) || CITIES_DATA[0];
  const targetSamsars = SAMSARS_DATA.filter(s => s.city === cityId && (districtId === 'all' || s.districts.includes(districtId)));

  const handleToggleRecord = () => {
    if (!isRecording) {
      playAudioBeep('record_start');
      setIsRecording(true);
      const timer = setInterval(() => {
        setRecordingDuration(d => {
          if (d >= 8) {
            clearInterval(timer);
            setIsRecording(false);
            setHasRecordedVoice(true);
            playAudioBeep('record_end');
            return 8;
          }
          return d + 1;
        });
      }, 1000);
    } else {
      setIsRecording(false);
      setHasRecordedVoice(true);
      playAudioBeep('record_end');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playAudioBeep('whatsapp_sent');
    setIsSubmitted(true);
    speakDarija(
      "Safé ! Demande dialk tsiftat l " + targetSamsars.length + " d Samsara f " + (districtId !== 'all' ? districtId : cityId) + ". Ghadi ytaslo bik f WhatsApp direct."
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-sm"
        >
          ✕
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Diffusion Flash aux Samsars</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900">
                Diffuser votre recherche dans un quartier
              </h3>
              <p className="text-xs text-stone-500">
                Votre demande sera transmise instantanément sur WhatsApp aux Samsars vérifiés de la zone sans intermédiaire.
              </p>
            </div>

            {/* City & District */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Ville</label>
                <select
                  value={cityId}
                  onChange={(e) => {
                    setCityId(e.target.value);
                    setDistrictId('all');
                  }}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                >
                  {CITIES_DATA.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Quartier</label>
                <select
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                >
                  <option value="all">Tous les quartiers</option>
                  {currentCity.districts.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Property type & Budget */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Type de bien</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                >
                  <option value="appartement">🏢 Appartement</option>
                  <option value="villa">🏡 Villa</option>
                  <option value="terrain">🗺️ Terrain</option>
                  <option value="commercial">🏬 Local Commercial</option>
                  <option value="riad">🕌 Riad (Médina)</option>
                  <option value="location">🔑 Location</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Budget approximatif</label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                >
                  <option value="Moins de 50 Mlyoun">Moins de 50 Mlyoun</option>
                  <option value="50 - 80 Mlyoun">50 - 80 Mlyoun</option>
                  <option value="80 - 120 Mlyoun">80 - 120 Mlyoun</option>
                  <option value="120 - 200 Mlyoun">120 - 200 Mlyoun</option>
                  <option value="Plus de 200 Mlyoun">Plus de 200 Mlyoun</option>
                </select>
              </div>
            </div>

            {/* Voice Note Option (Zero typing) */}
            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-amber-700" />
                  <span>Enregistrer une note vocale (Darija ou Français) :</span>
                </span>
                {hasRecordedVoice && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    ✓ Audio prêt
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggleRecord}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition shadow-xs ${
                    isRecording 
                      ? 'bg-red-600 text-white animate-pulse'
                      : hasRecordedVoice
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-white hover:bg-stone-50 text-stone-800 border border-amber-300'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      <span>Enregistrement en cours ({recordingDuration}s)... Taper pour arrêter</span>
                    </>
                  ) : hasRecordedVoice ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Ré-enregistrer le message vocal</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-amber-600" />
                      <span>Appuyer pour parler en Darija</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Text details */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Détails supplémentaires (Optionnel) :
              </label>
              <textarea
                rows={2}
                placeholder="Ex : Étage élevé avec ascenseur, proche du tramway..."
                value={clientNotes}
                onChange={(e) => setClientNotes(e.target.value)}
                className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Votre Prénom</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Mehdi"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">N° WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="06 61..."
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Diffuser à {targetSamsars.length} Samsars de {currentCity.name}</span>
            </button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-extrabold text-stone-900">
              Demande transmise avec succès !
            </h3>

            <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
              Votre recherche a été transmise aux <strong>{targetSamsars.length} Samsars référents</strong> de la zone via leur WhatsApp officiel. 
              Vous recevrez directement un appel ou un message vocal du premier Samsar ayant un bien correspondant.
            </p>

            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
