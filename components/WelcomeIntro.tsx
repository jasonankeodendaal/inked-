import React, { useEffect, useState } from 'react';

interface WelcomeIntroProps {
  isVisible: boolean;
  onEnter: () => void;
  logoUrl: string;
}

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
        className="absolute inset-0 w-full h-full object-cover -z-10 opacity-50"
      />
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
