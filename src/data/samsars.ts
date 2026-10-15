export interface Samsar {
  id: string;
  name: string;
  alias: string; // e.g. "Si Bouchaib Moul L'kheir"
  city: string;
  districts: string[];
  experienceYears: number;
  phone: string;
  whatsapp: string;
  rating: number;
  reviewsCount: number;
  specialties: ('appartement' | 'villa' | 'terrain' | 'commercial' | 'riad' | 'location')[];
  languages: string[];
  status: 'verified' | 'vip_derb' | 'popular';
  avatar: string;
  bioDarija: string;
  bioFrench: string;
  audioPromptDarija: string; // text in Arabizi
  audioDarijaArabic: string; // text in proper Moroccan Arabic script for native vocal pronunciation
  activeListingsEstimate: string; // "12-15 bpartmat w stou7a"
  reputationBadge: string;
  typicalCommission: string;
  coffeeSpot: string; // Café de référence dans le quartier
  isCustom?: boolean; // True if created by the user
  customVoiceAudioUrl?: string; // Live voice recording blob URL or base64
}

export interface CityData {
  id: string;
  name: string;
  nameAr: string;
  districts: { id: string; name: string; nameAr: string; popularTypes: string }[];
}

export const CITIES_DATA: CityData[] = [
  {
    id: 'casablanca',
    name: 'Casablanca',
    nameAr: 'الدار البيضاء',
    districts: [
      { id: 'maarif', name: 'Maârif & Racine', nameAr: 'المعاريف و راسين', popularTypes: 'Appartements, Studios, Bureaux' },
      { id: 'bourgogne', name: 'Bourgogne & Gauthier', nameAr: 'بوركون و كوتييه', popularTypes: 'Résidentiel, Rénové, Proche corniche' },
      { id: 'ain-diab', name: 'Aïn Diab & Anfa Supérieur', nameAr: 'عين الذئاب و أنفا', popularTypes: 'Villas haut standing, Terrains' },
      { id: 'hay-hassani', name: 'Hay Hassani & Oulfa', nameAr: 'الحي الحسني و الألفة', popularTypes: 'Économique, Moyen standing, Magasins' },
      { id: 'sidi-maarouf', name: 'Sidi Maârouf & Casanearshore', nameAr: 'سيدي معروف', popularTypes: 'Location cadres, Appartements neufs' },
      { id: 'roches-noires', name: 'Roches Noires & Belvédère', nameAr: 'روش نوار و بيلفيدير', popularTypes: 'Ancien français, Haussmannien, Commercial' },
      { id: 'hay-mohammadi', name: 'Hay Mohammadi & Ain Sebaa', nameAr: 'الحي المحمدي و عين السبع', popularTypes: 'Populaire, Dépôts, Maisons R+2' },
    ]
  },
  {
    id: 'marrakech',
    name: 'Marrakech',
    nameAr: 'مراكش',
    districts: [
      { id: 'gueliz', name: 'Guéliz & Hivernage', nameAr: 'كليز و الحي الشتوي', popularTypes: 'Appartements touristiques, Commerces' },
      { id: 'medina', name: 'Médina & Riad Zitoun', nameAr: 'المدينة القديمة و رياض الزيتون', popularTypes: 'Riads traditionnels, Maisons d\'hôtes' },
      { id: 'targa', name: 'Targa & Massira', nameAr: 'تاركة و المسيرة', popularTypes: 'Villas familiales, Duplex' },
      { id: 'palmeraie', name: 'La Palmeraie & Route de Fès', nameAr: 'النخيل و طريق فاس', popularTypes: 'Domaines, Palais, Grands terrains' },
      { id: 'mhamid', name: 'M\'hamid & Agdal', nameAr: 'المحاميد و أكدال', popularTypes: 'Logement accessible, Projets neufs' }
    ]
  },
  {
    id: 'tanger',
    name: 'Tanger',
    nameAr: 'طنجة',
    districts: [
      { id: 'malabata', name: 'Malabata & Baie de Tanger', nameAr: 'مالاباطا و الكورنيش', popularTypes: 'Vue mer, Appartements standing' },
      { id: 'marshan', name: 'Marshan & Vieille Montagne', nameAr: 'مرشان و الجبل الكبير', popularTypes: 'Villas coloniales, Propriétés de prestige' },
      { id: 'boukhalef', name: 'Boukhalef & Mesnana', nameAr: 'بوخالف و مسنانة', popularTypes: 'Location étudiants, Économique' },
      { id: 'centre-ville', name: 'Centre-Ville & Iberia', nameAr: 'وسط المدينة و إيبيريا', popularTypes: 'Immeubles de standing, Bureaux' }
    ]
  },
  {
    id: 'rabat',
    name: 'Rabat',
    nameAr: 'الرباط',
    districts: [
      { id: 'agdal', name: 'Agdal', nameAr: 'أكدال', popularTypes: 'Appartements, Bureaux, Commerces' },
      { id: 'hay-riad', name: 'Hay Riad & Souissi', nameAr: 'حي الرياض و السويسي', popularTypes: 'Villas d\'ambassadeurs, Haut standing' },
      { id: 'hassan', name: 'Hassan & Centre', nameAr: 'حسان و المركز', popularTypes: 'Appartements hauts plafonds, Ministères' },
      { id: 'ocean', name: 'L\'Océan & Diour Jamaa', nameAr: 'المحيط و ديور الجامع', popularTypes: 'Populaire, Rénovation, Proche tramway' }
    ]
  }
];

