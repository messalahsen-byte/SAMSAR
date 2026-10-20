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

export type StartScreen = 
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

export type PropertyType = 'maison' | 'appartement' | 'villa' | 'terrain';

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

export type OperationType = 'vente' | 'location';

interface PropertyListing {
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
  operation?: OperationType;
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
    samsarPhone: '+212 661 22 33 44'
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
    samsarPhone: '+212 661 22 33 44'
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
    samsarPhone: '+212 661 22 33 44'
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
    samsarPhone: '+212 661 22 33 44'
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
    samsarPhone: '+212 661 22 33 44'
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
    operation: 'vente'
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
    operation: 'vente'
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
    operation: 'vente'
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
    samsarPhone: '+212 661 22 33 44'
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
    samsarPhone: '+212 661 11 22 33'
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
    samsarPhone: '+212 661 11 22 33'
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
    samsarPhone: '+212 661 11 22 33'
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
    type: 'maison',
    typeLabel: 'Maison',
    typeLabelAr: 'منزل',
    surface: '190 m²',
    bedrooms: 4,
    samsarName: 'Si Mohamed',
    samsarPhone: '+212 661 11 22 33'
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
    samsarPhone: '+212 661 11 22 33'
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
    samsarPhone: '+212 661 55 66 77'
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
    samsarPhone: '+212 661 55 66 77'
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
    samsarPhone: '+212 661 55 66 77'
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
    samsarPhone: '+212 661 55 66 77'
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
    samsarPhone: '+212 661 77 88 99'
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
    samsarPhone: '+212 661 77 88 99'
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
    samsarPhone: '+212 661 77 88 99'
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
    operation: 'vente'
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
    operation: 'vente'
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
    operation: 'vente'
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
    type: 'maison',
    typeLabel: 'Maison',
    typeLabelAr: 'منزل',
    surface: '260 m²',
    bedrooms: 5,
    samsarName: 'Si Mehdi',
    samsarPhone: '+212 661 88 99 00',
    operation: 'vente'
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
    operation: 'vente'
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
    operation: 'vente'
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
    operation: 'vente'
  }
];

// ============================================================================
// DICTIONNAIRE DE DÉTECTION DARIJA POUR LE MODE VOCAL
// ============================================================================
export const DARIJA_DICTIONARY = {
  // 1. ACTIONS (Ce que le client veut faire) :
  actions: {
    // ACHETER : "nchri", "chri", "bghit nchri", "acheter"
    ACHETER: ['bghit nchri', 'nchri', 'chri', 'acheter', 'achat'],
    // VENDRE : "nbi3", "bi3", "bghit nbi3", "vendre"
    VENDRE: ['bghit nbi3', 'nbi3', 'bi3', 'vendre', 'vente'],
    // LOUER : "nkri", "kra", "bghit nkri", "louer"
    LOUER: ['bghit nkri', 'nkri', 'kra', 'louer', 'location']
  },
  // 2. TYPES DE BIENS (Ce que le client cherche) :
  types: {
    // VILLA : "villa", "dar kbira" (prioritaire sur "dar" simple)
    VILLA: ['dar kbira', 'villa'],
    // MAISON : "dar", "maison", "riad"
    MAISON: ['dar', 'maison', 'riad'],
    // APPARTEMENT : "appart", "ch9a", "appartement", "flat"
    APPARTEMENT: ['ch9a', 'ch99a', 'chqua', 'chka', 'appart', 'appartement', 'flat'],
    // TERRAIN : "ard", "terrain", "loca"
    TERRAIN: ['ard', "l'ard", 'terrain', 'loca', 'lotissement']
  },
  // 3. VILLES (Où le client cherche) :
  villes: {
    // "casa", "casablanca"
    CASABLANCA: ['casablanca', 'casa', 'dar lbaida', 'dar beida'],
    // "rbat", "rabat"
    RABAT: ['rabat', 'rbat'],
    // "marrakech", "marrakch"
    MARRAKECH: ['marrakech', 'marrakch', 'kech'],
    // "tanja", "tanger"
    TANGER: ['tanger', 'tanja'],
    // "agadir"
    AGADIR: ['agadir'],
    // "fes"
    FES: ['fes', 'fès'],
    // "meknes"
    MEKNES: ['meknes', 'meknès']
  }
};

/**
 * Fonction de détection de mot-clé ou expression dans le texte
 * Gère les expressions multi-mots et les mots uniques avec frontières (compatible 3, 7, 9 darija)
 */
function matchKeyword(normalizedText: string, keyword: string): boolean {
  const kw = keyword.toLowerCase().trim();
  if (!kw) return false;
  if (kw.includes(' ')) {
    return normalizedText.includes(kw);
  }
  // Détection avec frontière de mots pour éviter les faux-positifs
  const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
  return regex.test(normalizedText);
}

// ============================================================================
// LOGIQUE STRICTE (IF / ELSE) BASÉE SUR LA VARIABLE texteEcoute
// - SI texteEcoute contient "nchri" ALORS filtre = "acheter"
// - SI texteEcoute contient "nkri" ALORS filtre = "louer"
// - SI texteEcoute contient "casa" ALORS ville = "Casablanca"
// - SI texteEcoute contient "rabat" ALORS ville = "Rabat"
// - SINON, ne filtre rien (affiche tout).
// ============================================================================
// MODE VOCAL (100% DYNAMIQUE & APPROCHE DOUCE PROGRESSIVE)
// - SI le nouveau texte contient un mot-clé majeur (ville, type ou action) :
//   ALORS réinitialise les filtres précédents AVANT d'appliquer les nouveaux.
// - SINON : conserve les filtres actuels pour enrichir les critères (ex: "2 chambres").
// ============================================================================
export interface ResultatFiltreVocal {
  filtreAction: 'acheter' | 'louer' | null;
  filtreVille: string | null;
  filtreType: PropertyType | null;
  filtreChambres?: number | null;
  resultats: PropertyListing[];
}

