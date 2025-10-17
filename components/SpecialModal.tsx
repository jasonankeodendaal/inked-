import React, { useState, useEffect, useCallback } from 'react';
import { SpecialItem } from '../App';
import FullScreenImageViewer from './FullScreenImageViewer';

interface SpecialModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: SpecialItem;
  createWhatsAppLink: (item: SpecialItem) => string;
}

const SpecialModal: React.FC<SpecialModalProps> = ({ isOpen, onClose, item, createWhatsAppLink }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Animation duration
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (fullScreenImage) {
          setFullScreenImage(null);
        } else {
          handleClose();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, fullScreenImage]);

  if (!isOpen && !isClosing) return null;

  const modalAnimation = isOpen && !isClosing ? 'opacity-100' : 'opacity-0';
  const contentAnimation = isOpen && !isClosing ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4';

  const formatPrice = (item: SpecialItem) => {
    switch (item.priceType) {
      case 'fixed':
        return <><span className="text-4xl font-bold">R{item.priceValue}</span><span className="text-gray-500">/fixed</span></>;
      case 'hourly':
        return <><span className="text-4xl font-bold">R{item.priceValue}</span><span className="text-gray-500">/hr</span></>;
      case 'percentage':
        return <><span className="text-4xl font-bold">{item.priceValue}%</span><span className="text-gray-500"> OFF</span></>;
      default:
        return <span className="text-2xl font-bold">Inquire</span>;
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ease-out ${modalAnimation}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="special-title"
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md"></div>

      <button onClick={handleClose} className="absolute top-4 right-4 z-20 p-2 text-2xl text-white/70 hover:text-white transition-colors" aria-label="Close dialog">
        <span role="img" aria-label="close">✖️</span>
      </button>

      <div 
        className={`relative z-10 w-full max-w-md bg-brand-off-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-out ${contentAnimation}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-h-[85vh] flex flex-col">
          <div className="relative flex-shrink-0">
            <button onClick={() => setFullScreenImage(item.imageUrl)} className="w-full h-48 block cursor-zoom-in" aria-label="View image in full screen">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover pointer-events-none"/>
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h2 id="special-title" className="font-script text-4xl text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">{item.title}</h2>
            </div>
          </div>
          
          <div className="p-6 flex-grow overflow-y-auto text-brand-dark">
            <p className="text-gray-600 mb-6">{item.description}</p>
            
            <div className="bg-gray-100 rounded-lg p-4 my-4 text-center">
              {formatPrice(item)}
            </div>

            {item.details && item.details.length > 0 && (
              <>
                <h4 className="font-bold text-gray-800 mt-6 mb-2">What's Included:</h4>
                <ul className="space-y-2 text-left text-gray-700 my-4 text-sm">
                  {item.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span role="img" aria-label="check mark" className="flex-shrink-0 mt-0.5">✨</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {item.voucherCode && (
                <div className="my-4 border-2 border-dashed border-yellow-400 bg-yellow-50 rounded-lg p-3">
                    <p className="flex items-center justify-center gap-2 text-yellow-800 text-sm font-semibold">
                        <span role="img" aria-label="tag">🏷️</span>
                        <span>Voucher Code: {item.voucherCode}</span>
                    </p>
                </div>
            )}
          </div>
          
          <div className="p-6 border-t border-gray-200 mt-auto flex-shrink-0">
             <a 
                href={createWhatsAppLink(item)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-800 px-4 py-3 rounded-full font-semibold hover:bg-yellow-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                aria-label={`Inquire about ${item.title} on WhatsApp`}
            >
                <span role="img" aria-label="WhatsApp icon">⭐</span>
                Inquire on WhatsApp
            </a>
          </div>
        </div>
      </div>
      {fullScreenImage && (
        <FullScreenImageViewer
          src={fullScreenImage}
          alt={item.title}
          onClose={() => setFullScreenImage(null)}
        />
      )}
    </div>
  );
};

export default SpecialModal;