export const INITIAL_DEMO_SAMSARS: Samsar[] = [
  {
    id: 'samsar-1',
    name: 'Si Mohamed El Amrani',
    alias: 'Si Mohamed "Moul L\'Maârif"',
    city: 'casablanca',
    districts: ['maarif', 'bourgogne'],
    experienceYears: 24,
    phone: '+212661489201',
    whatsapp: '+212661489201',
    rating: 4.9,
    reviewsCount: 87,
    specialties: ['appartement', 'commercial', 'location'],
    languages: ['Darija marocaine', 'Français oral courant'],
    status: 'vip_derb',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    bioDarija: '24 3am wana f l\'Maarif w Bourgogne. Kol 3imara f Zerktouni w Bir Anzarane 3aref moulaha w 3assasaha. Li bghiti bpartma choufa wla bi3 w chra marhba.',
    bioFrench: 'Doyen du Maârif depuis 1999. Réseau direct avec les gardiens d\'immeubles et propriétaires historiques. Connaît les appartements avant même qu\'ils ne soient mis en vente.',
    audioPromptDarija: 'Salam o 3alaykom, ana Si Mohamed d Maârif. 3andi bpartmat f Bir Anzarane w Zerktouni men 70 mlyoun l 200 mlyoun. Sift lia message f WhatsApp w ngoul lik chno kayn db.',
    audioDarijaArabic: 'السلام عليكم ورحمة الله، أنا السي محمد د المعاريف. عندي برطمات ف بئر أنزران و الزرقطوني من سبعين مليون لميتين مليون. صيفط ليا ميساج ف الواتساب و نگول ليك شنو كاين دابا.',
    activeListingsEstimate: '~18 appartements & locaux exclusifs',
    reputationBadge: 'Amine du Quartier (Certifié)',
    typicalCommission: '2.5% acquéreur (négociable au café)',
    coffeeSpot: 'Café de France, Bd Bir Anzarane (tous les matins 9h - 12h)',
    isCustom: false
  },
  {
    id: 'samsar-2',
    name: 'Bouchaib Zaari',
    alias: 'Ba Bouchaib "Moul L\'kheir"',
    city: 'casablanca',
    districts: ['hay-hassani', 'oulfa'],
    experienceYears: 31,
    phone: '+212662981452',
    whatsapp: '+212662981452',
    rating: 4.8,
    reviewsCount: 114,
    specialties: ['appartement', 'commercial'],
    languages: ['Darija marocaine uniquement'],
    status: 'vip_derb',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    bioDarija: 'Men chhar 1992 wana f l\'Hay Hassani. Bi3 w chra f l\'mouyen standing w l\'i9tissadi. Kolchi 3andi bel kalma w nniya. Makhedamch bel pc, ghi b telephone w WhatsApp.',
    bioFrench: 'Figure incontournable de Hay Hassani et Oulfa. Spécialiste du moyen standing et de l\'accès à la propriété pour les familles. Transaction basée sur la parole et la confiance.',
    audioPromptDarija: 'Ahlan wa sahlan, Ba Bouchaib m3akom. Hay Hassani w Oulfa ra hna s7ab l\'ard. Bghiti chi bpartma n9ia b l\'ascenseur wla khedma nchouf lik li bghiti b nniya.',
    audioDarijaArabic: 'أهلا وسهلا، با بوشعيب معاكوم. الحي الحسني و الألفة را حنا صحاب الأرض. بغيتي شي برطمة نقية ب الأسانسور ولا خدمة، نشوف ليك اللي بغيتي بالنية والكلمة.',
    activeListingsEstimate: '~25 biens (Apparts, R+2, Magasins)',
    reputationBadge: 'Kbir L\'Houma (Homme de parole)',
    typicalCommission: '2.5% sans intermédiaire supplémentaire',
    coffeeSpot: 'Café Al Wifaq, Terminus Hay Hassani',
    isCustom: false
  },
  {
    id: 'samsar-3',
    name: 'Hamid Tazi',
    alias: 'Si Hamid "Spécialiste Titré"',
    city: 'casablanca',
    districts: ['ain-diab', 'bourgogne'],
    experienceYears: 16,
    phone: '+212667332211',
    whatsapp: '+212667332211',
    rating: 4.95,
    reviewsCount: 63,
    specialties: ['villa', 'terrain', 'appartement'],
    languages: ['Darija', 'Français', 'Espagnol'],
    status: 'verified',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    bioDarija: 'Specialiste f les villas d Ain Diab, Anfa w Bourgogne. Ma kankhedemch f l\'moulkia bla titre foncier. Kolchi n9i 3nd notaire direct.',
    bioFrench: 'Expert des transactions de prestige sur la côte casablancaise. Maîtrise les vérifications à la conservation foncière avant toute visite.',
    audioPromptDarija: 'Bonjour o salam, Hamid Tazi. Pour Ain Diab w villas d Anfa, 3andi des opportunités directes m3a l moula9a d origines. Sift lia vos critères f WhatsApp.',
    audioDarijaArabic: 'السلام عليكم، حميد التازي معاكوم. لعشاق الڤيلات ف عين الذياب و أنفا، عندي فرص مباشرة مع المالكين الأصليين. صيفطو ليا معايير الطلب فالواتساب.',
    activeListingsEstimate: '~9 villas d\'exception & terrains',
    reputationBadge: '100% Titres Fonciers Vérifiés',
    typicalCommission: '2.5% standard marché',
    coffeeSpot: 'La Sqala ou Starbucks Anfa',
    isCustom: false
  },
  {
    id: 'samsar-4',
    name: 'Lhaj Abdellatif Marrakchi',
    alias: 'Lhaj "Serr L\'Médina"',
    city: 'marrakech',
    districts: ['medina', 'gueliz'],
    experienceYears: 36,
    phone: '+212661876543',
    whatsapp: '+212661876543',
    rating: 4.9,
    reviewsCount: 142,
    specialties: ['riad', 'villa', 'commercial'],
    languages: ['Darija marocaine', 'Français touristique', 'Anglais'],
    status: 'vip_derb',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    bioDarija: 'Zadit w kbert f Derb Dabachi. Riads titrés wla moulkia, 3aref chkon moukhettess f kol derb. Men 1988 wana f souk l\'3aqar.',
    bioFrench: 'Mémoire vivante de la Médina de Marrakech. Détient les clés des plus beaux riads cachés et cours intérieures non répertoriées sur internet.',
    audioPromptDarija: 'Marhba bikom f Marrakech. Lhaj Abdellatif m3akom. Riads f Riad Zitoun, Mouassine, wla appartements Guéliz, 3andi li kayn o li ma kaynch f internet.',
    audioDarijaArabic: 'مرحبا بيكم ف مراكش البهجة. الحاج عبد اللطيف معاكوم. رياضات ف رياض الزيتون و المواسين، و برطمات ف گيليز، عندي اللي كاين واللي ما كاينش ف الإنترنت.',
    activeListingsEstimate: '~30 riads et biens de caractère',
    reputationBadge: 'Doyen des Riads de Marrakech',
    typicalCommission: '2.5% acheteur',
    coffeeSpot: 'Café de France, Place Jemaa El-Fna (Terrasse du bas)',
    isCustom: false
  },
  {
    id: 'samsar-5',
    name: 'Rachid Benchekroun',
    alias: 'Rachid "Guéliz Express"',
    city: 'marrakech',
    districts: ['gueliz', 'targa'],
    experienceYears: 12,
    phone: '+212664551122',
    whatsapp: '+212664551122',
    rating: 4.75,
    reviewsCount: 58,
    specialties: ['appartement', 'location', 'commercial'],
    languages: ['Darija', 'Français'],
    status: 'popular',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    bioDarija: 'Hyperactif f Guéliz w Targa. Appartements pour investissement locatif Airbnb ou résidence principale. Réponse directe f WhatsApp.',
    bioFrench: 'Dynamique et réactif. Spécialisé dans les appartements modernes de Guéliz rentables en location et résidences calmes avec piscine à Targa.',
    audioPromptDarija: 'Salam! Rachid f Guéliz. Si vous cherchez un 2 pièces ou 3 pièces bien situé avec bon rendement locatif, contactez-moi direct f WhatsApp.',
    audioDarijaArabic: 'السلام عليكم، رشيد ف گيليز. إلى كتقلبو على شقة جوج بيوت ولا تلاتة ف موقع استراتيجي للكراء السياحي، تواصلو معايا ف الواتساب ديريكت.',
    activeListingsEstimate: '~14 appartements modernes',
    reputationBadge: 'Réactivité WhatsApp (< 3 min)',
    typicalCommission: '2.5% ou 1 mois de loyer',
    coffeeSpot: 'Café Les Négociants, Bd Mohammed V',
    isCustom: false
  },
  {
    id: 'samsar-6',
    name: 'Mustapha Tanjaoui',
    alias: 'Si Mustapha "Bab L\'B7ar"',
    city: 'tanger',
    districts: ['malabata', 'marshan', 'centre-ville'],
    experienceYears: 22,
    phone: '+212663998877',
    whatsapp: '+212663998877',
    rating: 4.88,
    reviewsCount: 79,
    specialties: ['appartement', 'villa', 'terrain'],
    languages: ['Darija du Nord (Chamali)', 'Espagnol', 'Français'],
    status: 'vip_derb',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bioDarija: 'Chamali 9o77. Malabata w Marshan w Vieille Montagne 3andi fihom 3ala9at m3a 3a2ilat 9dima. Bi3 w chra direct bla tkhlwid.',
    bioFrench: 'Figure respectée du Détroit. Expert des appartements vue mer imprenable et demeures historiques de Marshan. Parle espagnol et français.',
    audioPromptDarija: '3awafeq a sidi! Mustapha d Tanja m3akom. Chi dar vue mer f Malabata wla Marshan? Nwerrik l\'mawaqi3 li mafihomch l\'ghcha.',
    audioDarijaArabic: 'عوافي يا سيدي، مصطفى د طنجة معاكوم. شي دار مطلة على البحر ف مالاباطا ولا مرشان؟ نوريك الهميزات النقية اللي ما فيهمش التخلويض.',
    activeListingsEstimate: '~20 biens exclusifs à Tanger',
    reputationBadge: 'Confiance & Notabilité du Nord',
    typicalCommission: '2.5% standard Tanger',
    coffeeSpot: 'Café Hafa ou Gran Café de Paris',
    isCustom: false
  },
  {
    id: 'samsar-7',
    name: 'Karim Zouiten',
    alias: 'Karim "Rabat Riad & Agdal"',
    city: 'rabat',
    districts: ['agdal', 'hay-riad', 'hassan'],
    experienceYears: 14,
    phone: '+212666114477',
    whatsapp: '+212666114477',
    rating: 4.85,
    reviewsCount: 52,
    specialties: ['appartement', 'villa', 'commercial'],
    languages: ['Darija', 'Français'],
    status: 'verified',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop&q=80',
    bioDarija: 'Khedam f Agdal w Hay Riad m3a les cadres, fonctionnaires w les diplomates. Dossiers n9iyin b l\'avocat w notaire.',
    bioFrench: 'Interlocuteur privilégié pour les cadres et familles à Agdal et Hay Riad. Accompagnement rigoureux de la première visite jusqu\'à la signature.',
    audioPromptDarija: 'Salam o 3alaykom, Karim f Rabat. Pour Agdal w Hay Riad, des biens propres prêts pour l\'acte définitif. Marhba bikom.',
    audioDarijaArabic: 'السلام عليكم، كريم ف الرباط. بالنسبة لأكدال و حي الرياض، عقارات نقية ومضبوطة مع الموثق. مرحبا بتواصلكم.',
    activeListingsEstimate: '~12 biens de qualité',
    reputationBadge: 'Dossiers Juridiques Clairs',
    typicalCommission: '2.5% sans surprise',
    coffeeSpot: 'Café Paul Agdal ou Majestic Hassan',
    isCustom: false
  }
];

