import React, { useEffect, useState } from 'react';
import TattooSkullIcon from './icons/TattooSkullIcon';
import TattooRoseIcon from './icons/TattooRoseIcon';
import SacredGeometryIcon from './icons/SacredGeometryIcon';

interface WelcomeIntroProps {
  isVisible: boolean;
  onEnter: () => void;
  logoUrl: string;
}

const backgroundIcons = [
  { Icon: TattooSkullIcon, className: 'top-[10%] left-[5%] w-24 h-24 opacity-10 scale-90', animationDelay: '0s', animationDuration: '25s' },
  { Icon: TattooRoseIcon, className: 'top-[15%] right-[8%] w-32 h-32 opacity-15 scale-110', animationDelay: '3s', animationDuration: '30s' },
  { Icon: SacredGeometryIcon, className: 'top-[40%] left-[15%] w-20 h-20 opacity-5', animationDelay: '1s', animationDuration: '35s' },
  { Icon: TattooSkullIcon, className: 'top-[65%] right-[12%] w-28 h-28 opacity-10 scale-100', animationDelay: '7s', animationDuration: '28s' },
  { Icon: TattooRoseIcon, className: 'bottom-[8%] left-[20%] w-24 h-24 opacity-15 scale-80', animationDelay: '5s', animationDuration: '22s' },
  { Icon: SacredGeometryIcon, className: 'bottom-[5%] right-[2%] w-40 h-40 opacity-5 scale-125', animationDelay: '10s', animationDuration: '40s' },
  { Icon: TattooRoseIcon, className: 'top-[50%] right-[45%] w-16 h-16 opacity-10', animationDelay: '2s', animationDuration: '18s' },
];

const WelcomeIntro: React.FC<WelcomeIntroProps> = ({ isVisible, onEnter, logoUrl }) => {
  const [showContent, setShowContent] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleEnterClick = () => {
    setIsFadingOut(true);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-dark transition-opacity duration-700 ease-in-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
      onTransitionEnd={() => {
        if (isFadingOut) {
          onEnter();
        }
      }}
      aria-hidden={!isVisible}
    >
      <video
        src="https://assets.mixkit.co/videos/preview/mixkit-black-ink-in-a-transparent-liquid-4059-large.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-20 opacity-50"
      />

      {/* Background Icon Wallpaper */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {backgroundIcons.map(({ Icon, className, animationDelay, animationDuration }, index) => (
          <Icon
            key={index}
            className={`absolute text-white/80 ${className}`}
            style={{
              animationName: 'subtle-float',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDuration,
              animationDelay,
            }}
          />
        ))}
      </div>


      <div 
        className={`relative w-48 h-48 sm:w-64 sm:h-64 transition-opacity duration-1000 ease-in-out ${showContent ? 'opacity-100' : 'opacity-0'}`}
      >
        <img src={logoUrl} alt="Beautively Inked Logo" className="w-full h-full object-contain animate-subtle-glow"/>
      </div>

      <div
        className={`text-center transition-all duration-1000 ease-in-out mt-4 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        style={{ transitionDelay: '1s' }}
      >
        <div className="[filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.5))] mt-8">
          <h1 className="font-script text-brand-light text-5xl sm:text-6xl [text-shadow:0_0_8px_rgba(22,163,74,0.3)]">
            Beautively Inked
          </h1>
          <p className="mt-2 text-brand-light/70 text-sm">
            Where your story becomes art.
          </p>
          <button
            onClick={handleEnterClick}
            className="mt-8 border border-brand-light/50 text-brand-light px-10 py-3 rounded-full text-sm font-semibold hover:bg-brand-light hover:text-brand-dark transition-all duration-300 transform hover:scale-105"
          >
            Enter Studio
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeIntro;