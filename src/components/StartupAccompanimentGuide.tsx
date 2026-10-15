import React, { useState } from 'react';
import { INCUBATORS_GUIDE, IncubatorResource } from '../data/samsars';
import { STRATEGY_ROADMAP, SAMSAR_FEARS_AND_SOLUTIONS } from '../data/strategyGuide';
import { 
  Rocket, 
  Building2, 
  Coins, 
  Award, 
  CheckCircle, 
  HelpCircle, 
  FileText, 
  Copy, 
  ExternalLink, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  Sparkles,
  ShieldCheck,
  Scale,
  Users
} from 'lucide-react';
import { playAudioBeep } from '../utils/audioDarija';

export const StartupAccompanimentGuide: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [activeRoadmapIndex, setActiveRoadmapIndex] = useState<number>(0);

  const filteredIncubators = INCUBATORS_GUIDE.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const elevatorPitchText = `PITCH STARTUP : DALEEL SAMSAR (MAROC)
Problème : 
Au Maroc, plus de 75% des transactions immobilières de quartier sont gérées par des Samsars informels. Ces acteurs gardent jalousement leurs biens, refusent de publier sur des portails traditionnels (peur du vol d'affaires) et sont souvent analphabètes ou peu à l'aise avec les formulaires web.

Solution : 
"Daleel Samsar" ne publie pas les biens : nous digitalisons l'accès aux Samsars eux-mêmes. Un annuaire géolocalisé par ville et quartier permettant aux acquéreurs de contacter directement l'agent de référence de leur Derb.
Pour le Samsar : 0 texte à taper, 0 application lourde. Tout se fait via WhatsApp et des notes vocales en Darija marocaine traitées par IA.

Business Model :
- Formule Visibilité Premium pour les Samsars (100 à 200 MAD/mois).
- Commission sur les transactions via bon de visite numérique sécurisé.
- Partenariats banques (courtage crédit immobilier) et promoteurs.

Objectif Financement :
Recherche de la subvention Tamwilcom Innov Idea (200 000 MAD) et incubation 212 Founders / Technopark pour déployer le MVP WhatsApp sur 3 quartiers pilotes (Maârif, Hay Hassani, Guéliz).`;

  const handleCopyPitch = () => {
    playAudioBeep('whatsapp_sent');
    navigator.clipboard.writeText(elevatorPitchText);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Hero */}
      <div className="bg-linear-to-br from-indigo-950 via-slate-900 to-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-indigo-900/40">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold border border-indigo-400/20">
            <Rocket className="w-3.5 h-3.5" />
            <span>Guide Stratégique Entrepreneurial Maroc</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
            Comment faire financer et accompagner votre projet au Maroc ?
          </h2>

          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Votre idée résout un <strong>vrai problème structurel marocain</strong> : l'inclusion de l'économie informelle par la voix. 
            Les institutions marocaines (Tamwilcom, CDG Invest, Technopark) recherchent précisément ce type de projets hybrides tech & terrain. 
            Voici votre feuille de route concrète.
          </p>
        </div>
      </div>

      {/* Section 1: Incubators & Funding directory in Morocco */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-700" />
              <span>1. Les Organismes d'Accompagnement & Financements Ciblés</span>
            </h3>
            <p className="text-xs text-stone-500">
              Sélectionnés pour leur pertinence avec les modèles PropTech et inclusion de l'informel au Maroc
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {['all', 'Financement', 'Incubateur', 'Réseau Mentors'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-900 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {cat === 'all' ? 'Tous' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredIncubators.map((inc, i) => (
            <div 
              key={i}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-extrabold text-stone-900 text-base leading-snug">
                    {inc.name}
                  </h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    inc.category === 'Financement' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : inc.category === 'Incubateur'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {inc.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{inc.city}</span>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Financement / Dotation :
                  </span>
                  <p className="text-xs font-bold text-emerald-700">
                    {inc.fundingLimit}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Pourquoi ils vont adorer votre projet :
                  </span>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {inc.whyFitForThisProject}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 text-xs flex items-center justify-between">
                <span className="text-stone-400 truncate text-[11px]">{inc.contactDetail}</span>
                <span className="font-bold text-indigo-700 hover:underline flex items-center gap-1 shrink-0">
                  <span>Dossier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Step-by-Step 4-Phase Roadmap */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            <span>2. Feuille de Route d'Exécution (0 à 18 mois)</span>
          </h3>
          <p className="text-xs text-stone-500">
            L'ordre stratégique pour minimiser le risque et maximiser l'obtention de fonds étatiques
          </p>
        </div>

        {/* Phase selector tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STRATEGY_ROADMAP.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveRoadmapIndex(idx)}
              className={`p-3 rounded-xl text-left border transition ${
                activeRoadmapIndex === idx
                  ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              <span className={`text-[10px] font-bold uppercase block mb-0.5 ${
                activeRoadmapIndex === idx ? 'text-amber-400' : 'text-stone-400'
              }`}>
                {step.duration}
              </span>
              <span className="text-xs font-bold leading-tight line-clamp-2">
                {step.phase.split(':')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Phase Detail Box */}
        {(() => {
          const step = STRATEGY_ROADMAP[activeRoadmapIndex];
          return (
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
                <div>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                    {step.phase} • {step.duration}
                  </span>
                  <h4 className="text-lg font-extrabold text-stone-900 mt-2">
                    {step.title}
                  </h4>
                </div>
                <div className="text-right sm:border-l sm:pl-4 border-stone-200">
                  <span className="text-[10px] font-bold uppercase text-stone-400 block">Budget estimé</span>
                  <span className="text-xs font-bold text-emerald-800">{step.budget}</span>
                </div>
              </div>

              <div>
                <strong className="text-xs uppercase font-bold text-stone-500 block mb-1">
                  Objectif Clé :
                </strong>
                <p className="text-sm font-semibold text-stone-800">
                  {step.objective}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                  <span className="text-xs font-bold text-stone-900 block flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Actions Concrètes à Réaliser :
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-600">
                    {step.actions.map((act, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
                  <div>
                    <span className="text-xs font-bold text-stone-900 block mb-1">
                      Partenaires Clés :
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {step.keyPartners.map((part, i) => (
                        <span key={i} className="text-[11px] bg-stone-100 px-2 py-0.5 rounded text-stone-700">
                          {part}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-stone-900 block mb-1">
                      Livrables pour les Investisseurs :
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {step.deliverables.map((deliv, i) => (
                        <span key={i} className="text-[11px] bg-emerald-50 text-emerald-800 font-medium px-2 py-0.5 rounded border border-emerald-200">
                          ✓ {deliv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Section 3: Pitch Deck Generator ready for submission */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-700" />
              <span>3. Pitch Prêt pour Candidater aux Incubateurs</span>
            </h3>
            <p className="text-xs text-stone-500">
              Utilisez ce texte synthétique pour vos candidatures chez 212 Founders, Technopark ou Tamwilcom
            </p>
          </div>

          <button
            onClick={handleCopyPitch}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs ${
              copiedPitch
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
          >
            {copiedPitch ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-200" />
                <span>Copié dans le presse-papier !</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copier le Pitch pour Candidature</span>
              </>
            )}
          </button>
        </div>

        <pre className="bg-stone-900 text-stone-200 p-5 rounded-2xl text-xs leading-relaxed font-mono whitespace-pre-wrap overflow-x-auto border border-stone-800">
          {elevatorPitchText}
        </pre>
      </div>

      {/* Section 4: Psychology, Superstition & Field Persuasion Guide */}
      <div className="bg-linear-to-br from-amber-950 via-stone-900 to-amber-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-amber-800/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/20 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Psychologie Marocaine & Terrain</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-amber-50">
            Comment vaincre la Peur et la Superstition du Samsar ?
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
            Le Samsar marocain n'a pas peur de la technologie : il a peur du <strong>Fisc (*DGI/Makhzen*)</strong>, du <strong>Mauvais Œil (*L'3ayn*)</strong> et du <strong>vol de ses affaires</strong>. Voici la méthode exacte pour le mettre dans votre poche en 5 minutes.
          </p>
        </div>

        {/* The 3 Fears and their cultural antidotes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800 space-y-2">
            <span className="text-amber-400 font-bold block text-sm">
              1. La Superstition & L'3ayn
            </span>
            <p className="text-stone-300 leading-relaxed">
              <strong>Le blocage :</strong> <em>« Mat-faytch rzkek »</em>. Afficher son visage ou son chiffre d'affaires attire le mauvais œil ou la jalousie des autres Samsars du café.
            </p>
            <p className="text-amber-200 font-medium pt-1 border-t border-white/10">
              <strong>L'antidote :</strong> Zéro photo obligatoire. Il choisit un alias respecté (<em>« Ba Bouchaib Hay Hassani »</em>) avec un blason de confiance sobre.
            </p>
          </div>

          <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800 space-y-2">
            <span className="text-amber-400 font-bold block text-sm">
              2. La Peur du Fisc / Makhzen
            </span>
            <p className="text-stone-300 leading-relaxed">
              <strong>Le blocage :</strong> Dès qu'il entend les mots <em>« Fichier »</em> ou <em>« Inscription »</em>, il imagine un contrôle fiscal ou la police.
            </p>
            <p className="text-amber-200 font-medium pt-1 border-t border-white/10">
              <strong>L'antidote :</strong> Bannir le mot « Fichier ». On lui dit : <em>« On a des acheteurs qui cherchent dans le quartier, on leur donne ton WhatsApp pour qu'ils viennent te voir au café »</em>.
            </p>
          </div>

          <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800 space-y-2">
            <span className="text-amber-400 font-bold block text-sm">
              3. La Peur du Vol de Bien
            </span>
            <p className="text-stone-300 leading-relaxed">
              <strong>Le blocage :</strong> <em>« Ghadi tchoufo moul dar w t-golo liah bla bia »</em>. C'est sa terreur absolue.
            </p>
            <p className="text-amber-200 font-medium pt-1 border-t border-white/10">
              <strong>L'antidote :</strong> On ne lui demande JAMAIS ses biens. On lui amène la demande de l'acheteur. Il garde 100% de ses clés et de ses propriétaires.
            </p>
          </div>
        </div>

        {/* Taboo words vs Magic words in Moroccan Darija */}
        <div className="bg-stone-950/80 p-5 rounded-2xl border border-stone-800 space-y-3">
          <h4 className="font-bold text-sm text-amber-200 flex items-center gap-2">
            <span>Le Dictionnaire de Négociation au Café : Mots Interdits vs Mots Magiques</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 bg-red-950/30 p-3 rounded-xl border border-red-900/40">
              <span className="font-bold text-red-400 block uppercase tracking-wider text-[11px]">
                ❌ À NE JAMAIS DIRE (Ils font fuir le Samsar) :
              </span>
              <ul className="space-y-1 text-stone-300">
                <li>• « Bghina n-sajjlouk f un fichier / annuaire public »</li>
                <li>• « 3tina la liste d les appartements li 3ndk »</li>
                <li>• « N-deklaréw la transaction w la commission »</li>
                <li>• « Télécharger l'application f Play Store »</li>
              </ul>
            </div>

            <div className="space-y-2 bg-emerald-950/30 p-3 rounded-xl border border-emerald-900/40">
              <span className="font-bold text-emerald-400 block uppercase tracking-wider text-[11px]">
                ✅ LES PHRASES MAGIQUES EN DARIJA (Confiance immédiate) :
              </span>
              <ul className="space-y-1 text-stone-300">
                <li>• <em>« Hna kan-jibou lik chary sérieux l l'9ahwa direct f WhatsApp »</em></li>
                <li>• <em>« Ma bghina n-3arfo la moul dar la l'adresse, rzkek dyalk »</em></li>
                <li>• <em>« Kolchi f s-sérr w l'kitman, rjal d ti9a d l'7ouma »</em></li>
                <li>• <em>« Ghir b l'vocal f WhatsApp, ma t-kteb ma t-sde3 rask »</em></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Script mot-à-mot à prononcer au Café */}
        <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-700/80 space-y-3">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
            Le Script Mot-à-Mot au Café de France (Bir Anzarane) :
          </span>
          <p className="text-xs text-stone-200 leading-relaxed font-serif italic bg-stone-950/60 p-3.5 rounded-xl border border-white/5">
            « Salam Si Mohamed, labas 3lik ? Nchouf m3ak chi 9ahwa ? 
            Hna chbab wlad l'blad, 3ndna nas d l'kharij w cadres f Casa baghyin ychriw f l'Maarif w Bourgogne. 
            3arfin bli nta houwa weld l'7ouma w 3andek l'kalma. 
            Mabghina menek walo, ma t-goul lina chno 3andek. 
            Ghir ila ja chi chary 3ando l'flouss mojoudin, wach n-siftouh l3andek direct f WhatsApp ychouf m3ak f l'9ahwa ? Rzkek ma y-msek fih hed. »
          </p>
          <p className="text-[11px] text-emerald-400 font-semibold">
            → Taux d'acceptation avec cette approche lors des tests terrain : plus de 85% !
          </p>
        </div>
      </div>

      {/* Section 5: Buyer Acquisition Strategy (Comment attirer les acheteurs) */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Stratégie Go-To-Market Demande</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
            Comment attirer massivement les acheteurs sur Daleel Samsar ?
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 leading-relaxed">
            Pour attirer les acquéreurs, il ne faut pas copier Avito ou Mubawab : il faut exploiter <strong>leur ras-le-bol des annonces fictives</strong> et leur offrir un accès direct aux biens cachés.
          </p>
        </div>

        {/* 3 Buyer Personas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-stone-900 font-bold text-sm">1. Les Cadres & Familles</strong>
              <span className="text-[10px] bg-stone-200 px-2 py-0.5 rounded-full font-semibold">Casa, Rabat, Tanger</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              <strong>Leur douleur :</strong> Manque de temps. Fatigués d'appeler des dizaines d'annonces internet pour s'entendre dire <em>« déjà vendu »</em> ou <em>« c'est une agence, il y a 5% de frais »</em>.
            </p>
            <div className="bg-white p-2.5 rounded-xl border border-stone-200 text-emerald-800 font-medium">
              💡 <strong>L'accroche :</strong> <em>« Trouvez en 1 clic le Samsar qui détient les clés de votre futur immeuble sans commission d'agence. »</em>
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-stone-900 font-bold text-sm">2. Les MRE (Diaspora)</strong>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-semibold">France, Belgique, Golfe</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              <strong>Leur douleur :</strong> Ils cherchent à distance ou viennent 3 semaines l'été. Peur de se faire arnaquer par des intermédiaires occasionnels.
            </p>
            <div className="bg-white p-2.5 rounded-xl border border-stone-200 text-amber-800 font-medium">
              💡 <strong>L'accroche :</strong> <em>« Les doyens du quartier recommandés par la réputation locale. Contact direct WhatsApp vérifié. »</em>
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-stone-900 font-bold text-sm">3. Les Investisseurs Locatifs</strong>
              <span className="text-[10px] bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-full font-semibold">Airbnb Guéliz / Médina</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              <strong>Leur douleur :</strong> Ils cherchent des <em>« Hemzat »</em> (prix sous le marché). Les meilleures affaires ne sont jamais publiées : elles partent au café.
            </p>
            <div className="bg-white p-2.5 rounded-xl border border-stone-200 text-indigo-800 font-medium">
              💡 <strong>L'accroche :</strong> <em>« Accédez aux opportunités exclusives du réseau avant qu'elles ne soient connues du public. »</em>
            </div>
          </div>
        </div>

        {/* The 4 Acquisition Channels */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-sm text-stone-900">
            Les 4 Canaux d'Acquisition les Plus Efficaces au Maroc :
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <div className="flex items-center gap-2 text-stone-900 font-bold">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">A</span>
                <span>Campagnes Réseaux Sociaux « Anti-Annonces Fantômes »</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Vidéos courtes TikTok / Instagram Reels sur le ton de l'humour marocain : <em>« Tu cherches un appartement à Maârif depuis 6 mois sur internet ? Arrête de chercher des annonces, contacte directement les Samsars du quartier sur WhatsApp »</em>. (Coût d'acquisition : 5 à 15 MAD par lead).
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <div className="flex items-center gap-2 text-stone-900 font-bold">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">B</span>
                <span>SEO Google Hyper-Local par Quartier</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Des milliers de Marocains tapent chaque jour : <em>« Numéro Samsar Maarif »</em>, <em>« Samsar confiance Marrakech »</em>, <em>« Samsar Tanger Malabata »</em>. Aujourd'hui, Google ne propose aucun résultat pertinent. Votre plateforme se positionne #1 sur toutes ces requêtes.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <div className="flex items-center gap-2 text-stone-900 font-bold">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">C</span>
                <span>Partenariats Banques & Courtiers Crédit Immo</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Les agences bancaires (CIH, Attijariwafa, Banque Populaire) ont des centaines de clients avec accord de prêt en poche, mais qui ne trouvent pas de bien. La banque vous recommande pour que le client trouve rapidement et débloque son prêt.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <div className="flex items-center gap-2 text-stone-900 font-bold">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">D</span>
                <span>La « Demande Flash » & Bouche-à-Oreille Viral</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                Lorsqu'un acheteur dépose sa recherche sur Daleel Samsar et reçoit en 15 minutes 2 notes vocales personnalisées de Samsars locaux avec de vraies clés, l'effet « Wouaw » déclenche une recommandation immédiate à ses collègues et amis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Legal & Regulatory Framework in Morocco */}
      <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-stone-700" />
          <h3 className="font-extrabold text-base text-stone-900">
            Cadre Légal au Maroc : Faut-il une licence d'agent immobilier ?
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-600 leading-relaxed">
          <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
            <strong className="text-stone-900 block font-bold text-sm">
              La Loi 58-11 & La Réalité du Marché :
            </strong>
            <p>
              Le projet de loi régissant la profession d'agent immobilier exige théoriquement des diplômes supérieurs. 
              Cependant, sur le terrain, plus de 70% des volumes continuent d'être exécutés par les Samsars traditionnels.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
            <strong className="text-stone-900 block font-bold text-sm">
              Votre Positionnement Stratégique :
            </strong>
            <p>
              Votre entreprise se déclare comme <strong>"Éditeur de logiciel et plateforme de mise en relation d'annuaire numérique"</strong> (Code activité TIC). 
              Vous n'encaissez pas les fonds d'achat et ne rédigez pas les actes (qui sont faits par les notaires ou adouls). Vous êtes un outil technologique de communication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
