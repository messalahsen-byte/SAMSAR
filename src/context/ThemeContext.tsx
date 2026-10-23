import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'emerald-gold' | 'ochre-majorelle';

export interface ThemeDefinition {
  id: ThemeMode;
  name: string;
  nameAr: string;
  description: string;
  // CSS Colors
  brandPrimaryHex: string;
  brandAccentHex: string;
  accentBgHex: string;
  accentTextHex: string;
  // Tailwind Utility Classes
  accentTextClass: string;
  accentBgClass: string;
  accentBorderClass: string;
  accentHoverBorderClass: string;
  accentHoverTextClass: string;
  accentHoverBgClass: string;
  iconBgClass: string;
  iconTextClass: string;
  arrowHoverTextClass: string;
  badgeBgClass: string;
  badgeTextClass: string;
}

export const THEMES: Record<ThemeMode, ThemeDefinition> = {
  'emerald-gold': {
    id: 'emerald-gold',
    name: 'Émeraude Royal & Or Atlas',
    nameAr: 'الزمرد الملكي والذهب',
    description: 'Prestige, confiance institutionnelle & identité marocaine noble',
    brandPrimaryHex: '#004d40',
    brandAccentHex: '#D4AF37',
    accentBgHex: '#FEF9C3',
    accentTextHex: '#854D0E',
    accentTextClass: 'text-amber-500',
    accentBgClass: 'bg-amber-50',
    accentBorderClass: 'border-amber-400',
    accentHoverBorderClass: 'hover:border-amber-500',
    accentHoverTextClass: 'group-hover:text-amber-600',
    accentHoverBgClass: 'group-hover:bg-amber-100',
    iconBgClass: 'bg-amber-100/80',
    iconTextClass: 'text-amber-700',
    arrowHoverTextClass: 'group-hover:text-amber-500',
    badgeBgClass: 'bg-amber-100',
    badgeTextClass: 'text-amber-800'
  },
  'ochre-majorelle': {
    id: 'ochre-majorelle',
    name: "Terre d'Ocre & Majorelle",
    nameAr: 'تراب الأوكري وماجوريل',
    description: 'Chaleur méditerranéenne, modernité dynamique & architectural',
    brandPrimaryHex: '#1E293B',
    brandAccentHex: '#EA580C',
    accentBgHex: '#FFEDD5',
    accentTextHex: '#9A3412',
    accentTextClass: 'text-orange-500',
    accentBgClass: 'bg-orange-50',
    accentBorderClass: 'border-orange-500',
    accentHoverBorderClass: 'hover:border-orange-500',
    accentHoverTextClass: 'group-hover:text-orange-600',
    accentHoverBgClass: 'group-hover:bg-orange-100',
    iconBgClass: 'bg-orange-100',
    iconTextClass: 'text-orange-600',
    arrowHoverTextClass: 'group-hover:text-orange-500',
    badgeBgClass: 'bg-orange-100',
    badgeTextClass: 'text-orange-800'
  }
};

interface ThemeContextType {
  theme: ThemeMode;
  themeConfig: ThemeDefinition;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('directsamsar_theme');
      if (saved === 'emerald-gold' || saved === 'ochre-majorelle') {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'emerald-gold';
  });

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('directsamsar_theme', newTheme);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'emerald-gold' ? 'ochre-majorelle' : 'emerald-gold');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const themeConfig = THEMES[theme];

  return (
    <ThemeContext.Provider value={{ theme, themeConfig, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
