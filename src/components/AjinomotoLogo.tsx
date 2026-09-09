import React, { useState } from 'react';

export const AJINOMOTO_OFFICIAL_LOGO_URL =
  'https://upload.wikimedia.org/wikipedia/commons/0/01/Ajinomoto_Group_Global_Brand_logo.png';
const LOCAL_BACKUP_LOGO_URL = '/ajinomoto-global-brand.png';

export interface AjinomotoLogoProps {
  className?: string;
  variant?: 'symbol' | 'horizontal' | 'full' | 'stacked';
  showText?: boolean;
  showSlogan?: boolean;
  sloganColor?: string;
  inverted?: boolean;
  withOutline?: boolean;
  outlineColor?: string;
  alt?: string;
}

export const AjinomotoLogo: React.FC<AjinomotoLogoProps> = ({
  className = 'h-8 w-auto',
  variant = 'full',
  showText = true,
  showSlogan = true,
  sloganColor,
  inverted = false,
  withOutline = false,
  outlineColor = '#ffffff',
  alt = 'Ajinomoto Group Global Brand'
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(AJINOMOTO_OFFICIAL_LOGO_URL);
  const [useVectorFallback, setUseVectorFallback] = useState(false);

  const handleImageError = () => {
    // If the remote Wikimedia link fails (e.g. rate limit/offline), switch to local mirror first, then inline vector
    if (currentSrc === AJINOMOTO_OFFICIAL_LOGO_URL) {
      setCurrentSrc(LOCAL_BACKUP_LOGO_URL);
    } else {
      setUseVectorFallback(true);
    }
  };

  // Clean, crisp outline filter if needed on dark/colored backgrounds
  const outlineFilter = withOutline
    ? `drop-shadow(1px 0 0 ${outlineColor}) drop-shadow(-1px 0 0 ${outlineColor}) drop-shadow(0 1px 0 ${outlineColor}) drop-shadow(0 -1px 0 ${outlineColor})`
    : undefined;

  // Pure Vector Inline Component for 100% Crisp, Instant, Zero-Network Display
  const renderVectorLogo = () => {
    // Symbol only (Authentic Ajinomoto A-Ribbon Emblem)
    if (variant === 'symbol') {
      return (
        <svg
          viewBox="0 0 30 26"
          className="h-full w-auto aspect-[30/26] select-none"
          style={{ filter: outlineFilter }}
          aria-label={alt}
        >
          <g transform="translate(1, 1)">
            <path
              fill="#E60012"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M 14.5 1 C 8.2 1 3.2 6 3.2 12.3 C 3.2 18.5 8.2 23.5 14.5 23.5 C 19.8 23.5 24.2 19.8 25.4 14.8 L 20.8 13.2 C 20 16.5 17.5 19 14.5 19 C 10.8 19 7.8 16 7.8 12.3 C 7.8 8.6 10.8 5.6 14.5 5.6 C 17.3 5.6 19.6 7.3 20.6 9.8 L 16.2 14.2 L 27.5 14.2 L 27.5 2.9 L 23.8 6.6 C 21.6 3.2 18.3 1 14.5 1 Z"
            />
            <path
              fill="#E60012"
              d="M 13.2 10.8 L 16.8 10.8 L 16.8 18.5 C 16.8 19.8 16 20.7 14.8 20.7 C 13.8 20.7 13.2 20.1 13 19.6 L 11.2 21.2 C 12 22.3 13.3 23 14.8 23 C 17.5 23 19.2 21.2 19.2 18.5 L 19.2 8.5 L 13.2 8.5 Z"
            />
          </g>
        </svg>
      );
    }

    // Stacked / Centered variant
    if (variant === 'stacked') {
      return (
        <div className="inline-flex flex-col items-center justify-center text-center select-none" style={{ filter: outlineFilter }}>
          <svg viewBox="0 0 30 26" className="h-10 w-auto mb-1" aria-hidden="true">
            <g transform="translate(1, 1)">
              <path
                fill="#E60012"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M 14.5 1 C 8.2 1 3.2 6 3.2 12.3 C 3.2 18.5 8.2 23.5 14.5 23.5 C 19.8 23.5 24.2 19.8 25.4 14.8 L 20.8 13.2 C 20 16.5 17.5 19 14.5 19 C 10.8 19 7.8 16 7.8 12.3 C 7.8 8.6 10.8 5.6 14.5 5.6 C 17.3 5.6 19.6 7.3 20.6 9.8 L 16.2 14.2 L 27.5 14.2 L 27.5 2.9 L 23.8 6.6 C 21.6 3.2 18.3 1 14.5 1 Z"
              />
              <path
                fill="#E60012"
                d="M 13.2 10.8 L 16.8 10.8 L 16.8 18.5 C 16.8 19.8 16 20.7 14.8 20.7 C 13.8 20.7 13.2 20.1 13 19.6 L 11.2 21.2 C 12 22.3 13.3 23 14.8 23 C 17.5 23 19.2 21.2 19.2 18.5 L 19.2 8.5 L 13.2 8.5 Z"
              />
            </g>
          </svg>
          <span className="font-extrabold tracking-wider text-red-600 text-lg uppercase leading-none">
            AJINOMOTO
          </span>
          {showSlogan && (
            <span
              className="text-xs font-serif italic tracking-wide text-red-600 dark:text-red-400 font-bold mt-0.5"
              style={{ color: sloganColor || undefined }}
            >
              Eat Well, Live Well<span className="text-red-600 font-sans font-black text-sm">.</span>
            </span>
          )}
        </div>
      );
    }

    // Default Full and Horizontal Variants:
    // Authentic Corporate Logo: [A-Ribbon Emblem] + [AJINOMOTO Wordmark] + [Eat Well, Live Well. Slogan]
    return (
      <svg
        viewBox="0 0 340 76"
        className="h-full w-auto select-none"
        style={{ filter: outlineFilter }}
        aria-label={alt}
      >
        {/* Left: Stylized Ajinomoto Corporate "A" Emblem Ribbon */}
        <g transform="translate(4, 3) scale(2.2)">
          <path
            fill="#E60012"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 14.5 1 C 8.2 1 3.2 6 3.2 12.3 C 3.2 18.5 8.2 23.5 14.5 23.5 C 19.8 23.5 24.2 19.8 25.4 14.8 L 20.8 13.2 C 20 16.5 17.5 19 14.5 19 C 10.8 19 7.8 16 7.8 12.3 C 7.8 8.6 10.8 5.6 14.5 5.6 C 17.3 5.6 19.6 7.3 20.6 9.8 L 16.2 14.2 L 27.5 14.2 L 27.5 2.9 L 23.8 6.6 C 21.6 3.2 18.3 1 14.5 1 Z"
          />
          <path
            fill="#E60012"
            d="M 13.2 10.8 L 16.8 10.8 L 16.8 18.5 C 16.8 19.8 16 20.7 14.8 20.7 C 13.8 20.7 13.2 20.1 13 19.6 L 11.2 21.2 C 12 22.3 13.3 23 14.8 23 C 17.5 23 19.2 21.2 19.2 18.5 L 19.2 8.5 L 13.2 8.5 Z"
          />
        </g>

        {/* Elegant Vertical Divider Accent */}
        <line x1="72" y1="12" x2="72" y2="64" stroke="#E60012" strokeWidth="1.8" strokeLinecap="round" opacity="0.25" />

        {/* Right Section: Wordmark AJINOMOTO & Corporate Slogan "Eat Well, Live Well." */}
        <g transform="translate(84, 0)">
          {/* AJINOMOTO Wordmark (Geometric Bold Corporate Typeface) */}
          <g transform="translate(0, 8) scale(2.55)">
            {/* A */}
            <path
              fill="#E60012"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M 10.92 0.15 L 10.64 0.5 L 7.28 4.01 C 6.86 3.9 6.42 3.83 5.98 3.83 C 4.67 3.84 3.44 4.31 2.43 4.96 C -0.42 6.74 -0.99 9.05 1.95 9.06 C 4.44 9.06 5.7 6.98 7.74 4.84 L 7.85 4.72 C 8.65 5.16 9.45 5.93 10.19 7.2 C 10.49 7.7 10.72 8.31 10.76 8.74 L 12.53 8.74 L 12.53 0.15 Z M 10.74 1.53 L 10.74 6.79 C 10.14 5.76 9.25 4.88 8.18 4.35 Z M 5.95 4.25 C 6.27 4.25 6.62 4.28 6.95 4.36 L 6.78 4.55 C 3.99 7.47 3.24 8.64 2.05 8.64 C 1.23 8.64 0.72 7.1 2.81 5.31 C 3.62 4.61 4.8 4.25 5.95 4.25 Z"
            />
            {/* J */}
            <path
              fill="#E60012"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M 16.45 0.15 V 7.37 C 16.45 9.64 15.24 10.5 13.71 10.72 L 13.4 10.17 C 14.59 9.84 14.74 8.68 14.74 6.84 V 0.15 Z"
            />
            {/* I */}
            <path fill="#E60012" d="M 18.51 8.74 H 20.21 V 0.15 H 18.51 Z" />
            {/* N */}
            <path
              fill="#E60012"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M 28.89 6.04 L 28.86 5.66 V 0.15 H 29.95 V 8.74 H 29.02 C 27.61 7.18 24.99 4.23 23.53 2.67 C 23.48 2.62 23.42 2.51 23.37 2.42 V 8.74 H 22.27 V 0.15 H 23.53 C 25.19 1.97 27.05 3.92 28.72 5.81 Z"
            />
            {/* O */}
            <path
              fill="#E60012"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M 31.3 4.45 C 31.3 1.68 33.02 0 35.71 0 C 38.38 0 40.11 1.68 40.11 4.45 C 40.11 7.22 38.38 8.89 35.71 8.89 C 33.02 8.89 31.3 7.22 31.3 4.45 Z M 35.71 8.18 C 37.3 8.18 38.28 6.57 38.28 4.45 C 38.28 2.34 37.3 0.71 35.71 0.71 C 34.1 0.71 33.13 2.34 33.13 4.45 C 33.13 6.57 34.1 8.18 35.71 8.18 Z"
            />
            {/* M */}
            <path
              fill="#E60012"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M 48.8 2.84 L 45.95 8.74 H 45.65 L 42.84 2.77 L 42.79 2.67 C 42.79 2.7 42.81 2.73 42.79 2.77 C 42.4 4.76 42.21 6.75 42.21 8.74 H 40.98 C 41.41 6.27 41.81 3.43 42.23 0.35 H 43.29 L 46.06 6.17 L 46.22 6.16 L 49.13 0.35 H 50.04 C 50.44 3.65 50.89 6.46 51.32 8.95 H 50.04 C 49.94 7.16 49.74 5.1 49.56 3.21 Z"
            />
            {/* O */}
            <path
              fill="#E60012"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M 52.23 4.45 C 52.23 1.68 53.96 0 56.63 0 C 59.32 0 61.04 1.68 61.04 4.45 C 61.04 7.22 59.32 8.89 56.63 8.89 C 53.96 8.89 52.23 7.22 52.23 4.45 Z M 56.63 8.18 C 58.24 8.18 59.2 6.57 59.2 4.45 C 59.2 2.34 58.24 0.71 56.63 0.71 C 55.04 0.71 54.06 2.34 54.06 4.45 C 54.06 6.57 55.04 8.18 56.63 8.18 Z"
            />
            {/* T */}
            <path
              fill="#E60012"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M 63.78 8.74 V 1.09 C 62.44 1.14 61.91 1.19 61.26 1.28 V 0.15 H 68.06 V 1.28 C 67.21 1.19 67.1 1.11 65.52 1.09 V 8.74 Z"
            />
            {/* O */}
            <path
              fill="#E60012"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M 68.29 4.45 C 68.29 1.68 70.02 0 72.69 0 C 75.38 0 77.1 1.68 77.1 4.45 C 77.1 7.22 75.38 8.89 72.69 8.89 C 70.02 8.89 68.29 7.22 68.29 4.45 Z M 72.69 8.18 C 74.3 8.18 75.26 6.57 75.26 4.45 C 75.26 2.34 74.3 0.71 72.69 0.71 C 71.1 0.71 70.12 2.34 70.12 4.45 C 70.12 6.57 71.1 8.18 72.69 8.18 Z"
            />
          </g>

          {/* Slogan: "Eat Well, Live Well." with signature Ajinomoto typography */}
          {showSlogan && (
            <g transform="translate(2, 59)">
              <text
                fontFamily="'Playfair Display', Georgia, Cambria, 'Times New Roman', serif"
                fontSize="18.5"
                fontWeight="700"
                fontStyle="italic"
                letterSpacing="0.04em"
                fill={sloganColor || '#E60012'}
              >
                Eat Well, Live Well<tspan fill="#E60012" fontSize="22" fontWeight="900">.</tspan>
              </text>
            </g>
          )}
        </g>
      </svg>
    );
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Renders the official Wikimedia Ajinomoto Group Global Brand logo */}
      {!useVectorFallback && variant !== 'symbol' ? (
        <img
          src={currentSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={handleImageError}
          style={{ filter: outlineFilter }}
          className="h-full w-auto object-contain select-none transition-transform"
        />
      ) : (
        renderVectorLogo()
      )}
    </div>
  );
};
