export interface RoadmapStep {
  phase: string;
  duration: string;
  title: string;
  objective: string;
  actions: string[];
  keyPartners: string[];
  budget: string;
  deliverables: string[];
}

export const STRATEGY_ROADMAP: RoadmapStep[] = [
  {
    phase: 'Phase 0 : Terrain & Preuve de Café',
    duration: 'Mois 1 - 2',
    title: 'Validation de l\'offre avec 30 Samsars sur 1 quartier pilote',
    objective: 'Prouver que les Samsars acceptent de recevoir des leads qualifiés sans dévoiler leurs propriétaires.',
    actions: [
      'Choisir 1 quartier à forte densité de transactions (ex: Maârif ou Hay Hassani à Casablanca, ou Guéliz à Marrakech).',
      'Identifier les 2 ou 3 cafés de ralliement des Samsars locaux (ex: Café de France Bir Anzarane).',
      'Approcher 15 à 30 Samsars en personne (avec thé à la menthe) : "Nous avons des acheteurs sérieux qui cherchent dans le quartier, nous leur donnons votre contact WhatsApp directement".',
      'Créer un simple groupe ou compte WhatsApp Business "Daleel Samsar" géré manuellement pour tester la réactivité.'
    ],
    keyPartners: ['Gardiens d\'immeubles ("3assasa")', 'Cafés populaires de quartier', 'Notaires locaux'],
    budget: '5 000 à 10 000 MAD (déplacements, tests de contact, thé, crédits téléphoniques)',
    deliverables: ['Liste de 30 Samsars partants', 'Taux de réponse aux demandes (> 70%)', 'Preuve de concept validée']
  },
  {
    phase: 'Phase 1 : Incubation & Financement d\'Amorçage',
    duration: 'Mois 3 - 6',
    title: 'Intégration d\'un incubateur labellisé Tamwilcom (Innov Idea)',
    objective: 'Obtenir la subvention étatique de 100k à 200k MAD pour développer le MVP automatisé.',
    actions: [
      'Déposer le dossier auprès d\'un incubateur partenaire Tamwilcom (Technopark, HSeven, StartUp Maroc ou Réseau Entreprendre).',
      'Défendre le caractère d\'inclusion sociale (digitaliser une population informelle et non-diplômée grâce à l\'IA vocale Darija).',
      'Décrocher la subvention "Innov Idea" (jusqu\'à 200 000 MAD à fonds perdu, 100% sans cession de capital).',
      'Créer la structure juridique (SARL d\'intermédiation technologique ou auto-entrepreneur au départ).'
    ],
    keyPartners: ['Tamwilcom (Fonds Innov Invest)', 'Incubateur sélectionné', 'Expert-comptable'],
    budget: 'Financé par la subvention Innov Idea (100k - 200k MAD)',
    deliverables: ['Subvention accordée', 'Statut juridique déposé', 'Label Jeune Entreprise Innovante']
  },
  {
    phase: 'Phase 2 : Tech MVP (WhatsApp Business + IA Vocale Darija)',
    duration: 'Mois 6 - 9',
    title: 'Automatisation de la passerelle WhatsApp et moteur vocal Darija',
    objective: 'Permettre au Samsar d\'utiliser la plateforme 100% par note vocale WhatsApp sans taper un seul mot.',
    actions: [
      'Connecter l\'API Meta WhatsApp Cloud avec un Webhook Node.js / React.',
      'Intégrer un modèle de reconnaissance vocale Darija (Whisper fine-tuné ou Gemini Multimodal Audio) qui extrait le quartier, type de bien, budget.',
      'Lancer l\'annuaire web public pour les acquéreurs (version responsive mobile ultra-rapide).',
      'Mettre en place le système de broadcast de demandes d\'acheteurs vers les Samsars du quartier concerné.'
    ],
    keyPartners: ['Meta WhatsApp Cloud API', 'Google Cloud / Gemini API', 'Développeur Fullstack'],
    budget: '80 000 à 120 000 MAD (développement, serveurs, API WhatsApp)',
    deliverables: ['Bot WhatsApp opérationnel', 'Annuaire en ligne opérationnel', 'Système de notes vocales bilingue']
  },
  {
    phase: 'Phase 3 : Accélération & Amorçage Seed (212 Founders)',
    duration: 'Mois 9 - 18',
    title: 'Extension à 5 villes et levée de fonds Seed (1M à 3M MAD)',
    objective: 'Couvrir Casablanca, Marrakech, Tanger, Rabat et Agadir avec plus de 1 000 Samsars actifs.',
    actions: [
      'Recruter des "Ambassadeurs de quartier" (jeunes du quartier formés pour embarquer les Samsars sur WhatsApp).',
      'Activer la monétisation : formule Premium pour les Samsars (150 MAD/mois pour être mis en avant) et frais de mise en relation promoteurs.',
      'Candidater au programme Seed de 212 Founders (CDG Invest) pour un ticket de 1 000 000 à 3 000 000 MAD.',
      'Nouer des partenariats avec les banques marocaines (courtage crédit immobilier pour les acquéreurs trouvés).'
    ],
    keyPartners: ['212 Founders / CDG Invest', 'Banques (CIH, Attijariwafa, BCP)', 'Promoteurs immobiliers'],
    budget: 'Levée Seed 1M à 3M MAD',
    deliverables: ['1 000+ Samsars actifs', 'Couverture 5 grandes villes', 'Rentabilité unitaire (Unit Economics)']
  }
];

export const SAMSAR_FEARS_AND_SOLUTIONS = [
  {
    fear: 'Peur de se faire voler le bien ("I-choufo moul dar w ygolou liah bla bia")',
    solution: 'La plateforme ne publie JAMAIS l\'adresse précise ni le contact du propriétaire. C\'est l\'acquéreur qui est redirigé vers le Samsar. Le Samsar reste le maître unique de la visite.'
  },
  {
    fear: 'Analphabétisme ou difficulté à lire et écrire le français/l\'arabe standard',
    solution: 'Tout fonctionne par note vocale (Audio Darija) et pictogrammes colorés sur WhatsApp et l\'app. Le Samsar appuie sur le micro, écoute la demande en Darija, et répond en vocal.'
  },
  {
    fear: 'Refus de payer des commissions élevées à une application',
    solution: 'L\'inscription de base est 100% GRATUITE. Le Samsar conserve l\'intégralité de sa commission de 2.5% négociée directement avec son client.'
  },
  {
    fear: 'Méfiance envers l\'informatique et les démarches compliquées',
    solution: 'Pas d\'application lourde à télécharger sur l\'App Store : il utilise son WhatsApp quotidien. Onboardé en direct dans son café préféré par un ambassadeur en 2 minutes.'
  }
];
