import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { PageTitle } from './PageTitle';

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

export interface PostListingFormProps {
  language: 'fr' | 'ar';
  onBack?: () => void;
  onSuccessReturn?: () => void;
}

export const PostListingForm: React.FC<PostListingFormProps> = ({
  language,
  onBack,
  onSuccessReturn,
}) => {
  // Types de biens
  const PROPERTY_TYPES = [
    { id: 'maison', labelFr: 'Maison', labelAr: 'دار' },
    { id: 'appartement', labelFr: 'Appartement', labelAr: 'شقة' },
    { id: 'villa', labelFr: 'Villa', labelAr: 'فيلا' },
    { id: 'riad', labelFr: 'Riad', labelAr: 'رياض' },
    { id: 'local', labelFr: 'Local', labelAr: 'محل' },
    { id: 'bureau', labelFr: 'Bureau', labelAr: 'مكتب' },
    { id: 'terrain', labelFr: 'Terrain', labelAr: 'أرض' },
    { id: 'garage', labelFr: 'Garage', labelAr: 'كراج' },
  ];

  // Villes disponibles
  const CITIES = [
    { id: 'Casablanca', labelFr: 'Casablanca', labelAr: 'الدار البيضاء' },
    { id: 'Rabat', labelFr: 'Rabat', labelAr: 'الرباط' },
    { id: 'Marrakech', labelFr: 'Marrakech', labelAr: 'مراكش' },
    { id: 'Tanger', labelFr: 'Tanger', labelAr: 'طنجة' },
    { id: 'Fès', labelFr: 'Fès', labelAr: 'فاس' },
    { id: 'Agadir', labelFr: 'Agadir', labelAr: 'أكادير' },
    { id: 'Oujda', labelFr: 'Oujda', labelAr: 'وجدة' },
    { id: 'Meknès', labelFr: 'Meknès', labelAr: 'مكناس' },
    { id: 'Kénitra', labelFr: 'Kénitra', labelAr: 'القنيطرة' },
    { id: 'Tétouan', labelFr: 'Tétouan', labelAr: 'تطوان' },
    { id: 'Safi', labelFr: 'Safi', labelAr: 'آسفي' },
    { id: 'El Jadida', labelFr: 'El Jadida', labelAr: 'الجديدة' },
    { id: 'Béni Mellal', labelFr: 'Béni Mellal', labelAr: 'بني ملال' },
    { id: 'Nador', labelFr: 'Nador', labelAr: 'الناظور' },
    { id: 'Taza', labelFr: 'Taza', labelAr: 'تازة' },
    { id: 'Settat', labelFr: 'Settat', labelAr: 'سطات' },
    { id: 'Berrechid', labelFr: 'Berrechid', labelAr: 'برشيد' },
    { id: 'Khouribga', labelFr: 'Khouribga', labelAr: 'خريبكة' },
    { id: 'Laâyoune', labelFr: 'Laâyoune', labelAr: 'العيون' },
    { id: 'Dakhla', labelFr: 'Dakhla', labelAr: 'الداخلة' },
  ];

  // États du formulaire
  const [propertyType, setPropertyType] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [quarter, setQuarter] = useState<string>('');
  const [customQuarter, setCustomQuarter] = useState<string>('');

  // Réinitialisation automatique du quartier si la ville change ou si le quartier n'appartient pas à la ville
  useEffect(() => {
    if (quarter && (!city || !quartiersParVille[city]?.includes(quarter))) {
      setQuarter('');
      setCustomQuarter('');
    }
  }, [city]);

  const [surface, setSurface] = useState<string>('');
  const [rooms, setRooms] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [operation, setOperation] = useState<'vente' | 'location'>('vente');
  const [description, setDescription] = useState<string>('');

  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // État de validation et soumission
  const [submittedAttempt, setSubmittedAttempt] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Vérification des champs obligatoires
  const isTypeValid = Boolean(propertyType);
  const isCityValid = Boolean(city);
  const isSurfaceValid = Boolean(surface && Number(surface) > 0);
  const isPriceValid = Boolean(price && Number(price) > 0);
  const isNameValid = Boolean(fullName.trim());
  const isPhoneValid = Boolean(phone.trim());

  const isFormValid =
    isTypeValid &&
    isCityValid &&
    isSurfaceValid &&
    isPriceValid &&
    isNameValid &&
    isPhoneValid;

  const requiredErrorText =
    language === 'ar' ? 'هذا الحقل مطلوب' : 'Ce champ est requis';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedAttempt(true);

    if (!isFormValid) {
      return;
    }

    // ÉTAPE 1 : Sauvegarder dans le LocalStorage (userProperties)
    try {
      const finalQuarter = quarter === 'Autre' && customQuarter.trim() ? customQuarter.trim() : quarter;

      const rawType = propertyType.toLowerCase().trim();
      const normalizedType = rawType.includes('local') ? 'local' : rawType;

      const newUserProperty = {
        id: Date.now().toString(), // ID unique
        type: normalizedType, // ex: 'maison', 'appartement', 'local'
        city: city,
        neighborhood: finalQuarter,
        operation: ((operation as string) === 'vente' || (operation as string) === 'À vendre') ? 'achat' : 'location', // Normaliser pour la recherche
        price: parseInt(price) || 0,
        surface: parseInt(surface) || 0,
        rooms: parseInt(rooms || '1') || 1,
        description: description,
        title: `${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} à ${operation === 'vente' ? 'vendre' : 'louer'} à ${city}`,
        image: '/placeholder-house.jpg', // Image par défaut
        isUserSubmitted: true // Pour pouvoir les identifier
      };

      // Récupérer les anciens biens soumis, ou créer un tableau vide
      const existingProperties = JSON.parse(localStorage.getItem('userProperties') || '[]');
      existingProperties.push(newUserProperty);
      localStorage.setItem('userProperties', JSON.stringify(existingProperties));

      // Sauvegarde additionnelle dans daleel_samsar_custom_listings
      const storedCustom = JSON.parse(localStorage.getItem('daleel_samsar_custom_listings') || '[]');
      storedCustom.unshift(newUserProperty);
      localStorage.setItem('daleel_samsar_custom_listings', JSON.stringify(storedCustom));

      // Émettre l'événement pour recharger immédiatement sans attendre un rechargement
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('userPropertiesUpdated'));
      }
    } catch (err) {
      console.warn('Could not save user listing to localStorage', err);
    }

    // Affiche l'écran de succès
    setIsSuccess(true);
  };

  // --------------------------------------------------------------------------
  // ÉCRAN DE SUCCÈS (ACTION 5)
  // --------------------------------------------------------------------------
  if (isSuccess) {
    return (
      <div
        dir={language === 'ar' ? 'rtl' : 'ltr'}
        className="w-full max-w-xl mx-auto py-8 px-4 animate-fade-in"
      >
        <div className="bg-white rounded-2xl shadow-md p-8 sm:p-10 border border-gray-100 text-center space-y-6">
          {/* Icône ✅ animée */}
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border-2 border-emerald-200 shadow-sm animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              {language === 'ar' ? 'تم استلام إعلانك بنجاح!' : 'Annonce envoyée avec succès !'}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 font-medium max-w-md mx-auto leading-relaxed">
              {language === 'ar'
                ? 'تم إرسال إعلانك إلى السماسرة. سيتصلون بك خلال 24 ساعة.'
                : 'Votre annonce a été envoyée à nos Samsars. Ils vous contacteront sous 24h.'}
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (onSuccessReturn) {
                  onSuccessReturn();
                } else if (onBack) {
                  onBack();
                }
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm shadow-md active:scale-95 transition cursor-pointer"
            >
              {language === 'ar' ? 'العودة إلى القائمة' : 'Retour au menu'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // FORMULAIRE EN 3 SECTIONS (ACTION 2 & 3 & 4)
  // --------------------------------------------------------------------------
  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="w-full max-w-xl mx-auto py-2 px-1 sm:px-0 animate-fade-in"
    >
      {/* Titre standard de la page */}
      <PageTitle
        title={language === 'ar' ? 'بيع أو كراء عقار' : 'Vendre / Déposer un bien'}
        subtitle={
          language === 'ar'
            ? 'املأ الاستمارة لنشر عقارك وربطه بأفضل السماسرة المعتمدين في منطقتك'
            : 'Publiez votre bien à la vente ou à la location en direct avec nos Samsars'
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        {/* ================================================================= */}
        {/* SECTION 1 - LE BIEN                                              */}
        {/* ================================================================= */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <span>🏠</span>
            <span>{language === 'ar' ? 'العقار' : 'Le bien'}</span>
          </h2>

          <div className="space-y-4">
            {/* Type de bien (Menu déroulant bilingue) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {language === 'ar' ? 'نوع العقار' : 'Type de bien'}{' '}
                <span className="text-red-500">*</span>
              </label>

              <select 
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-orange-500 bg-white text-gray-900 outline-none text-sm cursor-pointer"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              >
                <option value="">
                  {language === 'ar' ? '-- اختر نوع العقار --' : '-- Tout type de bien --'}
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

              {submittedAttempt && !isTypeValid && (
                <p className="text-red-500 text-xs font-semibold mt-1.5">
                  {requiredErrorText}
                </p>
              )}
            </div>

            {/* Ville (select) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {language === 'ar' ? 'المدينة' : 'Ville'}{' '}
                <span className="text-red-500">*</span>
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
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
                  {language === 'ar' ? '-- اختر المدينة --' : '-- Sélectionnez une ville --'}
                </option>
                {CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {language === 'ar' ? c.labelAr : c.labelFr}
                  </option>
                ))}
              </select>

              {submittedAttempt && !isCityValid && (
                <p className="text-red-500 text-xs font-semibold mt-1.5">
                  {requiredErrorText}
                </p>
              )}
            </div>

            {/* Quartier (select filtré dynamiquement selon la ville) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {language === 'ar' ? 'الحي' : 'Quartier'}
              </label>
              <select
                value={quarter}
                onChange={(e) => setQuarter(e.target.value)}
                disabled={!city}
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
                  {!city
                    ? (language === 'ar' ? '-- اختر المدينة أولاً --' : '-- Sélectionnez d\'abord une ville --')
                    : (language === 'ar' ? '-- جميع الأحياء --' : '-- Tous les quartiers --')
                  }
                </option>
                {city && (quartiersParVille[city] || []).map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
                {city && (
                  <option value="Autre">{language === 'ar' ? 'حي آخر' : 'Autre quartier'}</option>
                )}
              </select>

              {/* Précision libre si 'Autre' est sélectionné */}
              {quarter === 'Autre' && (
                <div className="mt-2 animate-fade-in">
                  <input
                    type="text"
                    value={customQuarter}
                    onChange={(e) => setCustomQuarter(e.target.value)}
                    placeholder={
                      language === 'ar'
                        ? 'يرجى كتابة اسم الحي بالتفصيل...'
                        : 'Précisez votre quartier...'
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm bg-gray-50 text-gray-800"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 2 - LES DÉTAILS                                          */}
        {/* ================================================================= */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <span>📋</span>
            <span>{language === 'ar' ? 'التفاصيل' : 'Détails'}</span>
          </h2>

          <div className="space-y-4">
            {/* Type d'opération (À vendre / À louer) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                {language === 'ar' ? 'نوع المعاملة' : "Type d'opération"}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOperation('vente')}
                  className={`flex-1 transition cursor-pointer text-center ${
                    operation === 'vente'
                      ? 'bg-orange-500 text-white rounded-full px-4 py-2.5 text-sm font-bold shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full px-4 py-2.5 text-sm font-medium'
                  }`}
                >
                  {language === 'ar' ? 'للبيع' : 'À vendre'}
                </button>
                <button
                  type="button"
                  onClick={() => setOperation('location')}
                  className={`flex-1 transition cursor-pointer text-center ${
                    operation === 'location'
                      ? 'bg-orange-500 text-white rounded-full px-4 py-2.5 text-sm font-bold shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full px-4 py-2.5 text-sm font-medium'
                  }`}
                >
                  {language === 'ar' ? 'للكراء' : 'À louer'}
                </button>
              </div>
            </div>

            {/* Surface (m²) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <span>📐</span>
                <span>{language === 'ar' ? 'المساحة (م²)' : 'Surface (m²)'}</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={surface}
                onChange={(e) => setSurface(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: 120' : 'Ex: 120'}
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
              />
              {submittedAttempt && !isSurfaceValid && (
                <p className="text-red-500 text-xs font-semibold mt-1.5">
                  {requiredErrorText}
                </p>
              )}
            </div>

            {/* Nombre de pièces */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <span>🛏️</span>
                <span>{language === 'ar' ? 'عدد الغرف' : 'Nombre de pièces'}</span>
              </label>
              <input
                type="number"
                min="0"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: 3' : 'Ex: 3'}
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
              />
            </div>

            {/* Prix (MAD) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <span>💰</span>
                <span>
                  {language === 'ar'
                    ? operation === 'location'
                      ? 'السعر الشهري (درهم)'
                      : 'السعر المطلوب (درهم)'
                    : operation === 'location'
                    ? 'Loyer mensuel (MAD)'
                    : 'Prix (MAD)'}
                </span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? operation === 'location'
                      ? 'مثال: 6500'
                      : 'مثال: 950000'
                    : operation === 'location'
                    ? 'Ex: 6500'
                    : 'Ex: 950000'
                }
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
              />
              {submittedAttempt && !isPriceValid && (
                <p className="text-red-500 text-xs font-semibold mt-1.5">
                  {requiredErrorText}
                </p>
              )}
            </div>

            {/* Description (multiligne 4 lignes) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {language === 'ar' ? 'الوصف' : 'Description'}
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  language === 'ar'
                    ? 'صف عقارك بالتفصيل (الإطلالة، الطابق، الحالة، التجهيزات)...'
                    : 'Décrivez votre bien...'
                }
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 3 - VOS COORDONNÉES                                       */}
        {/* ================================================================= */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <span>👤</span>
            <span>{language === 'ar' ? 'معلومات الاتصال' : 'Vos coordonnées'}</span>
          </h2>

          <div className="space-y-4">
            {/* Nom complet */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {language === 'ar' ? 'الاسم الكامل' : 'Nom complet'}{' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: كريم العلمي' : 'Ex: Karim Alami'}
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
              />
              {submittedAttempt && !isNameValid && (
                <p className="text-red-500 text-xs font-semibold mt-1.5">
                  {requiredErrorText}
                </p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {language === 'ar' ? 'رقم الهاتف' : 'Téléphone'}{' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="06XX XX XX XX"
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
              />
              {submittedAttempt && !isPhoneValid && (
                <p className="text-red-500 text-xs font-semibold mt-1.5">
                  {requiredErrorText}
                </p>
              )}
            </div>

            {/* Email (optionnel) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {language === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Email (optionnel)'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'ar' ? 'karim@example.com' : 'karim@exemple.com'}
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* BOUTON DE SOUMISSION (ACTION 5)                                   */}
        {/* ================================================================= */}
        <div className="pt-2 pb-8">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-4 rounded-xl font-bold text-base transition ${
              isFormValid
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg active:scale-98 cursor-pointer'
                : 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed shadow-none'
            }`}
          >
            {language === 'ar' ? 'نشر إعلاني' : 'Publier mon annonce'}
          </button>
        </div>
      </form>
    </div>
  );
};
