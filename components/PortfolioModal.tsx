import React, { useState, useEffect, useCallback, MouseEvent, useRef } from 'react';
import { PortfolioItem } from '../App';
import FullScreenImageViewer from './FullScreenImageViewer';

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PortfolioItem;
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({ isOpen, onClose, item }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]); // Ref for video elements

  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url.split('?')[0]) || url.startsWith('data:video/');

  const allMedia = [item.primaryImage, ...item.galleryImages, item.videoData].filter(
    (media): media is string => !!media
  );
  
  // Reset refs when media items change
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, allMedia.length);
  }, [allMedia]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    const timer = setTimeout(() => {
      onClose();
      setIsClosing(false);
      setIsPaused(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const handleAnchorClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href) {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
    handleClose();
  };
  
  // Central navigation handler to pause videos before switching
  const handleNavigation = useCallback((newIndex: number) => {
    const oldVideoEl = videoRefs.current[currentIndex];
    if (oldVideoEl) {
        oldVideoEl.pause();
    }
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  const nextImage = useCallback(() => {
    handleNavigation((currentIndex + 1) % allMedia.length);
  }, [allMedia.length, currentIndex, handleNavigation]);

  const prevImage = useCallback(() => {
    handleNavigation((currentIndex - 1 + allMedia.length) % allMedia.length);
  }, [allMedia.length, currentIndex, handleNavigation]);
  
  const goToImage = (index: number) => {
    handleNavigation(index);
  };
  
  // Autoplay for image carousel
  useEffect(() => {
    if (isOpen && !isPaused && allMedia.length > 1 && !isVideo(allMedia[currentIndex])) {
      const autoplayTimer = setInterval(nextImage, 5000);
      return () => clearInterval(autoplayTimer);
    }
  }, [isOpen, currentIndex, isPaused, allMedia, nextImage]);
  
  // Programmatic autoplay for videos
  useEffect(() => {
    const videoEl = videoRefs.current[currentIndex];
    if (isOpen && videoEl) {
        videoEl.play().catch(error => {
            console.warn("Autoplay was prevented:", error);
            // The browser prevented autoplay. The user will need to press play manually.
            // The `controls` attribute ensures the play button is visible.
        });
    }
  }, [currentIndex, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (fullScreenImage) {
          setFullScreenImage(null);
        } else {
          handleClose();
        }
      }
      if (allMedia.length > 1) {
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, nextImage, prevImage, allMedia.length, fullScreenImage]);
  
  // Reset index when item changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [item]);

  // Reset loading state when item or index changes
  useEffect(() => {
      setIsMediaLoading(true);
  }, [currentIndex, item]);

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
          {/* Media Gallery */}
          <div 
            className="lg:col-span-3 bg-black/20 aspect-square lg:aspect-auto relative group overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {isMediaLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                <div className="w-10 h-10 border-4 border-white/50 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
            <div className="relative w-full h-full">
              {allMedia.map((src, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                  {isVideo(src) ? (
                     <video
                        ref={el => videoRefs.current[index] = el}
                        src={src}
                        poster={item.primaryImage}
                        className={`w-full h-full object-contain transition-opacity duration-500 ease-in-out ${isMediaLoading ? 'opacity-0' : 'opacity-100'}`}
                        controls
                        muted
                        playsInline
                        preload="metadata"
                        onPlay={() => setIsPaused(true)}
                        onPause={() => setIsPaused(true)}
                        onEnded={allMedia.length > 1 ? nextImage : undefined}
                        onCanPlayThrough={() => setIsMediaLoading(false)}
                        onWaiting={() => setIsMediaLoading(true)}
                      />
                  ) : (
                    <button
                      onClick={() => setFullScreenImage(src)}
                      className="absolute inset-0 w-full h-full p-0 border-0 bg-transparent cursor-zoom-in"
                      aria-label={`View image ${index + 1} in full screen`}
                    >
                      <img 
                          src={src} 
                          alt={`${item.title} - media ${index + 1}`} 
                          className="w-full h-full object-contain"
                          onLoad={() => { if (index === currentIndex) setIsMediaLoading(false); }}
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {allMedia.length > 1 && (
                <>
                    <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-2xl bg-black/50 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all duration-300" aria-label="Previous image">
                        &#x25C0;&#xFE0E;
                    </button>
                    <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-2xl bg-black/50 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all duration-300" aria-label="Next image">
                        &#x25B6;&#xFE0E;
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {allMedia.map((_, index) => (
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
                <a href="#contact-form" onClick={handleAnchorClick} className="w-full block text-center bg-brand-gold border border-brand-gold text-white px-8 py-3 rounded-full font-semibold hover:bg-opacity-80 transition-colors">
                    Get a Quote for a Similar Piece
                </a>
            </div>
          </div>
        </div>
      </div>
      {fullScreenImage && (
        <FullScreenImageViewer
          src={fullScreenImage}
          alt="Full screen view"
          onClose={() => setFullScreenImage(null)}
        />
      )}
    </div>
  );
};

export default PortfolioModal;
