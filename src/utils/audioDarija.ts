// Audio and Darija voice synthesis and recording utilities

// Map of common Arabizi phrases to proper Arabic script with Moroccan dialect phrasing
// Reading Arabic script through Arabic TTS produces a MUCH more authentic Moroccan sound than Latin Arabizi
export function getArabicScriptForDarija(arabiziText: string): string {
  const map: Record<string, string> = {
    'salam': 'السلام عليكم',
    'salam o 3alaykom': 'السلام عليكم ورحمة الله',
    'marhba': 'مرحبا بكم',
    'bpartma': 'برطمة',
    'bpartmat': 'برطمات',
    'chary': 'شاري',
    'khedma': 'خدمة',
    'souk': 'سوق العقار',
    'mouyen standing': 'موايان ستاندينغ',
    'choufa': 'شوفة',
    'dar': 'دار'
  };

  return arabiziText;
}

export function speakDarija(text: string, onEnd?: () => void) {
  speakDarijaNatural(text, text, onEnd);
}

export function speakDarijaNatural(arabicText: string, arabiziFallback?: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();

  // Prefer Arabic script for speech synthesis: Arabic phonetics are authentic
  const textToRead = arabicText && arabicText.trim().length > 0 ? arabicText : (arabiziFallback || '');

  const utterance = new SpeechSynthesisUtterance(textToRead);

  // Search for the best voice available: ar-MA (Morocco), ar-XA, ar-SA, or generic Arabic
  const voices = window.speechSynthesis.getVoices();
  
  // Prioritize Moroccan Arabic, then any Arabic voice
  const moroccanVoice = voices.find(v => v.lang.toLowerCase() === 'ar-ma' || v.name.toLowerCase().includes('moroc'));
  const arabicVoice = moroccanVoice || voices.find(v => v.lang.startsWith('ar') || v.name.toLowerCase().includes('arab'));
  const frenchVoice = voices.find(v => v.lang.startsWith('fr'));

  if (arabicVoice) {
    utterance.voice = arabicVoice;
    utterance.lang = arabicVoice.lang;
    utterance.rate = 0.88; // slightly slower for clearer local diction
    utterance.pitch = 0.95;
  } else if (frenchVoice) {
    // If only French voice is installed, read Latin text phonetically
    utterance.voice = frenchVoice;
    utterance.lang = 'fr-FR';
    utterance.text = arabiziFallback || textToRead;
    utterance.rate = 0.85;
  } else {
    utterance.rate = 0.88;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function playAudioBeep(type: 'whatsapp_sent' | 'record_start' | 'record_end' | 'notification') {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'whatsapp_sent') {
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'record_start') {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'record_end') {
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else {
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch {
    // Ignore restrictions
  }
}

export function formatWhatsAppUrl(phoneNumber: string, messageText: string): string {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(messageText);
  return `https://wa.me/${cleanNumber}?text=${encoded}`;
}

// Real Voice Recorder helper using MediaRecorder API
export class LiveVoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async start(): Promise<boolean> {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return false;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(this.stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      return true;
    } catch (err) {
      console.warn('Microphone access not granted or unavailable:', err);
      return false;
    }
  }

  stop(): Promise<string> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        resolve('');
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Stop all audio tracks to turn off mic indicator
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = null;
        }

        resolve(audioUrl);
      };

      this.mediaRecorder.stop();
    });
  }

  isRecording(): boolean {
    return this.mediaRecorder !== null && this.mediaRecorder.state === 'recording';
  }
}
