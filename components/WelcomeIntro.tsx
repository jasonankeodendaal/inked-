import React, { useEffect, useState } from 'react';

interface WelcomeIntroProps {
  isVisible: boolean;
  onEnter: () => void;
}

// A simple component to generate random floating sparks for a magical effect
const Spark: React.FC = () => {
    const style = {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 2 + 1}px`,
      height: `${Math.random() * 2 + 1}px`,
      animationDelay: `${Math.random() * 4}s`,
      animationDuration: `${Math.random() * 2 + 3}s`,
    };
    return <div className="absolute rounded-full bg-white/80 animate-float-up" style={style}></div>;
};

const WelcomeIntro: React.FC<WelcomeIntroProps> = ({ isVisible, onEnter }) => {
  const [showContent, setShowContent] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 1000); // Delay for the text and button to appear
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleEnterClick = () => {
    setIsFadingOut(true);
    // onEnter will be called after the fade-out animation completes
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#aed5e8] transition-opacity duration-700 ease-in-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
      onTransitionEnd={() => {
        if (isFadingOut) {
          onEnter();
        }
      }}
      aria-hidden={!isVisible}
    >
      <div className="relative w-full h-full max-w-lg max-h-lg flex items-center justify-center">
        {/* Layer 1: Background Elements (Client's Body) */}
        <img
          src="https://i.ibb.co/L5rQJbH/client-body.png"
          alt=""
          className="absolute w-[80%] h-auto object-contain animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        />

        {/* Layer 2: Artist's Arm and Machine */}
        <img
          src="https://i.ibb.co/C09H7C9/artist-arm.png"
          alt=""
          className="absolute w-[80%] h-auto object-contain animate-fade-in animate-vibrate-subtle"
          style={{ animationDelay: '0.4s' }}
        />
        
        {/* Sparks container */}
        <div className="absolute w-[80%] h-[80%] animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {Array.from({ length: 25 }).map((_, i) => <Spark key={i} />)}
        </div>
      </div>

      {/* Text and Button Container */}
      <div
        className={`absolute bottom-10 left-4 right-4 text-center transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="[filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.4))]">
          <h1 className="font-script text-white text-5xl sm:text-6xl">
            Beautively Inked
          </h1>
          <p className="mt-2 text-white/90 text-sm">
            Where your story becomes art.
          </p>
          <button
            onClick={handleEnterClick}
            className="mt-6 border-2 border-white text-white px-10 py-3 rounded-full text-sm font-bold hover:bg-white hover:text-brand-dark transition-all duration-300 transform hover:scale-105"
          >
            Enter Studio
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeIntro;