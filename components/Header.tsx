// FIX: Add missing React import
import React, { useState, MouseEvent } from 'react';
import MenuIcon from './icons/MenuIcon';
import XIcon from './icons/XIcon';

interface HeaderProps {
  onNavigate: (view: 'home' | 'admin') => void;
  logoUrl: string;
  companyName: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, logoUrl, companyName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollingTextContent = (`${companyName} • `).repeat(5);

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, view?: 'home' | 'admin') => {
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
        <div className="flex justify-between items-center h-20 md:h-24">
          <a href="#" onClick={(e) => handleLinkClick(e, 'home')} className="flex items-center gap-3" aria-label="Beautively Inked Home">
            <img src={logoUrl} alt="Beautively Inked Logo" className="h-16 w-16 md:h-20 md:w-20 object-contain" />
          </a>
          
          {/* Scrolling Ticker */}
          <div className="flex-1 mx-4 sm:mx-8 overflow-hidden">
            <div className="w-max flex animate-text-scroll transform-gpu">
                <p className="font-script text-white/70 whitespace-nowrap tracking-widest">
                    {scrollingTextContent} {scrollingTextContent}
                </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <a href="#" onClick={(e) => handleLinkClick(e, 'admin')} className="hidden md:block text-xs text-gray-500 hover:text-brand-light transition-colors">
                Admin
            </a>
            <a href="#contact-form" onClick={handleLinkClick} className="hidden sm:block border border-brand-light/50 px-6 py-2 rounded-full text-sm font-semibold hover:bg-brand-light hover:text-brand-dark transition-colors">
              Book Appointment
            </a>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden z-50 text-brand-light"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <XIcon className="w-8 h-8" /> : <MenuIcon className="w-8 h-8" />}
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