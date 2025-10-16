import React from 'react';

const commonProps = {
  stroke: 'currentColor',
  strokeWidth: '2.5',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none',
};

export const Skull: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 64" className={className} {...commonProps}>
    <path d="M22,52 C16,52 12,48 12,42 V32 C12,22 20,14 32,14 S52,22 52,32 V42 C52,48 48,52 42,52 H38 L32,58 L26,52 H22 Z" />
    <circle cx="26" cy="34" r="5" fill="currentColor" fillOpacity="0.2"/>
    <circle cx="38" cy="34" r="5" fill="currentColor" fillOpacity="0.2"/>
    <path d="M30,42 L34,42 L32,38 Z" />
    <path d="M25,48 H39 M27,48 V52 M31,48 V52 M35,48 V52" />
  </svg>
);

export const Dagger: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 64" className={className} {...commonProps}>
    <path d="M32 58 V18 L40 10 L32 2 L24 10 L32 18" />
    <path d="M20 22 H44" />
  </svg>
);

export const Rose: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 64" className={className} {...commonProps}>
    <path d="M32,24 C26,24 22,32 22,32 C22,32 26,40 32,40 S42,32 42,32 S38,24 32,24Z" />
    <path d="M32,24 C32,16 42,16 42,24" />
    <path d="M32,24 C32,16 22,16 22,24" />
    <path d="M22,32 C14,32 14,42 22,42" />
    <path d="M42,32 C50,32 50,42 42,42" />
    <path d="M32,40 V54" />
    <path d="M24,50 C18,50 20,44 24,50Z" />
    <path d="M40,50 C46,50 44,44 40,50Z" />
  </svg>
);

export const SacredHeart: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 64" className={className} {...commonProps}>
    <path d="M32,22 C20,22 14,32 14,40 C14,54 32,58 32,58 S50,54 50,40 C50,32 44,22 32,22Z" />
    <path d="M28,14 L32,6 L36,14" />
    <path d="M32,6 V22" />
    <path d="M20,30 L44,50 M44,30 L20,50" />
  </svg>
);

export const Star: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 64" className={className} {...commonProps}>
    <path d="M32,5 L40,23 L59,25 L45,39 L48,58 L32,48 L16,58 L19,39 L5,25 L24,23 Z" />
  </svg>
);

export const Diamond: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 64 64" className={className} {...commonProps}>
      <path d="M16,24 L32,54 L48,24 L32,10 Z" />
      <path d="M16,24 L48,24 M32,54 L24,24 L32,10 L40,24" />
    </svg>
);
