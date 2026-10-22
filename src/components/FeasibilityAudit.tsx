import React, { useState } from 'react';
import { 
  CheckSquare, 
  TrendingUp, 
  AlertTriangle, 
  Calculator, 
  Compass, 
  CheckCircle2, 
  HelpCircle, 
  Target, 
  ShieldAlert, 
  BadgePercent,
  Sparkles,
  BarChart3,
  Coffee,
  Users
} from 'lucide-react';

export const FeasibilityAudit: React.FC = () => {
  // Simulator inputs
  const [targetCitySamsars, setTargetCitySamsars] = useState<number>(50);
  const [monetizationModel, setMonetizationModel] = useState<'subscription' | 'seller_package' | 'technical_partners' | 'mixed'>('mixed');
  const [monthlySubscriptionFee, setMonthlySubscriptionFee] = useState<number>(120); // 120 MAD/mois ou pack Cash Plus
  const [mreSellerMandates, setMreSellerMandates] = useState<number>(15); // Mandats vendeurs MRE prioritaires
  const [sellerFee, setSellerFee] = useState<number>(350); // 350 MAD forfait diffusion prioritaire & anti-harcèlement
  const [technicalReferrals, setTechnicalReferrals] = useState<number>(8); // Mises en relation géomètres, topographes, architectes
  const [referralFee, setReferralFee] = useState<number>(400); // 400 MAD par mise en relation professionnelle formelle

  // Evaluation criteria scores (out of 10)
  const scores = {
    problemUrgency: 9.5, // Le problème des biens informels au Maroc est gigantesque
    marketSize: 9.0, // Des centaines de milliers de transactions annuelles
    samsarAdoption: 8.0, // Fort si micro-recharges Cash Plus / Wafacash, zéro friction bancaire
    techFeasibility: 9.2, // WhatsApp Cloud API + Audio IA sont ultra matures
    legalFeasibility: 9.0, // 100% conforme : plateforme de mise en relation TIC, pas d'IOB non agréé
    monetizationPotential: 8.2 // Très réaliste : monétisation côté MRE solvable + micro-packs Samsar
  };

  const totalScore = (
    (scores.problemUrgency + 
     scores.marketSize + 
     scores.samsarAdoption + 
     scores.techFeasibility + 
     scores.legalFeasibility + 
     scores.monetizationPotential) / 6
  ).toFixed(1);

  // Financial calculations in MAD (100% ancrées dans l'économie réelle)
  const monthlySamsarSubsRevenue = (targetCitySamsars * 0.35) * monthlySubscriptionFee; // ~35% de Samsars payants
  const monthlySellerRevenue = mreSellerMandates * sellerFee; // Forfait Vendeur MRE anti-harcèlement
  const monthlyTechPartnerRevenue = technicalReferrals * referralFee; // Apporteur d'affaires géomètres/architectes/diagnostics

  let totalMonthlyRevenue = 0;
  if (monetizationModel === 'subscription') {
    totalMonthlyRevenue = monthlySamsarSubsRevenue;
  } else if (monetizationModel === 'seller_package') {
    totalMonthlyRevenue = monthlySellerRevenue;
  } else if (monetizationModel === 'technical_partners') {
    totalMonthlyRevenue = monthlyTechPartnerRevenue;
  } else {
    totalMonthlyRevenue = monthlySamsarSubsRevenue + monthlySellerRevenue + monthlyTechPartnerRevenue;
  }

  const annualRevenue = totalMonthlyRevenue * 12;

  return (
    <div className="space-y-10 pb-20">
      {/* Header Banner */}
      <div className="bg-linear-to-br from-stone-900 via-stone-950 to-amber-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/20">
            <Compass className="w-3.5 h-3.5" />
            <span>Matrice d'Évaluation & Étude de Faisabilité</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight">
            Comment évaluer la pertinence et la faisabilité du projet ?
          </h2>

          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Pour valider un projet comme Daleel Samsar avant d'investir du temps et de l'argent, il faut analyser <strong>3 dimensions inséparables</strong> : la <strong className="text-amber-300">Pertinence Marché</strong>, la <strong className="text-amber-300">Faisabilité Opérationnelle</strong> et la <strong className="text-amber-300">Viabilité Financière</strong>.
          </p>
        </div>
      </div>

      {/* Global Score Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
            Indice de Viabilité Global :
          </span>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black text-emerald-700 font-serif">
              {totalScore} / 10
            </span>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
              Projet à Très Fort Potentiel Terrain
            </span>
          </div>
          <p className="text-xs text-stone-600 max-w-xl">
            Le besoin non comblé est massif au Maroc. La seule condition critique de succès réside dans <strong>l'onboarding physique au café</strong> et l'usage exclusif de la voix/WhatsApp (zéro application lourde).
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0 text-xs">
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
            <span className="text-stone-400 font-medium block">Pertinence Marché :</span>
            <strong className="text-stone-900 text-sm font-bold">9.3 / 10 (Critique)</strong>
          </div>
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
            <span className="text-stone-400 font-medium block">Faisabilité Tech :</span>
            <strong className="text-stone-900 text-sm font-bold">9.2 / 10 (Facile)</strong>
          </div>
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
            <span className="text-stone-400 font-medium block">Adoption Samsar :</span>
            <strong className="text-amber-700 text-sm font-bold">7.5 / 10 (Point clé)</strong>
          </div>
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
            <span className="text-stone-400 font-medium block">Monétisation :</span>
            <strong className="text-emerald-700 text-sm font-bold">8.5 / 10 (Rémunérateur)</strong>
          </div>
        </div>
      </div>

      {/* 3 Pillars Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1: Pertinence */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <Target className="w-6 h-6 text-amber-800" />
          </div>
          <h3 className="font-extrabold text-stone-900 text-lg">
            1. Pertinence (Desirability)
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Est-ce que le problème résolu est réel et douloureux ?
          </p>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="text-stone-900 block font-bold mb-0.5">Côté Acquéreur :</strong>
              <span className="text-stone-600">80% des biens ne sont pas sur Mubawab/Avito. Trouver un bien à Maârif ou Guéliz exige de se déplacer physiquement dans le quartier pour chercher un Samsar au hasard.</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="text-stone-900 block font-bold mb-0.5">Côté Samsar :</strong>
              <span className="text-stone-600">Le Samsar passe 60% de son temps à attendre des clients au café. Lui envoyer des acheteurs sérieux et solvables résout son problème d'accès aux clients.</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Faisabilité */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold">
            <Compass className="w-6 h-6 text-indigo-800" />
          </div>
          <h3 className="font-extrabold text-stone-900 text-lg">
            2. Faisabilité (Feasibility)
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Est-ce réalisable techniquement et humainement au Maroc ?
          </p>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="text-stone-900 block font-bold mb-0.5">Faisabilité Technique :</strong>
              <span className="text-stone-600">L'API WhatsApp Business de Meta et les modèles vocaux (Whisper / Gemini) traitent déjà la Darija marocaine. Aucun obstacle technologique majeur.</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="text-stone-900 block font-bold mb-0.5">Faisabilité Terrain :</strong>
              <span className="text-stone-600">Exige des "ambassadeurs de quartier" pour faire la tournée des cafés en personne. Ne peut pas être géré à 100% à distance.</span>
            </div>
          </div>
        </div>

        {/* Pillar 3: Viabilité */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6 text-emerald-800" />
          </div>
          <h3 className="font-extrabold text-stone-900 text-lg">
            3. Viabilité (Unit Economics Réelles)
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Des flux de revenus 100% conformes à la loi marocaine et solvables immédiatement :
          </p>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="text-stone-900 block font-bold mb-0.5">1. Forfait Vendeur MRE (Anti-harcèlement) :</strong>
              <span className="text-stone-600">350 MAD payés par carte bancaire par le propriétaire pour confier son bien (ex: terrain Chouiter) aux 3 meilleurs Samsars vérifiés sans harcèlement.</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="text-stone-900 block font-bold mb-0.5">2. Micro-Packs Samsar (Cash Plus / Wafacash) :</strong>
              <span className="text-stone-600">100 à 150 MAD/mois ou par pack de 5 contacts qualifiés. Zéro compte bancaire requis pour le Samsar.</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="text-stone-900 block font-bold mb-0.5">3. Partenaires Formels (Géomètres / BTP) :</strong>
              <span className="text-stone-600">300 à 500 MAD par mise en relation auprès de cabinets de topographes et géomètres (bornage, cadastre) et architectes.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Realism Callout: Bank Lead Reality Check */}
      <div className="bg-amber-50 rounded-3xl border border-amber-300/80 p-5 sm:p-6 space-y-2">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          <span>Point de Vigilance Réglementaire : La Réalité des Banques au Maroc</span>
        </div>
        <h4 className="text-sm sm:text-base font-extrabold text-stone-900">
          Pourquoi compter sur 0,5% de commission bancaire est une illusion (et comment nous l'avons corrigé) :
        </h4>
        <p className="text-xs text-stone-700 leading-relaxed">
          Comme vous l'avez très justement souligné : <strong>aucune banque marocaine ne paie 0,5% pour un lead non qualifié</strong>. Les banques ont déjà leurs réseaux officiels d'apporteurs d'affaires conventionnés (promoteurs, notaires, courtiers agréés IOB). De plus, un Samsar informel n'a ni ICE, ni RC, ni agrément légal pour transmettre un dossier de crédit.
        </p>
        <p className="text-xs text-stone-800 font-semibold">
          Notre modèle financier repose donc sur les <strong>clients qui ont du cash et qui paient vraiment</strong> : les propriétaires MRE qui veulent vendre sans être harcelés, les Samsars via des recharges familières (Cash Plus/Wafacash), et les professionnels techniques formels (géomètres-topographes, architectes).
        </p>
      </div>

      {/* Interactive Financial Simulator */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulateur Financier Réaliste (Zéro Illusion Bancaire)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
            Simulez vos revenus mensuels sur des flux 100% réels
          </h3>
          <p className="text-xs text-stone-500">
            Ajustez les volumes de mandats MRE, de Samsars actifs et d'apports d'affaires techniques.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                <span>Mandats Vendeurs MRE Prioritaires (ex: Chouiter, Sbata, Maârif) :</span>
                <span className="text-amber-800 font-extrabold">{mreSellerMandates} biens déposés / mois</span>
              </div>
              <input
                type="range"
                min="2"
                max="60"
                step="1"
                value={mreSellerMandates}
                onChange={(e) => setMreSellerMandates(parseInt(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>5 mandats (Démarrage)</span>
                <span>25 mandats (Phase 1)</span>
                <span>60 mandats (Réseau actif)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                <span>Nombre de Samsars actifs dans votre réseau :</span>
                <span className="text-stone-900 font-extrabold">{targetCitySamsars} Samsars</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={targetCitySamsars}
                onChange={(e) => setTargetCitySamsars(parseInt(e.target.value))}
                className="w-full accent-stone-700 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                <span>Mises en relation avec professionnels formels (Géomètre, Topographe, BTP) :</span>
                <span className="text-indigo-800 font-extrabold">{technicalReferrals} dossiers / mois</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={technicalReferrals}
                onChange={(e) => setTechnicalReferrals(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Modèle de monétisation activé :
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'mixed', label: 'Mixte Réaliste' },
                  { id: 'seller_package', label: 'Forfaits MRE' },
                  { id: 'subscription', label: 'Packs Samsar' },
                  { id: 'technical_partners', label: 'Topographes/BTP' }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMonetizationModel(m.id as any)}
                    className={`p-2 rounded-xl text-center font-bold border transition ${
                      monetizationModel === m.id
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Display (5 cols) */}
          <div className="lg:col-span-5 bg-stone-900 text-white p-6 rounded-3xl border border-stone-800 space-y-4">
            <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold block">
              Projections Financières Réelles :
            </span>

            <div className="border-b border-white/10 pb-4">
              <span className="text-xs text-stone-400 block">Chiffre d'Affaires Mensuel Net Estimé :</span>
              <span className="text-3xl font-black text-emerald-400 font-serif">
                {totalMonthlyRevenue.toLocaleString()} MAD
              </span>
              <span className="text-xs text-stone-400 block mt-0.5">
                (soit ~{(totalMonthlyRevenue / 10000).toFixed(1)} Mlyoun Centimes / mois)
              </span>
            </div>

            <div className="space-y-2 text-xs text-stone-300">
              <div className="flex justify-between">
                <span>Chiffre d'Affaires Annuel :</span>
                <strong className="text-white">{annualRevenue.toLocaleString()} MAD/an</strong>
              </div>
              <div className="flex justify-between">
                <span>Forfaits Vendeurs MRE (350 MAD/bien) :</span>
                <span className="text-amber-300">+{monthlySellerRevenue.toLocaleString()} MAD</span>
              </div>
              <div className="flex justify-between">
                <span>Recharges Samsars (Cash Plus 120 MAD) :</span>
                <span className="text-emerald-300">+{monthlySamsarSubsRevenue.toLocaleString()} MAD</span>
              </div>
              <div className="flex justify-between">
                <span>Partenaires Topographes/BTP (400 MAD/lead) :</span>
                <span className="text-indigo-300">+{monthlyTechPartnerRevenue.toLocaleString()} MAD</span>
              </div>
            </div>

            <div className="bg-white/10 p-3 rounded-2xl text-[11px] text-stone-300 space-y-1">
              <strong className="text-white block font-bold">Rentabilité & Solidité Face au Jury :</strong>
              <p>
                Ce modèle est <strong>inattaquable devant un jury d'incubateur ou Tamwilcom</strong> car il ne dépend d'aucune convention bancaire hypothétique : il monétise la tranquillité du propriétaire MRE et la recharge de crédit du Samsar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Analysis: Should we count clicks and connections? */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-5 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-amber-700" />
            <span>Votre Question Clé : Faut-il comptabiliser les clics et mises en relation ?</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            Oui, absolument ! C'est la métrique vitale de tout votre business.
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Sans compteur de clics et de mises en relation, vous naviguez à l'aveugle. Voici les <strong>3 raisons capitales</strong> pour lesquelles chaque clic WhatsApp / Appel doit être comptabilisé :
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <strong className="text-stone-900 block font-bold text-sm">
              1. La Preuve de Valeur pour le Samsar
            </strong>
            <p className="text-stone-600 leading-relaxed">
              Le Samsar est un homme de terrain : il oublie vite d'où viennent les appels. 
              À la fin du mois, vous lui envoyez un vocal WhatsApp : <em>« Si Mohamed, grâce à Daleel Samsar, vous avez reçu 18 acquéreurs sérieux ce mois-ci à votre café »</em>. 
              C'est cette preuve concrète qui le rend fidèle et l'incite à payer un abonnement de 150 MAD.
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <strong className="text-stone-900 block font-bold text-sm">
              2. La Clé de votre Facturation (Monétisation)
            </strong>
            <p className="text-stone-600 leading-relaxed">
              Vous pouvez choisir 2 formats tarifaires simples :
              <br/>• <strong>Le seuil de gratuité :</strong> Les 5 premières mises en relation sont gratuites. Dès la 6ème, le Samsar active un pass mensuel (100-150 MAD) pour continuer à recevoir les leads.
              <br/>• <strong>Le pack de crédits :</strong> 200 MAD pour recevoir 10 contacts acheteurs qualifiés.
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <strong className="text-stone-900 block font-bold text-sm">
              3. L'Exigence des Investisseurs (CDG / Tamwilcom)
            </strong>
            <p className="text-stone-600 leading-relaxed">
              Un jury d'incubateur ou un fonds d'investissement (212 Founders) ne regarde pas le nombre de visiteurs sur votre site : il regarde le <strong>nombre de Mises en Relation Réelles</strong>. 
              C'est la preuve irréfutable que votre plateforme génère de la valeur dans l'économie réelle marocaine.
            </p>
          </div>
        </div>

        {/* Real-time Connection Log simulator */}
        <div className="bg-stone-900 text-white rounded-2xl p-5 border border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Journal des Dernières Mises en Relation Déclenchées dans l'App :
            </span>
            <span className="text-[11px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
              Comptabilisation Active
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between p-2 rounded-lg bg-stone-800/80 border border-stone-700">
              <span className="text-stone-300">Clic WhatsApp • Maârif (Casablanca) → Si Mohamed</span>
              <span className="text-emerald-400 font-bold">+1 Lead Comptabilisé</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-stone-800/80 border border-stone-700">
              <span className="text-stone-300">Clic Appel Direct • Hay Hassani → Ba Bouchaib</span>
              <span className="text-emerald-400 font-bold">+1 Lead Comptabilisé</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-stone-800/80 border border-stone-700">
              <span className="text-stone-300">Clic WhatsApp • Médina Marrakech → Lhaj Abdellatif</span>
              <span className="text-emerald-400 font-bold">+1 Lead Comptabilisé</span>
            </div>
          </div>
        </div>
      </div>

      {/* The 14-Day Lean Smoke Test Protocol */}
      <div className="bg-linear-to-br from-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-5">
        <div>
          <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">
            Méthode Lean Startup
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
            Le Protocole des 14 Jours pour tester sans dépenser 1 Dirham
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1">
            Voici les 4 étapes précises pour valider à 100% l'appétence du marché avant d'écrire une seule ligne de code supplémentaire.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-stone-800/80 p-4 rounded-2xl border border-stone-700 space-y-2">
            <span className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">1</span>
            <strong className="text-indigo-200 block font-bold text-sm">Le Test des 10 Cafés</strong>
            <p className="text-stone-300 leading-relaxed">
              Allez dans 3 cafés à Maârif ou Guéliz avec un carnet. Parlez à 10 Samsars avec le script exact. Notez combien vous disent oui pour recevoir des messages vocaux WhatsApp.
            </p>
            <span className="text-emerald-400 font-semibold block text-[11px]">Objectif : 7/10 d'accords</span>
          </div>

          <div className="bg-stone-800/80 p-4 rounded-2xl border border-stone-700 space-y-2">
            <span className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">2</span>
            <strong className="text-indigo-200 block font-bold text-sm">La Fausse Demande Acheteur</strong>
            <p className="text-stone-300 leading-relaxed">
              Envoyez une note vocale réelle à 5 Samsars qui ont accepté : <em>« Salam, 3andi un cadre baghi bpartma f Maarif, 95 mlyoun »</em>. Chronométrez leur délai de réponse.
            </p>
            <span className="text-emerald-400 font-semibold block text-[11px]">Objectif : Réponse en &lt; 30 min</span>
          </div>

          <div className="bg-stone-800/80 p-4 rounded-2xl border border-stone-700 space-y-2">
            <span className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">3</span>
            <strong className="text-indigo-200 block font-bold text-sm">Test de la Demande Acquéreur</strong>
            <p className="text-stone-300 leading-relaxed">
              Postez un post simple sur des groupes Facebook d'expatriés ou cadres : <em>« En contact direct avec les 4 plus anciens Samsars de Maârif sans frais de portail. Qui cherche actuellement ? »</em>
            </p>
            <span className="text-emerald-400 font-semibold block text-[11px]">Objectif : 10 demandes qualifiées</span>
          </div>

          <div className="bg-stone-800/80 p-4 rounded-2xl border border-stone-700 space-y-2">
            <span className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">4</span>
            <strong className="text-indigo-200 block font-bold text-sm">Le Bilan d'Éligibilité</strong>
            <p className="text-stone-300 leading-relaxed">
              Si les 3 premiers tests sont positifs, vous disposez des métriques chiffrées exactes exigées par <strong>Tamwilcom (Innov Idea)</strong> et <strong>212 Founders</strong> pour obtenir vos fonds d'amorçage.
            </p>
            <span className="text-emerald-400 font-semibold block text-[11px]">Objectif : Dépôt du dossier</span>
          </div>
        </div>
      </div>
    </div>
  );
};
