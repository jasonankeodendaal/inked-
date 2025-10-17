import React, { useState } from 'react';
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
  return (
    <div className="transform transition-transform duration-300 hover:scale-105 group">
      <button
        onClick={onClick}
        className="block w-full p-2 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 relative aspect-square"
        aria-label={`View details for ${item.title}`}
      >
        <div className="absolute inset-2 rounded-lg overflow-hidden bg-black">
          {item.videoUrl ? (
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src={item.videoUrl} type={getMimeType(item.videoUrl)} />
            </video>
          ) : (
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
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
      <section id="showroom" className="bg-stone-100 py-16 sm:py-20">
        <div className="container mx-auto px-4 text-brand-dark">
          <div className="max-w-4xl mb-12 text-center mx-auto">
            <h2 className="font-script text-4xl sm:text-6xl mb-4">
              {showroomTitle}
            </h2>
            <p className="text-gray-600 text-lg">
             {showroomDescription}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
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