export function filtrerParTexteEcoute(
  texte: string,
  listings: PropertyListing[]
): ResultatFiltreVocal {
  const rawText = (texte || '').trim();
  // Normalisation : minuscules et suppression des accents pour matcher "à", "é", "è", etc.
  const t = rawText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 1. FORCER LE NETTOYAGE AVANT TOUTE APPLICATION DE CRITÈRE (Reset complet)
  let filtreAction: 'acheter' | 'louer' | null = null;
  let filtreVille: string | null = null;
  let filtreType: PropertyType | null = null;
  let filtreChambres: number | null = null;

  // 2. PARSER FRANÇAIS & DARIJA (Caractères Latins & Arabes) - OPÉRATION / ACTION
  // - "je veux louer", "location", "à louer", "louer", "nkri", "كراء", "نكري", "باغي نكري" ➔ operation: 'louer'
  // - "acheter", "achat", "je cherche à acheter", "vente", "à vendre", "nchri", "شراء", "نشري", "باغي نشري" ➔ operation: 'acheter'
  const aLocation = 
    t.includes('louer') || 
    t.includes('location') || 
    t.includes('a louer') || 
    t.includes('veux louer') || 
    t.includes('cherche a louer') || 
    t.includes('nkri') || 
    t.includes('kri') || 
    t.includes('kraa') ||
    t.includes('كراء') ||
    t.includes('نكري') ||
    t.includes('كري') ||
    t.includes('للكراء') ||
    t.includes('باغي نكري') ||
    t.includes('بغيت نكري') ||
    t.includes('كرى');

  const aAchat = 
    t.includes('acheter') || 
    t.includes('achat') || 
    t.includes('cherche a acheter') || 
    t.includes('veux acheter') || 
    t.includes('a acheter') || 
    t.includes('a vendre') || 
    t.includes('vente') || 
    t.includes('nchri') || 
    t.includes('chri') || 
    t.includes('chiraa') ||
    t.includes('شراء') ||
    t.includes('نشري') ||
    t.includes('شري') ||
    t.includes('للبيع') ||
    t.includes('بيع') ||
    t.includes('باغي نشري') ||
    t.includes('بغيت نشري');

  if (aLocation && !aAchat) {
    filtreAction = 'louer';
  } else if (aAchat && !aLocation) {
    filtreAction = 'acheter';
  } else if (aLocation && aAchat) {
    const idxLoc = Math.min(...[t.indexOf('louer'), t.indexOf('location'), t.indexOf('nkri'), t.indexOf('نكري'), t.indexOf('كراء')].filter(i => i >= 0));
    const idxAch = Math.min(...[t.indexOf('acheter'), t.indexOf('achat'), t.indexOf('nchri'), t.indexOf('نشري'), t.indexOf('شراء')].filter(i => i >= 0));
    filtreAction = idxLoc < idxAch ? 'louer' : 'acheter';
  }

  // 3. PARSER FRANÇAIS & DARIJA - VILLE (Caractères Latins & Arabes)
  // - Rabat, Casablanca, Tanger, Marrakech, Agadir
  if (
    t.includes('rabat') || 
    t.includes('rbat') || 
    t.includes('agdal') || 
    t.includes('hay riad') || 
    t.includes('souissi') || 
    t.includes('hassan') ||
    t.includes('الرباط') ||
    t.includes('رباط') ||
    t.includes('اكدال') ||
    t.includes('أكدال') ||
    t.includes('حي الرياض') ||
    t.includes('السويسي')
  ) {
    filtreVille = 'Rabat';
  } else if (
    t.includes('casablanca') || 
    t.includes('casa') || 
    t.includes('dar beida') || 
    t.includes('dar lbaida') || 
    t.includes('dar el beida') || 
    t.includes('maarif') || 
    t.includes('bourgogne') || 
    t.includes('gauthier') || 
    t.includes('anfa') ||
    t.includes('كازا') ||
    t.includes('الدار البيضاء') ||
    t.includes('كازابلانكا') ||
    t.includes('المعاريف') ||
    t.includes('أنفا') ||
    t.includes('انفا')
  ) {
    filtreVille = 'Casablanca';
  } else if (
    t.includes('tanger') || 
    t.includes('tanja') || 
    t.includes('malabata') || 
    t.includes('marshan') || 
    t.includes('iberia') ||
    t.includes('طنجة') ||
    t.includes('مالاباطا')
  ) {
    filtreVille = 'Tanger';
  } else if (
    t.includes('marrakech') || 
    t.includes('kech') || 
    t.includes('gueliz') || 
    t.includes('hivernage') || 
    t.includes('palmeraie') || 
    t.includes('medina') ||
    t.includes('مراكش') ||
    t.includes('كليز') ||
    t.includes('جيليز') ||
    t.includes('النخيل')
  ) {
    filtreVille = 'Marrakech';
  } else if (
    t.includes('agadir') || 
    t.includes('taghazout') || 
    t.includes('sonaba') || 
    t.includes('founty') ||
    t.includes('أكادير') ||
    t.includes('اكادير') ||
    t.includes('تغازوت')
  ) {
    filtreVille = 'Agadir';
  }

  // 4. PARSER FRANÇAIS & DARIJA - TYPE DE BIEN
  // - "appartement", "appart", "studio", "ch9a", "شقة", "برطمة" ➔ type: 'appartement'
  // - "maison", "villa", "riad", "dar", "فيلا", "دار", "منزل" ➔ type: 'maison'
  // - "terrain", "ard", "أرض", "بقعة" ➔ type: 'terrain'
  if (
    t.includes('appartement') || 
    t.includes('appart') || 
    t.includes('studio') || 
    t.includes('duplex') || 
    t.includes('ch9a') || 
    t.includes('ch99a') || 
    t.includes('chqua') ||
    t.includes('شقة') ||
    t.includes('شقق') ||
    t.includes('برطمة') ||
    t.includes('برطما') ||
    t.includes('استوديو') ||
    t.includes('ستوديو')
  ) {
    filtreType = 'appartement';
  } else if (
    t.includes('maison') || 
    t.includes('villa') || 
    t.includes('riad') || 
    t.includes('dar') || 
    t.includes('menzel') ||
    t.includes('دار') ||
    t.includes('فيلا') ||
    t.includes('منزل') ||
    t.includes('رياض') ||
    t.includes('ديور')
  ) {
    filtreType = 'maison';
  } else if (
    t.includes('terrain') || 
    t.includes('ard') || 
    t.includes('bo93a') ||
    t.includes('أرض') ||
    t.includes('ارض') ||
    t.includes('بقعة') ||
    t.includes('بقع')
  ) {
    filtreType = 'terrain';
  }

  // 5. PARSER FRANÇAIS & DARIJA - NOMBRE DE CHAMBRES
  if (t.includes('1 ch') || t.includes('une ch') || t.includes('1 piece') || t.includes('studio') || t.includes('wahed') || t.includes('wahd') || t.includes('بيت واحد') || t.includes('غرفة واحدة') || t.includes('1 غرف')) {
    filtreChambres = 1;
  } else if (t.includes('2 ch') || t.includes('deux ch') || t.includes('2 pieces') || t.includes('jouj') || t.includes('zoj') || t.includes('جوج بيوت') || t.includes('2 بيوت') || t.includes('غرفتين') || t.includes('2 غرف')) {
    filtreChambres = 2;
  } else if (t.includes('3 ch') || t.includes('trois ch') || t.includes('3 pieces') || t.includes('tlata') || t.includes('tleta') || t.includes('تلاتة بيوت') || t.includes('3 بيوت') || t.includes('3 غرف')) {
    filtreChambres = 3;
  } else if (t.includes('4 ch') || t.includes('quatre ch') || t.includes('4 pieces') || t.includes('reb3a') || t.includes('أربعة غرف') || t.includes('4 بيوت')) {
    filtreChambres = 4;
  }

  // 6. APPLICATION DES CRITÈRES SUR LA LISTE DES BIENS
  const aDesCriteres = filtreAction !== null || filtreVille !== null || filtreType !== null || (filtreChambres !== null && filtreChambres > 0);
  
  if (!aDesCriteres) {
    return {
      filtreAction: null,
      filtreVille: null,
      filtreType: null,
      filtreChambres: null,
      resultats: [...listings]
    };
  }

  // Filtrage strict
  const resultats = listings.filter((item) => {
    // A. Opération (louer vs acheter)
    if (filtreAction === 'louer') {
      if (item.operation !== 'location') return false;
    } else if (filtreAction === 'acheter') {
      if (item.operation === 'location') return false;
    }

    // B. Ville
    if (filtreVille) {
      if (item.city.toLowerCase() !== filtreVille.toLowerCase()) return false;
    }

    // C. Type de bien ("maison", "villa", "riad" matchent maison et villa)
    if (filtreType) {
      if (filtreType === 'maison') {
        if (item.type !== 'maison' && item.type !== 'villa') return false;
      } else {
        if (item.type !== filtreType) return false;
      }
    }

    // D. Chambres
    if (filtreChambres !== null && filtreChambres > 0) {
      if (item.bedrooms < filtreChambres) return false;
    }

    return true;
  });

  return { filtreAction, filtreVille, filtreType, filtreChambres, resultats };
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
  } else if (t.includes('maison') || t.includes('riad') || t.includes('dar') || t.includes('دار') || t.includes('منزل') || t.includes('رياض')) {
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
  if (evalResult.filtreAction) filtresDesc.push(`Opération: ${evalResult.filtreAction === 'louer' ? 'Location' : 'Achat'}`);
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



// Moteur de recherche du Mode Classique (PRÉSERVÉ STRICTEMENT)
export function filtrerBiensModeClassique(
  ville: string | null = null,
  quartier: string = 'all',
  type: PropertyType | null = null,
  budget: string = 'max'
): PropertyListing[] {
  const maxPrice = 
    budget === '500k' ? 500000 :
    budget === '1m' ? 1000000 :
    budget === '2m' ? 2000000 :
    budget === '3m' ? 3500000 :
    Infinity;

  return PROPERTY_LISTINGS.filter((item) => {
    if (item.operation === 'location') return false;

    if (ville && ville !== 'all') {
      const matchCity = item.city.toLowerCase() === ville.toLowerCase() || item.cityId.toLowerCase() === ville.toLowerCase();
      if (!matchCity) return false;
    }

    if (quartier && quartier !== 'all' && item.quarterId !== quartier) {
      return false;
    }

    if (type && item.type !== type) {
      return false;
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

interface StartNavigationProps {
  onRestartSplash?: () => void;
}

export const StartNavigation: React.FC<StartNavigationProps> = ({ onRestartSplash }) => {
  // ACTION 3 : Premier écran par défaut = Dashboard (avec l'interface vocale centrale et principale)
  const [currentScreen, setCurrentScreen] = useState<StartScreen>('dashboard');
  const [language, setLanguage] = useState<Language>('fr');

  // ACTION 2 : Double Micro (Darija ar-MA / Français fr-FR)
  const [voiceLanguage, setVoiceLanguage] = useState<'darija' | 'fr'>('darija');

  // État des filtres vocaux explicite (nettoyage forcé avant chaque mise à jour)
  const [filters, setFilters] = useState<{
    city: string | null;
    type: PropertyType | null;
    operation: 'acheter' | 'louer' | null;
    price: string | null;
  }>({
    city: null,
    type: null,
    operation: null,
    price: null,
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

  // État d'évaluation strict dynamique (aucun hardcoding)
  const [voiceEvaluation, setVoiceEvaluation] = useState<ResultatFiltreVocal>(() =>
    filtrerParTexteEcoute("", PROPERTY_LISTINGS)
  );

  // Diagnostic vocal temps réel (Étape C)
  const diagnosticVocal = React.useMemo(() => {
    return genererDiagnosticVocal(texteBrutCapte || texteEcoute, PROPERTY_LISTINGS, voiceEvaluation);
  }, [texteBrutCapte, texteEcoute, voiceEvaluation]);

  const [countdown, setCountdown] = useState<number>(3);
  const [calledModal, setCalledModal] = useState<PropertyListing | null>(null);

  // État de l'alerte pour "Trouver un Samsar" (remplacé par la vraie page find_samsar)
  const [activeAlert, setActiveAlert] = useState<{ title: string; subtitle: string } | null>(null);
  const [selectedSamsarModal, setSelectedSamsarModal] = useState<TrustedSamsar | null>(null);
  const [simulatedCallActive, setSimulatedCallActive] = useState<boolean>(false);
  const [samsarCityFilter, setSamsarCityFilter] = useState<string>('all');
  const [samsarQuarterFilter, setSamsarQuarterFilter] = useState<string>('all');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // États des filtres pour la page "Rechercher un bien" (Acheter / Vendre)
  const [selectedCityId, setSelectedCityId] = useState<string>('casablanca');
  const [selectedQuarterId, setSelectedQuarterId] = useState<string>('all');
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType>('appartement');
  const [contactedListing, setContactedListing] = useState<PropertyListing | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string>('1m');
  const [searchSubmitted, setSearchSubmitted] = useState<boolean>(false);
  const [filteredListings, setFilteredListings] = useState<PropertyListing[]>([]);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  // 2. FORCER LE RESET DES FILTRES DANS LA FONCTION DE TRADUCTION
  const handleTranslatedText = (nouveauTexte: string) => {
    const texteNettoye = (nouveauTexte || '').trim();
    setTexteBrutCapte(texteNettoye);
    setTexteEcoute(texteNettoye);

    // FORCER LE NETTOYAGE AVANT MISE À JOUR
    setFilters({ city: null, type: null, operation: null, price: null });

    // 3. APPLIQUER LES NOUVEAUX CRITÈRES APRÈS LE RESET
    const evaluation = filtrerParTexteEcoute(texteNettoye, PROPERTY_LISTINGS);

    setFilters({
      city: evaluation.filtreVille,
      type: evaluation.filtreType,
      operation: evaluation.filtreAction,
      price: null,
    });

    setVoiceEvaluation(evaluation);
    setCurrentScreen('voice_results');
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
        try {
          alert("Erreur micro: " + event.error);
        } catch (e) {}
        setIsListeningMic(false);
        setMicError(event.error);
        if (event.error === 'not-allowed') {
          setMicStatusMessage('Micro bloqué ou refusé par le navigateur (permission ou iframe).');
        } else if (event.error === 'no-speech') {
          setMicStatusMessage('Aucune voix détectée.');
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
    typeOverride?: PropertyType,
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
  if (currentScreen === 'voice_results') {
    return (
      <div className="relative min-h-[100dvh] w-full bg-[#111827] text-white flex flex-col justify-between font-sans">
        <header className="w-full px-5 py-4 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <MoroccoFlagStarLogo />
            <span className="font-black text-white text-lg font-serif tracking-tight">
              DIRECT<span className="text-amber-500">SAMSAR</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => startListening()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md active:scale-95 transition cursor-pointer"
            >
              <Mic className="w-4 h-4 animate-pulse" />
              <span>🎙️ Parler</span>
            </button>

            <button
              onClick={() => setCurrentScreen('mode_choice')}
              className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 w-full max-w-lg mx-auto p-4 sm:p-5 flex flex-col gap-6 py-6">
          {/* 1. AUCUN HARDCODING : Tous les badges proviennent exclusivement des variables */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              {voiceEvaluation.filtreVille && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  📍 {voiceEvaluation.filtreVille}
                </span>
              )}
              {voiceEvaluation.filtreType && (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold capitalize">
                  🏠 {voiceEvaluation.filtreType}
                </span>
              )}
              {voiceEvaluation.filtreAction && (
                <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold capitalize">
                  🏷️ {voiceEvaluation.filtreAction}
                </span>
              )}
              {voiceEvaluation.filtreChambres && (
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold">
                  🛏️ {voiceEvaluation.filtreChambres}+ ch.
                </span>
              )}
            </div>
            <span className="text-stone-400 font-bold">
              {voiceEvaluation.resultats.length} bien{voiceEvaluation.resultats.length > 1 ? 's' : ''} trouvé{voiceEvaluation.resultats.length > 1 ? 's' : ''}
            </span>
          </div>

          {voiceEvaluation.resultats.length > 0 ? (
            <>
              {/* Création d'une carte (card) pour CHAQUE bien trouvé */}
              {voiceEvaluation.resultats.map((house) => (
                <motion.div
                  key={house.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative w-full rounded-3xl overflow-hidden bg-stone-900 border border-white/15 shadow-2xl transition hover:border-emerald-500/60"
                >
                  {/* 1. Grande photo de la propriété */}
                  <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-stone-950">
                    <img
                      src={house.image}
                      alt={house.city}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />

                    {/* Badge Ville */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white font-black text-sm tracking-wide shadow-md border border-white/20">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span>{house.city}</span>
                    </div>

                    {/* Badge Type de bien */}
                    <div className="absolute top-4 right-4 px-3.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-xs text-white font-black text-xs uppercase tracking-wider shadow-md">
                      {house.typeLabel}
                    </div>

                    {/* Prix affiché en très gros et en gras */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                      <div>
                        <span className="block text-[11px] font-bold text-amber-300/80 uppercase tracking-wider">
                          Prix
                        </span>
                        <span className="block text-3xl sm:text-4xl font-black text-amber-400 tracking-tight drop-shadow-lg">
                          {house.price}
                        </span>
                      </div>

                      {house.bedrooms > 0 && (
                        <div className="px-3 py-1 rounded-xl bg-black/50 backdrop-blur-xs text-xs font-bold text-stone-200 border border-white/10">
                          {house.bedrooms} ch. • {house.surface}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. Bouton Contacter le Samsar directement sur CHAQUE carte */}
                  <div className="p-4 bg-stone-900/95 flex items-center justify-between gap-3 border-t border-white/10">
                    <div className="text-left">
                      <span className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                        Samsar
                      </span>
                      <span className="block text-sm font-extrabold text-white">
                        {house.samsarName}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCalledModal(house)}
                      className="py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-95 transition cursor-pointer"
                    >
                      <Phone className="w-4 h-4 animate-pulse" />
                      <span>APPELER</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </>
          ) : (
            /* 5. Si aucun bien ne correspond aux mots-clés, affiche un message simple : "Aucun bien trouvé. Essayez une autre ville." */
            <div className="w-full py-12 px-6 rounded-3xl bg-white/5 border border-white/10 text-center space-y-6 animate-fade-in my-auto">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <SearchX className="w-8 h-8 text-amber-400 stroke-[2.2]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Aucun bien trouvé. Essayez une autre ville.
                </h3>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => startListening()}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/40 active:scale-95 transition cursor-pointer"
                >
                  <Mic className="w-5 h-5 animate-pulse" />
                  <span>Réessayer une recherche vocale</span>
                </button>
              </div>
            </div>
          )}
        </main>

        <AnimatePresence>
          {calledModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-sm bg-stone-900 border-2 border-emerald-500/50 rounded-3xl p-6 text-center space-y-6 shadow-2xl"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center border-2 border-emerald-500">
                  <Phone className="w-10 h-10 animate-bounce" />
                </div>

                <div className="space-y-1">
                  <div className="text-3xl font-black text-amber-400">
                    {calledModal.price}
                  </div>
                  <div className="text-xl font-bold text-white flex items-center justify-center gap-1">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                    <span>{calledModal.city}</span>
                  </div>
                  <div className="text-sm font-bold text-stone-300">
                    {calledModal.samsarName}
                  </div>
                </div>

                <a
                  href={`tel:${calledModal.samsarPhone}`}
                  className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-lg flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
                >
                  <Phone className="w-5 h-5" />
                  <span>{calledModal.samsarPhone}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setCalledModal(null)}
                  className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition"
                >
                  Fermer
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Zone de Diagnostic Vocal (Étape C) */}
        <div className="w-full max-w-lg mx-auto px-4">
          <VoiceDiagnosticPanel
            diagnostic={diagnosticVocal}
            isListening={isListeningMic}
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
  const isAr = (
    currentScreen === 'dashboard' || 
    currentScreen === 'search_property' || 
    currentScreen === 'find_samsar' ||
    currentScreen === 'samsar_choice' ||
    currentScreen === 'samsar_map' ||
    currentScreen === 'buy_sell_choice' ||
    currentScreen === 'post_listing'
  ) && language === 'ar';
  const currentCity = CITIES_DATA.find((c) => c.id === selectedCityId) || CITIES_DATA[0];

  return (
    <div 
      dir={isAr ? 'rtl' : 'ltr'} 
      className={`relative min-h-[100dvh] w-full bg-[#FAFAFA] text-stone-900 flex flex-col justify-between font-sans ${isAr ? 'text-right' : 'text-left'}`}
    >
      {/* Header DirectSamsar avec logo et drapeau */}
      <header className="w-full px-5 py-4 flex items-center justify-between border-b border-stone-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div 
          onClick={() => {
            if (currentScreen !== 'mode_choice') {
              setCurrentScreen('dashboard');
            }
          }}
          className={`flex items-center gap-3 select-none ${currentScreen !== 'mode_choice' ? 'cursor-pointer hover:opacity-90 active:scale-98 transition' : ''}`}
          title={currentScreen !== 'mode_choice' ? (isAr ? 'الرجوع إلى الرئيسية' : 'Retour à l\'accueil') : undefined}
        >
          <MoroccoFlagStarLogo />
          <span className="font-black text-stone-900 text-lg font-serif tracking-tight">
            DIRECT<span className="text-amber-600">SAMSAR</span>
          </span>
        </div>

        <div className="flex items-center gap-2 relative">
          {/* Bascule de langue rapide */}
          {(currentScreen === 'dashboard' || 
            currentScreen === 'search_property' || 
            currentScreen === 'find_samsar' ||
            currentScreen === 'samsar_choice' ||
            currentScreen === 'samsar_map' ||
            currentScreen === 'buy_sell_choice' ||
            currentScreen === 'post_listing') && (
            <button
              type="button"
              onClick={() => setLanguage(language === 'ar' ? 'fr' : 'ar')}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 transition active:scale-95 cursor-pointer flex items-center gap-1.5 border border-stone-200"
            >
              <span>{language === 'ar' ? '🇫🇷 Français' : '🇲🇦 العربية'}</span>
            </button>
          )}

          {/* Menu à 3 traits (Burger Menu) en haut à droite */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-2xl text-stone-800 hover:text-stone-950 hover:bg-stone-100 border border-stone-200 transition active:scale-95 cursor-pointer flex items-center justify-center shadow-xs"
            title={isAr ? 'القائمة الرئيسية' : 'Menu principal (3 traits)'}
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-stone-800 stroke-[2.5]" />
            ) : (
              <Menu className="w-5 h-5 text-stone-800 stroke-[2.5]" />
            )}
          </button>

          {/* Dropdown / Tiroir du menu à 3 traits */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" 
                  onClick={() => setIsMenuOpen(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute top-full mt-2.5 ${isAr ? 'left-0' : 'right-0'} w-64 bg-white rounded-3xl shadow-2xl border border-stone-200/90 p-2 z-50 space-y-1 font-sans`}
                  dir={isAr ? 'rtl' : 'ltr'}
                >
                  <div className="px-3 py-2 border-b border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-wider text-stone-400">
                      {isAr ? 'القائمة الرئيسية' : 'Menu Principal'}
                    </span>
                    <button 
                      type="button"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-stone-400 hover:text-stone-600 p-1 rounded-full hover:bg-stone-100"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 1. Accueil */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentScreen('dashboard');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                      currentScreen === 'dashboard' 
                        ? 'bg-amber-50 text-amber-900 font-black' 
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Home className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{isAr ? 'الصفحة الرئيسية' : 'Accueil'}</span>
                  </button>

                  {/* 2. Acheter / Louer un bien */}
                  <button
                    type="button"
                    onClick={() => {
                      setSearchSubmitted(false);
                      setCurrentScreen('search_property');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                      currentScreen === 'search_property' 
                        ? 'bg-emerald-50 text-[#006233] font-black' 
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Search className="w-4 h-4 text-[#006233] shrink-0" />
                    <span>{isAr ? 'شراء / كراء عقار' : 'Acheter / Louer un bien'}</span>
                  </button>

                  {/* 3. Vendre / Mettre en location */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentScreen('post_listing');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                      currentScreen === 'post_listing' 
                        ? 'bg-orange-50 text-orange-900 font-black' 
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Tag className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>{isAr ? 'نشر عقاري (بيع / كراء)' : 'Déposer mon bien'}</span>
                  </button>

                  {/* 4. Trouver un Samsar */}
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentScreen('samsar_choice');
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                      currentScreen === 'samsar_choice' || currentScreen === 'find_samsar' || currentScreen === 'samsar_map'
                        ? 'bg-amber-50 text-amber-900 font-black' 
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <User className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{isAr ? 'سماسرتنا المعتمدون' : 'Trouver un Samsar'}</span>
                  </button>

                  {/* Séparateur */}
                  <div className="pt-1 mt-1 border-t border-stone-100 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        startListening();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-emerald-800 hover:bg-emerald-50 transition cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{isAr ? 'البحث الصوتي (فرنسي أو دارجة)' : 'Mode Vocal (Français / Darija)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentScreen('mode_choice');
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:bg-stone-100 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{isAr ? 'تغيير وضع البداية' : 'Changer de mode'}</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Corps principal */}
      <main className={`flex-1 flex flex-col items-center ${currentScreen === 'mode_choice' || currentScreen === 'language_choice' ? 'justify-center' : 'justify-start'} p-3 sm:p-5 w-full ${currentScreen === 'samsar_map' ? 'max-w-4xl' : 'max-w-xl'} mx-auto z-10`}>
        {/* =========================================================
         * ÉCRAN 1 : CHOIX DU MODE
         * ========================================================= */}
        {currentScreen === 'mode_choice' && (
          <div className="w-full flex flex-col items-center justify-center text-center space-y-8 animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Comment souhaitez-vous chercher ?
              </h2>
              <p className="text-sm text-stone-500 font-medium">
                DirectSamsar s'adapte à votre préférence
              </p>
            </div>

            <div className="w-full flex flex-col items-center gap-5">
              {/* Bouton Vocal */}
              <button
                type="button"
                onClick={() => startListening()}
                className="w-[80%] max-w-md py-6 px-6 rounded-3xl bg-gradient-to-r from-[#006233] to-[#0a7e43] text-white shadow-xl shadow-emerald-950/20 hover:shadow-2xl hover:shadow-emerald-950/30 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-4 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Mic className="w-8 h-8 text-white drop-shadow" />
                </div>
                <div className="text-left">
                  <span className="block text-2xl font-black tracking-tight">
                    Vocal
                  </span>
                  <span className="block text-xs text-emerald-100 font-medium">
                    Parlez en darija ou français
                  </span>
                </div>
              </button>

              {/* Bouton Classique */}
              <button
                type="button"
                onClick={() => setCurrentScreen('language_choice')}
                className="w-[80%] max-w-md py-6 px-6 rounded-3xl bg-white text-stone-900 border-2 border-stone-200/80 shadow-xl shadow-stone-300/40 hover:shadow-2xl hover:border-orange-400 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-4 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#F97316] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Keyboard className="w-8 h-8 drop-shadow-sm" />
                </div>
                <div className="text-left">
                  <span className="block text-2xl font-black tracking-tight text-stone-900">
                    Classique
                  </span>
                  <span className="block text-xs text-stone-500 font-medium">
                    Recherche écrite & critères
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
         * ÉCRAN 2 : CHOIX DE LA LANGUE
         * ========================================================= */}
        {currentScreen === 'language_choice' && (
          <div className="w-full flex flex-col items-center justify-center text-center space-y-8 animate-fade-in">
            <div className="w-full flex items-center justify-start pl-[10%]">
              <button
                type="button"
                onClick={() => setCurrentScreen('mode_choice')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 py-1.5 px-3 rounded-full hover:bg-stone-200/60 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Choisissez votre langue
              </h2>
              <p className="text-sm text-stone-500 font-medium">
                Sélectionnez la langue de votre interface
              </p>
            </div>

            <div className="w-full flex flex-col items-center gap-5">
              <button
                type="button"
                onClick={() => {
                  setLanguage('fr');
                  setCurrentScreen('dashboard');
                }}
                className="w-[80%] max-w-md py-6 px-6 rounded-3xl bg-white text-stone-900 border-2 border-stone-200/80 shadow-xl shadow-stone-300/40 hover:shadow-2xl hover:border-blue-400 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-4 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                  🇫🇷
                </div>
                <div className="text-left">
                  <span className="block text-2xl font-black tracking-tight text-stone-900">
                    Français
                  </span>
                  <span className="block text-xs text-stone-500 font-medium">
                    Accéder à l'accueil
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLanguage('ar');
                  setCurrentScreen('dashboard');
                }}
                className="w-[80%] max-w-md py-6 px-6 rounded-3xl bg-gradient-to-r from-[#C1272D] to-[#d63031] text-white shadow-xl shadow-red-950/20 hover:shadow-2xl hover:shadow-red-950/30 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-4 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                  🇲🇦
                </div>
                <div className="text-left" dir="rtl">
                  <span className="block text-2xl font-black tracking-tight">
                    العربية
                  </span>
                  <span className="block text-xs text-red-100 font-medium">
                    الدخول إلى الصفحة الرئيسية
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
         * ÉCRAN 3 : ÉCOUTE VOCALE DÉDIÉE (ÉPURÉE & SANS OUTILS BRUTS)
         * ========================================================= */}
        {currentScreen === 'voice_listening' && (
          <div className="w-full flex flex-col items-center justify-center text-center py-6 space-y-6 animate-fade-in max-w-xl mx-auto px-4">
            {/* 3. AVERTISSEMENT IFRAME (Prévisualisation AI Studio) */}
            {isInIframe && (
              <div className="w-full p-4 rounded-2xl bg-red-50 border-2 border-red-500 text-red-800 text-xs sm:text-sm font-bold text-center shadow-lg space-y-2">
                <p className="flex items-center justify-center gap-1.5 text-red-700">
                  <span>⚠️ Le micro est bloqué par le navigateur dans ce mode de prévisualisation. Veuillez ouvrir l'application dans un nouvel onglet pour tester la voix.</span>
                </p>
                <div className="pt-1">
                  <a
                    href={typeof window !== 'undefined' ? window.location.href : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition shadow active:scale-95 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ouvrir dans un nouvel onglet</span>
                  </a>
                </div>
              </div>
            )}

            {/* ACTION 2 : SÉLECTEUR DOUBLE MICRO (DARIJA / FRANÇAIS) */}
            <div className="flex items-center justify-center">
              <div className="inline-flex p-1 rounded-2xl bg-stone-100 border border-stone-300 shadow-inner">
                <button
                  type="button"
                  onClick={() => {
                    setVoiceLanguage('darija');
                    startListening('darija', true);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    voiceLanguage === 'darija'
                      ? 'bg-gradient-to-r from-[#006233] to-[#0a7e43] text-white shadow-md'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>🇲🇦</span>
                  <span>Darija (الدارجة)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVoiceLanguage('fr');
                    startListening('fr', true);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    voiceLanguage === 'fr'
                      ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-md'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>🇫🇷</span>
                  <span>Français</span>
                </button>
              </div>
            </div>

            {/* Alerte d'erreur micro détectée */}
            {micError && (
              <div className="w-full p-3 rounded-xl bg-amber-50 border border-amber-400 text-amber-900 text-xs font-bold text-center shadow-xs">
                <span>🛑 Erreur détectée par Web Speech API : </span>
                <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300 text-red-600 font-black">{micError}</span>
              </div>
            )}

            {/* GROS BOUTON MICRO CENTRAL */}
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{
                  scale: isListeningMic ? [1, 1.4, 1.8] : 1,
                  opacity: isListeningMic ? [0.6, 0.3, 0] : 0
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
                className="absolute w-48 h-48 rounded-full bg-[#006233]/25 pointer-events-none"
              />

              <button
                type="button"
                onClick={() => {
                  if (isListeningMic) {
                    stopListening();
                  } else {
                    startListening(voiceLanguage, true);
                  }
                }}
                title="Cliquer pour parler ou relancer le micro"
                className={`relative z-10 w-36 h-36 sm:w-44 sm:h-44 rounded-full text-white flex flex-col items-center justify-center shadow-2xl active:scale-95 hover:scale-105 transition-all cursor-pointer group ${
                  isListeningMic
                    ? 'bg-gradient-to-tr from-[#C1272D] to-[#F97316] shadow-red-950/40 ring-4 ring-red-500/30'
                    : 'bg-gradient-to-tr from-[#006233] via-[#0a7e43] to-[#F97316] shadow-emerald-950/40 ring-4 ring-emerald-500/30'
                }`}
              >
                <Mic className="w-14 h-14 sm:w-16 sm:h-16 text-white drop-shadow-md animate-pulse group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-black uppercase tracking-wider text-white/95 mt-1 drop-shadow">
                  {isListeningMic ? '🔴 Écoute active' : '🎙️ Cliquer pour parler'}
                </span>
              </button>
            </div>

            {/* Égaliseur sonore */}
            <div className="flex items-center justify-center gap-1.5 h-12">
              {[16, 32, 48, 28, 44, 20, 36, 48, 24, 16].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: isListeningMic ? [12, h, 8, h * 0.9, 12] : [8, 12, 6, 10, 8]
                  }}
                  transition={{
                    duration: 0.8 + (i % 3) * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.08
                  }}
                  className={`w-1.5 rounded-full ${isListeningMic ? 'bg-gradient-to-t from-[#006233] to-[#F97316]' : 'bg-stone-300'}`}
                />
              ))}
            </div>

            <div className="space-y-3 max-w-sm w-full">
              <p className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                {isListeningMic ? 'Parlez, je vous écoute...' : 'Micro prêt'}
              </p>
              
              {/* Preuve de vie du micro Web Speech API */}
              <div className="flex flex-col items-center gap-1.5">
                <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs ${
                  isListeningMic 
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${isListeningMic ? 'bg-emerald-600 animate-ping' : 'bg-amber-500'}`} />
                  <span>
                    {isListeningMic 
                      ? `Micro ACTIF (${voiceLanguage === 'darija' ? 'Darija ar-MA' : 'Français fr-FR'}) • Parlez maintenant` 
                      : (micStatusMessage || 'Micro en pause • Cliquez sur le micro')}
                  </span>
                </div>
              </div>

              {/* Phrase vocale détectée */}
              <div className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-sm text-center space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Phrase détectée :
                </span>
                <span className="text-base sm:text-lg font-black text-[#006233] block">
                  {texteBrutCapte || texteEcoute ? (
                    `"${texteBrutCapte || texteEcoute}"`
                  ) : (
                    <span className="text-stone-400 font-normal italic text-xs">
                      {voiceLanguage === 'darija' 
                        ? "En attente... (ex: 'باغي نكري شقة في الرباط')" 
                        : "En attente... (ex: 'Je veux louer un appartement à Rabat')"}
                    </span>
                  )}
                </span>
                {(texteBrutCapte || texteEcoute) && (
                  <button
                    type="button"
                    onClick={() => executeVoiceSearch(texteBrutCapte || texteEcoute)}
                    className="mt-2.5 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#006233] to-[#0a7e43] hover:from-emerald-700 hover:to-emerald-600 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
                  >
                    <span>Lancer la recherche maintenant</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Panneau de Diagnostic repliable */}
            <div className="w-full max-w-lg">
              <VoiceDiagnosticPanel
                diagnostic={diagnosticVocal}
                isListening={isListeningMic}
                voiceLanguage={voiceLanguage}
                initialExpanded={false}
              />
            </div>

            <div className="w-[80%] max-w-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  stopListening();
                  setCurrentScreen('dashboard');
                }}
                className="w-full py-3 px-6 rounded-2xl bg-white text-stone-700 border border-stone-300 font-bold text-xs sm:text-sm shadow-sm hover:bg-stone-50 active:scale-95 transition cursor-pointer"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
         * ÉCRAN 4 : DASHBOARD PRINCIPAL (PREMIER ÉCRAN DE L'APPLICATION)
         * ACTION 3 : LE DOUBLE MICRO EST L'ÉLÉMENT CENTRAL ET PRINCIPAL
         * ========================================================= */}
        {currentScreen === 'dashboard' && (
          <div className="w-full flex flex-col justify-start gap-6 py-2 animate-fade-in">
            {/* HERO PRINCIPAL : LE DOUBLE MICRO CENTRAL DIRECTSAMSAR (DARIJA / FRANÇAIS) */}
            <div className="w-full bg-white text-stone-900 rounded-3xl p-5 sm:p-7 shadow-xl border-2 border-emerald-600/30 relative space-y-5">
              {/* En-tête de la recherche vocale */}
              <div className="text-center space-y-1.5 relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#006233] text-xs font-bold tracking-wide uppercase">
                  <MoroccoFlagStarLogo />
                  <span>Recherche Vocale Immobilière</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900">
                  {language === 'ar' ? 'ابحث بصوتك عن عقارك' : 'Dictez votre recherche'}
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-md mx-auto">
                  {language === 'ar'
                    ? 'تحدث بالدارجة أو بالفرنسية وسيقوم المساعد الذكي بتصفية العقارات فوراً.'
                    : 'Parlez en Darija ou en Français, le moteur intelligent filtre les biens instantanément.'}
                </p>
              </div>

              {/* ACTION 2 : SÉLECTEUR DOUBLE MICRO (DARIJA / FRANÇAIS) */}
              <div className="flex items-center justify-center relative z-10">
                <div className="inline-flex p-1 rounded-2xl bg-stone-100 border border-stone-200 shadow-inner">
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceLanguage('darija');
                      if (isListeningMic) startListening('darija');
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                      voiceLanguage === 'darija'
                        ? 'bg-gradient-to-r from-[#006233] to-[#0a7e43] text-white shadow-md'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <span>🇲🇦</span>
                    <span>Darija (الدارجة)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setVoiceLanguage('fr');
                      if (isListeningMic) startListening('fr');
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                      voiceLanguage === 'fr'
                        ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-md'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <span>🇫🇷</span>
                    <span>Français</span>
                  </button>
                </div>
              </div>

              {/* ACTION 3 : LE GROS BOUTON MICRO CENTRAL ÉLÉGANT */}
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
                        startListening(voiceLanguage);
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
                      : 'bg-stone-100 text-stone-700 border border-stone-200'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isListeningMic ? 'bg-emerald-600 animate-ping' : 'bg-stone-400'}`} />
                    <span>
                      {isListeningMic 
                        ? `Micro ACTIF (${voiceLanguage === 'darija' ? 'ar-MA' : 'fr-FR'}) • Parlez maintenant` 
                        : (micStatusMessage || `Prêt pour ${voiceLanguage === 'darija' ? 'Darija (ar-MA)' : 'Français (fr-FR)'}`)}
                    </span>
                  </div>
                </div>
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
            {/* Carte 1 : Trouver un Samsar -> Ouvre l'écran intermédiaire de choix Samsars */}
            <button
              type="button"
              onClick={() => {
                setCurrentScreen('samsar_choice');
              }}
              className="w-full h-44 sm:h-52 bg-white hover:bg-stone-50/90 border-2 border-stone-200/90 hover:border-amber-500 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl shadow-stone-200/70 hover:shadow-2xl transition-all duration-200 active:scale-[0.985] group relative overflow-hidden cursor-pointer pointer-events-auto z-10"
            >
              <div className="flex items-start justify-between w-full">
                <div className="w-14 h-14 rounded-2xl bg-amber-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <User className="w-7 h-7 text-white" />
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
                  {language === 'ar' ? 'البحث عن سمسار' : 'Trouver un Samsar'}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 font-medium">
                  {language === 'ar' 
                    ? 'سماسرتنا المعتمدون حسب الأحياء والمدن' 
                    : 'Nos Samsars de confiance référents par quartier'}
                </p>
              </div>
            </button>

            {/* Carte 2 : Acheter / Vendre -> Ouvre l'écran intermédiaire de choix */}
            <button
              type="button"
              onClick={() => {
                setCurrentScreen('buy_sell_choice');
              }}
              className="w-full h-44 sm:h-52 bg-white hover:bg-stone-50/90 border-2 border-stone-200/90 hover:border-emerald-600 rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl shadow-stone-200/70 hover:shadow-2xl transition-all duration-200 active:scale-[0.985] group relative overflow-hidden cursor-pointer pointer-events-auto z-10"
            >
              <div className="flex items-start justify-between w-full">
                <div className="w-14 h-14 rounded-2xl bg-[#006233] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Home className="w-7 h-7 text-white" />
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
                  {language === 'ar' ? 'شراء / بيع' : 'Acheter / Vendre'}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 font-medium">
                  {language === 'ar' 
                    ? 'عقارات موثقة ونشر الإعلانات المباشرة' 
                    : 'Biens vérifiés & dépôt d\'annonce'}
                </p>
              </div>
            </button>
          </div>
        )}

        {/* =========================================================
         * ÉCRAN INTERMÉDIAIRE : "QUE VOULEZ-VOUS FAIRE ?"
         * 1. Bouton "Retour" en haut pour revenir à l'accueil
         * 2. Titre : "Que voulez-vous faire ?"
         * 3. Carte 1 : "Acheter / Louer un bien" (Icône de loupe) -> Page RECHERCHE existante
         * 4. Carte 2 : "Vendre / Mettre en location" (Icône de tag) -> Page Déposer une annonce
         * ========================================================= */}
        {currentScreen === 'buy_sell_choice' && (
          <div className="w-full flex flex-col justify-center gap-6 py-2 animate-fade-in">
            {/* 1. Bouton "Retour" pour revenir à l'accueil */}
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentScreen('dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 hover:text-stone-950 font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 cursor-pointer"
              >
                {language === 'ar' ? (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    <span>الرجوع إلى الرئيسية</span>
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour</span>
                  </>
                )}
              </button>

              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                DirectSamsar
              </span>
            </div>

            {/* Titre : "Que voulez-vous faire ?" */}
            <div className="w-full text-center space-y-2 py-1">
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {language === 'ar' ? 'ماذا تريد أن تفعل؟' : 'Que voulez-vous faire ?'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-md mx-auto">
                {language === 'ar'
                  ? 'اختر بين البحث عن عقار للشراء أو الكراء، أو وضع إعلان لبيع أو كراء عقارك'
                  : 'Choisissez si vous souhaitez trouver un bien ou déposer votre annonce'}
              </p>
            </div>

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
         * ÉCRAN : "DÉPOSER UNE ANNONCE" (Vendre / Mettre en location)
         * 1. Bouton "Retour" en haut
         * 2. Titre : "Déposer mon bien"
         * 3. Message : "Formulaire en construction"
         * ========================================================= */}
        {currentScreen === 'post_listing' && (
          <div className="w-full flex flex-col space-y-6 py-2 animate-fade-in">
            {/* 1. Bouton Retour en haut */}
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentScreen('buy_sell_choice')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 hover:text-stone-950 font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 cursor-pointer"
              >
                {language === 'ar' ? (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    <span>رجوع</span>
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCurrentScreen('dashboard')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition cursor-pointer"
              >
                <Home className="w-4 h-4 text-amber-700" />
                <span>{language === 'ar' ? 'الرئيسية' : 'Accueil'}</span>
              </button>
            </div>

            {/* 2. Titre : "Déposer mon bien" */}
            <div className="w-full text-center space-y-2 py-1">
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {language === 'ar' ? 'نشر عقاري' : 'Déposer mon bien'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-md mx-auto">
                {language === 'ar'
                  ? 'خدمة وضع الإعلانات لبيع أو كراء العقارات عبر منصة ديركت سمسار'
                  : 'Publiez votre bien à la vente ou à la location en direct avec nos Samsars'}
              </p>
            </div>

            {/* 3. Message : "Formulaire en construction" */}
            <div className="w-full bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-lg text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20 shadow-xs">
                <Construction className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
                  <span>🚧 {language === 'ar' ? 'قيد التطوير' : 'Bientôt disponible'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                  {language === 'ar' ? 'الاستمارة قيد الإنجاز' : 'Formulaire en construction'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 font-medium max-w-sm mx-auto leading-relaxed">
                  {language === 'ar'
                    ? 'نعمل حالياً على إعداد الاستمارة الذكية لتسهيل رفع الصور وإضافة تفاصيل عقارك وربطه بالسماسرة المعتمدين.'
                    : 'Notre équipe finalise le formulaire intelligent pour vous permettre d\'ajouter vos photos, fixer votre prix et déléguer la visite à nos Samsars de confiance.'}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentScreen('find_samsar')}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#006233] hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>{language === 'ar' ? 'الاتصال بسمسار لمساعدتي' : 'Contacter un Samsar pour m\'aider'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentScreen('dashboard')}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm active:scale-95 transition cursor-pointer"
                >
                  {language === 'ar' ? 'العودة للرئيسية' : 'Retour à l\'accueil'}
                </button>
              </div>
            </div>
          </div>
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
            {/* 1. Bouton "Retour" pour revenir à l'accueil */}
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentScreen('dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 hover:text-stone-950 font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 cursor-pointer"
              >
                {language === 'ar' ? (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    <span>الرجوع إلى الرئيسية</span>
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour</span>
                  </>
                )}
              </button>

              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                DirectSamsar
              </span>
            </div>

            {/* Titre : "Trouver un Samsar" */}
            <div className="w-full text-center space-y-2 py-1">
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {language === 'ar' ? 'البحث عن سمسار' : 'Trouver un Samsar'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-md mx-auto">
                {language === 'ar'
                  ? 'اختر طريقة البحث المفضلة لديك للعثور على وسيط عقاري معتمد'
                  : 'Choisissez comment vous souhaitez trouver votre agent immobilier de confiance'}
              </p>
            </div>

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
         * ÉCRAN : "CARTE DES SAMSARS" (Par Carte)
         * 1. Bouton "Retour" en haut
         * 2. Titre : "Carte des Samsars"
         * 3. Grand cadre gris avec "Carte interactive en cours de chargement..."
         * 4. Menu à 3 traits présent en haut à droite (dans le header)
         * ========================================================= */}
        {currentScreen === 'samsar_map' && (
          <div className="w-full flex flex-col space-y-6 py-2 animate-fade-in">
            {/* 1. Bouton Retour en haut */}
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentScreen('samsar_choice')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 hover:text-stone-950 font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 cursor-pointer"
              >
                {language === 'ar' ? (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    <span>رجوع</span>
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCurrentScreen('dashboard')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition cursor-pointer"
              >
                <Home className="w-4 h-4 text-amber-700" />
                <span>{language === 'ar' ? 'الرئيسية' : 'Accueil'}</span>
              </button>
            </div>

            {/* 2. Titre : "Carte des Samsars" */}
            <div className="w-full text-center space-y-2 py-1">
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {language === 'ar' ? 'خريطة السماسرة' : 'Carte des Samsars'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-md mx-auto">
                {language === 'ar'
                  ? 'استكشف مواقع السماسرة المعتمدين جغرافياً عبر مدن وأحياء المملكة'
                  : 'Visualisation géographique de nos agents partenaires'}
              </p>
            </div>

            {/* 3. Carte Google Maps interactive centrée sur le Maroc / Casablanca avec marqueurs Samsars */}
            <div className="w-full flex-1 flex flex-col min-h-0">
              <SamsarGoogleMap language={language} />
            </div>

            {/* Bouton secondaire pour basculer vers la liste filtrée */}
            <div className="w-full flex items-center justify-center pt-2">
              <button
                type="button"
                onClick={() => setCurrentScreen('find_samsar')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 hover:text-stone-900 font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                <span>{language === 'ar' ? 'عرض السماسرة في قائمة مفلترة بالأحياء' : 'Afficher les Samsars en liste détaillée par quartier'}</span>
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
            {/* 1. En haut : Bouton "Retour" pour revenir à l'écran de choix Samsar */}
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentScreen('samsar_choice')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 hover:text-stone-950 font-bold text-xs sm:text-sm shadow-xs transition active:scale-95 cursor-pointer"
              >
                {language === 'ar' ? (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    <span>رجوع</span>
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour</span>
                  </>
                )}
              </button>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#006233]" />
                <span>{language === 'ar' ? 'سماسرة معتمدون' : 'Profils vérifiés'}</span>
              </span>
            </div>

            {/* 2. Titre : "Nos Samsars de confiance" */}
            <div className="w-full text-center space-y-2 py-1">
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {language === 'ar' ? 'سماسرتنا المعتمدون' : 'Nos Samsars de confiance'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-md mx-auto">
                {language === 'ar'
                  ? 'سماسرة عقاريون معتمدون وموثوق بهم حسب الأحياء والمدن المغربية'
                  : 'Des agents immobiliers locaux, vérifiés et recommandés par quartier'}
              </p>
            </div>

            {/* BARRE DE FILTRES COMBINÉS : VILLE & QUARTIER */}
            <div className="w-full space-y-4 bg-white p-4 sm:p-5 rounded-3xl border border-stone-200/90 shadow-md">
              {/* FILTRE 1 : VILLE */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-600 px-1">
                  <span className="flex items-center gap-1.5 text-stone-900">
                    <MapPin className="w-3.5 h-3.5 text-[#006233]" />
                    <span>{language === 'ar' ? '1. اختر المدينة (Ville) :' : '1. Filtrer par Ville :'}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {TRUSTED_SAMSARS.filter(s => samsarCityFilter === 'all' || s.cityId === samsarCityFilter).length} {language === 'ar' ? 'سمسار' : (TRUSTED_SAMSARS.filter(s => samsarCityFilter === 'all' || s.cityId === samsarCityFilter).length > 1 ? 'samsars' : 'samsar')}
                  </span>
                </div>

                {/* Boutons simples avec : "Toutes les villes", "Casablanca", "Rabat", "Marrakech", "Tanger" */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {SAMSAR_CITY_OPTIONS.map((cityOpt) => {
                    const isActive = samsarCityFilter === cityOpt.id;
                    return (
                      <button
                        key={cityOpt.id}
                        type="button"
                        onClick={() => {
                          setSamsarCityFilter(cityOpt.id);
                          setSamsarQuarterFilter('all');
                        }}
                        className={`py-2 px-3 sm:px-3.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all duration-150 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                          isActive
                            ? 'bg-[#006233] text-white border-[#006233] shadow-md shadow-emerald-950/20'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200/90 hover:border-emerald-500/40'
                        }`}
                      >
                        {cityOpt.id !== 'all' && (
                          <MapPin className={`w-3 h-3 ${isActive ? 'text-amber-300' : 'text-stone-400'}`} />
                        )}
                        <span>{language === 'ar' ? cityOpt.labelAr : cityOpt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SÉPARATEUR DISCRET */}
              <div className="w-full border-t border-stone-100" />

              {/* FILTRE 2 : QUARTIER (En combinaison avec le filtre Ville) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-600 px-1">
                  <span className="flex items-center gap-1.5 text-stone-900">
                    <Building className="w-3.5 h-3.5 text-amber-600" />
                    <span>{language === 'ar' ? '2. اختر الحي (Quartier) :' : '2. Filtrer par Quartier :'}</span>
                  </span>

                  {/* Menu déroulant Quartier (pratique sur mobile) */}
                  <div className="relative inline-block">
                    <select
                      value={samsarQuarterFilter}
                      onChange={(e) => setSamsarQuarterFilter(e.target.value)}
                      className="py-1 px-2.5 pr-7 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-xs font-bold text-stone-800 appearance-none focus:outline-hidden focus:border-emerald-600 cursor-pointer"
                    >
                      {(SAMSAR_QUARTERS_BY_CITY[samsarCityFilter] || SAMSAR_QUARTERS_BY_CITY.all).map((q) => (
                        <option key={q.id} value={q.id}>
                          {language === 'ar' ? q.labelAr : q.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-stone-500 absolute right-2 top-2 pointer-events-none" />
                  </div>
                </div>

                {/* Boutons tactiles pour les quartiers principaux */}
                <div className="flex flex-wrap gap-1.5">
                  {(SAMSAR_QUARTERS_BY_CITY[samsarCityFilter] || SAMSAR_QUARTERS_BY_CITY.all).map((q) => {
                    const isQuarterActive = samsarQuarterFilter === q.id;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setSamsarQuarterFilter(q.id)}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all duration-150 active:scale-95 cursor-pointer flex items-center gap-1 ${
                          isQuarterActive
                            ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200 hover:border-amber-400'
                        }`}
                      >
                        {q.id !== 'all' && (
                          <span className={`w-1.5 h-1.5 rounded-full ${isQuarterActive ? 'bg-white' : 'bg-amber-500'}`} />
                        )}
                        <span>{language === 'ar' ? q.labelAr : q.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RAPPEL DES CRITÈRES ACTIFS */}
            <div className="flex items-center justify-between text-xs font-bold px-1 text-stone-500">
              <div className="flex items-center gap-2">
                <span>{language === 'ar' ? 'النتائج المطابقة :' : 'Résultats correspondants :'}</span>
                {samsarCityFilter !== 'all' && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px]">
                    📍 {SAMSAR_CITY_OPTIONS.find(c => c.id === samsarCityFilter)?.label}
                  </span>
                )}
                {samsarQuarterFilter !== 'all' && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px]">
                    🏠 {(SAMSAR_QUARTERS_BY_CITY[samsarCityFilter] || SAMSAR_QUARTERS_BY_CITY.all).find(q => q.id === samsarQuarterFilter)?.label}
                  </span>
                )}
              </div>
              <span className="text-stone-400">
                {TRUSTED_SAMSARS.filter(s => {
                  if (samsarCityFilter !== 'all' && s.cityId !== samsarCityFilter) return false;
                  if (samsarQuarterFilter !== 'all' && s.quarterId !== samsarQuarterFilter) return false;
                  return true;
                }).length} trouvé(s)
              </span>
            </div>

            {/* 3. Liste de cartes des Samsars de confiance filtrée dynamiquement (Ville ET Quartier) */}
            <div className="w-full flex flex-col gap-4">
              {TRUSTED_SAMSARS
                .filter((samsar) => {
                  // Si l'utilisateur choisit une Ville, garde uniquement les Samsars de cette ville
                  if (samsarCityFilter !== 'all' && samsar.cityId.toLowerCase() !== samsarCityFilter.toLowerCase()) {
                    return false;
                  }
                  // Si l'utilisateur choisit un Quartier, garde uniquement les Samsars de ce quartier
                  if (samsarQuarterFilter !== 'all' && samsar.quarterId.toLowerCase() !== samsarQuarterFilter.toLowerCase()) {
                    return false;
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

              {/* Si aucun Samsar n'est trouvé pour la combinaison Ville + Quartier */}
              {TRUSTED_SAMSARS.filter(s => {
                if (samsarCityFilter !== 'all' && s.cityId !== samsarCityFilter) return false;
                if (samsarQuarterFilter !== 'all' && s.quarterId !== samsarQuarterFilter) return false;
                return true;
              }).length === 0 && (
                <div className="w-full py-10 px-6 rounded-3xl bg-white border border-stone-200 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <SearchX className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-stone-800">
                    {language === 'ar' ? 'لا يوجد سمسار يطابق هذا الحي حالياً' : 'Aucun samsar trouvé pour ce quartier'}
                  </h4>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSamsarQuarterFilter('all')}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold active:scale-95 transition cursor-pointer"
                    >
                      {language === 'ar' ? 'جميع أحياء المدينة' : 'Tous les quartiers de cette ville'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSamsarCityFilter('all');
                        setSamsarQuarterFilter('all');
                      }}
                      className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold active:scale-95 transition cursor-pointer"
                    >
                      {language === 'ar' ? 'عرض جميع المدن' : 'Réinitialiser tous les filtres'}
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
            {/* 1. Bouton Retour en haut */}
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentScreen('dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:text-stone-950 hover:bg-stone-100 text-sm font-bold shadow-xs active:scale-95 transition cursor-pointer"
              >
                {language === 'ar' ? (
                  <>
                    <span>العودة للرئيسية</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour</span>
                  </>
                )}
              </button>

              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                DirectSamsar
              </span>
            </div>

            {/* 2. Titre principal */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {language === 'ar' ? 'Rechercher un bien' : 'Rechercher un bien'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-medium">
                {language === 'ar' 
                  ? 'اختر المدينة والنوع والميزانية للعثور على أفضل العروض' 
                  : 'Filtrez facilement pour trouver le bien idéal au Maroc'}
              </p>
            </div>

            {/* 3. Les filtres sous forme de gros boutons et sélecteurs tactiles */}
            <div className="space-y-5 bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-md">
              
              {/* FILTRE 1 : VILLE */}
              <div className="space-y-2.5">
                <label className="block text-xs sm:text-sm font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#C1272D]" />
                  <span>{language === 'ar' ? 'المدينة (Ville)' : 'Ville'}</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CITIES_DATA.map((city) => {
                    const isSelected = selectedCityId === city.id;
                    return (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => {
                          setSelectedCityId(city.id);
                          setSelectedQuarterId('all');
                        }}
                        className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold border-2 transition-all cursor-pointer flex items-center justify-center text-center ${
                          isSelected
                            ? 'bg-stone-900 text-white border-stone-900 shadow-md scale-[1.02]'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                        }`}
                      >
                        {language === 'ar' ? city.nameAr : city.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FILTRE 2 : QUARTIER */}
              <div className="space-y-2.5">
                <label className="block text-xs sm:text-sm font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-amber-600" />
                  <span>{language === 'ar' ? 'الحي (Quartier)' : 'Quartier'}</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedQuarterId}
                    onChange={(e) => setSelectedQuarterId(e.target.value)}
                    className="w-full py-3.5 px-4 pr-10 rounded-2xl bg-stone-50 border-2 border-stone-200 text-stone-800 text-sm sm:text-base font-bold appearance-none hover:border-stone-300 focus:outline-hidden focus:border-amber-500 transition cursor-pointer"
                  >
                    {currentCity.quarters.map((q) => (
                      <option key={q.id} value={q.id}>
                        {language === 'ar' ? q.nameAr : q.name}
                      </option>
                    ))}
                  </select>
                  <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none text-stone-400 ${language === 'ar' ? 'left-4' : 'right-4'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* FILTRE 3 : TYPE DE BIEN (4 GROS BOUTONS TACTILES) */}
              <div className="space-y-2.5">
                <label className="block text-xs sm:text-sm font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-[#006233]" />
                  <span>{language === 'ar' ? 'نوع العقار (Type de bien)' : 'Type de bien'}</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Appartement */}
                  <button
                    type="button"
                    onClick={() => setSelectedPropertyType('appartement')}
                    className={`py-3.5 px-3 rounded-2xl text-xs sm:text-sm font-extrabold border-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      selectedPropertyType === 'appartement'
                        ? 'bg-[#006233] text-white border-[#006233] shadow-md scale-[1.02]'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>{language === 'ar' ? 'شقة' : 'Appartement'}</span>
                  </button>

                  {/* Maison */}
                  <button
                    type="button"
                    onClick={() => setSelectedPropertyType('maison')}
                    className={`py-3.5 px-3 rounded-2xl text-xs sm:text-sm font-extrabold border-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      selectedPropertyType === 'maison'
                        ? 'bg-[#006233] text-white border-[#006233] shadow-md scale-[1.02]'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>{language === 'ar' ? 'منزل' : 'Maison'}</span>
                  </button>

                  {/* Villa */}
                  <button
                    type="button"
                    onClick={() => setSelectedPropertyType('villa')}
                    className={`py-3.5 px-3 rounded-2xl text-xs sm:text-sm font-extrabold border-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      selectedPropertyType === 'villa'
                        ? 'bg-[#006233] text-white border-[#006233] shadow-md scale-[1.02]'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>{language === 'ar' ? 'فيلا' : 'Villa'}</span>
                  </button>

                  {/* Terrain */}
                  <button
                    type="button"
                    onClick={() => setSelectedPropertyType('terrain')}
                    className={`py-3.5 px-3 rounded-2xl text-xs sm:text-sm font-extrabold border-2 transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      selectedPropertyType === 'terrain'
                        ? 'bg-[#006233] text-white border-[#006233] shadow-md scale-[1.02]'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                    }`}
                  >
                    <LandPlot className="w-4 h-4" />
                    <span>{language === 'ar' ? 'أرض' : 'Terrain'}</span>
                  </button>
                </div>
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

            {/* 4. En bas : Le très gros bouton orange "Rechercher" avec icône de loupe */}
            <div className="w-full pt-2">
              <button
                type="button"
                onClick={() => handleExecuteSearch()}
                className="w-full py-5 px-6 rounded-3xl bg-[#F97316] hover:bg-orange-600 active:bg-orange-700 text-white text-xl sm:text-2xl font-black shadow-xl shadow-orange-950/25 hover:shadow-2xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer group"
              >
                <Search className="w-7 h-7 text-white stroke-[2.5] group-hover:scale-110 transition-transform" />
                <span>{language === 'ar' ? 'Rechercher' : 'Rechercher'}</span>
              </button>
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

                            <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-[#006233] text-white text-xs font-extrabold shadow-sm">
                              {language === 'ar' ? listing.typeLabelAr : listing.typeLabel}
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
                              <span className="text-[#006233] font-bold">{listing.samsarName}</span>
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

                              {/* 4. Petit bouton "Contacter le Samsar" */}
                              <button
                                type="button"
                                onClick={() => setContactedListing(listing)}
                                className="px-4 py-3 rounded-2xl bg-[#006233] hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md active:scale-95 transition cursor-pointer shrink-0"
                              >
                                <Phone className="w-4 h-4" />
                                <span>{language === 'ar' ? 'الاتصال بالسمسار' : 'Contacter le Samsar'}</span>
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
                {language === 'ar' ? 'سمسار معتمد' : 'Samsar Référent'}
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

      {/* Footer épuré */}
      <footer className="w-full py-4 text-center text-xs text-stone-400 font-medium">
        {isAr ? 'دايركت سمسار المغرب • العقارات بكل وضوح' : 'DirectSamsar Maroc • L\'immobilier en toute clarté'}
      </footer>
    </div>
  );
};
