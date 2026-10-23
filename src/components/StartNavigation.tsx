import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Keyboard, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  User, 
  Home, 
  MapPin, 
  Check, 
  Phone, 
  Volume2,
  Construction,
  X,
  Search,
  SearchX,
  Building,
  LandPlot,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  Star,
  MessageCircle,
  Menu,
  Tag,
  Plus,
  Map,
  ExternalLink
} from 'lucide-react';
import { MoroccoFlagStarLogo } from './MoroccoFlagStarLogo';
import { SamsarGoogleMap } from './SamsarGoogleMap';
import { VoiceDiagnosticPanel, VoiceDiagnosticData } from './VoiceDiagnosticPanel';
import { AppHeader } from './AppHeader';
import { PageTitle } from './PageTitle';
import { SplashScreen } from './SplashScreen';
import { PostListingForm } from './PostListingForm';

export type StartScreen = 
  | 'splash'
  | 'language' 
  | 'mode' 
  | 'home'
  | 'vocal' 
  | 'classic'
  | 'mode_choice' 
  | 'language_choice' 
  | 'voice_listening' 
  | 'voice_results' 
  | 'dashboard'
  | 'samsar_choice'
  | 'find_samsar'
  | 'samsar_map'
  | 'buy_sell_choice'
  | 'search_property'
  | 'post_listing';

export interface TrustedSamsar {
  id: string;
  name: string;
  nameAr: string;
  cityId: string;
  cityName: string;
  quarterId: string;
  quarterName: string;
  city: string;
  cityAr: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  phone: string;
  whatsappPhone: string;
  specialty: string;
  specialtyAr: string;
  verified: boolean;
}

export const SAMSAR_CITY_OPTIONS = [
  { id: 'all', label: 'Toutes les villes', labelAr: 'جميع المدن' },
  { id: 'casablanca', label: 'Casablanca', labelAr: 'الدار البيضاء' },
  { id: 'rabat', label: 'Rabat', labelAr: 'الرباط' },
  { id: 'marrakech', label: 'Marrakech', labelAr: 'مراكش' },
  { id: 'tanger', label: 'Tanger', labelAr: 'طنجة' }
];

export const SAMSAR_QUARTERS_BY_CITY: Record<string, { id: string; label: string; labelAr: string }[]> = {
  all: [
    { id: 'all', label: 'Tous les quartiers', labelAr: 'جميع الأحياء' },
    { id: 'maarif', label: 'Maârif', labelAr: 'المعاريف' },
    { id: 'gauthier', label: 'Gauthier', labelAr: 'غوتيي' },
    { id: 'ain_diab', label: 'Aïn Diab', labelAr: 'عين الذئاب' },
    { id: 'agdal', label: 'Agdal', labelAr: 'أكدال' },
    { id: 'hassan', label: 'Hassan', labelAr: 'حسان' },
    { id: 'hay_riad', label: 'Hay Riad', labelAr: 'حي الرياض' },
    { id: 'gueliz', label: 'Guéliz', labelAr: 'جيليز' },
    { id: 'hivernage', label: 'Hivernage', labelAr: 'الحي الشتوي' },
    { id: 'malabata', label: 'Malabata', labelAr: 'مالاباطا' },
    { id: 'centre', label: 'Centre Ville', labelAr: 'وسط المدينة' }
  ],
  casablanca: [
    { id: 'all', label: 'Tous les quartiers', labelAr: 'جميع الأحياء' },
    { id: 'maarif', label: 'Maârif', labelAr: 'المعاريف' },
    { id: 'gauthier', label: 'Gauthier', labelAr: 'غوتيي' },
    { id: 'ain_diab', label: 'Aïn Diab', labelAr: 'عين الذئاب' }
  ],
  rabat: [
    { id: 'all', label: 'Tous les quartiers', labelAr: 'جميع الأحياء' },
    { id: 'agdal', label: 'Agdal', labelAr: 'أكدال' },
    { id: 'hassan', label: 'Hassan', labelAr: 'حسان' },
    { id: 'hay_riad', label: 'Hay Riad', labelAr: 'حي الرياض' }
  ],
  marrakech: [
    { id: 'all', label: 'Tous les quartiers', labelAr: 'جميع الأحياء' },
    { id: 'gueliz', label: 'Guéliz', labelAr: 'جيليز' },
    { id: 'hivernage', label: 'Hivernage', labelAr: 'الحي الشتوي' }
  ],
  tanger: [
    { id: 'all', label: 'Tous les quartiers', labelAr: 'جميع الأحياء' },
    { id: 'malabata', label: 'Malabata', labelAr: 'مالاباطا' },
    { id: 'centre', label: 'Centre Ville', labelAr: 'وسط المدينة' }
  ]
};

export const TRUSTED_SAMSARS: TrustedSamsar[] = [
  // --- CASABLANCA ---
  {
    id: 'samsar-karim',
    name: 'Karim El Fassi',
    nameAr: 'كريم الفاسي',
    cityId: 'casablanca',
    cityName: 'Casablanca',
    quarterId: 'maarif',
    quarterName: 'Maârif',
    city: 'Casablanca - Maarif',
    cityAr: 'الدار البيضاء - المعاريف',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviewCount: 48,
    phone: '+212 661 22 33 44',
    whatsappPhone: '212661223344',
    specialty: 'Expert appartements standing & villas',
    specialtyAr: 'خبير شقق راقية وفيلات',
    verified: true
  },
  {
    id: 'samsar-mehdi',
    name: 'Mehdi Chraibi',
    nameAr: 'مهدي الشرايبي',
    cityId: 'casablanca',
    cityName: 'Casablanca',
    quarterId: 'gauthier',
    quarterName: 'Gauthier',
    city: 'Casablanca - Gauthier',
    cityAr: 'الدار البيضاء - غوتيي',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviewCount: 42,
    phone: '+212 661 23 45 67',
    whatsappPhone: '212661234567',
    specialty: 'Studios modernes & bureaux d\'affaires',
    specialtyAr: 'استوديوهات عصرية ومكاتب أعمال',
    verified: true
  },
  {
    id: 'samsar-hassan-casa',
    name: 'Hassan Berrada',
    nameAr: 'حسن برادة',
    cityId: 'casablanca',
    cityName: 'Casablanca',
    quarterId: 'ain_diab',
    quarterName: 'Aïn Diab',
    city: 'Casablanca - Aïn Diab & Anfa',
    cityAr: 'الدار البيضاء - عين الذئاب وأنفا',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviewCount: 35,
    phone: '+212 661 33 44 55',
    whatsappPhone: '212661334455',
    specialty: 'Vente résidentielle & front de mer',
    specialtyAr: 'بيع سكني وإطلالات بحرية',
    verified: true
  },

  // --- RABAT ---
  {
    id: 'samsar-driss',
    name: 'Driss Benjelloun',
    nameAr: 'إدريس بنجلون',
    cityId: 'rabat',
    cityName: 'Rabat',
    quarterId: 'agdal',
    quarterName: 'Agdal',
    city: 'Rabat - Agdal',
    cityAr: 'الرباط - أكدال',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviewCount: 39,
    phone: '+212 661 55 66 77',
    whatsappPhone: '212661556677',
    specialty: 'Location & Achat résidentiel haut de gamme',
    specialtyAr: 'كراء وشراء سكني راقي',
    verified: true
  },
  {
    id: 'samsar-salma-rab',
    name: 'Salma Mansouri',
    nameAr: 'سلمى المنصوري',
    cityId: 'rabat',
    cityName: 'Rabat',
    quarterId: 'hassan',
    quarterName: 'Hassan',
    city: 'Rabat - Hassan',
    cityAr: 'الرباط - حسان',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviewCount: 51,
    phone: '+212 661 66 77 88',
    whatsappPhone: '212661667788',
    specialty: 'Appartements centraux & cabinets professionnels',
    specialtyAr: 'شقق وسط المدينة وعيادات مهنية',
    verified: true
  },
  {
    id: 'samsar-tarik-rab',
    name: 'Tarik Alami',
    nameAr: 'طارق العلمي',
    cityId: 'rabat',
    cityName: 'Rabat',
    quarterId: 'hay_riad',
    quarterName: 'Hay Riad',
    city: 'Rabat - Hay Riad',
    cityAr: 'الرباط - حي الرياض',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviewCount: 46,
    phone: '+212 661 78 89 90',
    whatsappPhone: '212661788990',
    specialty: 'Villas de prestige & résidences fermées',
    specialtyAr: 'فيلات راقية وإقامات مغلقة',
    verified: true
  },

  // --- MARRAKECH ---
  {
    id: 'samsar-mohamed',
    name: 'Si Mohamed Amrani',
    nameAr: 'سي محمد العمراني',
    cityId: 'marrakech',
    cityName: 'Marrakech',
    quarterId: 'gueliz',
    quarterName: 'Guéliz',
    city: 'Marrakech - Guéliz',
    cityAr: 'مراكش - جيليز',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviewCount: 62,
    phone: '+212 661 11 22 33',
    whatsappPhone: '212661112233',
    specialty: 'Spécialiste Riads & Maisons traditionnelles',
    specialtyAr: 'مختص رياضات ومنازل تقليدية',
    verified: true
  },
  {
    id: 'samsar-omar-rak',
    name: 'Omar Tazi',
    nameAr: 'عمر التازي',
    cityId: 'marrakech',
    cityName: 'Marrakech',
    quarterId: 'hivernage',
    quarterName: 'Hivernage',
    city: 'Marrakech - Hivernage',
    cityAr: 'مراكش - الحي الشتوي',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviewCount: 44,
    phone: '+212 661 88 99 00',
    whatsappPhone: '212661889900',
    specialty: 'Appartements de luxe & villas avec piscine',
    specialtyAr: 'شقق فاخرة وفيلات بمسبح',
    verified: true
  },

  // --- TANGER ---
  {
    id: 'samsar-rachid',
    name: 'Moulay Rachid Tazi',
    nameAr: 'مولاي رشيد التازي',
    cityId: 'tanger',
    cityName: 'Tanger',
    quarterId: 'malabata',
    quarterName: 'Malabata',
    city: 'Tanger - Malabata',
    cityAr: 'طنجة - مالاباطا',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviewCount: 54,
    phone: '+212 661 77 88 99',
    whatsappPhone: '212661778899',
    specialty: 'Terrains viabilisés & front de mer',
    specialtyAr: 'أراضي مجهزة ومطلة على البحر',
    verified: true
  },
  {
    id: 'samsar-bilal-tan',
    name: 'Bilal Alami',
    nameAr: 'بلال العلمي',
    cityId: 'tanger',
    cityName: 'Tanger',
    quarterId: 'centre',
    quarterName: 'Centre Ville',
    city: 'Tanger - Centre Ville',
    cityAr: 'طنجة - وسط المدينة',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviewCount: 38,
    phone: '+212 661 99 00 11',
    whatsappPhone: '212661990011',
    specialty: 'Appartements vue détroit & résidences',
    specialtyAr: 'شقق بإطلالة على المضيق وإقامات',
    verified: true
  }
];

export type Language = 'fr' | 'ar';

export type PropertyType = 
  | 'maison' 
  | 'appartement' 
  | 'villa' 
  | 'terrain' 
  | 'riad' 
  | 'studio' 
  | 'duplex' 
  | 'local' 
  | 'bureau';

interface HouseItem {
  id: string;
  image: string;
  price: string;
  priceAr: string;
  city: string;
  cityAr: string;
  samsarName: string;
  samsarPhone: string;
}

// Données du mode vocal (strictement préservé)
const HOUSES_DATA: HouseItem[] = [
  {
    id: 'house-1',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    price: '850 000 DH',
    priceAr: '850.000 درهم',
    city: 'Marrakech',
    cityAr: 'مراكش',
    samsarName: 'Si Mohamed',
    samsarPhone: '+212661001122'
  },
  {
    id: 'house-2',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    price: '1 400 000 DH',
    priceAr: '1.400.000 درهم',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    samsarName: 'Samsar Hassan',
    samsarPhone: '+212661334455'
  },
  {
    id: 'house-3',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    price: '2 150 000 DH',
    priceAr: '2.150.000 درهم',
    city: 'Tanger',
    cityAr: 'طنجة',
    samsarName: 'Moulay Rachid',
    samsarPhone: '+212661778899'
  }
];

// Configuration des villes et quartiers marocains pour la page "Rechercher un bien"
const CITIES_DATA = [
  {
    id: 'casablanca',
    name: 'Casablanca',
    nameAr: 'الدار البيضاء',
    quarters: [
      { id: 'all', name: 'Tous les quartiers', nameAr: 'كل الأحياء' },
      { id: 'maarif', name: 'Maârif', nameAr: 'المعاريف' },
      { id: 'gauthier', name: 'Gauthier', nameAr: 'غوتييه' },
      { id: 'ain_diab', name: 'Ain Diab', nameAr: 'عين الذئاب' },
      { id: 'bourgogne', name: 'Bourgogne', nameAr: 'بوركون' },
      { id: 'bouskoura', name: 'Bouskoura', nameAr: 'بوسكورة' }
    ]
  },
  {
    id: 'marrakech',
    name: 'Marrakech',
    nameAr: 'مراكش',
    quarters: [
      { id: 'all', name: 'Tous les quartiers', nameAr: 'كل الأحياء' },
      { id: 'gueliz', name: 'Guéliz', nameAr: 'جيليز' },
      { id: 'hivernage', name: 'Hivernage', nameAr: 'الحي الشتوي' },
      { id: 'palmeraie', name: 'Palmeraie', nameAr: 'النخيل' },
      { id: 'medina', name: 'Médina', nameAr: 'المدينة القديمة' },
      { id: 'chwiter', name: 'Chwiter', nameAr: 'الشويطر' }
    ]
  },
  {
    id: 'rabat',
    name: 'Rabat',
    nameAr: 'الرباط',
    quarters: [
      { id: 'all', name: 'Tous les quartiers', nameAr: 'كل الأحياء' },
      { id: 'agdal', name: 'Agdal', nameAr: 'أكدال' },
      { id: 'hay_riad', name: 'Hay Riad', nameAr: 'حي الرياض' },
      { id: 'souissi', name: 'Souissi', nameAr: 'السويسي' },
      { id: 'hassan', name: 'Hassan', nameAr: 'حسان' }
    ]
  },
  {
    id: 'tanger',
    name: 'Tanger',
    nameAr: 'طنجة',
    quarters: [
      { id: 'all', name: 'Tous les quartiers', nameAr: 'كل الأحياء' },
      { id: 'malabata', name: 'Malabata', nameAr: 'مالاباطا' },
      { id: 'centre', name: 'Centre Ville', nameAr: 'وسط المدينة' },
      { id: 'marshan', name: 'Marshan', nameAr: 'مرشان' },
      { id: 'iberia', name: 'Iberia', nameAr: 'إيبيريا' }
    ]
  }
];

export type OperationType = 'achat' | 'location';

export interface PropertyListing {
  id: string;
  image: string;
  title: string;
  titleAr: string;
  price: string;
  priceAr: string;
  priceNum: number;
  cityId: string;
  city: string;
  cityAr: string;
  quarterId: string;
  quarter: string;
  quarterAr: string;
  type: PropertyType;
  typeLabel: string;
  typeLabelAr: string;
  surface: string;
  bedrooms: number;
  samsarName: string;
  samsarPhone: string;
  operation: OperationType;
  description?: string;
  isUserSubmitted?: boolean;
}

