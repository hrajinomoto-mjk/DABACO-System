import React, { useEffect, useRef } from 'react';
import { ThemeId, getThemeById } from '../utils/themes';

interface AmbientBackdropProps {
  activeTheme: ThemeId;
  darkMode: boolean;
  variant?: 'landing' | 'login';
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

/**
 * Executive Architectural & Atmospheric Background System
 * Combines:
 * 1. Theme-adaptive atmospheric horizon lighting (crafted per corporate theme)
 * 2. Precision Monozukuri architectural drafting grid + geometric arcs
 * 3. Retina-crisp theme-adaptive financial constellation canvas (respects prefers-reduced-motion)
 * 4. Ultra-subtle matte surface grain for paper/anodized executive depth
 */
export const AmbientBackdrop: React.FC<AmbientBackdropProps> = ({
  activeTheme,
  darkMode,
  variant = 'landing'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const theme = getThemeById(activeTheme);
  const accentRgb = hexToRgb(theme.swatches.accent);
  const accent2Rgb = hexToRgb(theme.swatches.accentSecondary);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = { x: -9999, y: -9999, active: false };

    interface NodePoint {
      x: number;
      y: number;
      r: number;
      dx: number;
      dy: number;
      accented: boolean;
      phase: number;
    }

    let nodes: NodePoint[] = [];

    const setup = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const baseCount = variant === 'login' ? (width < 768 ? 22 : 42) : width < 768 ? 28 : 58;
      nodes = [];
      for (let i = 0; i < baseCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.6 + 1.1,
          dx: (Math.random() - 0.5) * 0.24,
          dy: (Math.random() - 0.5) * 0.24,
          accented: i % 3 === 0,
          phase: Math.random() * Math.PI * 2
        });
      }
    };

    const drawFrame = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const maxDist = variant === 'login' ? 145 : 155;
      const neutralNodeColor = darkMode ? '226, 232, 240' : '71, 85, 105';
      const lineBaseAlpha = darkMode ? 0.22 : 0.16;
      const nodeBaseAlpha = darkMode ? 0.45 : 0.32;

      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];

        if (!prefersReducedMotion) {
          p.x += p.dx;
          p.y += p.dy;
          if (p.x < 0 || p.x > width) p.dx *= -1;
          if (p.y < 0 || p.y > height) p.dy *= -1;
        }

        const pulse = prefersReducedMotion ? 1 : 0.8 + 0.2 * Math.sin(time * 0.0014 + p.phase);

        // Draw links between neighboring nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const p2 = nodes[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < maxDist) {
            const strength = (1 - dist / maxDist) * lineBaseAlpha;
            const useAccent = p.accented || p2.accented;
            ctx.beginPath();
            ctx.strokeStyle = useAccent
              ? `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, ${strength.toFixed(3)})`
              : `rgba(${neutralNodeColor}, ${(strength * 0.72).toFixed(3)})`;
            ctx.lineWidth = useAccent ? 0.75 : 0.55;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Subtle interactive cursor link
        if (mouse.active) {
          const mDist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (mDist < 170) {
            const mStrength = (1 - mDist / 170) * (darkMode ? 0.34 : 0.24);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${accent2Rgb.r}, ${accent2Rgb.g}, ${accent2Rgb.b}, ${mStrength.toFixed(3)})`;
            ctx.lineWidth = 0.85;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        // Draw node dot (with tiny soft halo for accented nodes)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.accented
          ? `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, ${(nodeBaseAlpha * 1.45 * pulse).toFixed(3)})`
          : `rgba(${neutralNodeColor}, ${(nodeBaseAlpha * pulse).toFixed(3)})`;
        ctx.fill();

        if (p.accented) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 2.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, ${(0.07 * pulse).toFixed(3)})`;
          ctx.fill();
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(drawFrame);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    setup();
    drawFrame(0);

    window.addEventListener('resize', setup);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', setup);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTheme, darkMode, variant, accentRgb.r, accentRgb.g, accentRgb.b, accent2Rgb.r, accent2Rgb.g, accent2Rgb.b]);

  const gridLineColor = darkMode ? 'rgba(226, 232, 240, 0.045)' : 'rgba(15, 23, 42, 0.048)';
  const arcStrokeColor = darkMode
    ? `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.14)`
    : `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.12)`;
  const arcSecondaryColor = darkMode ? 'rgba(148, 163, 184, 0.08)' : 'rgba(71, 85, 105, 0.08)';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Theme-Adaptive Horizon & Atmospheric Light Wash */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: darkMode
            ? `
              radial-gradient(ellipse 80% 52% at 50% -10%, rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.20) 0%, rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.05) 42%, transparent 72%),
              radial-gradient(ellipse 55% 45% at 88% 92%, rgba(${accent2Rgb.r}, ${accent2Rgb.g}, ${accent2Rgb.b}, 0.14) 0%, transparent 65%),
              radial-gradient(ellipse 45% 40% at 10% 78%, rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.09) 0%, transparent 65%)
            `
            : `
              radial-gradient(ellipse 85% 55% at 50% -12%, rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.11) 0%, rgba(${accent2Rgb.r}, ${accent2Rgb.g}, ${accent2Rgb.b}, 0.04) 44%, transparent 74%),
              radial-gradient(ellipse 55% 48% at 92% 88%, rgba(${accent2Rgb.r}, ${accent2Rgb.g}, ${accent2Rgb.b}, 0.09) 0%, transparent 65%),
              radial-gradient(ellipse 50% 42% at 6% 72%, rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.065) 0%, transparent 64%)
            `
        }}
      />

      {/* 2. Precision Architectural Drafting Grid (Radially Masked) */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${gridLineColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridLineColor} 1px, transparent 1px)
          `,
          backgroundSize: variant === 'login' ? '48px 48px' : '60px 60px',
          maskImage:
            variant === 'login'
              ? 'radial-gradient(ellipse 85% 80% at 50% 48%, black 35%, transparent 92%)'
              : 'radial-gradient(ellipse 90% 70% at 50% 24%, black 28%, transparent 88%)',
          WebkitMaskImage:
            variant === 'login'
              ? 'radial-gradient(ellipse 85% 80% at 50% 48%, black 35%, transparent 92%)'
              : 'radial-gradient(ellipse 90% 70% at 50% 24%, black 28%, transparent 88%)'
        }}
      />

      {/* 3. Precision Geometric Architectural Arcs (Monozukuri Engineering Motif) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-90"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="dabaco-beam-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={theme.swatches.accent} stopOpacity="0" />
            <stop offset="50%" stopColor={theme.swatches.accent} stopOpacity={darkMode ? '0.28' : '0.18'} />
            <stop offset="100%" stopColor={theme.swatches.accentSecondary} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="dabaco-diag-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.swatches.accent} stopOpacity="0" />
            <stop offset="50%" stopColor={theme.swatches.accentSecondary} stopOpacity={darkMode ? '0.16' : '0.12'} />
            <stop offset="100%" stopColor={theme.swatches.accent} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Precision Orbital Arcs */}
        <circle cx="720" cy={variant === 'login' ? '450' : '260'} r="380" stroke={arcSecondaryColor} strokeWidth="1" />
        <circle
          cx="720"
          cy={variant === 'login' ? '450' : '260'}
          r="560"
          stroke={arcStrokeColor}
          strokeWidth="1"
          strokeDasharray="4 10"
        />
        <circle cx="720" cy={variant === 'login' ? '450' : '260'} r="740" stroke={arcSecondaryColor} strokeWidth="0.75" />

        {/* Subtle Architectural Framing Diagonals */}
        <line x1="120" y1="0" x2="540" y2="900" stroke="url(#dabaco-diag-grad)" strokeWidth="1" />
        <line x1="1320" y1="0" x2="900" y2="900" stroke="url(#dabaco-diag-grad)" strokeWidth="1" />

        {/* Horizon Precision Hairline */}
        <line
          x1="160"
          y1={variant === 'login' ? '120' : '160'}
          x2="1280"
          y2={variant === 'login' ? '120' : '160'}
          stroke="url(#dabaco-beam-grad)"
          strokeWidth="1"
        />

        {/* Delicate Corner Drafting Crosshairs */}
        <g stroke={arcStrokeColor} strokeWidth="1">
          <path d="M96 140 h14 M103 133 v14" />
          <path d="M1330 140 h14 M1337 133 v14" />
          <path d="M96 760 h14 M103 753 v14" />
          <path d="M1330 760 h14 M1337 753 v14" />
        </g>
      </svg>

      {/* 4. Interactive Retina Theme-Aware Financial Constellation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 5. Top Edge Subtle Chromatic Accent Line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-85"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${theme.swatches.accent} 30%, ${theme.swatches.accentSecondary} 70%, transparent 100%)`
        }}
      />
    </div>
  );
};
