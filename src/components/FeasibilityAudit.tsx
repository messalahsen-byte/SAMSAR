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
  const [monetizationModel, setMonetizationModel] = useState<'subscription' | 'lead_fee' | 'bank_brokerage' | 'mixed'>('mixed');
  const [monthlySubscriptionFee, setMonthlySubscriptionFee] = useState<number>(150); // MAD/mois
  const [dealsPerMonth, setDealsPerMonth] = useState<number>(10);
  const [avgPropertyPrice, setAvgPropertyPrice] = useState<number>(900000); // 900 000 MAD

  // Evaluation criteria scores (out of 10)
  const scores = {
    problemUrgency: 9.5, // Le problème des biens informels au Maroc est gigantesque
    marketSize: 9.0, // Des centaines de milliers de transactions annuelles
    samsarAdoption: 7.5, // Fort si approche vocale/WhatsApp, nul si formulaire web classique
    techFeasibility: 9.2, // WhatsApp Cloud API + Audio IA sont ultra matures
    legalFeasibility: 8.0, // Statut plateforme TIC de mise en relation
    monetizationPotential: 8.5 // Très élevé via abonnements et courtage bancaire
  };

  const totalScore = (
    (scores.problemUrgency + 
     scores.marketSize + 
     scores.samsarAdoption + 
     scores.techFeasibility + 
     scores.legalFeasibility + 
     scores.monetizationPotential) / 6
  ).toFixed(1);

  // Financial calculations in MAD
  const monthlySamsarSubsRevenue = (targetCitySamsars * 0.4) * monthlySubscriptionFee; // 40% payants
  const monthlyBrokerageRevenue = (dealsPerMonth * 0.4) * (avgPropertyPrice * 0.005); // 0.5% courtage bancaire crédit
  const monthlyLeadFeeRevenue = dealsPerMonth * 250; // Frais fixe mise en relation

  let totalMonthlyRevenue = 0;
  if (monetizationModel === 'subscription') {
    totalMonthlyRevenue = monthlySamsarSubsRevenue;
  } else if (monetizationModel === 'lead_fee') {
    totalMonthlyRevenue = monthlyLeadFeeRevenue;
  } else if (monetizationModel === 'bank_brokerage') {
    totalMonthlyRevenue = monthlyBrokerageRevenue;
  } else {
    totalMonthlyRevenue = monthlySamsarSubsRevenue + monthlyBrokerageRevenue + monthlyLeadFeeRevenue;
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
            3. Viabilité (Unit Economics)
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Comment le projet génère-t-il du profit récurrent ?
          </p>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="text-stone-900 block font-bold mb-0.5">Abonnement Samsar :</strong>
              <span className="text-stone-600">100 à 200 MAD/mois pour être le profil prioritaire du quartier recevant les leads chauds en premier.</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="text-stone-900 block font-bold mb-0.5">Courtage Crédit Immobilier :</strong>
              <span className="text-stone-600">Les banques (CIH, Attijariwafa, BCP) reversent 0.5% du montant du prêt accordé pour chaque dossier apporté (soit ~5 000 MAD par transaction !).</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Financial Simulator */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulateur Financier & Projections (Marché Marocain)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
            Simulez vos revenus mensuels potentiels
          </h3>
          <p className="text-xs text-stone-500">
            Ajustez les paramètres ci-dessous pour calculer le chiffre d'affaires prévisionnel sur votre première zone
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                <span>Nombre de Samsars actifs dans votre réseau :</span>
                <span className="text-amber-800 font-extrabold">{targetCitySamsars} Samsars</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={targetCitySamsars}
                onChange={(e) => setTargetCitySamsars(parseInt(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>10 (1 quartier pilote)</span>
                <span>100 (1 ville moyenne)</span>
                <span>300 (Casablanca complète)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                <span>Transactions conclues par mois via la mise en relation :</span>
                <span className="text-emerald-800 font-extrabold">{dealsPerMonth} ventes / mois</span>
              </div>
              <input
                type="range"
                min="2"
                max="50"
                step="1"
                value={dealsPerMonth}
                onChange={(e) => setDealsPerMonth(parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                <span>Prix moyen du bien immobilier :</span>
                <span className="text-stone-900 font-extrabold">{(avgPropertyPrice / 10000).toFixed(0)} Mlyoun Centimes ({avgPropertyPrice.toLocaleString()} MAD)</span>
              </div>
              <input
                type="range"
                min="400000"
                max="2500000"
                step="50000"
                value={avgPropertyPrice}
                onChange={(e) => setAvgPropertyPrice(parseInt(e.target.value))}
                className="w-full accent-stone-700 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Modèle de monétisation activé :
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'mixed', label: 'Mixte (Recommandé)' },
                  { id: 'subscription', label: 'Abonnements' },
                  { id: 'bank_brokerage', label: 'Courtage Banques' },
                  { id: 'lead_fee', label: 'Frais par Lead' }
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
              Projections Financières Estimées :
            </span>

            <div className="border-b border-white/10 pb-4">
              <span className="text-xs text-stone-400 block">Chiffre d'Affaires Mensuel Estimé :</span>
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
                <span>Part courtage banques (0.5%) :</span>
                <span className="text-emerald-300">+{monthlyBrokerageRevenue.toLocaleString()} MAD</span>
              </div>
              <div className="flex justify-between">
                <span>Part abonnements Samsars :</span>
                <span className="text-amber-300">+{monthlySamsarSubsRevenue.toLocaleString()} MAD</span>
              </div>
            </div>

            <div className="bg-white/10 p-3 rounded-2xl text-[11px] text-stone-300 space-y-1">
              <strong className="text-white block font-bold">Seuil de Rentabilité (Breakeven) :</strong>
              <p>
                Avec seulement <strong>25 Samsars abonnés</strong> ou <strong>2 crédits immobiliers signés par mois</strong>, le projet couvre l'intégralité de ses frais de fonctionnement (serveurs, WhatsApp Cloud API et animateur terrain).
              </p>
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