const PROPERTY_LISTINGS: PropertyListing[] = [
  // --- CASABLANCA ---
  {
    id: 'cas-app-1',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    title: 'Appartement ensoleillé 2 chambres à Maarif, Casablanca',
    titleAr: 'شقة مشمسة غرفتان بالمعاريف، الدار البيضاء',
    price: '950 000 MAD',
    priceAr: '950.000 درهم',
    priceNum: 950000,
    cityId: 'casablanca',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    quarterId: 'maarif',
    quarter: 'Maârif',
    quarterAr: 'المعاريف',
    type: 'appartement',
    typeLabel: 'Appartement',
    typeLabelAr: 'شقة',
    surface: '85 m²',
    bedrooms: 2,
    samsarName: 'Samsar Hassan',
    samsarPhone: '+212 661 22 33 44',
    operation: 'achat'
  },
  {
    id: 'cas-app-2',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    title: 'Studio moderne rénové à Bourgogne, Casablanca',
    titleAr: 'استوديو عصري مجدد في بوركون، الدار البيضاء',
    price: '480 000 MAD',
    priceAr: '480.000 درهم',
    priceNum: 480000,
    cityId: 'casablanca',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    quarterId: 'bourgogne',
    quarter: 'Bourgogne',
    quarterAr: 'بوركون',
    type: 'appartement',
    typeLabel: 'Appartement',
    typeLabelAr: 'شقة',
    surface: '45 m²',
    bedrooms: 1,
    samsarName: 'Samsar Hassan',
    samsarPhone: '+212 661 22 33 44',
    operation: 'achat'
  },
  {
    id: 'cas-app-3',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    title: 'Grand standing 3 chambres à Gauthier, Casablanca',
    titleAr: 'شقة راقية 3 غرف في غوتييه، الدار البيضاء',
    price: '1 800 000 MAD',
    priceAr: '1.800.000 درهم',
    priceNum: 1800000,
    cityId: 'casablanca',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    quarterId: 'gauthier',
    quarter: 'Gauthier',
    quarterAr: 'غوتييه',
    type: 'appartement',
    typeLabel: 'Appartement',
    typeLabelAr: 'شقة',
    surface: '135 m²',
    bedrooms: 3,
    samsarName: 'Samsar Hassan',
    samsarPhone: '+212 661 22 33 44',
    operation: 'achat'
  },
  {
    id: 'cas-vil-1',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    title: 'Villa contemporaine 4 chambres à Maarif, Casablanca',
    titleAr: 'فيلا عصرية 4 غرف بالمعاريف، الدار البيضاء',
    price: '2 500 000 MAD',
    priceAr: '2.500.000 درهم',
    priceNum: 2500000,
    cityId: 'casablanca',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    quarterId: 'maarif',
    quarter: 'Maârif',
    quarterAr: 'المعاريف',
    type: 'villa',
    typeLabel: 'Villa',
    typeLabelAr: 'فيلا',
    surface: '340 m²',
    bedrooms: 4,
    samsarName: 'Samsar Hassan',
    samsarPhone: '+212 661 22 33 44',
    operation: 'achat'
  },
  {
    id: 'cas-vil-2',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    title: 'Villa de prestige avec piscine à Ain Diab, Casablanca',
    titleAr: 'فيلا فخمة مع مسبح في عين الذئاب، الدار البيضاء',
    price: '4 800 000 MAD',
    priceAr: '4.800.000 درهم',
    priceNum: 4800000,
    cityId: 'casablanca',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    quarterId: 'ain_diab',
    quarter: 'Ain Diab',
    quarterAr: 'عين الذئاب',
    type: 'villa',
    typeLabel: 'Villa',
    typeLabelAr: 'فيلا',
    surface: '500 m²',
    bedrooms: 5,
    samsarName: 'Samsar Hassan',
    samsarPhone: '+212 661 22 33 44',
    operation: 'achat'
  },
  {
    id: 'cas-mai-1',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    title: 'Maison familiale avec jardin à Bouskoura, Casablanca',
    titleAr: 'منزل عائلي مع حديقة في بوسكورة، الدار البيضاء',
    price: '1 950 000 MAD',
    priceAr: '1.950.000 درهم',
    priceNum: 1950000,
    cityId: 'casablanca',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    quarterId: 'bouskoura',
    quarter: 'Bouskoura',
    quarterAr: 'بوسكورة',
    type: 'maison',
    typeLabel: 'Maison',
    typeLabelAr: 'منزل',
    surface: '220 m²',
    bedrooms: 4,
    samsarName: 'Samsar Hassan',
    samsarPhone: '+212 661 22 33 44',
    operation: 'achat'
  },
  {
    id: 'cas-mai-2',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    title: 'Maison traditionnelle avec patio à Bourgogne, Casablanca',
    titleAr: 'منزل تقليدي مع فناء في بوركون، الدار البيضاء',
    price: '1 450 000 MAD',
    priceAr: '1.450.000 درهم',
    priceNum: 1450000,
    cityId: 'casablanca',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    quarterId: 'bourgogne',
    quarter: 'Bourgogne',
    quarterAr: 'بوركون',
    type: 'maison',
    typeLabel: 'Maison',
    typeLabelAr: 'منزل',
    surface: '185 m²',
    bedrooms: 3,
    samsarName: 'Samsar Hassan',
    samsarPhone: '+212 661 22 33 44',
    operation: 'achat'
  },
  {
    id: 'cas-mai-3',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    title: 'Belle maison moderne 3 niveaux à Maârif, Casablanca',
    titleAr: 'منزل عصري 3 طوابق بالمعاريف، الدار البيضاء',
    price: '2 200 000 MAD',
    priceAr: '2.200.000 درهم',
    priceNum: 2200000,
    cityId: 'casablanca',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    quarterId: 'maarif',
    quarter: 'Maârif',
    quarterAr: 'المعاريف',
    type: 'maison',
    typeLabel: 'Maison',
    typeLabelAr: 'منزل',
    surface: '240 m²',
    bedrooms: 4,
    samsarName: 'Samsar Hassan',
    samsarPhone: '+212 661 22 33 44',
    operation: 'achat'
  },
  {
    id: 'cas-ter-1',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    title: 'Terrain résidentiel viabilisé à Bouskoura, Casablanca',
    titleAr: 'بقعة أرضية مجهزة للبناء في بوسكورة، الدار البيضاء',
    price: '890 000 MAD',
    priceAr: '890.000 درهم',
    priceNum: 890000,
    cityId: 'casablanca',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    quarterId: 'bouskoura',
    quarter: 'Bouskoura',
    quarterAr: 'بوسكورة',
    type: 'terrain',
    typeLabel: 'Terrain',
    typeLabelAr: 'أرض',
    surface: '380 m²',
    bedrooms: 0,
    samsarName: 'Samsar Hassan',
    samsarPhone: '+212 661 22 33 44',
    operation: 'achat'
  },
  {
    id: 'cas-com-1',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    title: 'Local commercial et boutique avec vitrine à Maarif, Casablanca',
    titleAr: 'محل تجاري وبوتيك بواجهة زجاجية بالمعاريف، الدار البيضاء',
    price: '1 250 000 MAD',
    priceAr: '1.250.000 درهم',
    priceNum: 1250000,
    cityId: 'casablanca',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    quarterId: 'maarif',
    quarter: 'Maârif',
    quarterAr: 'المعاريف',
    type: 'local',
    typeLabel: 'Commerce / Local',
    typeLabelAr: 'محل تجاري',
    surface: '65 m²',
    bedrooms: 0,
    samsarName: 'Samsar Hassan',
    samsarPhone: '+212 661 22 33 44',
    operation: 'achat'
  },

  // --- MARRAKECH ---
  {
    id: 'rak-app-1',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    title: 'Appartement avec terrasse à Guéliz, Marrakech',
    titleAr: 'شقة راقية مع شرفة بجيليز، مراكش',
    price: '850 000 MAD',
    priceAr: '850.000 درهم',
    priceNum: 850000,
    cityId: 'marrakech',
    city: 'Marrakech',
    cityAr: 'مراكش',
    quarterId: 'gueliz',
    quarter: 'Guéliz',
    quarterAr: 'جيليز',
    type: 'appartement',
    typeLabel: 'Appartement',
    typeLabelAr: 'شقة',
    surface: '92 m²',
    bedrooms: 2,
    samsarName: 'Si Mohamed',
    samsarPhone: '+212 661 11 22 33',
    operation: 'achat'
  },
  {
    id: 'rak-app-2',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    title: 'Résidence de luxe fermée à Hivernage, Marrakech',
    titleAr: 'إقامة فاخرة مغلقة بالحي الشتوي، مراكش',
    price: '1 400 000 MAD',
    priceAr: '1.400.000 درهم',
    priceNum: 1400000,
    cityId: 'marrakech',
    city: 'Marrakech',
    cityAr: 'مراكش',
    quarterId: 'hivernage',
    quarter: 'Hivernage',
    quarterAr: 'الحي الشتوي',
    type: 'appartement',
    typeLabel: 'Appartement',
    typeLabelAr: 'شقة',
    surface: '120 m²',
    bedrooms: 3,
    samsarName: 'Si Mohamed',
    samsarPhone: '+212 661 11 22 33',
    operation: 'achat'
  },
  {
    id: 'rak-vil-1',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    title: 'Riad & Villa avec piscine à Palmeraie, Marrakech',
    titleAr: 'رياض وفيلا بمسبح خاص بالنخيل، مراكش',
    price: '3 800 000 MAD',
    priceAr: '3.800.000 درهم',
    priceNum: 3800000,
    cityId: 'marrakech',
    city: 'Marrakech',
    cityAr: 'مراكش',
    quarterId: 'palmeraie',
    quarter: 'Palmeraie',
    quarterAr: 'النخيل',
    type: 'villa',
    typeLabel: 'Villa',
    typeLabelAr: 'فيلا',
    surface: '450 m²',
    bedrooms: 5,
    samsarName: 'Si Mohamed',
    samsarPhone: '+212 661 11 22 33',
    operation: 'achat'
  },
  {
    id: 'rak-mai-1',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    title: 'Maison Riad traditionnel titré à Médina, Marrakech',
    titleAr: 'منزل ورياض تقليدي محفظ بالمدينة، مراكش',
    price: '1 650 000 MAD',
    priceAr: '1.650.000 درهم',
    priceNum: 1650000,
    cityId: 'marrakech',
    city: 'Marrakech',
    cityAr: 'مراكش',
    quarterId: 'medina',
    quarter: 'Médina',
    quarterAr: 'المدينة القديمة',
    type: 'riad',
    typeLabel: 'Riad',
    typeLabelAr: 'رياض',
    surface: '190 m²',
    bedrooms: 4,
    samsarName: 'Si Mohamed',
    samsarPhone: '+212 661 11 22 33',
    operation: 'achat'
  },
  {
    id: 'rak-mai-2',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    title: 'Maison beldi traditionnelle à Bab Doukkala, Marrakech',
    titleAr: 'دار بلدية تقليدية بباب دكالة، مراكش',
    price: '950 000 MAD',
    priceAr: '950.000 درهم',
    priceNum: 950000,
    cityId: 'marrakech',
    city: 'Marrakech',
    cityAr: 'مراكش',
    quarterId: 'medina',
    quarter: 'Bab Doukkala',
    quarterAr: 'باب دكالة',
    type: 'maison',
    typeLabel: 'Maison',
    typeLabelAr: 'دار',
    surface: '160 m²',
    bedrooms: 3,
    samsarName: 'Si Mohamed',
    samsarPhone: '+212 661 11 22 33',
    operation: 'achat'
  },
  {
    id: 'rak-mai-kri-1',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    title: 'Maison meublée à louer à Targa, Marrakech',
    titleAr: 'دار مفروشة للكراء بتاركة، مراكش',
    price: '7 500 MAD / mois',
    priceAr: '7.500 درهم / شهر',
    priceNum: 7500,
    cityId: 'marrakech',
    city: 'Marrakech',
    cityAr: 'مراكش',
    quarterId: 'targa',
    quarter: 'Targa',
    quarterAr: 'تاركة',
    type: 'maison',
    typeLabel: 'Maison',
    typeLabelAr: 'دار',
    surface: '210 m²',
    bedrooms: 4,
    samsarName: 'Si Mohamed',
    samsarPhone: '+212 661 11 22 33',
    operation: 'location'
  },
  {
    id: 'rak-ter-1',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    title: 'Terrain constructible viabilisé à Chwiter, Marrakech',
    titleAr: 'أرض صالحة للبناء ومجهزة بالشويطر، مراكش',
    price: '420 000 MAD',
    priceAr: '420.000 درهم',
    priceNum: 420000,
    cityId: 'marrakech',
    city: 'Marrakech',
    cityAr: 'مراكش',
    quarterId: 'chwiter',
    quarter: 'Chwiter',
    quarterAr: 'الشويطر',
    type: 'terrain',
    typeLabel: 'Terrain',
    typeLabelAr: 'أرض',
    surface: '500 m²',
    bedrooms: 0,
    samsarName: 'Si Mohamed',
    samsarPhone: '+212 661 11 22 33',
    operation: 'achat'
  },

  // --- RABAT ---
  {
    id: 'rab-app-1',
    image: 'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=1200&q=80',
    title: 'Appartement moderne 3 pièces à Agdal, Rabat',
    titleAr: 'شقة عصرية 3 غرف بأكدال، الرباط',
    price: '1 200 000 MAD',
    priceAr: '1.200.000 درهم',
    priceNum: 1200000,
    cityId: 'rabat',
    city: 'Rabat',
    cityAr: 'الرباط',
    quarterId: 'agdal',
    quarter: 'Agdal',
    quarterAr: 'أكدال',
    type: 'appartement',
    typeLabel: 'Appartement',
    typeLabelAr: 'شقة',
    surface: '105 m²',
    bedrooms: 3,
    samsarName: 'Samsar Driss',
    samsarPhone: '+212 661 55 66 77',
    operation: 'achat'
  },
  {
    id: 'rab-mai-1',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    title: 'Maison contemporaine avec jardin à Hay Riad, Rabat',
    titleAr: 'منزل أنيق مع حديقة بحي الرياض، الرباط',
    price: '3 200 000 MAD',
    priceAr: '3.200.000 درهم',
    priceNum: 3200000,
    cityId: 'rabat',
    city: 'Rabat',
    cityAr: 'الرباط',
    quarterId: 'hay_riad',
    quarter: 'Hay Riad',
    quarterAr: 'حي الرياض',
    type: 'maison',
    typeLabel: 'Maison',
    typeLabelAr: 'منزل',
    surface: '260 m²',
    bedrooms: 5,
    samsarName: 'Samsar Driss',
    samsarPhone: '+212 661 55 66 77',
    operation: 'achat'
  },
  {
    id: 'rab-vil-1',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    title: 'Grande Villa avec parc arboré à Souissi, Rabat',
    titleAr: 'فيلا واسعة مع حديقة مشجرة بالسويسي، الرباط',
    price: '4 900 000 MAD',
    priceAr: '4.900.000 درهم',
    priceNum: 4900000,
    cityId: 'rabat',
    city: 'Rabat',
    cityAr: 'الرباط',
    quarterId: 'souissi',
    quarter: 'Souissi',
    quarterAr: 'السويسي',
    type: 'villa',
    typeLabel: 'Villa',
    typeLabelAr: 'فيلا',
    surface: '600 m²',
    bedrooms: 6,
    samsarName: 'Samsar Driss',
    samsarPhone: '+212 661 55 66 77',
    operation: 'achat'
  },
  {
    id: 'rab-ter-1',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    title: 'Terrain résidentiel titré à Hay Riad, Rabat',
    titleAr: 'بقعة أرضية محفظة ومجهزة بحي الرياض، الرباط',
    price: '1 450 000 MAD',
    priceAr: '1.450.000 درهم',
    priceNum: 1450000,
    cityId: 'rabat',
    city: 'Rabat',
    cityAr: 'الرباط',
    quarterId: 'hay_riad',
    quarter: 'Hay Riad',
    quarterAr: 'حي الرياض',
    type: 'terrain',
    typeLabel: 'Terrain',
    typeLabelAr: 'أرض',
    surface: '420 m²',
    bedrooms: 0,
    samsarName: 'Samsar Driss',
    samsarPhone: '+212 661 55 66 77',
    operation: 'achat'
  },
  {
    id: 'rab-com-1',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    title: 'Local commercial et bureaux modernes à Agdal, Rabat',
    titleAr: 'محل تجاري ومكاتب عصرية بأكدال، الرباط',
    price: '1 850 000 MAD',
    priceAr: '1.850.000 درهم',
    priceNum: 1850000,
    cityId: 'rabat',
    city: 'Rabat',
    cityAr: 'الرباط',
    quarterId: 'agdal',
    quarter: 'Agdal',
    quarterAr: 'أكدال',
    type: 'local',
    typeLabel: 'Commerce / Local',
    typeLabelAr: 'محل تجاري',
    surface: '95 m²',
    bedrooms: 0,
    samsarName: 'Samsar Driss',
    samsarPhone: '+212 661 55 66 77',
    operation: 'achat'
  },

  // --- TANGER ---
  {
    id: 'tan-app-1',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
    title: 'Appartement lumineux avec balcon à Centre Ville, Tanger',
    titleAr: 'شقة مضيئة مع شرفة بوسط المدينة، طنجة',
    price: '780 000 MAD',
    priceAr: '780.000 درهم',
    priceNum: 780000,
    cityId: 'tanger',
    city: 'Tanger',
    cityAr: 'طنجة',
    quarterId: 'centre',
    quarter: 'Centre Ville',
    quarterAr: 'وسط المدينة',
    type: 'appartement',
    typeLabel: 'Appartement',
    typeLabelAr: 'شقة',
    surface: '88 m²',
    bedrooms: 2,
    samsarName: 'Moulay Rachid',
    samsarPhone: '+212 661 77 88 99',
    operation: 'achat'
  },
  {
    id: 'tan-vil-1',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    title: 'Superbe Villa vue mer panoramique à Malabata, Tanger',
    titleAr: 'فيلا فاخرة بإطلالة بحرية بمالاباطا، طنجة',
    price: '4 100 000 MAD',
    priceAr: '4.100.000 درهم',
    priceNum: 4100000,
    cityId: 'tanger',
    city: 'Tanger',
    cityAr: 'طنجة',
    quarterId: 'malabata',
    quarter: 'Malabata',
    quarterAr: 'مالاباطا',
    type: 'villa',
    typeLabel: 'Villa',
    typeLabelAr: 'فيلا',
    surface: '420 m²',
    bedrooms: 4,
    samsarName: 'Moulay Rachid',
    samsarPhone: '+212 661 77 88 99',
    operation: 'achat'
  },
  {
    id: 'tan-mai-1',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    title: 'Maison de charme avec terrasse à Marshan, Tanger',
    titleAr: 'منزل أصيل مع سطح بانورامي بمرشان، طنجة',
    price: '1 850 000 MAD',
    priceAr: '1.850.000 درهم',
    priceNum: 1850000,
    cityId: 'tanger',
    city: 'Tanger',
    cityAr: 'طنجة',
    quarterId: 'marshan',
    quarter: 'Marshan',
    quarterAr: 'مرشان',
    type: 'maison',
    typeLabel: 'Maison',
    typeLabelAr: 'منزل',
    surface: '210 m²',
    bedrooms: 4,
    samsarName: 'Moulay Rachid',
    samsarPhone: '+212 661 77 88 99',
    operation: 'achat'
  },
  {
    id: 'tan-ter-1',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    title: 'Terrain résidentiel titré à Iberia, Tanger',
    titleAr: 'بقعة أرضية محفظة ومهيأة بإيبيريا، طنجة',
    price: '980 000 MAD',
    priceAr: '980.000 درهم',
    priceNum: 980000,
    cityId: 'tanger',
    city: 'Tanger',
    cityAr: 'طنجة',
    quarterId: 'iberia',
    quarter: 'Iberia',
    quarterAr: 'إيبيريا',
    type: 'terrain',
    typeLabel: 'Terrain',
    typeLabelAr: 'أرض',
    surface: '350 m²',
    bedrooms: 0,
    samsarName: 'Moulay Rachid',
    samsarPhone: '+212 661 77 88 99',
    operation: 'achat'
  },

  // --- BIENS À LOUER (LOCATION) ---
  {
    id: 'cas-loc-1',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    title: 'Appartement meublé standing à Maarif, Casablanca',
    titleAr: 'شقة مفروشة راقية بالمعاريف، الدار البيضاء',
    price: '6 500 MAD / mois',
    priceAr: '6.500 درهم / شهر',
    priceNum: 6500,
    cityId: 'casablanca',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    quarterId: 'maarif',
    quarter: 'Maârif',
    quarterAr: 'المعاريف',
    type: 'appartement',
    typeLabel: 'Appartement',
    typeLabelAr: 'شقة',
    surface: '75 m²',
    bedrooms: 2,
    samsarName: 'Samsar Hassan',
    samsarPhone: '+212 661 22 33 44',
    operation: 'location'
  },
  {
    id: 'rab-loc-1',
    image: 'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=1200&q=80',
    title: 'Appartement avec terrasse à Agdal, Rabat',
    titleAr: 'شقة راقية مع شرفة بأكدال، الرباط',
    price: '7 500 MAD / mois',
    priceAr: '7.500 درهم / شهر',
    priceNum: 7500,
    cityId: 'rabat',
    city: 'Rabat',
    cityAr: 'الرباط',
    quarterId: 'agdal',
    quarter: 'Agdal',
    quarterAr: 'أكدال',
    type: 'appartement',
    typeLabel: 'Appartement',
    typeLabelAr: 'شقة',
    surface: '95 m²',
    bedrooms: 2,
    samsarName: 'Samsar Driss',
    samsarPhone: '+212 661 55 66 77',
    operation: 'location'
  },
  {
    id: 'rab-loc-2',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    title: 'Bel appartement meublé à Hay Riad, Rabat',
    titleAr: 'شقة مفروشة راقية بحي الرياض، الرباط',
    price: '8 500 MAD / mois',
    priceAr: '8.500 درهم / شهر',
    priceNum: 8500,
    cityId: 'rabat',
    city: 'Rabat',
    cityAr: 'الرباط',
    quarterId: 'hay_riad',
    quarter: 'Hay Riad',
    quarterAr: 'حي الرياض',
    type: 'appartement',
    typeLabel: 'Appartement',
    typeLabelAr: 'شقة',
    surface: '110 m²',
    bedrooms: 2,
    samsarName: 'Samsar Driss',
    samsarPhone: '+212 661 55 66 77',
    operation: 'location'
  },
  {
    id: 'rak-loc-1',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    title: 'Appartement moderne meublé à Guéliz, Marrakech',
    titleAr: 'شقة عصرية مفروشة بجيليز، مراكش',
    price: '5 500 MAD / mois',
    priceAr: '5.500 درهم / شهر',
    priceNum: 5500,
    cityId: 'marrakech',
    city: 'Marrakech',
    cityAr: 'مراكش',
    quarterId: 'gueliz',
    quarter: 'Guéliz',
    quarterAr: 'جيليز',
    type: 'appartement',
    typeLabel: 'Appartement',
    typeLabelAr: 'شقة',
    surface: '80 m²',
    bedrooms: 2,
    samsarName: 'Si Mohamed',
    samsarPhone: '+212 661 11 22 33',
    operation: 'location'
  },
  {
    id: 'tan-loc-1',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
    title: 'Appartement vue mer à Centre Ville, Tanger',
    titleAr: 'شقة بإطلالة بحرية بوسط المدينة، طنجة',
    price: '4 800 MAD / mois',
    priceAr: '4.800 درهم / شهر',
    priceNum: 4800,
    cityId: 'tanger',
    city: 'Tanger',
    cityAr: 'طنجة',
    quarterId: 'centre',
    quarter: 'Centre Ville',
    quarterAr: 'وسط المدينة',
    type: 'appartement',
    typeLabel: 'Appartement',
    typeLabelAr: 'شقة',
    surface: '85 m²',
    bedrooms: 2,
    samsarName: 'Moulay Rachid',
    samsarPhone: '+212 661 77 88 99',
    operation: 'location'
  },

  // --- AGADIR ---
  {
    id: 'aga-app-1',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    title: 'Appartement vue sur mer à Marina, Agadir',
    titleAr: 'شقة راقية بإطلالة على البحر بمارينا، أكادير',
    price: '920 000 MAD',
    priceAr: '920.000 درهم',
    priceNum: 920000,
    cityId: 'agadir',
    city: 'Agadir',
    cityAr: 'أكادير',
    quarterId: 'marina',
    quarter: 'Marina',
    quarterAr: 'مارينا',
    type: 'appartement',
    typeLabel: 'Appartement',
    typeLabelAr: 'شقة',
    surface: '90 m²',
    bedrooms: 2,
    samsarName: 'Samsar Aziz',
    samsarPhone: '+212 661 33 44 55',
    operation: 'achat'
  },
  {
    id: 'aga-vil-1',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    title: 'Villa moderne avec piscine à Sonaba, Agadir',
    titleAr: 'فيلا عصرية مع مسبح بسونابا، أكادير',
    price: '3 200 000 MAD',
    priceAr: '3.200.000 درهم',
    priceNum: 3200000,
    cityId: 'agadir',
    city: 'Agadir',
    cityAr: 'أكادير',
    quarterId: 'sonaba',
    quarter: 'Sonaba',
    quarterAr: 'سونابا',
    type: 'villa',
    typeLabel: 'Villa',
    typeLabelAr: 'فيلا',
    surface: '380 m²',
    bedrooms: 4,
    samsarName: 'Samsar Aziz',
    samsarPhone: '+212 661 33 44 55',
    operation: 'achat'
  },
  {
    id: 'aga-loc-1',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    title: 'Appartement meublé à Baie des Palmiers, Agadir',
    titleAr: 'شقة مفروشة بخليج النخيل، أكادير',
    price: '5 000 MAD / mois',
    priceAr: '5.000 درهم / شهر',
    priceNum: 5000,
    cityId: 'agadir',
    city: 'Agadir',
    cityAr: 'أكادير',
    quarterId: 'baie_palmiers',
    quarter: 'Baie des Palmiers',
    quarterAr: 'خليج النخيل',
    type: 'appartement',
    typeLabel: 'Appartement',
    typeLabelAr: 'شقة',
    surface: '82 m²',
    bedrooms: 2,
    samsarName: 'Samsar Aziz',
    samsarPhone: '+212 661 33 44 55',
    operation: 'location'
  },

  // --- FÈS ---
  {
    id: 'fes-mai-1',
    image: 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1200&q=80',
    title: 'Riad authentique rénové à Médina, Fès',
    titleAr: 'رياض أصيل مجدد بالمدينة القديمة، فاس',
    price: '1 600 000 MAD',
    priceAr: '1.600.000 درهم',
    priceNum: 1600000,
    cityId: 'fes',
    city: 'Fès',
    cityAr: 'فاس',
    quarterId: 'medina',
    quarter: 'Médina',
    quarterAr: 'المدينة القديمة',
    type: 'riad',
    typeLabel: 'Riad',
    typeLabelAr: 'رياض',
    surface: '260 m²',
    bedrooms: 5,
    samsarName: 'Si Mehdi',
    samsarPhone: '+212 661 88 99 00',
    operation: 'achat'
  },
  {
    id: 'fes-app-1',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    title: 'Appartement standing à Ville Nouvelle, Fès',
    titleAr: 'شقة راقية بالمدينة الجديدة، فاس',
    price: '680 000 MAD',
    priceAr: '680.000 درهم',
    priceNum: 680000,
    cityId: 'fes',
    city: 'Fès',
    cityAr: 'فاس',
    quarterId: 'ville_nouvelle',
    quarter: 'Ville Nouvelle',
    quarterAr: 'المدينة الجديدة',
    type: 'appartement',
    typeLabel: 'Appartement',
    typeLabelAr: 'شقة',
    surface: '110 m²',
    bedrooms: 3,
    samsarName: 'Si Mehdi',
    samsarPhone: '+212 661 88 99 00',
    operation: 'achat'
  },

  // --- MEKNÈS ---
  {
    id: 'mek-app-1',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
    title: 'Appartement ensoleillé à Hamria, Meknès',
    titleAr: 'شقة مشمسة بحمرية، مكناس',
    price: '580 000 MAD',
    priceAr: '580.000 درهم',
    priceNum: 580000,
    cityId: 'meknes',
    city: 'Meknès',
    cityAr: 'مكناس',
    quarterId: 'hamria',
    quarter: 'Hamria',
    quarterAr: 'حمرية',
    type: 'appartement',
    typeLabel: 'Appartement',
    typeLabelAr: 'شقة',
    surface: '95 m²',
    bedrooms: 3,
    samsarName: 'Samsar Karim',
    samsarPhone: '+212 661 44 55 66',
    operation: 'achat'
  },
  {
    id: 'mek-vil-1',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    title: 'Grande villa avec jardin à Belle Vue, Meknès',
    titleAr: 'فيلا واسعة مع حديقة ببل في، مكناس',
    price: '2 400 000 MAD',
    priceAr: '2.400.000 درهم',
    priceNum: 2400000,
    cityId: 'meknes',
    city: 'Meknès',
    cityAr: 'مكناس',
    quarterId: 'belle_vue',
    quarter: 'Belle Vue',
    quarterAr: 'بل في',
    type: 'villa',
    typeLabel: 'Villa',
    typeLabelAr: 'فيلا',
    surface: '360 m²',
    bedrooms: 5,
    samsarName: 'Samsar Karim',
    samsarPhone: '+212 661 44 55 66',
    operation: 'achat'
  }
];

