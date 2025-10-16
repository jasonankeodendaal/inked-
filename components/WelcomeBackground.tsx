import React from 'react';
import * as TattooIcons from './icons/TattooFlashIcons';

const icons = Object.values(TattooIcons);

const gridItems = Array.from({ length: 400 }).map((_, i) => {
  const Icon = icons[Math.floor(Math.random() * icons.length)];
  const rotation = -30 + Math.random() * 60;
  const scale = 0.7 + Math.random() * 0.6; // Scale between 0.7 and 1.3
  return {
    id: i,
    Icon,
    style: {
      transform: `rotate(${rotation}deg) scale(${scale})`,
    },
  };
});


const WelcomeBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-brand-dark" aria-hidden="true">
      <div 
        className="absolute inset-[-20%] w-[140%] h-[140%] grid gap-4 opacity-10 animate-subtle-pan"
        style={{ gridTemplateColumns: 'repeat(20, minmax(0, 1fr))' }}
      >
        {gridItems.map(({ id, Icon, style }) => (
          <div key={id} style={style} className="flex items-center justify-center p-2">
            <Icon className="w-24 h-24 text-brand-off-white" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_#0a0a0a_85%)]"></div>
    </div>
  );
};

export default WelcomeBackground;