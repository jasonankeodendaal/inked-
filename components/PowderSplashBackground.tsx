import React from 'react';

const PowderSplashBackground: React.FC = () => {
  const backgroundStyle: React.CSSProperties = {
    position: 'absolute',
    inset: '0px',
    backgroundImage: `
      radial-gradient(at 20% 15%, hsla(300, 70%, 80%, 0.2) 0px, transparent 50%),
      radial-gradient(at 80% 25%, hsla(60, 70%, 80%, 0.2) 0px, transparent 50%),
      radial-gradient(at 10% 85%, hsla(150, 70%, 80%, 0.2) 0px, transparent 50%),
      radial-gradient(at 75% 90%, hsla(340, 70%, 85%, 0.25) 0px, transparent 50%),
      radial-gradient(at 50% 50%, hsla(240, 70%, 80%, 0.15) 0px, transparent 50%)
    `,
    filter: 'blur(60px)',
    pointerEvents: 'none',
    zIndex: 0,
    transform: 'translateZ(0)', // Promotes the element to its own compositing layer for performance
  };

  return <div style={backgroundStyle} aria-hidden="true" />;
};

export default PowderSplashBackground;