// ============================================================================
// GESTION DU LOCALSTORAGE (userProperties)
// Relie le formulaire "Vendre / Déposer un bien" à la recherche classique & vocale
// ============================================================================
export function getUserProperties(): PropertyListing[] {
  if (typeof window === 'undefined') return [];
  try {
    const rawData = localStorage.getItem('userProperties');
    if (!rawData) return [];
    const list = JSON.parse(rawData);
    if (!Array.isArray(list)) return [];

    const cityArMap: Record<string, string> = {
      casablanca: 'الدار البيضاء',
      rabat: 'الرباط',
      marrakech: 'مراكش',
      tanger: 'طنجة',
      fes: 'فاس',
      agadir: 'أكادير',
      oujda: 'وجدة',
      meknes: 'مكناس',
      autre: 'أخرى'
    };

    const typeArMap: Record<string, string> = {
      maison: 'دار',
      appartement: 'شقة',
      villa: 'فيلا',
      riad: 'رياض',
      local: 'محل',
      bureau: 'مكتب',
      terrain: 'أرض',
      garage: 'كراج'
    };

    const typeFrMap: Record<string, string> = {
      maison: 'Maison',
      appartement: 'Appartement',
      villa: 'Villa',
      riad: 'Riad',
      local: 'Local commercial',
      bureau: 'Bureau',
      terrain: 'Terrain',
      garage: 'Garage'
    };

    return list.map((item: any) => {
      const typeNorm = (item.type || 'appartement').toLowerCase() as PropertyType;
      const cityNorm = item.city || 'Casablanca';
      const cityId = cityNorm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      const quarterNorm = item.neighborhood || item.quarter || 'Centre';
      const quarterId = quarterNorm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '') || 'all';

      const priceNum = typeof item.price === 'number' ? item.price : parseInt(String(item.price || '0'), 10) || 0;
      const surfaceNum = typeof item.surface === 'number' ? item.surface : parseInt(String(item.surface || '0'), 10) || 0;
      const roomsNum = typeof item.rooms === 'number' ? item.rooms : parseInt(String(item.rooms || item.bedrooms || '1'), 10) || 1;
      
      const op: OperationType = (item.operation === 'location' || item.operation === 'À louer' || item.operation === 'louer') ? 'location' : 'achat';

      const typeLabel = typeFrMap[typeNorm] || (typeNorm.charAt(0).toUpperCase() + typeNorm.slice(1));
      const typeLabelAr = typeArMap[typeNorm] || typeNorm;
      const cityAr = cityArMap[cityId] || cityNorm;

      const titleFr = item.title || `${typeLabel} à ${op === 'achat' ? 'vendre' : 'louer'} à ${cityNorm}`;
      const titleAr = `${typeLabelAr} ${op === 'achat' ? 'للبيع' : 'للكراء'} في ${cityAr}`;

      return {
        id: String(item.id || `user-prop-${Date.now()}`),
        image: item.image || '/placeholder-house.jpg',
        title: titleFr,
        titleAr: titleAr,
        price: `${priceNum.toLocaleString('fr-FR')} MAD`,
        priceAr: `${priceNum.toLocaleString('fr-FR')} درهم`,
        priceNum: priceNum,
        cityId: cityId,
        city: cityNorm,
        cityAr: cityAr,
        quarterId: quarterId,
        quarter: quarterNorm,
        quarterAr: quarterNorm,
        type: typeNorm,
        typeLabel: typeLabel,
        typeLabelAr: typeLabelAr,
        surface: `${surfaceNum} m²`,
        bedrooms: roomsNum,
        samsarName: item.fullName || item.sellerName || 'Propriétaire Direct',
        samsarPhone: item.phone || item.sellerPhone || '+212 600 00 00 00',
        operation: op,
        description: item.description || '',
        isUserSubmitted: true
      };
    });
  } catch (e) {
    console.warn('Error reading userProperties from localStorage:', e);
    return [];
  }
}

export function getAllPropertyListings(): PropertyListing[] {
  const userProps = getUserProperties();
  return [...userProps, ...PROPERTY_LISTINGS];
}

// ============================================================================
// DICTIONNAIRES VOCAUX EXHAUSTIFS & LOGIQUE STRICTE (FRANÇAIS & DARIJA)
// Synchronisés avec searchUtils pour une source de vérité unique et infaillible
// ============================================================================
export {
  typeMapping,
  operationMapping,
  cityMapping,
  CITIES_LIST,
  parseVoiceCommand,
  filtrerParTexteEcoute
} from '../utils/searchUtils';
export type { ParsedVoiceFilters, ResultatFiltreVocal } from '../utils/searchUtils';
import {
  typeMapping,
  operationMapping,
  cityMapping,
  parseVoiceCommand,
  filtrerParTexteEcoute
} from '../utils/searchUtils';
import type { ParsedVoiceFilters, ResultatFiltreVocal } from '../utils/searchUtils';

// ----------------------------------------------------------------------------
// TITRE DYNAMIQUE BILINGUE SELON LA LANGUE CHOISIE (ACTION 3)
// Exemple : lang === 'fr' ? 'Appartement à louer' : 'شقة للكراء'
// ----------------------------------------------------------------------------
export function getListingDynamicTitle(item: PropertyListing, lang: 'fr' | 'ar'): string {
  const isLocation = item.operation === 'location' || (item.priceNum !== undefined && item.priceNum < 50000);
  if (lang === 'ar') {
    switch (item.type) {
      case 'appartement':
        return isLocation ? 'شقة للكراء' : 'شقة للبيع';
      case 'villa':
        return isLocation ? 'فيلا للكراء' : 'فيلا للبيع';
      case 'maison':
        return isLocation ? 'منزل للكراء' : 'منزل للبيع';
      case 'terrain':
        return isLocation ? 'أرض للكراء' : 'أرض للبيع';
      case 'riad':
        return isLocation ? 'رياض للكراء' : 'رياض للبيع';
      case 'local':
        return isLocation ? 'محل تجاري للكراء' : 'محل تجاري للبيع';
      case 'bureau':
        return isLocation ? 'مكتب للكراء' : 'مكتب للبيع';
      case 'studio':
        return isLocation ? 'استوديو للكراء' : 'استوديو للبيع';
      case 'duplex':
        return isLocation ? 'دوبلكس للكراء' : 'دوبلكس للبيع';
      default:
        return isLocation ? 'عقار للكراء' : 'عقار للبيع';
    }
  } else {
    switch (item.type) {
      case 'appartement':
        return isLocation ? 'Appartement à louer' : 'Appartement à vendre';
      case 'villa':
        return isLocation ? 'Villa à louer' : 'Villa à vendre';
      case 'maison':
        return isLocation ? 'Maison à louer' : 'Maison à vendre';
      case 'terrain':
        return isLocation ? 'Terrain à louer' : 'Terrain à vendre';
      case 'riad':
        return isLocation ? 'Riad à louer' : 'Riad à vendre';
      case 'local':
        return isLocation ? 'Local commercial à louer' : 'Local commercial à vendre';
      case 'bureau':
        return isLocation ? 'Bureau à louer' : 'Bureau à vendre';
      case 'studio':
        return isLocation ? 'Studio à louer' : 'Studio à vendre';
      case 'duplex':
        return isLocation ? 'Duplex à louer' : 'Duplex à vendre';
      default:
        return isLocation ? 'Bien à louer' : 'Bien à vendre';
    }
  }
}

// ----------------------------------------------------------------------------
// GÉNÉRATEUR DU PANNEAU DE DIAGNOSTIC VOCAL (Étape C)
// ----------------------------------------------------------------------------
export function genererDiagnosticVocal(
  texte: string,
  listings: PropertyListing[],
  evaluation?: ResultatFiltreVocal
): VoiceDiagnosticData {
  const rawText = (texte || '').trim();
  const t = rawText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (!t) {
    return {
      texteBrut: '',
      texteNettoye: '',
      actionDeclenchee: 'En attente d\'écoute...'
    };
  }

  // 1. Ligne 1 : Texte brut capté
  const texteBrut = rawText;

  // 2. Ligne 2 : Analyse vocale (Français & Darija)
  const elementsTraduits: string[] = [];
  if (t.includes('louer') || t.includes('location') || t.includes('nkri') || t.includes('kri') || t.includes('كراء') || t.includes('نكري')) {
    elementsTraduits.push('Opération : Location');
  } else if (t.includes('acheter') || t.includes('achat') || t.includes('vente') || t.includes('nchri') || t.includes('chri') || t.includes('شراء') || t.includes('نشري')) {
    elementsTraduits.push('Opération : Achat');
  }

  if (t.includes('appartement') || t.includes('appart') || t.includes('studio') || t.includes('ch9a') || t.includes('شقة') || t.includes('برطمة')) {
    elementsTraduits.push('Type : Appartement');
  } else if (t.includes('villa') || t.includes('فيلا')) {
    elementsTraduits.push('Type : Villa');
  } else if (t.includes('riad') || t.includes('رياض') || t.includes('ksar')) {
    elementsTraduits.push('Type : Riad');
  } else if (t.includes('local') || t.includes('commerce') || t.includes('boutique') || t.includes('magasin') || t.includes('mahal') || t.includes('hanout') || t.includes('محل')) {
    elementsTraduits.push('Type : Local / Commerce');
  } else if (t.includes('bureau') || t.includes('office') || t.includes('maktab') || t.includes('مكتب')) {
    elementsTraduits.push('Type : Bureau');
  } else if (t.includes('maison') || t.includes('dar') || t.includes('دار') || t.includes('منزل')) {
    elementsTraduits.push('Type : Maison');
  } else if (t.includes('terrain') || t.includes('ard') || t.includes('أرض') || t.includes('بقعة')) {
    elementsTraduits.push('Type : Terrain');
  }

  if (t.includes('rabat') || t.includes('rbat') || t.includes('الرباط') || t.includes('رباط')) {
    elementsTraduits.push('Ville : Rabat');
  } else if (t.includes('casablanca') || t.includes('casa') || t.includes('dar beida') || t.includes('كازا') || t.includes('الدار البيضاء')) {
    elementsTraduits.push('Ville : Casablanca');
  } else if (t.includes('tanger') || t.includes('tanja') || t.includes('طنجة')) {
    elementsTraduits.push('Ville : Tanger');
  } else if (t.includes('marrakech') || t.includes('kech') || t.includes('مراكش')) {
    elementsTraduits.push('Ville : Marrakech');
  } else if (t.includes('agadir') || t.includes('أكادير') || t.includes('اكادير')) {
    elementsTraduits.push('Ville : Agadir');
  }

  if (t.includes('1 ch') || t.includes('une ch') || t.includes('studio') || t.includes('wahed') || t.includes('بيت واحد')) {
    elementsTraduits.push('1 chambre min.');
  } else if (t.includes('2 ch') || t.includes('deux ch') || t.includes('jouj') || t.includes('جوج بيوت')) {
    elementsTraduits.push('2 chambres min.');
  } else if (t.includes('3 ch') || t.includes('trois ch') || t.includes('tlata') || t.includes('تلاتة بيوت')) {
    elementsTraduits.push('3 chambres min.');
  }

  const texteNettoye = elementsTraduits.length > 0
    ? elementsTraduits.join(' • ')
    : 'Texte analysé : ' + rawText;

  // 3. Ligne 3 : Action déclenchée
  const evalResult = evaluation || filtrerParTexteEcoute(rawText, listings);
  const filtresDesc: string[] = [];
  if (evalResult.filtreAction) filtresDesc.push(`Opération: ${evalResult.filtreAction === 'location' ? 'Location' : 'Achat'}`);
  if (evalResult.filtreVille) filtresDesc.push(`Ville: ${evalResult.filtreVille}`);
  if (evalResult.filtreType) filtresDesc.push(`Type: ${evalResult.filtreType}`);
  if (evalResult.filtreChambres) filtresDesc.push(`Chambres >= ${evalResult.filtreChambres}`);

  const actionDeclenchee = filtresDesc.length > 0
    ? `Filtres actifs : [${filtresDesc.join(', ')}] → ${evalResult.resultats.length} bien(s) trouvé(s)`
    : `Recherche globale → ${evalResult.resultats.length} bien(s)`;

  return {
    texteBrut,
    texteNettoye,
    actionDeclenchee
  };
}



