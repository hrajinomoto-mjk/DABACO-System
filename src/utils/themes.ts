export type ThemeId =
  | 'crimson-light'
  | 'sapphire-light'
  | 'ivory-light'
  | 'midnight-dark'
  | 'emerald-dark'
  | 'obsidian-dark';

export interface ThemeSwatches {
  bg: string;
  surface: string;
  sidebar: string;
  border: string;
  accent: string;
  accentSecondary: string;
  text: string;
  muted: string;
}

export interface ThemeOption {
  id: ThemeId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  descriptionEn: string;
  mode: 'light' | 'dark';
  recommendedFor: string;
  recommendedForEn: string;
  swatches: ThemeSwatches;
}

export const DEFAULT_LIGHT_THEME: ThemeId = 'crimson-light';
export const DEFAULT_DARK_THEME: ThemeId = 'midnight-dark';

export const SYSTEM_THEMES: ThemeOption[] = [
  {
    id: 'crimson-light',
    name: 'Ajinomoto Crimson',
    shortName: 'Crimson',
    tagline: 'Corporate Flagship',
    description: 'Identitas resmi PT Ajinomoto Indonesia dengan kanvas putih bersih, kontras tajam, dan aksen merah crimson.',
    descriptionEn: 'Official PT Ajinomoto Indonesia corporate identity featuring a crisp white canvas, sharp contrast, and crimson accents.',
    mode: 'light',
    recommendedFor: 'Operasional Harian',
    recommendedForEn: 'Daily Operations',
    swatches: {
      bg: '#f8fafc',
      surface: '#ffffff',
      sidebar: '#ffffff',
      border: '#e2e8f0',
      accent: '#dc2626',
      accentSecondary: '#e11d48',
      text: '#0f172a',
      muted: '#64748b'
    }
  },
  {
    id: 'sapphire-light',
    name: 'Nordic Sapphire',
    shortName: 'Sapphire',
    tagline: 'Financial Audit & Treasury',
    description: 'Palet biru-platinum korporat yang tenang dan presisi untuk audit anggaran serta rekonsiliasi data finansial.',
    descriptionEn: 'Calm platinum-sapphire corporate palette crafted for precision budget audits and financial reconciliation.',
    mode: 'light',
    recommendedFor: 'Audit & Keuangan',
    recommendedForEn: 'Audit & Finance',
    swatches: {
      bg: '#f1f5fb',
      surface: '#ffffff',
      sidebar: '#f8fbff',
      border: '#d6e2f2',
      accent: '#1d4ed8',
      accentSecondary: '#0284c7',
      text: '#0f172a',
      muted: '#475569'
    }
  },
  {
    id: 'ivory-light',
    name: 'Warm Ivory Executive',
    shortName: 'Warm Ivory',
    tagline: 'Boardroom Paper',
    description: 'Kanvas gading hangat minim silau dengan aksen burgundy & tembaga emas yang nyaman untuk analisis jangka panjang.',
    descriptionEn: 'Low-glare warm ivory paper canvas with burgundy and bronze-gold accents for extended analytical review.',
    mode: 'light',
    recommendedFor: 'Analisis & Review',
    recommendedForEn: 'Analysis & Review',
    swatches: {
      bg: '#f6f2ea',
      surface: '#fffdf9',
      sidebar: '#fbf8f2',
      border: '#e4dbcd',
      accent: '#9f1239',
      accentSecondary: '#b45309',
      text: '#1c1917',
      muted: '#57534e'
    }
  },
  {
    id: 'midnight-dark',
    name: 'Executive Midnight',
    shortName: 'Midnight',
    tagline: 'Command Center',
    description: 'Tema gelap biru-obsidian kontras tinggi dengan sorotan merah rubi untuk ruang kendali dan monitoring real-time.',
    descriptionEn: 'High-contrast obsidian navy dark mode with ruby highlights engineered for real-time monitoring command centers.',
    mode: 'dark',
    recommendedFor: 'Monitoring Intensif',
    recommendedForEn: 'Intensive Monitoring',
    swatches: {
      bg: '#080c14',
      surface: '#0f1624',
      sidebar: '#0a0e17',
      border: '#1e293b',
      accent: '#dc2626',
      accentSecondary: '#f43f5e',
      text: '#f8fafc',
      muted: '#94a3b8'
    }
  },
  {
    id: 'emerald-dark',
    name: 'Emerald Vault',
    shortName: 'Emerald',
    tagline: 'Precision Treasury Dark',
    description: 'Nuansa gelap hijau-zamrud berkarakter modern dan tenang untuk analisis arus kas, proyeksi, dan efisiensi biaya.',
    descriptionEn: 'Refined deep emerald-charcoal dark surfaces designed for cashflow analytics, forecasting, and cost efficiency.',
    mode: 'dark',
    recommendedFor: 'Treasury & Efisiensi',
    recommendedForEn: 'Treasury & Efficiency',
    swatches: {
      bg: '#061210',
      surface: '#0b1e1b',
      sidebar: '#071714',
      border: '#173832',
      accent: '#10b981',
      accentSecondary: '#14b8a6',
      text: '#ecfdf5',
      muted: '#94b8b0'
    }
  },
  {
    id: 'obsidian-dark',
    name: 'Obsidian Gold',
    shortName: 'Obsidian Gold',
    tagline: 'Director Lounge',
    description: 'Karbon grafit matte elegan dipadukan aksen emas amber korporat dengan estetika eksklusif tingkat direksi.',
    descriptionEn: 'Matte carbon graphite paired with warm corporate amber-gold accents for Board of Directors briefings.',
    mode: 'dark',
    recommendedFor: 'Presentasi Direksi',
    recommendedForEn: 'Board Briefings',
    swatches: {
      bg: '#0c0c0f',
      surface: '#16161c',
      sidebar: '#101014',
      border: '#272732',
      accent: '#d97706',
      accentSecondary: '#f59e0b',
      text: '#fafaf9',
      muted: '#a1a1aa'
    }
  }
];

export const isValidThemeId = (value: string | null | undefined): value is ThemeId => {
  return SYSTEM_THEMES.some((t) => t.id === value);
};

export const getThemeById = (id: ThemeId): ThemeOption => {
  return SYSTEM_THEMES.find((t) => t.id === id) || SYSTEM_THEMES[0];
};
