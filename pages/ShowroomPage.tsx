
import React, { useState } from 'react';
import { Genre, PortfolioItem } from '../App';
import PortfolioModal from '../components/PortfolioModal';

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

  // Get all items and filter for uniqueness, in case genres share items
  const allItems = showroomData.flatMap(genre => genre.items)
    .filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));

  if (allItems.length === 0) return null; // Handle empty state gracefully

  return (
    <>
      <section id="showroom" className="bg-stone-100 py-16 sm:py-20">
        <div className="container mx-auto px-4 text-brand-dark">
          <div className="max-w-4xl mb-12 text-center mx-auto">
            <h2 className="font-script text-4xl sm:text-6xl mb-4">
              The Flash Wall
            </h2>
            <p className="text-gray-600 text-lg">
             A curated collection of our work, showcasing the skill, diversity, and passion we bring to every piece.
            </p>
          </div>

          {/* NEW UNIFIED GALLERY GRID LAYOUT */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {allItems.map((item) => (
                <div key={item.id} className="transform transition-transform duration-300 hover:scale-105">
                  <button
                    onClick={() => handleImageClick(item)}
                    className="block w-full p-2 bg-white rounded-md shadow-lg hover:shadow-2xl transition-shadow duration-300"
                    aria-label={`View details for ${item.title}`}
                  >
                    <div className="aspect-square rounded-sm overflow-hidden">
                      <img
                        src={item.primaryImage}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </button>
                </div>
              ))}
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
