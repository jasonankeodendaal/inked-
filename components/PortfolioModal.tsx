import React, { useState, useEffect, useCallback } from 'react';
import { PortfolioItem } from '../App';

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PortfolioItem;
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({ isOpen, onClose, item }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const allImages = [item.primaryImage, ...item.galleryImages].filter(Boolean);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    const timer = setTimeout(() => {
      onClose();
      setIsClosing(false);
      setIsPaused(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href) {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
    handleClose();
  };

  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);
  
  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };
  
  useEffect(() => {
    if (isOpen && !isPaused && allImages.length > 1) {
      const autoplayTimer = setInterval(nextImage, 5000);
      return () => clearInterval(autoplayTimer);
    }
  }, [isOpen, currentIndex, isPaused, allImages.length, nextImage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (allImages.length > 1) {
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, nextImage, prevImage, allImages.length]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [item]);

  if (!isOpen && !isClosing) return null;

  const modalAnimation = isOpen && !isClosing ? 'opacity-100' : 'opacity-0';
  const contentAnimation = isOpen && !isClosing ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4';

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-500 ease-in-out ${modalAnimation}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-title"
      onClick={handleClose}
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-lg"></div>

      <button onClick={handleClose} className="absolute top-4 right-4 z-20 p-2 text-2xl text-white/70 hover:text-white transition-colors" aria-label="Close dialog">
        &#x2715;
      </button>

      <div 
        className={`relative z-10 w-full max-w-6xl max-h-[90vh] transition-all duration-500 ease-in-out ${contentAnimation}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid lg:grid-cols-5 gap-6 md:gap-8 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
          {/* Image Gallery */}
          <div 
            className="lg:col-span-3 bg-black/20 aspect-square lg:aspect-auto relative group overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative w-full h-full">
              {allImages.map((src, index) => (
                <img 
                    key={`${item.id}-${index}`}
                    src={src} 
                    alt={`${item.title} - image ${index + 1}`} 
                    className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                />
              ))}
            </div>
            
            {allImages.length > 1 && (
                <>
                    <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-2xl bg-black/50 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all duration-300" aria-label="Previous image">
                        &#x25C0;&#xFE0E;
                    </button>
                    <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-2xl bg-black/50 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all duration-300" aria-label="Next image">
                        &#x25B6;&#xFE0E;
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {allImages.map((_, index) => (
                            <button key={index} onClick={() => goToImage(index)} className={`w-2.5 h-2.5 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/60'}`} aria-label={`Go to image ${index + 1}`}></button>
                        ))}
                    </div>
                </>
            )}
          </div>
          {/* Details */}
          <div className="lg:col-span-2 flex flex-col p-6 md:p-8 max-h-[90vh] lg:max-h-auto">
             <div className="flex-grow flex flex-col min-h-0">
                <h2 id="portfolio-title" className="font-script text-3xl md:text-5xl text-brand-light mb-4 flex-shrink-0">{item.title}</h2>
                <div className="w-16 h-px bg-white/20 mb-6 flex-shrink-0"></div>
                <div className="text-gray-300 leading-relaxed overflow-y-auto pr-2 flex-grow">
                    <p>{item.story}</p>
                </div>
            </div>
            <div className="mt-8 flex-shrink-0">
                <a href="#contact-form" onClick={handleAnchorClick} className="w-full block text-center bg-brand-green border border-brand-green text-white px-8 py-3 rounded-full font-semibold hover:bg-opacity-80 transition-colors">
                    Get a Quote for a Similar Piece
                </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioModal;