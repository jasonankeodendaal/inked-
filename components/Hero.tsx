import React, { useState } from 'react';
import { PortfolioItem } from '../App';
import PortfolioModal from './PortfolioModal';
import SearchIcon from './icons/SearchIcon';

interface HeroProps {
  portfolioData: PortfolioItem[];
  onNavigate: (view: 'home' | 'admin') => void;
}

const Hero: React.FC<HeroProps> = ({ portfolioData, onNavigate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const handleImageClick = (item: PortfolioItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Delay clearing the item to allow for the closing animation
    setTimeout(() => setSelectedItem(null), 500);
  };
  
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (!href) return;

    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featuredItems = portfolioData.filter(item => item.featured);
  // Use featured items if available, otherwise fall back to the first 6 portfolio items to ensure the carousel is not empty.
  const itemsForCarousel = featuredItems.length > 0 ? featuredItems : portfolioData.slice(0, 6);
  // Duplicate the array for a seamless infinite scroll effect
  const allPortfolioItems = itemsForCarousel.length > 0 ? [...itemsForCarousel, ...itemsForCarousel] : [];


  return (
    <>
      <section className="relative h-screen bg-brand-dark text-brand-light overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-full z-0 bg-gradient-to-t from-brand-dark via-brand-dark/70 to-transparent"></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] z-20 w-full text-center px-4 [filter:drop-shadow(0_5px_8px_rgba(0,0,0,1))]">
          <div className="relative">
            <img 
                src="https://i.ibb.co/Mkfdy286/image-removebg-preview.png"
                alt="Tattoo machine"
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25rem] sm:w-[35rem] md:w-[40rem] lg:w-[50rem] max-w-none h-auto opacity-30 lg:opacity-40 transform rotate-[5deg] pointer-events-none [filter:brightness(1.2)_contrast(1.2)_saturate(1.1)_drop_shadow(0_35px_30px_rgba(0,0,0,0.9))]"
            />
            <h1 
              className="relative z-10 font-script text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-tight tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-100"
              style={{
                  textShadow: `
                    0px 2px 2px rgba(0,0,0,0.7),
                    0px 4px 4px rgba(0,0,0,0.5),
                    0px 8px 12px rgba(0,0,0,0.4)
                  `
              }}
            >
              Where your story becomes art.
            </h1>
            <p className="relative z-10 mt-6 max-w-lg mx-auto text-gray-400 text-sm sm:text-base">
              Bold decisions, permanent stories. Premium, beautiful ink for the unapologetic.
            </p>
            <div className="relative z-10 mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#contact-form" onClick={handleLinkClick} className="w-full sm:w-auto bg-brand-green border border-brand-green text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-full text-sm font-semibold hover:bg-opacity-80 transition-colors">
                Book an Appointment
              </a>
              <a href="#showroom" onClick={handleLinkClick} className="w-full sm:w-auto border border-brand-light/50 px-6 py-2.5 sm:px-8 sm:py-3 rounded-full text-sm font-semibold hover:bg-brand-light hover:text-brand-dark transition-colors">
                Visit the Showroom
              </a>
            </div>
            <div className="relative z-10 mt-16 sm:mt-24">
              <div className="flex items-center justify-center gap-4 text-white/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 animate-bounce-horizontal-reverse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <span className="text-xs font-semibold tracking-widest">EXPLORE OUR WORK</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 animate-bounce-horizontal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
          </div>
          </div>
        </div>
        
        <div className="absolute top-[56%] sm:top-[62%] md:top-[60%] left-0 w-full h-[60%] z-10 [perspective:1000px]">
          <div className="absolute top-0 w-full h-full [transform-style:preserve-3d] [transform:rotateX(55deg)] md:[transform:rotateX(50deg)]">
            <div className="absolute h-full w-max flex animate-infinite-scroll group">
              {allPortfolioItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="w-[140px] h-[210px] sm:w-[180px] h-[270px] md:w-[250px] md:h-[350px] m-1 sm:m-3 md:m-4 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 flex-shrink-0 transition-all duration-300 hover:!scale-110 relative hover:shadow-white/10">
                  <button 
                    onClick={() => handleImageClick(item)} 
                    className="w-full h-full block"
                    aria-label={`View details for ${item.title}`}
                  >
                    {item.videoData ? (
                      <video 
                        src={item.videoData} 
                        className="w-full h-full object-cover" 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                      />
                    ) : (
                      <img src={item.primaryImage} alt={item.title} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <SearchIcon className="w-12 h-12 text-white/80" />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,_transparent_40%,_#0a0a0a_90%)] z-30 pointer-events-none"></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[150%] bg-[radial-gradient(ellipse_at_center,_rgba(200,200,200,0.05)_0%,rgba(10,10,10,0)_60%)] z-0 pointer-events-none"></div>

      </section>

      {selectedItem && (
        <PortfolioModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          item={selectedItem}
        />
      )}
    </>
  );
};

export default Hero;