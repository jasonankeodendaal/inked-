import React, { useState } from 'react';
import { Genre, PortfolioItem } from '../App';
import PortfolioModal from '../components/PortfolioModal';
import PowderSplashBackground from '../components/PowderSplashBackground';

interface ShowroomProps {
  showroomData: Genre[];
}

const Showroom: React.FC<ShowroomProps> = ({ showroomData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const handleImageClick = (item: PortfolioItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 500);
  };
  
  const allItems = showroomData.flatMap(genre => genre.items);


  return (
    <>
      <section id="showroom" className="relative bg-brand-light py-16 sm:py-20 overflow-hidden">
        
        <PowderSplashBackground />

        <div className="relative z-10 container mx-auto px-4 text-brand-dark">
          <div className="max-w-4xl mb-12 text-center mx-auto">
            <h2 className="font-script text-4xl sm:text-6xl mb-4">
              The Flash Wall
            </h2>
            <p className="text-gray-600 text-lg">
             A curated collection of our work, showcasing the skill, diversity, and passion we bring to every piece.
            </p>
          </div>
          
          {/* The Room Container */}
          <div className="relative h-[80vh] max-h-[700px] w-full [perspective:1200px]">
            {/* Floor */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gray-300/50 [transform:rotateX(80deg)] origin-bottom" style={{ backgroundImage: "radial-gradient(ellipse at top, rgba(255,255,255,0.5) 0%, transparent 60%)" }}></div>

            {/* Back Wall with Art */}
            <div className="absolute inset-0 bg-repeat bg-center [transform:translateZ(-250px)] [box-shadow:inset_0_0_80px_20px_rgba(0,0,0,0.3)] bg-white/50" style={{ backgroundImage: "url('https://www.toptal.com/designers/subtlepatterns/uploads/light-grey-terrazzo.png')" }}>
              <div className="absolute inset-0 bg-gradient-to-t from-brand-light/80 via-transparent to-brand-light/80"></div>
              <div className="p-4 sm:p-6 md:p-10 h-full overflow-y-auto">
                 <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-10 gap-2 md:gap-4">
                    {allItems.map((item) => (
                        <div
                          key={item.id}
                          className="group relative bg-brand-off-white/80 backdrop-blur-sm p-1 pb-1.5 shadow-xl shadow-gray-500/60 rounded-sm transition-all duration-300 ease-in-out hover:scale-125 hover:z-20 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/40"
                        >
                          <button
                            onClick={() => handleImageClick(item)}
                            className="w-full h-full block aspect-square overflow-hidden bg-gray-200"
                            aria-label={`View details for ${item.title}`}
                          >
                            {item.videoData ? (
                              <video 
                                src={item.videoData} 
                                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" 
                                autoPlay 
                                loop 
                                muted 
                                playsInline
                              />
                            ) : (
                              <img
                                src={item.primaryImage}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                                loading="lazy"
                              />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <h4 className="text-white text-[8px] sm:text-[10px] font-bold text-center translate-y-2 group-hover:translate-y-0 transition-transform duration-300 drop-shadow-sm">{item.title}</h4>
                            </div>
                          </button>
                        </div>
                    ))}
                </div>
              </div>
            </div>
            
            {/* Spotlight Effect */}
            <div className="absolute -top-1/2 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_rgba(0,0,0,0.05)_0%,transparent_50%)] pointer-events-none z-10"></div>
            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,#e0e0e0_95%)] pointer-events-none z-20"></div>

          </div>
        </div>
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

export default Showroom;