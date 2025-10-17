import React, { useState } from 'react';
import { SpecialItem } from '../App';
import SpecialModal from './SpecialModal';
import PowderSplashBackground from './PowderSplashBackground';

interface SpecialsCollageProps {
  specials: SpecialItem[];
  whatsAppNumber: string;
}

const SpecialsCollage: React.FC<SpecialsCollageProps> = ({ specials, whatsAppNumber }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpecial, setSelectedSpecial] = useState<SpecialItem | null>(null);

  const openModal = (special: SpecialItem) => {
    setSelectedSpecial(special);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedSpecial(null), 500); // Delay for closing animation
  };

  if (!specials || specials.length === 0) {
    return null;
  }

  const createWhatsAppLink = (item: SpecialItem) => {
    let message = `Hi! I'm interested in the following special:\n\n`;
    message += `*Title:* ${item.title}\n`;
    message += `*Description:* ${item.description}\n`;
    
    let priceInfo = "Price: Inquire";
    switch (item.priceType) {
      case 'fixed':
        priceInfo = `*Price:* R${item.priceValue} (fixed)`;
        break;
      case 'hourly':
        priceInfo = `*Price:* R${item.priceValue}/hr`;
        break;
      case 'percentage':
        priceInfo = `*Discount:* ${item.priceValue}% OFF`;
        break;
    }
    message += `${priceInfo}\n`;

    if (item.details && item.details.length > 0) {
        message += `\n*Details:*\n`;
        item.details.forEach(detail => {
            message += `• ${detail}\n`;
        });
    }

    if (item.voucherCode) {
        message += `\n*Voucher Code:* ${item.voucherCode}\n`;
    }

    message += `\nCan you please provide more information on booking?`;
    
    return `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(message)}`;
  };

  const formatPrice = (item: SpecialItem) => {
    switch (item.priceType) {
      case 'fixed':
        return <><span className="text-3xl font-bold">R{item.priceValue}</span><span className="text-gray-500 text-sm">/fixed</span></>;
      case 'hourly':
        return <><span className="text-3xl font-bold">R{item.priceValue}</span><span className="text-gray-500 text-sm">/hr</span></>;
      case 'percentage':
        return <><span className="text-3xl font-bold">{item.priceValue}%</span><span className="text-gray-500 text-sm"> OFF</span></>;
      default:
        return <span className="text-xl font-bold">Inquire</span>;
    }
  };

  return (
    <>
      <section className="relative bg-brand-light text-brand-dark py-16 sm:py-20 overflow-hidden">
        <PowderSplashBackground />
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-script text-5xl md:text-6xl mb-4">Current Designs & Specials</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Limited-time offers and flash designs. Inquire via WhatsApp for details and booking.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 items-stretch">
              {specials.map((special) => (
                  <div key={special.id} className="bg-brand-off-white/80 backdrop-blur-sm border border-gray-200 shadow-xl shadow-black/10 rounded-lg flex flex-col h-full text-center group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20">
                      <div className="p-4 flex-grow flex flex-col">
                        <h3 className="font-script text-2xl text-brand-dark mb-2">{special.title}</h3>
                        <p className="text-gray-500 mb-4 text-xs flex-grow">{special.description}</p>
                        
                        <div className="bg-gray-100 rounded-lg p-2 my-2">
                            {formatPrice(special)}
                        </div>

                        {special.voucherCode && (
                          <div className="my-2 border-2 border-dashed border-yellow-400 bg-yellow-100 rounded-lg p-2">
                              <p className="flex items-center justify-center gap-2 text-yellow-800 text-xs font-semibold">
                                  <span role="img" aria-label="tag">🏷️</span>
                                  <span>{special.voucherCode}</span>
                              </p>
                          </div>
                        )}
                      </div>

                      <div className="p-4 border-t border-gray-200 space-y-2">
                          <button 
                            onClick={() => openModal(special)}
                            className="w-full bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-xs font-semibold hover:bg-gray-200 transition-colors"
                          >
                            View Details
                          </button>
                          <a 
                              href={createWhatsAppLink(special)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-800 px-4 py-2 rounded-full text-xs font-semibold hover:bg-yellow-500 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                              aria-label={`Inquire about ${special.title} on WhatsApp`}
                          >
                              <span role="img" aria-label="WhatsApp icon">⭐</span>
                              Inquire Now
                          </a>
                      </div>
                  </div>
              ))}
          </div>
        </div>
      </section>

      {selectedSpecial && (
        <SpecialModal
          isOpen={isModalOpen}
          onClose={closeModal}
          item={selectedSpecial}
          createWhatsAppLink={createWhatsAppLink}
        />
      )}
    </>
  );
};

export default SpecialsCollage;