// Moteur de recherche du Mode Classique (PRÉSERVÉ & INTÉGRÉ AU LOCALSTORAGE)
export function filtrerBiensModeClassique(
  ville: string | null = null,
  quartier: string = 'all',
  type: string | PropertyType | null = null,
  budget: string = 'max'
): PropertyListing[] {
  const maxPrice = 
    budget === '500k' ? 500000 :
    budget === '1m' ? 1000000 :
    budget === '2m' ? 2000000 :
    budget === '3m' ? 3500000 :
    Infinity;

  const allListings = getAllPropertyListings();

  return allListings.filter((item) => {
    if (item.operation === 'location') return false;

    if (ville && ville !== 'all') {
      const v = ville.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      const itemCity = item.city.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      const itemCityId = (item.cityId || '').toLowerCase().trim();
      const matchCity = itemCity === v || itemCityId === v || itemCity.includes(v) || v.includes(itemCity);
      if (!matchCity) return false;
    }

    if (quartier && quartier !== 'all') {
      const q = quartier.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      const itemQId = (item.quarterId || '').toLowerCase().trim();
      const itemQ = (item.quarter || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      const matchQuarter = itemQId === q || itemQ === q || itemQ.includes(q) || q.includes(itemQ);
      if (!matchQuarter) return false;
    }

    if (type && type !== 'all' && (type as string) !== '') {
      const tNorm = (type as string).toLowerCase().replace(/ commercial$/, '').trim();
      const itemType = (item.type || '').toLowerCase().trim();
      if (itemType !== tNorm && !itemType.includes(tNorm) && !tNorm.includes(itemType)) {
        return false;
      }
    }

    if (item.priceNum > maxPrice) {
      return false;
    }

    return true;
  });
}

const BUDGET_OPTIONS = [
  { id: '500k', label: '500 000 DH', labelAr: '500 ألف درهم' },
  { id: '1m', label: '1 000 000 DH', labelAr: '1 مليون درهم' },
  { id: '2m', label: '2 000 000 DH', labelAr: '2 مليون درهم' },
  { id: '3m', label: '3 500 000 DH', labelAr: '3.5 مليون درهم' },
  { id: 'max', label: 'Illimité', labelAr: 'غير محدد' }
];

export const quartiersParVille: Record<string, string[]> = {
  'Casablanca': ['Maârif', 'Ain Diab', 'Californie', 'Anfa', 'Gauthier', 'Bourgogne', 'Racine', 'Palmier', 'Oulfa', 'Sidi Maarouf', 'Ain Sebaa', 'Hay Hassani', 'Derb Sultan', 'Belvedere', 'Lissasfa'],
  'Rabat': ['Agdal', 'Hassan', 'Souissi', 'Hay Riad', 'Ocean', 'Diour Jamaa', 'Yacoub El Mansour', 'Aviation', 'Madinat Al Irfane'],
  'Marrakech': ['Guéliz', 'Hivernage', 'Medina', 'Mellah', 'Targa', 'Agdal', 'M\'hamid', 'Daoudiate'],
  'Tanger': ['Malabata', 'Centre Ville', 'Marshan', 'Boukhalef', 'Mesnana', 'Beni Makada'],
  'Fès': ['Ville Nouvelle', 'Medina', 'Agdal', 'Atlas', 'Saiss'],
  'Agadir': ['Talborjt', 'Founty', 'Hay Mohammadi', 'Anza', 'Dakhla'],
  'Oujda': ['Centre Ville', 'Al Qods', 'Lazaret', 'Mir Ali', 'Golf'],
  'Meknès': ['Hamria', 'Bassatine', 'Mansour', 'Zitoune', 'Marjane'],
  'Kénitra': ['Centre Ville', 'Bir Rami', 'Mehdia', 'Mimosa', 'Ouled Oujih'],
  'Tétouan': ['Centre Ville', 'Martil', 'Cabo Negro', 'Wilaya', 'M\'diq'],
  'Safi': ['Centre Ville', 'Biada', 'Plateau', 'Kourssi'],
  'El Jadida': ['Centre Ville', 'Sidi Bouzid', 'Al Qods', 'Nassim', 'Plage'],
  'Béni Mellal': ['Centre Ville', 'Ouled Hamdane', 'Al Massira', 'Riad Salam'],
  'Nador': ['Centre Ville', 'Al Matar', 'Taouima', 'Beni Ensar'],
  'Taza': ['Centre Ville', 'Boutouil', 'Al Qods', 'Doha'],
  'Settat': ['Centre Ville', 'Al Mouatamid', 'Al Farah', 'Miftah Al Khir'],
  'Berrechid': ['Centre Ville', 'Al Mouatamid', 'Riad', 'Bouskoura Sud'],
  'Khouribga': ['Centre Ville', 'Al Massira', 'Al Fariss', 'Zaytoun'],
  'Laâyoune': ['Centre Ville', 'Al Wahda', 'Al Qods', 'Madinat Al Wifaq'],
  'Dakhla': ['Centre Ville', 'Oum Tounsi', 'Al Massira', 'Kassambar']
};

export interface StartNavigationProps {
  onRestartSplash?: () => void;
  language?: Language;
  mode?: string;
  initialStep?: StartScreen;
  onBackToMode?: () => void;
  onBack?: () => void;
  onGoHome?: () => void;
}

export const StartNavigation: React.FC<StartNavigationProps> = ({ 
  onRestartSplash,
  language: propLanguage,
  mode: propMode,
  initialStep = 'home',
  onBackToMode,
  onBack,
  onGoHome
}) => {
  // NOUVELLE STRUCTURE (Parcours guidé par étapes) :
  // 1. Variable d'état currentStep ('home', 'find_samsar', 'search_property', 'post_listing', etc.)
  const [currentStep, setCurrentStep] = useState<StartScreen>(initialStep);
  const currentScreen = currentStep;
  const setCurrentScreen = setCurrentStep;
  const [language, setLanguage] = useState<Language>(propLanguage || 'fr');

  useEffect(() => {
    if (propLanguage) {
      setLanguage(propLanguage);
    }
  }, [propLanguage]);

  useEffect(() => {
    if (initialStep) {
      setCurrentStep(initialStep);
    }
  }, [initialStep]);

  // ACTION 2 : Double Micro (Darija ar-MA / Français fr-FR)
  const [voiceLanguage, setVoiceLanguage] = useState<'darija' | 'fr'>('darija');

  // État des filtres vocaux explicite (nettoyage forcé avant chaque mise à jour)
  const [filters, setFilters] = useState<{
    city: string | null;
    type: PropertyType | null;
    operation: 'achat' | 'location' | null;
    price: string | null;
    neighborhood?: string | null;
  }>({
    city: null,
    type: null,
    operation: null,
    price: null,
    neighborhood: null,
  });

  const [texteEcoute, setTexteEcoute] = useState<string>("");
  const [texteBrutCapte, setTexteBrutCapte] = useState<string>("");
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [micStatusMessage, setMicStatusMessage] = useState<string>("");
  const [micError, setMicError] = useState<string | null>(null);
  const [isInIframe, setIsInIframe] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const speechRecognitionRef = React.useRef<any>(null);
  const texteEcouteRef = React.useRef(texteEcoute);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        setIsInIframe(window.self !== window.top);
      } catch (e) {
        setIsInIframe(true);
      }
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognition);
    }
  }, []);

  useEffect(() => {
    texteEcouteRef.current = texteEcoute;
  }, [texteEcoute]);

  // État d'évaluation strict dynamique (avec LocalStorage userProperties synchronisé)
  const [allProperties, setAllProperties] = useState<PropertyListing[]>(() => getAllPropertyListings());

  const [voiceEvaluation, setVoiceEvaluation] = useState<ResultatFiltreVocal>(() =>
    filtrerParTexteEcoute("", getAllPropertyListings())
  );

  // États des filtres pour la page "Rechercher un bien" (Acheter / Vendre)
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [selectedQuarterId, setSelectedQuarterId] = useState<string>('all');
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('');
  const [contactedListing, setContactedListing] = useState<PropertyListing | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string>('1m');
  const [searchSubmitted, setSearchSubmitted] = useState<boolean>(false);
  const [filteredListings, setFilteredListings] = useState<PropertyListing[]>([]);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  // Réinitialisation automatique du quartier si la ville change ou si le quartier n'appartient pas à la ville
  useEffect(() => {
    const currentCity = filters.city || selectedCityId;
    if (filters.neighborhood && (!currentCity || !quartiersParVille[currentCity]?.includes(filters.neighborhood))) {
      setFilters(prev => ({ ...prev, neighborhood: '' }));
      setSelectedQuarterId('all');
    }
  }, [filters.city, selectedCityId]);

  // Recherche automatique instantanée (Live Search) pour la page "Acheter un bien"
  useEffect(() => {
    if (currentScreen === 'search_property') {
      const city = selectedCityId || filters.city || '';
      const quarter = selectedQuarterId || filters.neighborhood || 'all';
      const type = selectedPropertyType || (filters.type as string) || '';
      const budget = selectedBudget || 'max';

      const results = filtrerBiensModeClassique(city, quarter, type, budget);
      setFilteredListings(results);
      setSearchSubmitted(true);
    }
  }, [currentScreen, selectedCityId, filters.city, selectedQuarterId, filters.neighborhood, selectedPropertyType, filters.type, selectedBudget, allProperties]);

  // Synchronisation dynamique continue du LocalStorage (userProperties)
  useEffect(() => {
    const handleSync = () => {
      const updated = getAllPropertyListings();
      setAllProperties(updated);
      if (searchSubmitted) {
        setFilteredListings(filtrerBiensModeClassique(selectedCityId, selectedQuarterId, selectedPropertyType, selectedBudget));
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleSync);
      window.addEventListener('userPropertiesUpdated', handleSync);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleSync);
        window.removeEventListener('userPropertiesUpdated', handleSync);
      }
    };
  }, [searchSubmitted, selectedCityId, selectedQuarterId, selectedPropertyType, selectedBudget]);

  // Filtrage strict infaillible (ET logique)
  const filteredProperties = React.useMemo(() => {
    const filtered = allProperties.filter((property) => {
      // 1. Vérification de la Ville (si un filtre ville est actif)
      if (filters.city && property.city.toLowerCase() !== filters.city.toLowerCase()) {
        return false; // Rejeté si la ville ne correspond pas
      }

      // 2. Vérification du Type (si un filtre type est actif)
      if (filters.type && property.type.toLowerCase() !== filters.type.toLowerCase()) {
        return false; // Rejeté si le type ne correspond pas
      }

      // 3. Vérification de l'Opération (si un filtre opération est actif)
      if (filters.operation && property.operation.toLowerCase() !== filters.operation.toLowerCase()) {
        return false; // Rejeté si l'opération (achat/location) ne correspond pas
      }

      // Si le bien a passé tous les tests (ou si aucun filtre n'est actif), on le garde
      return true;
    });

    // Ajoute ce log pour qu'on puisse vérifier dans la console du navigateur :
    console.log("Filtres actifs:", filters);
    console.log("Nombre de biens après filtrage strict:", filtered.length);
    return filtered;
  }, [filters, allProperties]);

  // Diagnostic vocal temps réel (Étape C)
  const diagnosticVocal = React.useMemo(() => {
    return genererDiagnosticVocal(texteBrutCapte || texteEcoute, allProperties, voiceEvaluation);
  }, [texteBrutCapte, texteEcoute, allProperties, voiceEvaluation]);

  const [countdown, setCountdown] = useState<number>(3);
  const [calledModal, setCalledModal] = useState<PropertyListing | null>(null);
  const [detailModalListing, setDetailModalListing] = useState<PropertyListing | null>(null);

  // État de l'alerte pour "Trouver un Samsar" (remplacé par la vraie page find_samsar)
  const [activeAlert, setActiveAlert] = useState<{ title: string; subtitle: string } | null>(null);
  const [selectedSamsarModal, setSelectedSamsarModal] = useState<TrustedSamsar | null>(null);
  const [simulatedCallActive, setSimulatedCallActive] = useState<boolean>(false);
  const [samsarCityFilter, setSamsarCityFilter] = useState<string>('');
  const [samsarQuarterFilter, setSamsarQuarterFilter] = useState<string>('');
  const [samsarTypeFilter, setSamsarTypeFilter] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Réinitialisation automatique du quartier Samsar si la ville change ou si le quartier n'appartient pas à la ville
  useEffect(() => {
    if (samsarQuarterFilter && (!samsarCityFilter || !quartiersParVille[samsarCityFilter]?.includes(samsarQuarterFilter))) {
      setSamsarQuarterFilter('');
    }
  }, [samsarCityFilter]);

  // 2. FORCER LE RESET DES FILTRES DANS LA FONCTION DE TRADUCTION
  const handleTranslatedText = (nouveauTexte: string) => {
    const texteNettoye = (nouveauTexte || '').trim();
    setTexteBrutCapte(texteNettoye);
    setTexteEcoute(texteNettoye);

    // FORCER LE NETTOYAGE AVANT MISE À JOUR
    setFilters({ city: null, type: null, operation: null, price: null });

    // 3. APPLIQUER LES NOUVEAUX CRITÈRES APRÈS LE RESET (STRICT, ZÉRO APPROXIMATION)
    const currentListings = getAllPropertyListings();
    setAllProperties(currentListings);
    const evaluation = filtrerParTexteEcoute(texteNettoye, currentListings);

    setFilters({
      city: evaluation.filtreVille,
      type: evaluation.filtreType,
      operation: evaluation.filtreAction,
      price: null,
    });

    setVoiceEvaluation(evaluation);
    setCurrentScreen('voice_results');
    setCurrentStep('voice_results');
  };

  const handleResetVoiceSearch = () => {
    if (isListeningMic) stopListening();
    setTexteBrutCapte('');
    setTexteEcoute('');
    texteEcouteRef.current = '';
    setVoiceEvaluation({
      filtreAction: null,
      filtreVille: null,
      filtreType: null,
      filtreChambres: null,
      resultats: []
    });
    setFilters({ city: null, type: null, operation: null, price: null });
    setCurrentScreen('vocal');
    setCurrentStep('vocal');
  };

  const executeVoiceSearch = handleTranslatedText;

  // Arrêt sécurisé du micro
  const stopListening = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.onresult = null;
        speechRecognitionRef.current.onerror = null;
        speechRecognitionRef.current.onend = null;
        speechRecognitionRef.current.onstart = null;
        speechRecognitionRef.current.abort();
      } catch (err) {}
      speechRecognitionRef.current = null;
    }
    setIsListeningMic(false);
    setMicStatusMessage(`Micro en pause • Cliquez pour dicter en ${voiceLanguage === 'darija' ? 'Darija' : 'Français'}`);
  };

  // 1. DÉTRUIRE ET RECRÉER LE MICRO À CHAQUE CLIC (Le vrai fix - Évite le Stale Closure)
  // ACTION 2 : Support du Double Micro (Darija ar-MA vs Français fr-FR)
  const startListening = (langOverride?: 'darija' | 'fr', navigateToListening: boolean = false) => {
    const lang = langOverride || voiceLanguage;
    if (langOverride && langOverride !== voiceLanguage) {
      setVoiceLanguage(langOverride);
    }

    // A. Détruire et nettoyer toute instance précédente qui traîne en mémoire
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.onresult = null;
        speechRecognitionRef.current.onerror = null;
        speechRecognitionRef.current.onend = null;
        speechRecognitionRef.current.onstart = null;
        speechRecognitionRef.current.abort();
      } catch (err) {
        // Ignorer l'erreur d'arrêt d'une ancienne instance
      }
      speechRecognitionRef.current = null;
    }

    // B. Vider immédiatement le texte et l'état (Zéro mémoire / cache résiduel)
    setTexteBrutCapte('');
    setTexteEcoute('');
    texteEcouteRef.current = '';
    setMicError(null);
    setMicStatusMessage(`Micro actif • Parlez maintenant en ${lang === 'darija' ? 'Darija' : 'Français'}...`);
    setCountdown(5);

    if (navigateToListening) {
      setCurrentScreen('voice_listening');
    }

    // C. CRÉER UNE NOUVELLE INSTANCE À CHAQUE CLIC
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const isSupportedCheck = !!SpeechRecognition;
    if (!isSupportedCheck) {
      setMicStatusMessage("Reconnaissance vocale non supportée sur ce navigateur.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      // 2. FORCER LA CONFIGURATION STANDARD BILINGUE
      recognition.continuous = false;
      recognition.interimResults = false;
      // 'ar-MA' pour Darija marocain, 'fr-FR' pour Français
      recognition.lang = lang === 'darija' ? 'ar-MA' : 'fr-FR';

      recognition.onstart = () => {
        setIsListeningMic(true);
        setMicError(null);
        setMicStatusMessage(
          lang === 'darija'
            ? 'Micro ACTIF (Darija ar-MA) : Parlez maintenant en darija (ex: "باغي نكري شقة في الرباط")...'
            : 'Micro ACTIF (Français fr-FR) : Parlez maintenant en français (ex: "Je veux louer un appartement à Rabat")...'
        );
      };

      // FORCER LA MISE À JOUR DANS onresult
      recognition.onresult = (event: any) => {
        let transcript = '';
        if (event.results && event.results.length > 0 && event.results[0]?.[0]) {
          transcript = event.results[0][0].transcript;
        }
        const cleanTranscript = (transcript || '').trim();
        if (cleanTranscript) {
          texteEcouteRef.current = cleanTranscript;
          setTexteBrutCapte(cleanTranscript);
          setTexteEcoute(cleanTranscript);
          setMicStatusMessage(`Voix captée (${lang === 'darija' ? 'Darija' : 'Français'}) : "${cleanTranscript}"`);

          // FORCER LE RESET DES FILTRES ET APPLIQUER LA RECHERCHE
          handleTranslatedText(cleanTranscript);
        }
      };

      // 1. AJOUTER UN DÉTECTEUR D'ERREURS (Indispensable)
      recognition.onerror = (event: any) => {
        console.error("Erreur Micro:", event.error);
        setIsListeningMic(false);
        setMicError(event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setMicStatusMessage(
            language === 'ar'
              ? 'الوصول إلى الميكروفون غير مصرح به أو الاتصال غير آمن. يرجى تفعيل الميكروفون في إعدادات المتصفح.'
              : 'Accès micro non autorisé ou connexion non sécurisée. Activez le micro dans les paramètres de votre navigateur.'
          );
        } else if (event.error === 'no-speech') {
          setMicStatusMessage(language === 'ar' ? 'لم يتم التقاط أي صوت.' : 'Aucune voix détectée.');
        } else {
          setMicStatusMessage(`Erreur micro : ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListeningMic(false);
      };

      recognition.start();
      speechRecognitionRef.current = recognition;
    } catch (err: any) {
      console.error('Erreur instanciation SpeechRecognition:', err);
      setIsListeningMic(false);
      setMicStatusMessage("Erreur d'activation du micro. Cliquez pour réessayer.");
    }
  };

  // Bascule du microphone réel Web Speech API (appelle startListening pour réinstancier proprement)
  const toggleRealMic = () => {
    if (isListeningMic) {
      stopListening();
    } else {
      startListening(voiceLanguage);
    }
  };

  // Mode classique : bouton "Rechercher" (strictement préservé)
  const handleExecuteSearch = (
    cityOverride?: string,
    quarterOverride?: string,
    typeOverride?: string | PropertyType,
    budgetOverride?: string
  ) => {
    const city = cityOverride || selectedCityId;
    const quarter = quarterOverride || selectedQuarterId;
    const type = typeOverride || selectedPropertyType;
    const budget = budgetOverride || selectedBudget;

    const results = filtrerBiensModeClassique(city, quarter, type, budget);

    setFilteredListings(results);
    setSearchSubmitted(true);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  /* -------------------------------------------------------------
   * MODE VOCAL : Cycle de vie écran écoute & Nettoyage micro
   * ------------------------------------------------------------- */
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (currentScreen === 'voice_listening') {
      interval = setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
      }, 1000);

      // Si aucun micro n'a encore été démarré pour cet écran, instancier
      if (!speechRecognitionRef.current && !isListeningMic) {
        startListening();
      }
    }

    return () => {
      clearInterval(interval);
      if (currentScreen !== 'voice_listening') {
        if (speechRecognitionRef.current) {
          try {
            speechRecognitionRef.current.onresult = null;
            speechRecognitionRef.current.onerror = null;
            speechRecognitionRef.current.onend = null;
            speechRecognitionRef.current.onstart = null;
            speechRecognitionRef.current.abort();
          } catch {}
          speechRecognitionRef.current = null;
        }
        setIsListeningMic(false);
      }
    };
  }, [currentScreen]);

  /* =============================================================
   * PARCOURS VOCAL : RÉSULTATS VISUELS (100% DYNAMIQUE, ZERO HARDCODING)
   * ============================================================= */
  if (currentScreen === 'voice_results' || currentStep === 'voice_results') {
    return (
      <div 
        dir={language === 'ar' ? 'rtl' : 'ltr'} 
        className={`relative min-h-[100dvh] w-full bg-[#FAFAFA] text-stone-900 flex flex-col font-sans ${language === 'ar' ? 'text-right' : 'text-left'}`}
      >
        {/* 1. AppHeader Unifié & Fixe */}
        <AppHeader
          showBackButton={true}
          onBack={handleResetVoiceSearch}
          language={language}
          onToggleLanguage={() => setLanguage(language === 'ar' ? 'fr' : 'ar')}
          onSelectMenuOption={(option) => {
            if (isListeningMic) stopListening();
            setCurrentScreen(option as any);
            setCurrentStep(option as any);
          }}
          currentStep="vocal"
        />

        <main className="flex-1 w-full max-w-lg mx-auto p-4 sm:p-5 pt-20 sm:pt-24 flex flex-col gap-6 pb-6">
          <PageTitle
            title={language === 'ar' ? 'نتائج البحث الصوتي' : 'Résultats de recherche'}
            subtitle={
              language === 'ar'
                ? (voiceEvaluation.resultats.length > 0
                    ? `${voiceEvaluation.resultats.length} عقار مطابق لبحثك`
                    : 'العقارات المطابقة لبحثك الصوتي')
                : (voiceEvaluation.resultats.length > 0
                    ? `${voiceEvaluation.resultats.length} bien${voiceEvaluation.resultats.length > 1 ? 's' : ''} correspondant${voiceEvaluation.resultats.length > 1 ? 's' : ''}`
                    : 'Biens correspondants à votre recherche vocale')
            }
          />

          {/* Badges d'analyse des critères vocaux */}
          {(voiceEvaluation.filtreVille || voiceEvaluation.filtreType || voiceEvaluation.filtreAction || voiceEvaluation.filtreChambres) && (
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                {voiceEvaluation.filtreVille && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-[#006233] border border-emerald-200 font-bold">
                    📍 {voiceEvaluation.filtreVille}
                  </span>
                )}
                {voiceEvaluation.filtreType && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold capitalize">
                    🏠 {voiceEvaluation.filtreType}
                  </span>
                )}
                {voiceEvaluation.filtreAction && (
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold capitalize">
                    🏷️ {voiceEvaluation.filtreAction === 'location' ? (language === 'ar' ? 'كراء' : 'Location') : (language === 'ar' ? 'شراء' : 'Achat')}
                  </span>
                )}
                {voiceEvaluation.filtreChambres && (
                  <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 font-bold">
                    🛏️ {voiceEvaluation.filtreChambres}+ {language === 'ar' ? 'غرف' : 'ch.'}
                  </span>
                )}
              </div>
              <span className="text-stone-500 font-bold">
                {language === 'ar'
                  ? `${voiceEvaluation.resultats.length} عقار`
                  : `${voiceEvaluation.resultats.length} bien${voiceEvaluation.resultats.length > 1 ? 's' : ''} trouvé${voiceEvaluation.resultats.length > 1 ? 's' : ''}`}
              </span>
            </div>
          )}

          {/* ACTION 1 & ACTION 3 : Si des biens correspondent strictement, affichage en cartes bilingues avec SCROLL INFINI */}
          {voiceEvaluation.resultats.length > 0 ? (
            <div className="flex-1 overflow-y-auto pb-20 space-y-5">
              {voiceEvaluation.resultats.map((house) => (
                <motion.div
                  key={house.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative w-full rounded-3xl overflow-hidden bg-white border border-stone-200/90 shadow-md hover:shadow-lg transition flex flex-col"
                >
                  {/* Photo et badges contextuels */}
                  <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-stone-100">
                    <img
                      src={house.image}
                      alt={language === 'ar' ? house.titleAr : house.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/5" />

                    {/* Badge Ville */}
                    <div className={`absolute top-3 ${language === 'ar' ? 'right-3' : 'left-3'} flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white font-bold text-xs shadow-md border border-white/20`}>
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === 'ar' ? (house.cityAr || house.city) : house.city}</span>
                    </div>

                    {/* Badge Type de bien & Annonce directe */}
                    <div className={`absolute top-3 ${language === 'ar' ? 'left-3' : 'right-3'} flex items-center gap-1.5`}>
                      {house.isUserSubmitted && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white font-black text-xs shadow-md">
                          {language === 'ar' ? 'إعلان مباشر' : 'Annonce directe'}
                        </span>
                      )}
                      <div className="px-3 py-1 rounded-full bg-[#006233] text-white font-black text-xs uppercase tracking-wider shadow-md">
                        {language === 'ar' ? house.typeLabelAr : house.typeLabel}
                      </div>
                    </div>

                    {/* Prix affiché en gros sur l'image */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                      <div>
                        <span className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                          {language === 'ar' ? 'السعر' : 'Prix'}
                        </span>
                        <span className="block text-2xl sm:text-3xl font-black text-amber-400 tracking-tight drop-shadow-md">
                          {language === 'ar' ? (house.priceAr || house.price) : house.price}
                        </span>
                      </div>

                      {house.bedrooms > 0 && (
                        <div className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-xs text-xs font-bold text-white border border-white/20">
                          {language === 'ar' ? `${house.bedrooms} غرف • ${house.surface}` : `${house.bedrooms} ch. • ${house.surface}`}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contenu de la carte avec Titre dynamique et Boutons traduits (Action 3) */}
                  <div className="p-4 sm:p-5 flex flex-col gap-3">
                    {/* Titre dynamique traduit selon la langue (ex: 'Appartement à louer' / 'شقة للكراء') */}
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-stone-900 tracking-tight">
                        {getListingDynamicTitle(house, language)}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium line-clamp-1">
                        {language === 'ar' ? house.titleAr : house.title}
                      </p>
                    </div>

                    {/* Samsar référent ou Propriétaire */}
                    <div className="flex items-center justify-between text-xs py-1.5 border-y border-stone-100">
                      <span className="text-stone-500 font-medium">
                        {house.isUserSubmitted
                          ? (language === 'ar' ? 'المالك المباشر :' : 'Propriétaire :')
                          : (language === 'ar' ? 'السمسار المعتمد :' : 'Samsar référent :')}
                      </span>
                      <span className="font-extrabold text-stone-800">
                        {house.samsarName}
                      </span>
                    </div>

                    {/* Boutons traduits : "Contacter" / "اتصال" et "Détails" / "تفاصيل" (Action 3) */}
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setCalledModal(house)}
                        className="py-3 px-3 rounded-2xl bg-[#006233] hover:bg-emerald-800 text-white font-black text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
                      >
                        <Phone className="w-4 h-4" />
                        <span>
                          {house.isUserSubmitted
                            ? (language === 'ar' ? 'اتصال بالمالك' : 'Contacter')
                            : (language === 'ar' ? 'اتصال' : 'Contacter')}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDetailModalListing(house)}
                        className="py-3 px-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm flex items-center justify-center gap-1.5 border border-stone-200/80 active:scale-95 transition cursor-pointer"
                      >
                        <span>{language === 'ar' ? 'تفاصيل' : 'Détails'}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* ACTION 2 : MESSAGE "AUCUN RÉSULTAT" BILINGUE ET ÉLÉGANT (Zéro approximation, jamais de fourre-tout) */
            <div className="w-full py-12 px-6 rounded-3xl bg-white border border-stone-200 text-center shadow-sm space-y-6 animate-fade-in my-auto max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60 shadow-xs">
                <SearchX className="w-8 h-8 text-amber-600 stroke-[2]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  {language === 'ar'
                    ? 'لا توجد عقارات تطابق بحثك.'
                    : 'Aucun bien ne correspond à votre recherche.'}
                </h3>
                <p className="text-sm text-stone-500 font-medium leading-relaxed">
                  {language === 'ar'
                    ? 'حاول تعديل معايير البحث أو تغيير المدينة.'
                    : 'Essayez de modifier vos critères ou de changer de ville.'}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetVoiceSearch}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#006233] hover:bg-emerald-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/10 active:scale-95 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>
                    {language === 'ar' ? 'إعادة تعيين البحث' : 'Réinitialiser la recherche'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Modale "Détails" (Action 3) */}
        <AnimatePresence>
          {detailModalListing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
                className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[90vh]"
              >
                <div className="relative h-48 w-full overflow-hidden bg-stone-100 shrink-0">
                  <img
                    src={detailModalListing.image}
                    alt={detailModalListing.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setDetailModalListing(null)}
                    className={`absolute top-3 ${language === 'ar' ? 'left-3' : 'right-3'} p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition cursor-pointer`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className={`absolute bottom-3 ${language === 'ar' ? 'right-4' : 'left-4'} px-3 py-1 rounded-full bg-[#006233] text-white font-bold text-xs uppercase`}>
                    {language === 'ar' ? detailModalListing.typeLabelAr : detailModalListing.typeLabel}
                  </div>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 text-left" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-stone-900">
                      {getListingDynamicTitle(detailModalListing, language)}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                      {language === 'ar' ? detailModalListing.titleAr : detailModalListing.title}
                    </p>
                  </div>

                  <div className="text-2xl font-black text-[#006233]">
                    {language === 'ar' ? (detailModalListing.priceAr || detailModalListing.price) : detailModalListing.price}
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs font-semibold text-stone-700">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">
                        {language === 'ar' ? 'المدينة' : 'Ville'}
                      </span>
                      <span>{language === 'ar' ? (detailModalListing.cityAr || detailModalListing.city) : detailModalListing.city}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">
                        {language === 'ar' ? 'الحي' : 'Quartier'}
                      </span>
                      <span>{language === 'ar' ? (detailModalListing.quarterAr || detailModalListing.quarter) : detailModalListing.quarter}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">
                        {language === 'ar' ? 'المساحة' : 'Surface'}
                      </span>
                      <span>{detailModalListing.surface}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">
                        {language === 'ar' ? 'الغرف' : 'Chambres'}
                      </span>
                      <span>{detailModalListing.bedrooms > 0 ? (language === 'ar' ? `${detailModalListing.bedrooms} غرف` : `${detailModalListing.bedrooms} ch.`) : '-'}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/70 space-y-1">
                    <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                      {detailModalListing.isUserSubmitted
                        ? (language === 'ar' ? 'مالك العقار المباشر' : 'Propriétaire Direct')
                        : (language === 'ar' ? 'السمسار المعتمد' : 'Samsar Référent')}
                    </div>
                    <div className="text-base font-extrabold text-stone-900">
                      {detailModalListing.samsarName}
                    </div>
                    <div className="text-xs text-stone-600">
                      {detailModalListing.samsarPhone}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <a
                      href={`tel:${detailModalListing.samsarPhone}`}
                      className="w-full py-3.5 rounded-2xl bg-[#006233] hover:bg-emerald-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition"
                    >
                      <Phone className="w-4 h-4" />
                      <span>
                        {detailModalListing.isUserSubmitted
                          ? (language === 'ar' ? 'اتصال بالمالك' : 'Appeler le Propriétaire')
                          : (language === 'ar' ? 'اتصال بالسمسار' : 'Appeler le Samsar')}
                      </span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setDetailModalListing(null)}
                      className="w-full py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition cursor-pointer"
                    >
                      {language === 'ar' ? 'إغلاق' : 'Fermer'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modale "Contacter" (Action 3) */}
        <AnimatePresence>
          {calledModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
                className="w-full max-w-sm bg-white rounded-3xl p-6 text-center space-y-5 shadow-2xl border border-stone-200"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-[#006233] flex items-center justify-center border-2 border-emerald-200">
                  <Phone className="w-8 h-8 animate-bounce text-[#006233]" />
                </div>

                <div className="space-y-1">
                  <div className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-[#006233] text-[11px] font-bold uppercase tracking-wide">
                    {calledModal.isUserSubmitted
                      ? (language === 'ar' ? 'مالك العقار المباشر' : 'Propriétaire Direct')
                      : (language === 'ar' ? 'السمسار المعتمد' : 'Samsar Référent')}
                  </div>
                  <h3 className="text-xl font-extrabold text-stone-900">
                    {calledModal.samsarName}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    {getListingDynamicTitle(calledModal, language)}
                  </p>
                  <div className="text-lg font-black text-[#006233] pt-1">
                    {language === 'ar' ? (calledModal.priceAr || calledModal.price) : calledModal.price}
                  </div>
                </div>

                <a
                  href={`tel:${calledModal.samsarPhone}`}
                  className="w-full py-3.5 rounded-2xl bg-[#006233] hover:bg-emerald-800 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
                >
                  <Phone className="w-5 h-5" />
                  <span>{calledModal.samsarPhone}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setCalledModal(null)}
                  className="w-full py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm transition cursor-pointer"
                >
                  {language === 'ar' ? 'إغلاق' : 'Fermer'}
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Zone de Diagnostic Vocal (Étape C) */}
        <div className="w-full max-w-lg mx-auto px-4 pb-2">
          <VoiceDiagnosticPanel
            diagnostic={diagnosticVocal}
            isListening={isListeningMic}
            voiceLanguage={voiceLanguage}
            initialExpanded={false}
          />
        </div>

        <footer className="w-full py-3 text-center text-xs text-stone-500 font-medium">
          DirectSamsar • 100% Visuel
        </footer>
      </div>
    );
  }

  /* =============================================================
   * PARCOURS PRINCIPAL (FR ou AR)
   * ============================================================= */
  const isAr = language === 'ar' && currentStep !== 'language';
  const isMapScreen = currentScreen === 'samsar_map';
  const currentCity = CITIES_DATA.find(
    (c) => c.id.toLowerCase() === (selectedCityId || '').toLowerCase() || c.name.toLowerCase() === (selectedCityId || '').toLowerCase()
  ) || {
    id: selectedCityId ? selectedCityId.toLowerCase() : 'all',
    name: selectedCityId || 'Toutes les villes',
    nameAr: selectedCityId || 'جميع المدن',
    quarters: [{ id: 'all', name: 'Tous les quartiers', nameAr: 'كل الأحياء' }]
  };

  const handleAppBack = () => {
    if (isListeningMic) stopListening();
    if (onBack) {
      onBack();
      return;
    }
    if (currentStep === 'samsar_map' || currentStep === 'find_samsar') {
      setCurrentStep('samsar_choice');
    } else if (currentStep === 'samsar_choice') {
      setCurrentStep('home');
    } else if ((currentStep as string) === 'voice_results') {
      setCurrentStep('vocal');
    } else if (currentStep === 'home') {
      if (onBackToMode) {
        onBackToMode();
      }
    } else {
      setCurrentStep('home');
    }
  };

  const handleMenuSelect = (option: string) => {
    if (isListeningMic) stopListening();
    if (option === 'classic' || option === 'home') {
      setCurrentStep('home');
    } else {
      setCurrentStep(option as StartScreen);
    }
  };

  return (
    <div 
      dir={isAr ? 'rtl' : 'ltr'} 
      className={`w-full ${isMapScreen ? 'flex flex-col min-h-screen md:h-screen overflow-y-auto md:overflow-hidden' : 'flex flex-col h-full overflow-y-auto justify-between'} bg-[#FAFAFA] text-stone-900 font-sans ${isAr ? 'text-right' : 'text-left'}`}
    >
      {/* 1. COMPOSANT UNIQUE "AppHeader" (fixed top-0 left-0 w-full h-16 z-50) */}
      <AppHeader
        showBackButton={currentStep !== 'home' || !!onBackToMode}
        onBack={handleAppBack}
        language={language}
        onToggleLanguage={() => setLanguage(language === 'ar' ? 'fr' : 'ar')}
        onSelectMenuOption={handleMenuSelect}
        currentStep={currentStep}
        showHomeButton={currentStep !== 'home' || !!onGoHome}
        onGoHome={onGoHome || (() => setCurrentStep('home'))}
      />

      {/* =========================================================
       * MODE PLEIN ÉCRAN IMMERSIF : CARTE DES SAMSARS
       * - Occupe 100% de la hauteur disponible sous le header sur grand écran
       * - Défilement fluide et hauteur minimale garantie sur mobile/paysage
       * - Contrôles flottants intégrés sur la carte
       * ========================================================= */}
      {isMapScreen ? (
        <div className="flex-1 w-full flex flex-col min-h-screen md:h-screen overflow-y-auto md:overflow-hidden pt-16 sm:pt-20">
          <SamsarGoogleMap 
            language={language}
            title={language === 'ar' ? 'خريطة السماسرة' : 'Carte des Samsars'} 
            subtitle={language === 'ar' ? 'حدد موقع السماسرة المعتمدين عبر الخريطة التفاعلية' : 'Localisez les professionnels certifiés autour de vous'}
            onSwitchToList={() => setCurrentScreen('find_samsar')}
          />
        </div>
      ) : (
        /* Corps principal - Centré pour onboarding ou scrollable */
        <main className={`flex-1 flex flex-col items-center ${currentStep === 'home' || currentStep === 'mode' ? 'justify-center min-h-[85dvh]' : 'justify-start pt-20 sm:pt-24'} p-3 sm:p-5 w-full max-w-xl mx-auto z-10`}>
        {currentStep === 'splash' && (
          <SplashScreen onFinish={() => setCurrentStep('home')} />
        )}

        {/* =========================================================
         * ÉCRAN D'ACCUEIL : LOGO HERO & MENU PRINCIPAL
         * ========================================================= */}
        {(currentStep === 'home') && (
          <div className="min-h-screen w-full bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-start px-6 pt-20 pb-8 animate-fade-in">
            
            {/* Titre de section simple et discret */}
            <div className="w-full max-w-md pt-4 pb-6 text-center">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {language === 'ar' ? 'الخدمات العقارية' : 'Services Immobiliers'}
              </h1>
              <p className="text-sm text-gray-500 font-medium mt-1">
                {language === 'ar' ? 'اختر الخدمة المطلوبة للمتابعة' : 'Trouver un Samsar, acheter ou vendre un bien'}
              </p>
            </div>

            {/* MENU PRINCIPAL */}
            <div className="w-full max-w-md space-y-4">
              
              <button
                type="button"
                onClick={() => {
                  setCurrentScreen('samsar_choice');
                  setCurrentStep('samsar_choice');
                }}
                className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md active:scale-[0.98] transition-all flex items-center gap-4 text-left group cursor-pointer"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-200 transition-colors">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">Trouver un Samsar</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Agents certifiés par quartier</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSearchSubmitted(false);
                  setCurrentScreen('search_property');
                  setCurrentStep('search_property');
                }}
                className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md active:scale-[0.98] transition-all flex items-center gap-4 text-left group cursor-pointer"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">Acheter un bien</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Appartements, villas, terrains</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentScreen('post_listing');
                  setCurrentStep('post_listing');
                }}
                className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md active:scale-[0.98] transition-all flex items-center gap-4 text-left group cursor-pointer"
              >
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 transition-colors">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">Vendre un bien</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Publiez votre annonce</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="mt-auto pt-8 text-center">
              <p className="text-xs text-gray-400 font-medium">
                DirectSamsar Maroc • L'immobilier réinventé
              </p>
            </div>
          </div>
        )}

        {/* =========================================================
         * ÉCRAN 2 : CHOIX DU MODE
         * Affiche deux grandes cartes/boutons :
         * 1. "Mode Vocal 🎤" (Parler en Darija ou Français) -> Écran 3A (vocal)
         * 2. "Mode Classique 🏛️" (Recherche par menus) -> Écran 3B (classic)
         * ========================================================= */}
        {(currentStep === 'mode' || currentStep === 'mode_choice') && (
          <div className="w-full flex-1 flex flex-col items-center justify-center text-center space-y-7 py-6 animate-fade-in max-w-lg mx-auto my-auto">
            {/* PageTitle Standardisé (header gère le bouton Retour) */}
            <PageTitle
              title={language === 'ar' ? 'كيف تريد أن تبحث؟' : 'Comment souhaitez-vous chercher ?'}
              subtitle={language === 'ar' ? 'ديركت سمسار يتكيف مع اختيارك : تحدث بصوتك أو تصفح القوائم' : 'Choisissez la recherche vocale ou parcourez nos services classiques'}
            />

            <div className="w-full flex flex-col gap-5 px-1">
              {/* Carte 1 : Mode Vocal */}
              <button
                type="button"
                onClick={() => setCurrentStep('vocal')}
                className="w-full p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#006233] via-[#0a7e43] to-[#F97316] text-white shadow-xl shadow-emerald-950/20 hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 flex items-center justify-between group cursor-pointer text-left"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner">
                    <Mic className="w-9 h-9 text-white drop-shadow" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold uppercase tracking-wider text-white mb-1">
                      <span>{language === 'ar' ? 'موصى به' : 'Interactif'}</span>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight text-white">
                      {language === 'ar' ? 'الوضع الصوتي 🎤' : 'Mode Vocal 🎤'}
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-100 font-medium">
                      {language === 'ar' ? 'تحدث بالدارجة أو بالفرنسية' : 'Parlez en Darija ou en Français'}
                    </p>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition">
                  {language === 'ar' ? (
                    <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-1 transition" />
                  ) : (
                    <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition" />
                  )}
                </div>
              </button>

              {/* Carte 2 : Mode Classique */}
              <button
                type="button"
                onClick={() => setCurrentStep('classic')}
                className="w-full p-6 sm:p-7 rounded-3xl bg-white hover:bg-stone-50 text-stone-900 border-2 border-stone-200 hover:border-amber-500 shadow-xl shadow-stone-200/60 hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 flex items-center justify-between group cursor-pointer text-left"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Home className="w-9 h-9 drop-shadow-xs" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                      <span>{language === 'ar' ? 'الوضع التقليدي' : 'Standard'}</span>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight text-stone-900 group-hover:text-amber-800 transition">
                      {language === 'ar' ? 'الوضع الكلاسيكي 🏛️' : 'Mode Classique 🏛️'}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500 font-medium">
                      {language === 'ar' ? 'البحث عبر القوائم والمعايير' : 'Recherche par menus & filtres'}
                    </p>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full bg-stone-100 group-hover:bg-amber-100 flex items-center justify-center shrink-0 text-stone-600 group-hover:text-amber-800 transition">
                  {language === 'ar' ? (
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
                  ) : (
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                  )}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
         * ÉCRAN 3A : MODE VOCAL (SÉLECTEUR DARIJA/FRANÇAIS, GROS MICRO, RÉSULTAT)
         * ========================================================= */}
        {(currentStep === 'vocal' || currentStep === 'dashboard') && (
          <div className="w-full flex flex-col justify-start gap-6 py-2 animate-fade-in">
            {/* PageTitle standardisé */}
            <PageTitle
              title={language === 'ar' ? 'البحث الصوتي الذكي' : 'Recherche Vocale Immobilière'}
              subtitle={language === 'ar' ? 'تحدث بالدارجة أو بالفرنسية وسيقوم المساعد الذكي بتصفية العقارات فوراً' : 'Parlez en Darija ou en Français, le moteur intelligent filtre les biens instantanément'}
            />

            {/* HERO VOCAL CENTRAL DIRECTSAMSAR */}
            <div className="w-full bg-white text-stone-900 rounded-3xl p-5 sm:p-7 shadow-xl border-2 border-emerald-600/30 relative space-y-5">

              {/* ACTION 2 : SÉLECTEUR DOUBLE MICRO (DARIJA / FRANÇAIS) */}
              <div className="flex items-center justify-center relative z-10">
                <div className="inline-flex p-1 rounded-2xl bg-stone-100 border border-stone-200 shadow-inner">
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceLanguage('darija');
                      if (isListeningMic) startListening('darija', false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                      voiceLanguage === 'darija'
                        ? 'bg-gradient-to-r from-[#006233] to-[#0a7e43] text-white shadow-md'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <img src="https://flagcdn.com/w40/ma.png" srcSet="https://flagcdn.com/w80/ma.png 2x" width="20" height="15" alt="Maroc" className="inline-block rounded-xs object-cover shadow-xs" />
                    <span>Darija (الدارجة)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setVoiceLanguage('fr');
                      if (isListeningMic) startListening('fr', false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                      voiceLanguage === 'fr'
                        ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-md'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <img src="https://flagcdn.com/w40/fr.png" srcSet="https://flagcdn.com/w80/fr.png 2x" width="20" height="15" alt="France" className="inline-block rounded-xs object-cover shadow-xs" />
                    <span>Français</span>
                  </button>
                </div>
              </div>

              {/* LE GROS BOUTON MICRO CENTRAL ÉLÉGANT */}
              <div className="flex flex-col items-center justify-center relative z-10 py-1">
                <div className="relative flex items-center justify-center">
                  {isListeningMic && (
                    <motion.div
                      animate={{
                        scale: [1, 1.35, 1.7],
                        opacity: [0.6, 0.25, 0]
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                      className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#006233]/30 pointer-events-none"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (isListeningMic) {
                        stopListening();
                      } else {
                        startListening(voiceLanguage, false);
                      }
                    }}
                    title={isListeningMic ? "Arrêter l'écoute" : "Cliquer pour parler"}
                    className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center shadow-xl transition-all duration-300 active:scale-95 hover:scale-105 cursor-pointer group ${
                      isListeningMic
                        ? 'bg-gradient-to-tr from-[#C1272D] to-[#F97316] text-white shadow-red-950/40 ring-4 ring-red-500/40 animate-pulse'
                        : 'bg-gradient-to-tr from-[#006233] via-[#0a7e43] to-[#F97316] text-white shadow-emerald-950/30 hover:shadow-emerald-950/40 ring-4 ring-emerald-500/20'
                    }`}
                  >
                    <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-md group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-white/95 mt-1 drop-shadow">
                      {isListeningMic ? "Écoute..." : "Parler"}
                    </span>
                  </button>
                </div>

                {/* Égaliseur sonore animé si micro actif */}
                <div className="flex items-center justify-center gap-1.5 h-8 mt-2.5">
                  {[12, 24, 36, 20, 32, 16, 28, 36, 18, 12].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: isListeningMic ? [8, h, 6, h * 0.8, 8] : [6, 8, 4, 8, 6]
                      }}
                      transition={{
                        duration: 0.8 + (i % 3) * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.08
                      }}
                      className={`w-1 rounded-full ${
                        isListeningMic 
                          ? 'bg-gradient-to-t from-[#006233] to-[#F97316]' 
                          : 'bg-stone-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Pastille de statut en direct */}
                <div className="mt-1">
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold ${
                    isListeningMic 
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                      : (micError === 'not-allowed' || micError === 'service-not-allowed')
                        ? 'bg-amber-50 text-amber-900 border border-amber-300'
                        : 'bg-stone-100 text-stone-700 border border-stone-200'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      isListeningMic 
                        ? 'bg-emerald-600 animate-ping' 
                        : (micError === 'not-allowed' || micError === 'service-not-allowed')
                          ? 'bg-amber-500'
                          : 'bg-stone-400'
                    }`} />
                    <span>
                      {isListeningMic 
                        ? `Micro ACTIF (${voiceLanguage === 'darija' ? 'ar-MA' : 'fr-FR'}) • Parlez maintenant` 
                        : (micStatusMessage || `Prêt pour ${voiceLanguage === 'darija' ? 'Darija (ar-MA)' : 'Français (fr-FR)'}`)}
                    </span>
                  </div>
                </div>

                {/* Message discret et bienveillant si le micro est bloqué ou non sécurisé */}
                {(micError === 'not-allowed' || micError === 'service-not-allowed') && (
                  <div className="mt-2.5 px-4 py-2.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-900 text-xs text-center max-w-sm mx-auto shadow-2xs space-y-1 animate-fade-in">
                    <p className="font-bold flex items-center justify-center gap-1.5 text-amber-800">
                      <span>🔒</span>
                      <span>
                        {language === 'ar' ? 'إذن الميكروفون مطلوب' : 'Accès au microphone requis'}
                      </span>
                    </p>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      {language === 'ar'
                        ? 'الوصول إلى الميكروفون غير مصرح به أو الاتصال غير مشفر (HTTPS). يرجى السماح بالوصول في إعدادات المتصفح أو التأكد من استخدام اتصال آمن.'
                        : 'Accès micro non autorisé ou connexion non sécurisée. Activez le micro dans les paramètres de votre navigateur.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Avertissement Iframe si nécessaire */}
              {isInIframe && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold text-center relative z-10 space-y-1.5">
                  <p>⚠️ Le micro peut être restreint par votre navigateur dans cette prévisualisation.</p>
                  <a
                    href={typeof window !== 'undefined' ? window.location.href : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ouvrir dans un nouvel onglet pour activer le micro</span>
                  </a>
                </div>
              )}

              {/* ZONE PHRASE DÉTECTÉE / RÉSULTAT */}
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-center relative z-10 space-y-2">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Phrase détectée :
                </span>
                <p className="text-base sm:text-lg font-black text-[#006233] break-words">
                  {texteBrutCapte || texteEcoute ? (
                    `"${texteBrutCapte || texteEcoute}"`
                  ) : (
                    <span className="text-stone-400 font-normal italic text-xs">
                      {voiceLanguage === 'darija' 
                        ? "Exemple : 'باغي نكري شقة في الرباط' ou 'nkri appart f rbat'"
                        : "Exemple : 'Je veux louer un appartement à Rabat'"}
                    </span>
                  )}
                </p>

                {(texteBrutCapte || texteEcoute) && (
                  <div className="pt-1 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleTranslatedText(texteBrutCapte || texteEcoute);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#006233] to-[#0a7e43] hover:from-emerald-700 hover:to-emerald-600 text-white font-black text-xs shadow-md active:scale-95 transition cursor-pointer"
                    >
                      <span>Voir les résultats ({voiceEvaluation?.resultats?.length ?? 0} biens)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* PANNEAU DE DIAGNOSTIC REPLIABLE (Collapsible) */}
              <div className="relative z-10 pt-1">
                <VoiceDiagnosticPanel
                  diagnostic={diagnosticVocal}
                  isListening={isListeningMic}
                  voiceLanguage={voiceLanguage}
                  initialExpanded={false}
                />
              </div>
            </div>

            {/* LISTE RAPIDE DES BIENS CORRESPONDANTS OU MESSAGE AUCUN RÉSULTAT */}
            {(texteBrutCapte || texteEcoute) && (
              voiceEvaluation?.resultats && voiceEvaluation.resultats.length > 0 ? (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-lg font-black text-stone-900">
                      {language === 'ar' 
                        ? `العقارات المطابقة (${voiceEvaluation.resultats.length})` 
                        : `Biens correspondants (${voiceEvaluation.resultats.length})`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentScreen('voice_results');
                        setCurrentStep('voice_results');
                      }}
                      className="text-xs font-bold text-[#006233] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{language === 'ar' ? 'عرض كامل' : 'Affichage plein écran'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {voiceEvaluation.resultats.slice(0, 3).map((item) => (
                      <div 
                        key={item.id}
                        className="bg-white rounded-3xl p-4 border border-stone-200/90 shadow-md flex flex-col sm:flex-row gap-4 items-center overflow-hidden text-left"
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                      >
                        <div className="w-full sm:w-32 h-28 rounded-2xl overflow-hidden shrink-0 relative bg-stone-100">
                          <img 
                            src={item.image} 
                            alt={language === 'ar' ? item.titleAr : item.title} 
                            className="w-full h-full object-cover" 
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase">
                            {language === 'ar' ? item.typeLabelAr : item.typeLabel}
                          </span>
                        </div>
                        <div className="flex-1 w-full space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-500">
                              📍 {language === 'ar' ? (item.cityAr || item.city) : item.city}
                            </span>
                            <span className="text-sm font-black text-[#006233]">
                              {language === 'ar' ? (item.priceAr || item.price) : item.price}
                            </span>
                          </div>
                          {/* Titre dynamique traduit selon la langue (Action 3) */}
                          <h4 className="font-bold text-stone-900 text-sm">
                            {getListingDynamicTitle(item, language)}
                          </h4>
                          <p className="text-xs text-stone-500 font-medium line-clamp-1">
                            {language === 'ar' ? item.titleAr : item.title}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-stone-600 pt-0.5">
                            <span>{item.bedrooms > 0 ? (language === 'ar' ? `${item.bedrooms} غرف` : `${item.bedrooms} chambres`) : ''}</span>
                            <span>•</span>
                            <span>{item.surface}</span>
                          </div>
                          {/* Boutons traduits "Contacter" et "Détails" (Action 3) */}
                          <div className="pt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setCalledModal(item)}
                              className="flex-1 py-2 px-3 rounded-xl bg-[#006233] hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>{language === 'ar' ? 'اتصال' : 'Contacter'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setDetailModalListing(item)}
                              className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs border border-stone-200 flex items-center gap-1 transition cursor-pointer"
                            >
                              <span>{language === 'ar' ? 'تفاصيل' : 'Détails'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* ACTION 2 : MESSAGE "AUCUN RÉSULTAT" BILINGUE ET ÉLÉGANT */
                <div className="w-full py-8 px-5 rounded-3xl bg-white border border-stone-200 text-center shadow-sm space-y-4 animate-fade-in mt-2">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60 shadow-xs">
                    <SearchX className="w-6 h-6 text-amber-600 stroke-[2]" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
                      {language === 'ar'
                        ? 'لا توجد عقارات تطابق بحثك.'
                        : 'Aucun bien ne correspond à votre recherche.'}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium">
                      {language === 'ar'
                        ? 'حاول تعديل معايير البحث أو تغيير المدينة.'
                        : 'Essayez de modifier vos critères ou de changer de ville.'}
                    </p>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleResetVoiceSearch}
                      className="py-2.5 px-5 rounded-xl bg-[#006233] hover:bg-emerald-800 text-white font-bold text-xs inline-flex items-center justify-center gap-2 shadow-md active:scale-95 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>
                        {language === 'ar' ? 'إعادة تعيين البحث' : 'Réinitialiser la recherche'}
                      </span>
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* =========================================================
         * ÉCRAN 3B : MODE CLASSIQUE (MENU PRINCIPAL)
         * Affiche les 3 options claires :
         * 1. "Trouver un Samsar"
         * 2. "Acheter"
         * 3. "Vendre"
         * ========================================================= */}
        {currentStep === 'classic' && (
          <div className="w-full flex-1 flex flex-col justify-start gap-6 py-2 animate-fade-in max-w-lg mx-auto">
            {/* PageTitle standardisé */}
            <PageTitle
              title={language === 'ar' ? 'القائمة الرئيسية' : 'Menu Principal'}
              subtitle={language === 'ar' ? 'اختر الخدمة التي تريدها للمتابعة بكل سهولة' : 'Sélectionnez une option pour continuer'}
            />

            {/* LES 3 OPTIONS BIEN DISTINCTES */}
            <div className="flex flex-col gap-4">
              {/* Option 1 : Trouver un Samsar */}
              <button
                type="button"
                onClick={() => setCurrentStep('samsar_choice')}
                className="w-full bg-white hover:bg-stone-50 border-2 border-stone-200 hover:border-amber-500 rounded-3xl p-5 sm:p-6 flex items-center justify-between shadow-xl shadow-stone-200/50 hover:shadow-2xl transition-all duration-200 active:scale-[0.98] group cursor-pointer text-left"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-700 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-0.5">
                      <span>{language === 'ar' ? 'شبكة معتمدة' : 'Réseau certifié'}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight group-hover:text-amber-800 transition">
                      {language === 'ar' ? '1. البحث عن سمسار' : '1. Trouver un Samsar'}
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 font-medium">
                      {language === 'ar' 
                        ? 'سماسرتنا المعتمدون حسب الأحياء والمدن' 
                        : 'Nos Samsars de confiance référents par quartier'}
                    </p>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center shrink-0 text-amber-800 transition">
                  {language === 'ar' ? (
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
                  ) : (
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                  )}
                </div>
              </button>

              {/* Option 2 : Acheter */}
              <button
                type="button"
                onClick={() => {
                  setSearchSubmitted(false);
                  setCurrentStep('search_property');
                }}
                className="w-full bg-white hover:bg-stone-50 border-2 border-stone-200 hover:border-[#006233] rounded-3xl p-5 sm:p-6 flex items-center justify-between shadow-xl shadow-stone-200/50 hover:shadow-2xl transition-all duration-200 active:scale-[0.98] group cursor-pointer text-left"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#006233] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <Search className="w-7 h-7 text-white" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-0.5">
                      <span>{language === 'ar' ? 'عروض مباشرة' : 'Recherche de biens'}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight group-hover:text-[#006233] transition">
                      {language === 'ar' ? '2. شراء عقار' : '2. Acheter un bien'}
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 font-medium">
                      {language === 'ar' 
                        ? 'شقق، فيلات، رياضات وأراضي موثقة للشراء أو الكراء' 
                        : 'Appartements, villas, riads et terrains vérifiés'}
                    </p>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-800 transition">
                  {language === 'ar' ? (
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
                  ) : (
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                  )}
                </div>
              </button>

              {/* Option 3 : Vendre */}
              <button
                type="button"
                onClick={() => setCurrentStep('post_listing')}
                className="w-full bg-white hover:bg-stone-50 border-2 border-stone-200 hover:border-orange-500 rounded-3xl p-5 sm:p-6 flex items-center justify-between shadow-xl shadow-stone-200/50 hover:shadow-2xl transition-all duration-200 active:scale-[0.98] group cursor-pointer text-left"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <Tag className="w-7 h-7 text-white" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-[10px] font-bold text-orange-800 uppercase tracking-wider mb-0.5">
                      <span>{language === 'ar' ? 'نشر مباشر' : 'Déposer un bien'}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight group-hover:text-amber-800 transition">
                      {language === 'ar' ? '3. نشر عقاري (بيع / كراء)' : '3. Vendre / Déposer un bien'}
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 font-medium">
                      {language === 'ar' 
                        ? 'نشر إعلانك لبيع أو كراء عقارك بالتعاون مع سماسرتنا' 
                        : 'Publiez votre bien à vendre ou louer en direct'}
                    </p>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center shrink-0 text-amber-800 transition">
                  {language === 'ar' ? (
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
                  ) : (
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                  )}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
         * ÉCRAN INTERMÉDIAIRE : "QUE VOULEZ-VOUS FAIRE ?"
         * 1. Bouton "Retour" en haut pour revenir au menu classique
         * 2. Titre : "Que voulez-vous faire ?"
         * 3. Carte 1 : "Acheter / Louer un bien" (Icône de loupe) -> Page RECHERCHE existante
         * 4. Carte 2 : "Vendre / Mettre en location" (Icône de tag) -> Page Déposer une annonce
         * ========================================================= */}
        {currentScreen === 'buy_sell_choice' && (
          <div className="w-full flex flex-col justify-center gap-6 py-2 animate-fade-in">
            {/* PageTitle standardisé */}
            <PageTitle
              title={language === 'ar' ? 'ماذا تريد أن تفعل؟' : 'Que voulez-vous faire ?'}
              subtitle={language === 'ar' ? 'اختر بين البحث عن عقار للشراء أو الكراء، أو وضع إعلان لبيع أو كراء عقارك' : 'Choisissez si vous souhaitez trouver un bien ou déposer votre annonce'}
            />

            {/* 2 GRANDES CARTES / BOUTONS BIEN DISTINCTS */}
            <div className="w-full flex flex-col gap-5">
              {/* Carte 1 : "Acheter / Louer un bien" (Icône de loupe) */}
              <button
                type="button"
                onClick={() => {
                  setSearchSubmitted(false);
                  setCurrentScreen('search_property');
                }}
                className="w-full h-44 sm:h-52 bg-white hover:bg-emerald-50/40 border-2 border-stone-200/90 hover:border-[#006233] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl shadow-stone-200/70 hover:shadow-2xl transition-all duration-200 active:scale-[0.985] group relative overflow-hidden cursor-pointer pointer-events-auto text-left"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="w-14 h-14 rounded-2xl bg-[#006233] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Search className="w-7 h-7 text-white" />
                  </div>

                  <div className="w-10 h-10 rounded-full bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center text-emerald-800 transition">
                    {language === 'ar' ? (
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                    ) : (
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight group-hover:text-[#006233] transition">
                    {language === 'ar' ? 'شراء / كراء عقار' : 'Acheter / Louer un bien'}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 font-medium">
                    {language === 'ar'
                      ? 'ابحث بين العقارات الموثقة بالمدينة والحي والسعر'
                      : 'Rechercher parmi les biens disponibles par ville, quartier et budget'}
                  </p>
                </div>
              </button>

              {/* Carte 2 : "Vendre / Mettre en location" (Icône de tag) */}
              <button
                type="button"
                onClick={() => {
                  setCurrentScreen('post_listing');
                }}
                className="w-full h-44 sm:h-52 bg-white hover:bg-orange-50/40 border-2 border-stone-200/90 hover:border-amber-600 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl shadow-stone-200/70 hover:shadow-2xl transition-all duration-200 active:scale-[0.985] group relative overflow-hidden cursor-pointer pointer-events-auto text-left"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Tag className="w-7 h-7 text-white" />
                  </div>

                  <div className="w-10 h-10 rounded-full bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-amber-800 transition">
                    {language === 'ar' ? (
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                    ) : (
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight group-hover:text-amber-800 transition">
                    {language === 'ar' ? 'بيع / وضع للكراء' : 'Vendre / Mettre en location'}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 font-medium">
                    {language === 'ar'
                      ? 'انشر عقارك للعثور على مشترين أو مكترين بالتعاون مع سماسرتنا'
                      : 'Déposer votre annonce pour vendre ou louer votre bien'}
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
         * ÉCRAN : "DÉPOSER UNE ANNONCE" (Vendre / Déposer un bien)
         * Formulaire complet en 3 sections avec validation et succès
         * ========================================================= */}
        {currentScreen === 'post_listing' && (
          <PostListingForm
            language={language}
            onBack={() => {
              const updated = getAllPropertyListings();
              setAllProperties(updated);
              setCurrentScreen('classic');
              setCurrentStep('classic');
            }}
            onSuccessReturn={() => {
              const updated = getAllPropertyListings();
              setAllProperties(updated);
              setFilteredListings(filtrerBiensModeClassique(selectedCityId, selectedQuarterId, selectedPropertyType, selectedBudget));
              setCurrentScreen('classic');
              setCurrentStep('classic');
            }}
          />
        )}

        {/* =========================================================
         * ÉCRAN INTERMÉDIAIRE : "TROUVER UN SAMSAR" (Choix du mode)
         * 1. Bouton "Retour" en haut pour revenir à l'accueil
         * 2. Titre : "Trouver un Samsar"
         * 3. Carte 1 : "Par Ville et Quartier" (Icône de liste/filtres) -> Page liste des Samsars (find_samsar)
         * 4. Carte 2 : "Par Carte (Map)" (Icône de carte/géolocalisation) -> Page Carte des Samsars (samsar_map)
         * ========================================================= */}
        {currentScreen === 'samsar_choice' && (
          <div className="w-full flex flex-col justify-center gap-6 py-2 animate-fade-in">
            {/* PageTitle standardisé */}
            <PageTitle
              title={language === 'ar' ? 'البحث عن سمسار' : 'Trouver un Samsar'}
              subtitle={language === 'ar' ? 'اختر طريقة البحث المفضلة لديك' : 'Choisissez votre mode de recherche'}
            />

            {/* 2 GRANDES CARTES / BOUTONS BIEN DISTINCTS */}
            <div className="w-full flex flex-col gap-5">
              {/* Carte 1 : "Par Ville et Quartier" (Icône de liste/filtres) */}
              <button
                type="button"
                onClick={() => {
                  setCurrentScreen('find_samsar');
                }}
                className="w-full h-44 sm:h-52 bg-white hover:bg-amber-50/40 border-2 border-stone-200/90 hover:border-amber-600 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl shadow-stone-200/70 hover:shadow-2xl transition-all duration-200 active:scale-[0.985] group relative overflow-hidden cursor-pointer pointer-events-auto text-left"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="w-14 h-14 rounded-2xl bg-amber-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <SlidersHorizontal className="w-7 h-7 text-white" />
                  </div>

                  <div className="w-10 h-10 rounded-full bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-amber-800 transition">
                    {language === 'ar' ? (
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                    ) : (
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight group-hover:text-amber-800 transition">
                    {language === 'ar' ? 'حسب المدينة والحي' : 'Par Ville et Quartier'}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 font-medium">
                    {language === 'ar'
                      ? 'قائمة مفصلة بسماسرة ثقات مع تقييمات وفلاتر حسب المدن والأحياء'
                      : 'Consulter la liste complète de nos Samsars avec filtres par ville et quartier'}
                  </p>
                </div>
              </button>

              {/* Carte 2 : "Par Carte (Map)" (Icône de carte/géolocalisation) */}
              <button
                type="button"
                onClick={() => {
                  setCurrentScreen('samsar_map');
                }}
                className="w-full h-44 sm:h-52 bg-white hover:bg-emerald-50/40 border-2 border-stone-200/90 hover:border-[#006233] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl shadow-stone-200/70 hover:shadow-2xl transition-all duration-200 active:scale-[0.985] group relative overflow-hidden cursor-pointer pointer-events-auto text-left"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="w-14 h-14 rounded-2xl bg-[#006233] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Map className="w-7 h-7 text-white" />
                  </div>

                  <div className="w-10 h-10 rounded-full bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center text-emerald-800 transition">
                    {language === 'ar' ? (
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                    ) : (
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight group-hover:text-[#006233] transition">
                    {language === 'ar' ? 'على الخريطة (Map)' : 'Par Carte (Map)'}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 font-medium">
                    {language === 'ar'
                      ? 'استكشف مواقع السماسرة الأقرب إليك على خريطة تفاعلية'
                      : 'Localiser les Samsars de confiance directement sur la carte'}
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}



        {/* =========================================================
         * ÉCRAN : "TROUVER UN SAMSAR" - NOS SAMSARS DE CONFIANCE
         * 1. Bouton "Retour" en haut pour revenir à l'accueil
         * 2. Titre : "Nos Samsars de confiance"
         * 3. Liste de cartes : Avatar, Nom, Ville, Note ⭐⭐⭐⭐⭐, Bouton vert "Contacter"
         * ========================================================= */}
        {currentScreen === 'find_samsar' && (
          <div className="w-full flex flex-col space-y-6 py-2 animate-fade-in">
            {/* PageTitle standardisé */}
            <PageTitle
              title={language === 'ar' ? 'سماسرتنا المعتمدون' : 'Nos Samsars de confiance'}
              subtitle={language === 'ar' ? 'سماسرة عقاريون معتمدون وموثوق بهم حسب الأحياء والمدن المغربية' : 'Des agents immobiliers locaux, vérifiés et recommandés par quartier'}
            />

            {/* 3 MENUS DÉROULANTS BILINGUES : VILLE, QUARTIER, TYPE DE BIEN */}
            <div className="w-full space-y-4 bg-white p-4 sm:p-5 rounded-3xl border border-stone-200/90 shadow-md">
              {/* MENU 1 : VILLE */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-stone-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#006233]" />
                    <span>{language === 'ar' ? 'المدينة' : 'Ville'}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {TRUSTED_SAMSARS.filter((samsar) => {
                      if (samsarCityFilter && samsarCityFilter !== 'all' && samsarCityFilter !== '') {
                        const c = samsarCityFilter.toLowerCase().trim();
                        const matchCity = 
                          samsar.cityName.toLowerCase() === c ||
                          samsar.cityId.toLowerCase() === c ||
                          samsar.city.toLowerCase().includes(c) ||
                          c.includes(samsar.cityName.toLowerCase()) ||
                          c.includes(samsar.cityId.toLowerCase());
                        if (!matchCity) return false;
                      }
                      if (samsarQuarterFilter && samsarQuarterFilter !== 'all' && samsarQuarterFilter !== '' && samsarQuarterFilter !== 'Autre') {
                        const q = samsarQuarterFilter.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
                        const samsarQName = (samsar.quarterName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
                        const samsarQId = (samsar.quarterId || '').toLowerCase().trim();
                        const samsarCityFull = (samsar.city || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
                        const matchQuarter = 
                          samsarQName.includes(q) || 
                          q.includes(samsarQName) || 
                          samsarQId.includes(q) || 
                          q.includes(samsarQId) ||
                          samsarCityFull.includes(q);
                        if (!matchQuarter) return false;
                      }
                      if (samsarTypeFilter && samsarTypeFilter !== 'all' && samsarTypeFilter !== '') {
                        const t = samsarTypeFilter.toLowerCase().trim();
                        const spec = (samsar.specialty || '').toLowerCase();
                        const specAr = samsar.specialtyAr || '';
                        const matchSpecialty = 
                          (t.includes('appartement') && (spec.includes('appartement') || specAr.includes('شقق') || spec.includes('résidentiel'))) ||
                          (t.includes('villa') && (spec.includes('villa') || specAr.includes('فيلا') || specAr.includes('فيلات'))) ||
                          (t.includes('riad') && (spec.includes('riad') || specAr.includes('رياض'))) ||
                          (t.includes('maison') && (spec.includes('maison') || specAr.includes('منزل') || specAr.includes('منازل') || spec.includes('résidentiel'))) ||
                          (t.includes('studio') && (spec.includes('studio') || specAr.includes('استوديو'))) ||
                          (t.includes('bureau') && (spec.includes('bureau') || specAr.includes('مكتب') || specAr.includes('مكاتب') || spec.includes('professionnel') || specAr.includes('مهنية'))) ||
                          (t.includes('local') && (spec.includes('local') || spec.includes('commercial') || specAr.includes('محل') || specAr.includes('تجاري'))) ||
                          (t.includes('terrain') && (spec.includes('terrain') || specAr.includes('أرض') || specAr.includes('أراضي'))) ||
                          (t.includes('garage') && (spec.includes('garage') || spec.includes('parking') || specAr.includes('مرآب') || specAr.includes('كراج'))) ||
                          (t.includes('duplex') && (spec.includes('duplex') || spec.includes('appartement') || specAr.includes('دوبلكس'))) ||
                          spec.includes(t) ||
                          specAr.includes(samsarTypeFilter);
                        if (!matchSpecialty) return false;
                      }
                      return true;
                    }).length} {language === 'ar' ? 'سمسار' : 'samsar(s)'}
                  </span>
                </label>
                <select 
                  value={samsarCityFilter} 
                  onChange={(e) => {
                    const val = e.target.value;
                    setSamsarCityFilter(val);
                    setFilters((prev) => ({ ...prev, city: val || null }));
                  }}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer hover:border-orange-300"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: language === 'ar' ? 'left 16px center' : 'right 16px center',
                    backgroundSize: '20px',
                    paddingRight: language === 'ar' ? '16px' : '48px',
                    paddingLeft: language === 'ar' ? '48px' : '16px'
                  }}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                  <option value="">
                    {language === 'ar' ? 'جميع المدن' : 'Toutes les villes'}
                  </option>
                  <option value="Casablanca">{language === 'ar' ? 'الدار البيضاء' : 'Casablanca'}</option>
                  <option value="Rabat">{language === 'ar' ? 'الرباط' : 'Rabat'}</option>
                  <option value="Marrakech">{language === 'ar' ? 'مراكش' : 'Marrakech'}</option>
                  <option value="Tanger">{language === 'ar' ? 'طنجة' : 'Tanger'}</option>
                  <option value="Fès">{language === 'ar' ? 'فاس' : 'Fès'}</option>
                  <option value="Agadir">{language === 'ar' ? 'أكادير' : 'Agadir'}</option>
                  <option value="Oujda">{language === 'ar' ? 'وجدة' : 'Oujda'}</option>
                  <option value="Meknès">{language === 'ar' ? 'مكناس' : 'Meknès'}</option>
                  <option value="Kénitra">{language === 'ar' ? 'القنيطرة' : 'Kénitra'}</option>
                  <option value="Tétouan">{language === 'ar' ? 'تطوان' : 'Tétouan'}</option>
                  <option value="Safi">{language === 'ar' ? 'آسفي' : 'Safi'}</option>
                  <option value="El Jadida">{language === 'ar' ? 'الجديدة' : 'El Jadida'}</option>
                  <option value="Béni Mellal">{language === 'ar' ? 'بني ملال' : 'Béni Mellal'}</option>
                  <option value="Nador">{language === 'ar' ? 'الناظور' : 'Nador'}</option>
                  <option value="Taza">{language === 'ar' ? 'تازة' : 'Taza'}</option>
                  <option value="Settat">{language === 'ar' ? 'سطات' : 'Settat'}</option>
                  <option value="Berrechid">{language === 'ar' ? 'برشيد' : 'Berrechid'}</option>
                  <option value="Khouribga">{language === 'ar' ? 'خريبكة' : 'Khouribga'}</option>
                  <option value="Laâyoune">{language === 'ar' ? 'العيون' : 'Laâyoune'}</option>
                  <option value="Dakhla">{language === 'ar' ? 'الداخلة' : 'Dakhla'}</option>
                </select>
              </div>

              {/* MENU 2 : QUARTIER */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-stone-700 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-amber-600" />
                  <span>{language === 'ar' ? 'الحي' : 'Quartier'}</span>
                </label>
                <select 
                  value={samsarQuarterFilter} 
                  onChange={(e) => setSamsarQuarterFilter(e.target.value)}
                  disabled={!samsarCityFilter}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer hover:border-orange-300 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: language === 'ar' ? 'left 16px center' : 'right 16px center',
                    backgroundSize: '20px',
                    paddingRight: language === 'ar' ? '16px' : '48px',
                    paddingLeft: language === 'ar' ? '48px' : '16px'
                  }}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                  <option value="">
                    {!samsarCityFilter 
                      ? (language === 'ar' ? 'اختر المدينة أولاً' : 'Sélectionnez d\'abord une ville')
                      : (language === 'ar' ? 'جميع الأحياء' : 'Tous les quartiers')
                    }
                  </option>
                  {(quartiersParVille[samsarCityFilter] || []).map((quartier) => (
                    <option key={quartier} value={quartier}>
                      {quartier}
                    </option>
                  ))}
                  {samsarCityFilter && (
                    <option value="Autre">{language === 'ar' ? 'حي آخر' : 'Autre quartier'}</option>
                  )}
                </select>
              </div>

              {/* MENU 3 : TYPE DE BIEN */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-stone-700 flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-[#006233]" />
                  <span>{language === 'ar' ? 'نوع العقار' : 'Type de bien'}</span>
                </label>
                <select 
                  value={samsarTypeFilter} 
                  onChange={(e) => {
                    const val = e.target.value;
                    setSamsarTypeFilter(val);
                    setFilters((prev) => ({ 
                       ...prev, 
                      type: val ? (val.toLowerCase().replace(/ commercial$/, '') as PropertyType) : null 
                    }));
                  }}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer hover:border-orange-300"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: language === 'ar' ? 'left 16px center' : 'right 16px center',
                    backgroundSize: '20px',
                    paddingRight: language === 'ar' ? '16px' : '48px',
                    paddingLeft: language === 'ar' ? '48px' : '16px'
                  }}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                  <option value="">
                    {language === 'ar' ? 'اختر نوع العقار' : 'Tout type de bien'}
                  </option>
                  <option value="Maison">{language === 'ar' ? 'دار' : 'Maison'}</option>
                  <option value="Appartement">{language === 'ar' ? 'شقة' : 'Appartement'}</option>
                  <option value="Villa">{language === 'ar' ? 'فيلا' : 'Villa'}</option>
                  <option value="Riad">{language === 'ar' ? 'رياض' : 'Riad'}</option>
                  <option value="Local commercial">{language === 'ar' ? 'محل تجاري' : 'Local commercial'}</option>
                  <option value="Bureau">{language === 'ar' ? 'مكتب' : 'Bureau'}</option>
                  <option value="Terrain">{language === 'ar' ? 'أرض' : 'Terrain'}</option>
                  <option value="Garage">{language === 'ar' ? 'مرآب' : 'Garage'}</option>
                  <option value="Studio">{language === 'ar' ? 'ستوديو' : 'Studio'}</option>
                  <option value="Duplex">{language === 'ar' ? 'دوبلكس' : 'Duplex'}</option>
                </select>
              </div>
            </div>

            {/* RAPPEL DES CRITÈRES ACTIFS */}
            <div className="flex items-center justify-between text-xs font-bold px-1 text-stone-500 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span>{language === 'ar' ? 'النتائج المطابقة :' : 'Résultats correspondants :'}</span>
                {samsarCityFilter && samsarCityFilter !== 'all' && samsarCityFilter !== '' && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px]">
                    📍 {samsarCityFilter}
                  </span>
                )}
                {samsarQuarterFilter && samsarQuarterFilter !== 'all' && samsarQuarterFilter !== '' && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px]">
                    🏠 {samsarQuarterFilter}
                  </span>
                )}
                {samsarTypeFilter && samsarTypeFilter !== 'all' && samsarTypeFilter !== '' && (
                  <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-900 text-[11px]">
                    🏷️ {samsarTypeFilter}
                  </span>
                )}
              </div>
              <span className="text-stone-400">
                {TRUSTED_SAMSARS.filter((samsar) => {
                  if (samsarCityFilter && samsarCityFilter !== 'all' && samsarCityFilter !== '') {
                    const c = samsarCityFilter.toLowerCase().trim();
                    const matchCity = 
                      samsar.cityName.toLowerCase() === c ||
                      samsar.cityId.toLowerCase() === c ||
                      samsar.city.toLowerCase().includes(c) ||
                      c.includes(samsar.cityName.toLowerCase()) ||
                      c.includes(samsar.cityId.toLowerCase());
                    if (!matchCity) return false;
                  }
                  if (samsarQuarterFilter && samsarQuarterFilter !== 'all' && samsarQuarterFilter !== '' && samsarQuarterFilter !== 'Autre') {
                    const q = samsarQuarterFilter.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
                    const samsarQName = (samsar.quarterName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
                    const samsarQId = (samsar.quarterId || '').toLowerCase().trim();
                    const samsarCityFull = (samsar.city || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
                    const matchQuarter = 
                      samsarQName.includes(q) || 
                      q.includes(samsarQName) || 
                      samsarQId.includes(q) || 
                      q.includes(samsarQId) ||
                      samsarCityFull.includes(q);
                    if (!matchQuarter) return false;
                  }
                  if (samsarTypeFilter && samsarTypeFilter !== 'all' && samsarTypeFilter !== '') {
                    const t = samsarTypeFilter.toLowerCase().trim();
                    const spec = (samsar.specialty || '').toLowerCase();
                    const specAr = samsar.specialtyAr || '';
                    const matchSpecialty = 
                      (t.includes('appartement') && (spec.includes('appartement') || specAr.includes('شقق') || spec.includes('résidentiel'))) ||
                      (t.includes('villa') && (spec.includes('villa') || specAr.includes('فيلا') || specAr.includes('فيلات'))) ||
                      (t.includes('riad') && (spec.includes('riad') || specAr.includes('رياض'))) ||
                      (t.includes('maison') && (spec.includes('maison') || specAr.includes('منزل') || specAr.includes('منازل') || spec.includes('résidentiel'))) ||
                      (t.includes('studio') && (spec.includes('studio') || specAr.includes('استوديو'))) ||
                      (t.includes('bureau') && (spec.includes('bureau') || specAr.includes('مكتب') || specAr.includes('مكاتب') || spec.includes('professionnel') || specAr.includes('مهنية'))) ||
                      (t.includes('local') && (spec.includes('local') || spec.includes('commercial') || specAr.includes('محل') || specAr.includes('تجاري'))) ||
                      (t.includes('terrain') && (spec.includes('terrain') || specAr.includes('أرض') || specAr.includes('أراضي'))) ||
                      (t.includes('garage') && (spec.includes('garage') || spec.includes('parking') || specAr.includes('مرآب') || specAr.includes('كراج'))) ||
                      (t.includes('duplex') && (spec.includes('duplex') || spec.includes('appartement') || specAr.includes('دوبلكس'))) ||
                      spec.includes(t) ||
                      specAr.includes(samsarTypeFilter);
                    if (!matchSpecialty) return false;
                  }
                  return true;
                }).length} trouvé(s)
              </span>
            </div>

            {/* 3. Liste de cartes des Samsars de confiance filtrée dynamiquement (Ville, Quartier, Type) */}
            <div className="w-full flex flex-col gap-4">
              {TRUSTED_SAMSARS
                .filter((samsar) => {
                  if (samsarCityFilter && samsarCityFilter !== 'all' && samsarCityFilter !== '') {
                    const c = samsarCityFilter.toLowerCase().trim();
                    const matchCity = 
                      samsar.cityName.toLowerCase() === c ||
                      samsar.cityId.toLowerCase() === c ||
                      samsar.city.toLowerCase().includes(c) ||
                      c.includes(samsar.cityName.toLowerCase()) ||
                      c.includes(samsar.cityId.toLowerCase());
                    if (!matchCity) return false;
                  }
                  if (samsarQuarterFilter && samsarQuarterFilter !== 'all' && samsarQuarterFilter !== '' && samsarQuarterFilter !== 'Autre') {
                    const q = samsarQuarterFilter.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
                    const samsarQName = (samsar.quarterName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
                    const samsarQId = (samsar.quarterId || '').toLowerCase().trim();
                    const samsarCityFull = (samsar.city || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
                    const matchQuarter = 
                      samsarQName.includes(q) || 
                      q.includes(samsarQName) || 
                      samsarQId.includes(q) || 
                      q.includes(samsarQId) ||
                      samsarCityFull.includes(q);
                    if (!matchQuarter) return false;
                  }
                  if (samsarTypeFilter && samsarTypeFilter !== 'all' && samsarTypeFilter !== '') {
                    const t = samsarTypeFilter.toLowerCase().trim();
                    const spec = (samsar.specialty || '').toLowerCase();
                    const specAr = samsar.specialtyAr || '';
                    const matchSpecialty = 
                      (t.includes('appartement') && (spec.includes('appartement') || specAr.includes('شقق') || spec.includes('résidentiel'))) ||
                      (t.includes('villa') && (spec.includes('villa') || specAr.includes('فيلا') || specAr.includes('فيلات'))) ||
                      (t.includes('riad') && (spec.includes('riad') || specAr.includes('رياض'))) ||
                      (t.includes('maison') && (spec.includes('maison') || specAr.includes('منزل') || specAr.includes('منازل') || spec.includes('résidentiel'))) ||
                      (t.includes('studio') && (spec.includes('studio') || specAr.includes('استوديو'))) ||
                      (t.includes('bureau') && (spec.includes('bureau') || specAr.includes('مكتب') || specAr.includes('مكاتب') || spec.includes('professionnel') || specAr.includes('مهنية'))) ||
                      (t.includes('local') && (spec.includes('local') || spec.includes('commercial') || specAr.includes('محل') || specAr.includes('تجاري'))) ||
                      (t.includes('terrain') && (spec.includes('terrain') || specAr.includes('أرض') || specAr.includes('أراضي'))) ||
                      (t.includes('garage') && (spec.includes('garage') || spec.includes('parking') || specAr.includes('مرآب') || specAr.includes('كراج'))) ||
                      (t.includes('duplex') && (spec.includes('duplex') || spec.includes('appartement') || specAr.includes('دوبلكس'))) ||
                      spec.includes(t) ||
                      specAr.includes(samsarTypeFilter);
                    if (!matchSpecialty) return false;
                  }
                  return true;
                })
                .map((samsar) => (
                  <div
                    key={samsar.id}
                    className="w-full bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-md hover:shadow-xl hover:border-emerald-500/40 transition-all duration-200 flex flex-col sm:flex-row items-center sm:items-stretch gap-4 sm:gap-5"
                  >
                    {/* Photo de profil (avatar) */}
                    <div className="relative shrink-0">
                      <img
                        src={samsar.avatar}
                        alt={samsar.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-stone-100 shadow-sm"
                      />
                      <div 
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#006233] text-white flex items-center justify-center border-2 border-white shadow-xs" 
                        title="Samsar Vérifié"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>

                    {/* Détails du Samsar */}
                    <div className="flex-1 flex flex-col justify-between text-center sm:text-left space-y-1.5 w-full">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <h3 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                            {language === 'ar' ? samsar.nameAr : samsar.name}
                          </h3>

                          {/* Note : ⭐⭐⭐⭐⭐ 4.9/5 */}
                          <div className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-stone-800 text-xs font-bold self-center sm:self-auto">
                            <span className="text-amber-500 tracking-tighter text-xs">⭐⭐⭐⭐⭐</span>
                            <span className="font-extrabold text-stone-900">{samsar.rating.toFixed(1)}/5</span>
                            <span className="text-stone-400 font-normal">({samsar.reviewCount})</span>
                          </div>
                        </div>

                        {/* Sa Ville et son Quartier */}
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 mt-1">
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{language === 'ar' ? samsar.cityAr : samsar.city}</span>
                        </div>

                        {/* Spécialité */}
                        <p className="text-xs text-stone-500 font-medium mt-1">
                          {language === 'ar' ? samsar.specialtyAr : samsar.specialty}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-stone-100 text-xs text-stone-400">
                        <span className="font-mono text-stone-500 font-semibold">{samsar.phone}</span>
                        <span className="text-emerald-700 font-semibold">• Disponible</span>
                      </div>
                    </div>

                    {/* Bouton vert "Contacter" (qui simule un appel ou ouvre WhatsApp) */}
                    <div className="w-full sm:w-auto shrink-0 flex items-center sm:justify-center pt-2 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSimulatedCallActive(false);
                          setSelectedSamsarModal(samsar);
                        }}
                        className="w-full sm:w-36 py-3 px-4 rounded-2xl bg-[#006233] hover:bg-emerald-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 active:scale-95 transition cursor-pointer"
                      >
                        <Phone className="w-4 h-4 animate-pulse" />
                        <span>{language === 'ar' ? 'اتصال' : 'Contacter'}</span>
                      </button>
                    </div>
                  </div>
                ))}

              {/* Si aucun Samsar n'est trouvé pour la combinaison des filtres */}
              {TRUSTED_SAMSARS.filter((samsar) => {
                if (samsarCityFilter && samsarCityFilter !== 'all' && samsarCityFilter !== '') {
                  const c = samsarCityFilter.toLowerCase().trim();
                  const matchCity = 
                    samsar.cityName.toLowerCase() === c ||
                    samsar.cityId.toLowerCase() === c ||
                    samsar.city.toLowerCase().includes(c) ||
                    c.includes(samsar.cityName.toLowerCase()) ||
                    c.includes(samsar.cityId.toLowerCase());
                  if (!matchCity) return false;
                }
                if (samsarQuarterFilter && samsarQuarterFilter !== 'all' && samsarQuarterFilter !== '' && samsarQuarterFilter !== 'Autre') {
                  const q = samsarQuarterFilter.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
                  const samsarQName = (samsar.quarterName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
                  const samsarQId = (samsar.quarterId || '').toLowerCase().trim();
                  const samsarCityFull = (samsar.city || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
                  const matchQuarter = 
                    samsarQName.includes(q) || 
                    q.includes(samsarQName) || 
                    samsarQId.includes(q) || 
                    q.includes(samsarQId) ||
                    samsarCityFull.includes(q);
                  if (!matchQuarter) return false;
                }
                if (samsarTypeFilter && samsarTypeFilter !== 'all' && samsarTypeFilter !== '') {
                  const t = samsarTypeFilter.toLowerCase().trim();
                  const spec = (samsar.specialty || '').toLowerCase();
                  const specAr = samsar.specialtyAr || '';
                  const matchSpecialty = 
                    (t.includes('appartement') && (spec.includes('appartement') || specAr.includes('شقق') || spec.includes('résidentiel'))) ||
                    (t.includes('villa') && (spec.includes('villa') || specAr.includes('فيلا') || specAr.includes('فيلات'))) ||
                    (t.includes('riad') && (spec.includes('riad') || specAr.includes('رياض'))) ||
                    (t.includes('maison') && (spec.includes('maison') || specAr.includes('منزل') || specAr.includes('منازل') || spec.includes('résidentiel'))) ||
                    (t.includes('studio') && (spec.includes('studio') || specAr.includes('استوديو'))) ||
                    (t.includes('bureau') && (spec.includes('bureau') || specAr.includes('مكتب') || specAr.includes('مكاتب') || spec.includes('professionnel') || specAr.includes('مهنية'))) ||
                    (t.includes('local') && (spec.includes('local') || spec.includes('commercial') || specAr.includes('محل') || specAr.includes('تجاري'))) ||
                    (t.includes('terrain') && (spec.includes('terrain') || specAr.includes('أرض') || specAr.includes('أراضي'))) ||
                    (t.includes('garage') && (spec.includes('garage') || spec.includes('parking') || specAr.includes('مرآب') || specAr.includes('كراج'))) ||
                    (t.includes('duplex') && (spec.includes('duplex') || spec.includes('appartement') || specAr.includes('دوبلكس'))) ||
                    spec.includes(t) ||
                    specAr.includes(samsarTypeFilter);
                  if (!matchSpecialty) return false;
                }
                return true;
              }).length === 0 && (
                <div className="w-full py-10 px-6 rounded-3xl bg-white border border-stone-200 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <SearchX className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-stone-800">
                    {language === 'ar' ? 'لا يوجد سمسار يطابق هذه المعايير حالياً' : 'Aucun samsar trouvé pour ces critères'}
                  </h4>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSamsarCityFilter('');
                        setSamsarQuarterFilter('');
                        setSamsarTypeFilter('');
                      }}
                      className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold active:scale-95 transition cursor-pointer"
                    >
                      {language === 'ar' ? 'إعادة ضبط جميع الفلاتر' : 'Réinitialiser tous les filtres'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================
         * ÉCRAN 5 : PAGE "RECHERCHER UN BIEN" (Acheter / Vendre)
         * 1. Bouton "Retour" en haut
         * 2. Titre "Rechercher un bien"
         * 3. Filtres : Ville, Quartier, Type de bien, Budget Max
         * 4. Très gros bouton orange "Rechercher" avec icône loupe
         * ========================================================= */}
        {currentScreen === 'search_property' && (
          <div className="w-full flex flex-col justify-between space-y-6 py-2 animate-fade-in">
            {/* 2. Bouton retour standardisé juste en dessous du header unifié */}
            {/* PageTitle standardisé */}
            <PageTitle
              title={language === 'ar' ? 'البحث عن عقار' : 'Rechercher un bien'}
              subtitle={language === 'ar' ? 'اختر المدينة والنوع والميزانية للعثور على أفضل العروض' : 'Filtrez facilement pour trouver le bien idéal au Maroc'}
            />

            {/* 3. Les filtres sous forme de gros boutons et sélecteurs tactiles */}
            <div className="space-y-5 bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-md">
              
              {/* VILLE */}
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {language === 'ar' ? 'المدينة (Ville)' : 'Ville'}
                </label>
                <select 
                  value={filters.city || selectedCityId || ''} 
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedCityId(val);
                    setSelectedQuarterId('all');
                    setFilters({...filters, city: val || null, neighborhood: ''});
                  }}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer hover:border-orange-300"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: language === 'ar' ? 'left 16px center' : 'right 16px center',
                    backgroundSize: '20px',
                    paddingRight: language === 'ar' ? '16px' : '48px',
                    paddingLeft: language === 'ar' ? '48px' : '16px'
                  }}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                  <option value="">{language === 'ar' ? 'جميع المدن' : 'Toutes les villes'}</option>
                  <option value="Casablanca">{language === 'ar' ? 'الدار البيضاء' : 'Casablanca'}</option>
                  <option value="Rabat">{language === 'ar' ? 'الرباط' : 'Rabat'}</option>
                  <option value="Marrakech">{language === 'ar' ? 'مراكش' : 'Marrakech'}</option>
                  <option value="Tanger">{language === 'ar' ? 'طنجة' : 'Tanger'}</option>
                  <option value="Fès">{language === 'ar' ? 'فاس' : 'Fès'}</option>
                  <option value="Agadir">{language === 'ar' ? 'أكادير' : 'Agadir'}</option>
                  <option value="Oujda">{language === 'ar' ? 'وجدة' : 'Oujda'}</option>
                  <option value="Meknès">{language === 'ar' ? 'مكناس' : 'Meknès'}</option>
                  <option value="Kénitra">{language === 'ar' ? 'القنيطرة' : 'Kénitra'}</option>
                  <option value="Tétouan">{language === 'ar' ? 'تطوان' : 'Tétouan'}</option>
                  <option value="Safi">{language === 'ar' ? 'آسفي' : 'Safi'}</option>
                  <option value="El Jadida">{language === 'ar' ? 'الجديدة' : 'El Jadida'}</option>
                  <option value="Béni Mellal">{language === 'ar' ? 'بني ملال' : 'Béni Mellal'}</option>
                  <option value="Nador">{language === 'ar' ? 'الناظور' : 'Nador'}</option>
                  <option value="Taza">{language === 'ar' ? 'تازة' : 'Taza'}</option>
                  <option value="Settat">{language === 'ar' ? 'سطات' : 'Settat'}</option>
                  <option value="Berrechid">{language === 'ar' ? 'برشيد' : 'Berrechid'}</option>
                  <option value="Khouribga">{language === 'ar' ? 'خريبكة' : 'Khouribga'}</option>
                  <option value="Laâyoune">{language === 'ar' ? 'العيون' : 'Laâyoune'}</option>
                  <option value="Dakhla">{language === 'ar' ? 'الداخلة' : 'Dakhla'}</option>
                </select>
              </div>

              {/* QUARTIER */}
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {language === 'ar' ? 'الحي (Quartier)' : 'Quartier'}
                </label>
                <select 
                  value={filters.neighborhood || ''} 
                  onChange={(e) => {
                    const val = e.target.value;
                    setFilters({...filters, neighborhood: val});
                    setSelectedQuarterId(val || 'all');
                  }}
                  disabled={!filters.city} // Désactivé si aucune ville n'est choisie
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer hover:border-orange-300 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: language === 'ar' ? 'left 16px center' : 'right 16px center',
                    backgroundSize: '20px',
                    paddingRight: language === 'ar' ? '16px' : '48px',
                    paddingLeft: language === 'ar' ? '48px' : '16px'
                  }}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                  <option value="">
                    {!filters.city 
                      ? (language === 'ar' ? 'اختر المدينة أولاً' : 'Sélectionnez d\'abord une ville') 
                      : (language === 'ar' ? 'جميع الأحياء' : 'Tous les quartiers')}
                  </option>
                  {filters.city && (quartiersParVille[filters.city] || []).map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                  {filters.city && (
                    <option value="Autre">{language === 'ar' ? 'حي آخر' : 'Autre quartier'}</option>
                  )}
                </select>
              </div>

              {/* TYPE DE BIEN */}
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {language === 'ar' ? 'نوع العقار (Type de bien)' : 'Type de bien'}
                </label>
                <select 
                  value={selectedPropertyType || (filters.type as string) || ''} 
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedPropertyType(val);
                    setFilters({...filters, type: val ? (val.toLowerCase().replace(/ commercial$/, '') as PropertyType) : null});
                  }}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 text-base text-gray-900 font-medium focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer hover:border-orange-300"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: language === 'ar' ? 'left 16px center' : 'right 16px center',
                    backgroundSize: '20px',
                    paddingRight: language === 'ar' ? '16px' : '48px',
                    paddingLeft: language === 'ar' ? '48px' : '16px'
                  }}
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                  <option value="">{language === 'ar' ? 'اختر نوع العقار' : 'Tout type de bien'}</option>
                  <option value="Maison">{language === 'ar' ? 'دار' : 'Maison'}</option>
                  <option value="Appartement">{language === 'ar' ? 'شقة' : 'Appartement'}</option>
                  <option value="Villa">{language === 'ar' ? 'فيلا' : 'Villa'}</option>
                  <option value="Riad">{language === 'ar' ? 'رياض' : 'Riad'}</option>
                  <option value="Local commercial">{language === 'ar' ? 'محل تجاري' : 'Local commercial'}</option>
                  <option value="Bureau">{language === 'ar' ? 'مكتب' : 'Bureau'}</option>
                  <option value="Terrain">{language === 'ar' ? 'أرض' : 'Terrain'}</option>
                  <option value="Garage">{language === 'ar' ? 'مرآب' : 'Garage'}</option>
                  <option value="Studio">{language === 'ar' ? 'ستوديو' : 'Studio'}</option>
                  <option value="Duplex">{language === 'ar' ? 'دوبلكس' : 'Duplex'}</option>
                </select>
              </div>

              {/* FILTRE 4 : BUDGET MAX (PRIX) */}
              <div className="space-y-2.5">
                <label className="block text-xs sm:text-sm font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-orange-600" />
                  <span>{language === 'ar' ? 'الميزانية القصوى (Budget Max)' : 'Budget Max'}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {BUDGET_OPTIONS.map((b) => {
                    const isSelected = selectedBudget === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBudget(b.id)}
                        className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-600 shadow-sm font-black scale-105'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {language === 'ar' ? b.labelAr : b.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Résultat dynamique : Liste des annonces OU message aucun bien */}
            {searchSubmitted && (
              <div ref={resultsRef} className="w-full space-y-5 pt-3 animate-fade-in scroll-mt-6">
                {filteredListings.length > 0 ? (
                  <>
                    {/* En-tête des résultats avec nombre exact de biens trouvés */}
                    <div className="flex items-center justify-between px-1 bg-stone-100/70 p-3 rounded-2xl border border-stone-200">
                      <span className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#006233]" />
                        <span>
                          {language === 'ar' 
                            ? `تم العثور على ${filteredListings.length} ${filteredListings.length > 1 ? 'عقارات' : 'عقار'}` 
                            : `${filteredListings.length} bien${filteredListings.length > 1 ? 's' : ''} trouvé${filteredListings.length > 1 ? 's' : ''}`}
                        </span>
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        {language === 'ar' ? 'سماسرة معتمدون' : 'Vérifiés par Samsars'}
                      </span>
                    </div>

                    {/* Liste des annonces filtrées */}
                    <div className="space-y-5">
                      {filteredListings.map((listing) => (
                        <div
                          key={listing.id}
                          className="w-full bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-md hover:shadow-xl transition-all duration-200 group flex flex-col"
                        >
                          {/* 1. Grande photo de la maison */}
                          <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-stone-900">
                            <img
                              src={listing.image}
                              alt={listing.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Badges Ville/Quartier et Type sur l'image */}
                            <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                              <MapPin className="w-3.5 h-3.5 text-amber-400" />
                              <span>
                                {language === 'ar' 
                                  ? `${listing.cityAr} • ${listing.quarterAr}` 
                                  : `${listing.city} • ${listing.quarter}`}
                              </span>
                            </div>

                            <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                              {listing.isUserSubmitted && (
                                <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-black shadow-sm">
                                  {language === 'ar' ? 'إعلان مباشر' : 'Annonce directe'}
                                </span>
                              )}
                              <div className="px-3 py-1 rounded-full bg-[#006233] text-white text-xs font-extrabold shadow-sm">
                                {language === 'ar' ? listing.typeLabelAr : listing.typeLabel}
                              </div>
                            </div>
                          </div>

                          {/* Corps de la carte */}
                          <div className="p-5 flex flex-col justify-between space-y-4">
                            {/* 2. Titre clair */}
                            <h3 className="text-base sm:text-lg font-black text-stone-900 tracking-tight leading-snug">
                              {language === 'ar' ? listing.titleAr : listing.title}
                            </h3>

                            {/* Caractéristiques discrètes */}
                            <div className="flex items-center gap-3 text-xs font-semibold text-stone-500">
                              <span>{listing.surface}</span>
                              {listing.bedrooms > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{listing.bedrooms} {language === 'ar' ? 'غرف' : 'chambres'}</span>
                                </>
                              )}
                              <span>•</span>
                              <span className="text-[#006233] font-bold">
                                {listing.isUserSubmitted 
                                  ? `${language === 'ar' ? 'المالك :' : 'Propriétaire :'} ${listing.samsarName}`
                                  : listing.samsarName}
                              </span>
                            </div>

                            {/* Séparateur & Prix + Bouton Contacter */}
                            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                              {/* 3. Le Prix affiché en très gros et en gras */}
                              <div>
                                <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                                  {language === 'ar' ? 'السعر' : 'Prix'}
                                </span>
                                <span className="block text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">
                                  {language === 'ar' ? listing.priceAr : listing.price}
                                </span>
                              </div>

                              {/* 4. Bouton Contacter */}
                              <button
                                type="button"
                                onClick={() => setContactedListing(listing)}
                                className="px-4 py-3 rounded-2xl bg-[#006233] hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md active:scale-95 transition cursor-pointer shrink-0"
                              >
                                <Phone className="w-4 h-4" />
                                <span>
                                  {listing.isUserSubmitted 
                                    ? (language === 'ar' ? 'الاتصال بالمالك' : 'Contacter le propriétaire')
                                    : (language === 'ar' ? 'الاتصال بالسمسار' : 'Contacter le Samsar')}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  /* 3. Message clair avec icône loupe barrée si AUCUN bien ne correspond */
                  <div className="w-full p-8 rounded-3xl bg-amber-50/90 border-2 border-amber-200 text-center space-y-4 shadow-sm animate-fade-in">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-inner">
                      <SearchX className="w-8 h-8 text-amber-700 stroke-[2.2]" />
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="inline-block px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-black">
                        {language === 'ar' ? '0 عقار' : '0 bien trouvé'}
                      </div>
                      <h4 className="text-xl font-black text-stone-900 tracking-tight">
                        {language === 'ar'
                          ? 'لا يوجد أي عقار يطابق معاييرك'
                          : 'Aucun bien ne correspond à vos critères'}
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-sm mx-auto leading-relaxed">
                        {language === 'ar'
                          ? 'لا توجد نتائج مطابقة لهذه المعايير حالياً. جرب زيادة الميزانية أو اختيار كل الأحياء أو نوع عقار آخر.'
                          : 'Aucun bien ne correspond à cette combinaison de filtres. Essayez d\'augmenter le budget max ou de sélectionner tous les quartiers.'}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedQuarterId('all');
                          setSelectedBudget('max');
                          handleExecuteSearch(selectedCityId, 'all', selectedPropertyType, 'max');
                        }}
                        className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md transition active:scale-95 cursor-pointer"
                      >
                        {language === 'ar' ? 'عرض جميع عقارات المدينة (ميزانية مفتوحة)' : 'Élargir la recherche (Budget max)'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
      )}

      {/* Modale de contact direct du Samsar */}
      {contactedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            dir={language === 'ar' ? 'rtl' : 'ltr'}
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-5 animate-scale-in"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#006233] flex items-center justify-center">
                <Phone className="w-6 h-6 animate-bounce" />
              </div>

              <button
                type="button"
                onClick={() => setContactedListing(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#006233] text-xs font-bold uppercase tracking-wide">
                {contactedListing.isUserSubmitted
                  ? (language === 'ar' ? 'مالك العقار المباشر' : 'Propriétaire Direct')
                  : (language === 'ar' ? 'سمسار معتمد' : 'Samsar Référent')}
              </div>
              <h3 className="text-xl font-black text-stone-900">
                {contactedListing.samsarName}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {language === 'ar'
                  ? `مسؤول عن ${contactedListing.titleAr}`
                  : `Référent pour : ${contactedListing.title}`}
              </p>
            </div>

            <a
              href={`tel:${contactedListing.samsarPhone}`}
              className="w-full py-4 rounded-2xl bg-[#006233] hover:bg-emerald-800 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
            >
              <Phone className="w-5 h-5" />
              <span>{contactedListing.samsarPhone}</span>
            </a>

            <button
              type="button"
              onClick={() => setContactedListing(null)}
              className="w-full py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm transition cursor-pointer"
            >
              {language === 'ar' ? 'إغلاق' : 'Fermer'}
            </button>
          </div>
        </div>
      )}

      {/* Modal de contact du Samsar de confiance (Appel direct & WhatsApp) */}
      {selectedSamsarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            dir={language === 'ar' ? 'rtl' : 'ltr'}
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-5 animate-scale-in text-stone-900"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={selectedSamsarModal.avatar}
                    alt={selectedSamsarModal.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-stone-100 shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#006233] text-white flex items-center justify-center border-2 border-white shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
                <div>
                  <div className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                    {language === 'ar' ? 'سمسار معتمد' : 'Samsar de confiance'}
                  </div>
                  <h3 className="text-lg font-black text-stone-900">
                    {language === 'ar' ? selectedSamsarModal.nameAr : selectedSamsarModal.name}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    {language === 'ar' ? selectedSamsarModal.cityAr : selectedSamsarModal.city}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedSamsarModal(null);
                  setSimulatedCallActive(false);
                }}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Note & Avis */}
            <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/70 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-500 text-sm">⭐⭐⭐⭐⭐</span>
                <span className="font-extrabold text-stone-900">{selectedSamsarModal.rating.toFixed(1)}/5</span>
              </div>
              <span className="text-stone-500 font-medium">
                {selectedSamsarModal.reviewCount} {language === 'ar' ? 'تقييم موثق' : 'avis vérifiés'}
              </span>
            </div>

            {/* Animation de simulation d'appel en cours */}
            {simulatedCallActive && (
              <div className="p-4 bg-emerald-950 text-white rounded-2xl border border-emerald-500/40 text-center space-y-2 animate-pulse">
                <div className="w-10 h-10 mx-auto rounded-full bg-emerald-600 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white animate-bounce" />
                </div>
                <div className="text-xs font-bold text-emerald-300">
                  {language === 'ar' ? 'جاري الاتصال المباشر بالسمسار...' : 'Appel simulé en cours...'}
                </div>
                <div className="text-sm font-black font-mono tracking-wide">
                  {selectedSamsarModal.phone}
                </div>
                <p className="text-[11px] text-stone-300">
                  {language === 'ar' ? 'السمسار في الخدمة ومستعد للرد على استفسارك.' : 'Sonnerie... Le Samsar est en ligne et prêt à vous répondre.'}
                </p>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="space-y-2.5 pt-1">
              {/* Bouton vert Appeler / Simuler l'appel */}
              <button
                type="button"
                onClick={() => setSimulatedCallActive(true)}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#006233] hover:bg-emerald-800 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-md shadow-emerald-950/20 active:scale-95 transition cursor-pointer"
              >
                <Phone className="w-4 h-4 animate-bounce" />
                <span>{language === 'ar' ? 'مكالمة هاتفية مباشرة' : 'Simuler l\'appel direct'} ({selectedSamsarModal.phone})</span>
              </button>

              {/* Bouton vert WhatsApp */}
              <a
                href={`https://wa.me/${selectedSamsarModal.whatsappPhone}?text=${encodeURIComponent(
                  `Salam Alaykoum ${selectedSamsarModal.name}, j'ai vu votre profil sur DirectSamsar (${selectedSamsarModal.city}) et je souhaite vous contacter pour un bien immobilier.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-md shadow-green-950/20 active:scale-95 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === 'ar' ? 'مراسلة عبر واتساب' : 'Ouvrir WhatsApp'}</span>
              </a>

              {/* Fermer */}
              <button
                type="button"
                onClick={() => {
                  setSelectedSamsarModal(null);
                  setSimulatedCallActive(false);
                }}
                className="w-full py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition cursor-pointer"
              >
                {language === 'ar' ? 'إغلاق' : 'Fermer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alerte "Page en construction" conservée */}
      {activeAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            dir={language === 'ar' ? 'rtl' : 'ltr'}
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-5 animate-scale-in"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Construction className="w-6 h-6 animate-bounce" />
              </div>

              <button
                type="button"
                onClick={() => setActiveAlert(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="inline-block px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wide">
                {language === 'ar' ? 'الصفحة قيد الإنجاز' : 'Page en construction'}
              </div>
              <h3 className="text-xl font-black text-stone-900">
                {activeAlert.title}
              </h3>
              <p className="text-sm text-stone-500 font-medium">
                {language === 'ar'
                  ? 'هذه الميزة يتم ربطها الآن في الخطوة القادمة.'
                  : 'Cette fonctionnalité sera activée à la prochaine étape.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveAlert(null)}
              className="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-md active:scale-95 transition cursor-pointer"
            >
              {language === 'ar' ? 'حسناً (إغلاق)' : 'Compris (Fermer)'}
            </button>
          </div>
        </div>
      )}

      {/* Footer épuré (masqué en mode carte plein écran immersif) */}
      {!isMapScreen && (
        <footer className="w-full shrink-0 py-4 text-center text-xs text-stone-400 font-medium">
          {isAr ? 'دايركت سمسار المغرب • العقارات بكل وضوح' : 'DirectSamsar Maroc • L\'immobilier en toute clarté'}
        </footer>
      )}
    </div>
  );
};
