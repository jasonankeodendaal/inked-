import React, { useState } from 'react';

interface HeaderProps {
  onNavigate: (view: 'home' | 'admin') => void;
  logoUrl: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, logoUrl }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, view?: 'home' | 'admin') => {
    e.preventDefault();
    if (view) {
        onNavigate(view);
    } else {
        const href = e.currentTarget.getAttribute('href');
        if (href && href.startsWith('#')) {
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 text-brand-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-28 md:h-36">
          <a href="#" onClick={(e) => handleLinkClick(e, 'home')} className="flex items-center gap-3" aria-label="Beautively Inked Home">
            <img src={logoUrl} alt="Beautively Inked Logo" className="h-24 w-24 md:h-32 md:w-32 object-contain" />
          </a>
          
          <div className="flex items-center gap-4">
             <a href="#" onClick={(e) => handleLinkClick(e, 'admin')} className="hidden md:block text-xs text-gray-500 hover:text-brand-light transition-colors">
                Admin
            </a>
            <a href="#contact-form" onClick={handleLinkClick} className="border border-brand-light/50 px-6 py-2 rounded-full text-sm font-semibold hover:bg-brand-light hover:text-brand-dark transition-colors">
              Book Appointment
            </a>
            
            {/* Mobile Menu Button */}
            {/* FIX: Replaced SVG icons with emojis */}
            <button 
              className="md:hidden z-50 text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? '✖️' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-brand-dark z-40 flex flex-col items-center justify-center text-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="space-y-6">
             <a href="#contact-form" onClick={handleLinkClick} className="block border border-brand-light/50 px-8 py-3 rounded-full text-lg font-semibold hover:bg-brand-light hover:text-brand-dark transition-colors">
                Book Appointment
            </a>
             <a href="#" onClick={(e) => handleLinkClick(e, 'admin')} className="block text-gray-400 hover:text-brand-light transition-colors mt-6">
                Admin Login
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;