export const SAMSARS_DATA: Samsar[] = INITIAL_DEMO_SAMSARS;

// LocalStorage helpers for custom real Samsars
const STORAGE_KEY = 'daleel_samsars_custom_v1';

export function getCustomSamsars(): Samsar[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomSamsar(samsar: Samsar): Samsar[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getCustomSamsars();
    const updated = [samsar, ...existing.filter(s => s.id !== samsar.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function deleteCustomSamsar(id: string): Samsar[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getCustomSamsars();
    const updated = existing.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export interface IncubatorResource {
  name: string;
  category: 'Incubateur' | 'Financement' | 'Accompagnement Public' | 'Réseau Mentors';
  city: string;
  fundingLimit: string;
  focus: string;
  whyFitForThisProject: string;
  applicationLinkText: string;
  contactDetail: string;
}

export const INCUBATORS_GUIDE: IncubatorResource[] = [
  {
    name: '212 Founders (CDG Invest)',
    category: 'Financement',
    city: 'Casablanca / National',
    fundingLimit: 'Jusqu\'à 3 000 000 MAD (Seed) + 500k MAD incubation',
    focus: 'Startups Tech à fort impact économique en Afrique du Nord',
    whyFitForThisProject: 'Programme n°1 au Maroc pour les plateformes B2B/B2C avec forte composante informelle à formaliser. Très sensible aux modèles d\'inclusion financière et d\'IA vocale en Darija.',
    applicationLinkText: 'Candidater sur 212founders.co',
    contactDetail: 'Casablanca Technopark / Marina Casablanca'
  },
  {
    name: 'Tamwilcom - Fonds Innov Invest (Innov Idea & Innov Start)',
    category: 'Financement',
    city: 'National (État Marocain)',
    fundingLimit: '100k à 200k MAD non remboursable (Innov Idea) + jusqu\'à 500k MAD (Innov Start)',
    focus: 'Aide d\'amorçage étatique à fonds perdu pour prototype et preuve de concept',
    whyFitForThisProject: 'Idéal pour financer la première phase : le bot WhatsApp Business, l\'API vocale Darija et les 3 premiers mois de déploiement terrain dans 2 quartiers tests.',
    applicationLinkText: 'Passer par un incubateur labellisé Tamwilcom',
    contactDetail: 'tamwilcom.ma - Direction de l\'Innovation'
  },
  {
    name: 'Technopark Maroc (Casablanca, Rabat, Tanger, Agadir, Fès)',
    category: 'Incubateur',
    city: 'Réseau National (5 villes)',
    fundingLimit: 'Bureaux à loyer modéré, mentorat, accès écosystème',
    focus: 'Hébergement & accélération de startups TIC',
    whyFitForThisProject: 'Fournit la domiciliation légale, des connexions avec l\'ANPME, Maroc PME et une légitimité institutionnelle indispensable pour signer des partenariats notaires/banques.',
    applicationLinkText: 'technopark.ma',
    contactDetail: 'Boulevard Dammam, Casablanca'
  },
  {
    name: 'HSeven',
    category: 'Incubateur',
    city: 'Casablanca (Anfa)',
    fundingLimit: 'Accompagnement stratégique + Mise en relation VC Afrique & Europe',
    focus: 'Accélérateur de startups à ambition panafricaine',
    whyFitForThisProject: 'Le modèle "Samsar Voice Directory" est transposable dans toute l\'Afrique du Nord et l\'Afrique subsaharienne (marchés informels similaires à Dakar, Abidjan, Le Caire).',
    applicationLinkText: 'hseven.co',
    contactDetail: 'Marina Casablanca'
  },
  {
    name: 'Réseau Entreprendre Maroc',
    category: 'Réseau Mentors',
    city: 'Casablanca, Rabat, Marrakech, Tanger',
    fundingLimit: 'Prêt d\'honneur sans intérêt ni garantie (jusqu\'à 100k - 200k MAD)',
    focus: 'Mentorat individuel par des chefs d\'entreprises aguerris',
    whyFitForThisProject: 'Vous attribue un chef d\'entreprise chevronné qui vous aide chaque mois sur la stratégie de terrain, le management et la pérennité commerciale.',
    applicationLinkText: 'reseau-entreprendre-maroc.org',
    contactDetail: 'Comités d\'engagement trimestriels'
  },
  {
    name: 'Plug and Play Morocco / UM6P Ventures',
    category: 'Incubateur',
    city: 'Benguerir & Casablanca',
    fundingLimit: 'Programme d\'accélération international + tickets d\'investissement',
    focus: 'Deeptech, Retail, Smart City et plateformes de mise en relation',
    whyFitForThisProject: 'Accès direct aux chercheurs en traitement du langage naturel (NLP / Darija) de l\'Université Mohammed VI Polytechnique (UM6P).',
    applicationLinkText: 'plugandplaytechcenter.com/morocco',
    contactDetail: 'Green City Benguerir & Casablanca'
  }
];
