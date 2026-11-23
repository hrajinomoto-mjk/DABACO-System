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
  mode: 'light' | 'dark';
  recommendedFor: string;
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
    mode: 'light',
    recommendedFor: 'Operasional Harian',
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
    mode: 'light',
    recommendedFor: 'Audit & Keuangan',
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
    mode: 'light',
    recommendedFor: 'Analisis & Review',
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
    mode: 'dark',
    recommendedFor: 'Monitoring Intensif',
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
    mode: 'dark',
    recommendedFor: 'Treasury & Efisiensi',
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
    mode: 'dark',
    recommendedFor: 'Presentasi Direksi',
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
