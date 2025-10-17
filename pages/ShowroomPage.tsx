
import React, { useState, useEffect, useRef } from 'react';
import { Genre, ShowroomItem, PortfolioItem } from '../App';
import PortfolioModal from '../components/PortfolioModal';

const getMimeType = (url: string): string => {
    if (url.startsWith('data:')) {
        const mime = url.substring(5, url.indexOf(';'));
        return mime || 'video/mp4';
    }
    const extension = url.split(/[#?]/)[0].split('.').pop()?.trim().toLowerCase();
    switch (extension) {
        case 'mp4': return 'video/mp4';
        case 'webm': return 'video/webm';
        case 'ogg': return 'video/ogg';
        default: return 'video/mp4';
    }
};

interface ShowroomProps {
  showroomData: Genre[];
  showroomTitle: string;
  showroomDescription: string;
}

const ShowroomGridItem: React.FC<{ item: ShowroomItem, onClick: () => void }> = ({ item, onClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      },
      {
        rootMargin: '0px 0px 300px 0px', // Load when 300px away from viewport bottom
      }
    );
    
    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    // Start carousel only when visible and if it's an image gallery
    if (!shouldLoad || !item.images || item.images.length <= 1 || item.videoUrl) {
      return;
    }
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % item.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [shouldLoad, item.videoUrl, item.images]);
  
  const hasVideo = !!item.videoUrl;

  return (
    <div ref={containerRef} className="transform transition-transform duration-300 hover:scale-105 group">
      <button
        onClick={onClick}
        className="block w-full p-0.5 bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 relative aspect-square"
        aria-label={`View details for ${item.title}`}
      >
        <div className="absolute inset-0.5 rounded-md overflow-hidden bg-black">
          {hasVideo && shouldLoad && isMediaLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
          {hasVideo ? (
            <video
              poster={item.images && item.images.length > 0 ? item.images[0] : ''}
              className={`w-full h-full object-cover transition-opacity duration-300 ${isMediaLoading && shouldLoad ? 'opacity-0' : 'opacity-100'}`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onCanPlayThrough={() => setIsMediaLoading(false)}
              onWaiting={() => setIsMediaLoading(true)}
            >
              {shouldLoad && <source src={item.videoUrl} type={getMimeType(item.videoUrl)} />}
            </video>
          ) : (
            <div className="relative w-full h-full">
              {item.images.map((src, index) => (
                <img
                  key={`${item.id}-img-${index}`}
                  src={src}
                  alt={`${item.title} preview ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>
      </button>
    </div>
  );
};

const Showroom: React.FC<ShowroomProps> = ({ showroomData, showroomTitle, showroomDescription }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShowroomItem | null>(null);

  const handleImageClick = (item: ShowroomItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 500);
  };
  
  // Create a PortfolioItem-like object for the modal
  const adaptShowroomItemForModal = (item: ShowroomItem): PortfolioItem => {
    return {
        id: item.id,
        title: item.title,
        story: "This is a flash design from our showroom. Contact us to book this piece or a similar concept!",
        primaryImage: item.images[0],
        galleryImages: item.images.slice(1),
        videoData: item.videoUrl,
    };
  };

  const allItems = showroomData.flatMap(genre => genre.items)
    .filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));

  if (allItems.length === 0) return null;

  return (
    <>
      <section id="showroom" className="bg-stone-100 py-12 sm:py-16">
        <div className="container mx-auto px-4 text-brand-dark">
          <div className="max-w-4xl mb-8 text-center mx-auto">
            <h2 className="font-script text-4xl sm:text-6xl mb-4">
              {showroomTitle}
            </h2>
            <p className="text-gray-600 text-lg">
             {showroomDescription}
            </p>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-15 gap-1 sm:gap-2">
              {allItems.map((item) => (
                 <ShowroomGridItem 
                    key={item.id} 
                    item={item} 
                    onClick={() => handleImageClick(item)} 
                />
              ))}
            </div>

        </div>
      </section>

      {selectedItem && (
        <PortfolioModal
          isOpen={isModalOpen}
          onClose={closeModal}
          item={adaptShowroomItemForModal(selectedItem)}
        />
      )}
    </>
  );
};

export default Showroom;
