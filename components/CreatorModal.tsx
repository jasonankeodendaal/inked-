import React, { useState, useEffect, useCallback } from 'react';

interface CreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatorModal: React.FC<CreatorModalProps> = ({ isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Animation duration
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  if (!isOpen && !isClosing) return null;

  const modalAnimation = isOpen && !isClosing ? 'opacity-100' : 'opacity-0';
  const contentAnimation = isOpen && !isClosing ? 'opacity-100 scale-100' : 'opacity-0 scale-95';

  const logoUrl = "https://i.ibb.co/TDC9Xn1N/JSTYP-me-Logo.png";
  const whatsAppNumber = "27695989427";
  const email = "jstypme@gmail.com";
  const whatsAppLink = `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent("Hi! I'm interested in your web development services.")}`;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ease-out ${modalAnimation}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="creator-title"
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md"></div>

      <button onClick={handleClose} className="absolute top-4 right-4 z-20 p-2 text-2xl text-white/70 hover:text-white transition-colors" aria-label="Close dialog">
        <span role="img" aria-label="close">✖️</span>
      </button>

      <div 
        className={`relative z-10 w-full max-w-sm bg-brand-off-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-out ${contentAnimation} text-brand-dark text-center`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
            <img src={logoUrl} alt="JSTYP.me Logo" className="w-32 h-32 mx-auto mb-4 object-contain" />
            <h2 id="creator-title" className="text-2xl font-bold">JSTYP.me</h2>
            <p className="text-gray-600 italic text-sm mt-1">"Jason's solution to your problems, yes me!"</p>
            
            <div className="mt-8 space-y-3">
                <a 
                    href={whatsAppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-full font-semibold hover:bg-green-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                    aria-label="Contact via WhatsApp"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16.6 7.4c-1-1-2.3-1.5-3.8-1.5s-2.8.5-3.8 1.5-1.5 2.3-1.5 3.8c0 1.2.4 2.4 1.1 3.4l-1.1 4 4-1.1c1 .7 2.2 1.1 3.4 1.1h.1c3 0 5.4-2.4 5.4-5.4-.1-1.5-.6-2.9-1.6-3.9zm-3.8 9.3h-.1c-1 0-2-.3-2.8-.9l-.2-.1-2.1.6.6-2-.1-.2c-.5-.8-.8-1.8-.8-2.8 0-2.3 1.9-4.2 4.2-4.2s4.2 1.9 4.2 4.2-1.8 4.2-4.2 4.2zm2.1-3.2c-.1-.1-1-.5-1.2-.6-.1-.1-.3-.1-.4.1s-.4.5-.5.6c-.1.1-.2.1-.4 0s-.8-.3-1.4-1c-.5-.5-.8-.9-1-1.1-.1-.1 0-.2.1-.3s.2-.2.3-.3c.1 0 .1-.1.2-.2.1-.1 0-.2-.1-.3-.1-.1-.4-1.1-.6-1.5-.2-.4-.3-.3-.4-.3h-.2c-.1 0-.3.1-.5.3s-.7.7-.7 1.7.7 2 1.5 2.8c.8.8 1.9 1.9 4.6 2.6.5.1 1 .2 1.3.2.5.1 1-.1 1.4-.4.4-.3.4-.7.3-.8s-.1-.2-.2-.2z"/></svg>
                    Contact on WhatsApp
                </a>
                <a 
                    href={`mailto:${email}`}
                    className="w-full bg-gray-100 border border-gray-300 text-gray-800 px-4 py-3 rounded-full font-semibold hover:bg-gray-700 hover:text-white transition-colors flex items-center justify-center gap-2"
                    aria-label="Send an Email"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>
                    Send an Email
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorModal;