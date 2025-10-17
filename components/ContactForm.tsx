import React, { useState } from 'react';
import { Booking } from '../App';

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

interface ContactFormProps {
    onAddBooking: (booking: Omit<Booking, 'id' | 'status' | 'bookingType'>) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onAddBooking }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [contactMethod, setContactMethod] = useState<'email' | 'whatsapp'>('email');
  const [message, setMessage] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const [referenceImagePreviews, setReferenceImagePreviews] = useState<string[]>([]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            setErrorMessage("You can only upload a maximum of 5 images.");
            e.target.value = ''; // Clear the input
            return;
        }
        setReferenceImages(files);
        try {
            const dataUrls = await Promise.all(files.map(fileToDataUrl));
            setReferenceImagePreviews(dataUrls);
        } catch (error) {
            console.error("Error creating image previews:", error);
            setReferenceImagePreviews([]);
        }
    } else {
        setReferenceImages([]);
        setReferenceImagePreviews([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message || !bookingDate) {
      setErrorMessage('Please fill out all required fields to request a booking.');
      return;
    }
    if (contactMethod === 'whatsapp' && !whatsappNumber) {
      setErrorMessage('Please provide your WhatsApp number if you prefer to be contacted that way.');
      return;
    }
    
    let referenceImageDataUrls: string[] = [];
    if (referenceImages.length > 0) {
        try {
            referenceImageDataUrls = await Promise.all(referenceImages.map(fileToDataUrl));
        } catch (error) {
            console.error("Error processing images:", error);
            setErrorMessage('There was an error processing your images. Please try again.');
            return;
        }
    }

    onAddBooking({ name, email, message, bookingDate, whatsappNumber, contactMethod, referenceImages: referenceImageDataUrls });
    
    // Reset form and show success message
    setName('');
    setEmail('');
    setWhatsappNumber('');
    setContactMethod('email');
    setMessage('');
    setBookingDate('');
    setReferenceImages([]);
    setReferenceImagePreviews([]);
    setErrorMessage('');
    setSuccessMessage('Your booking request has been sent! We will contact you shortly to confirm.');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <div className="bg-brand-dark">
        <div className="container mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-brand-dark via-white/10 to-brand-dark"></div>
        </div>
      </div>
      <section id="contact-form" className="bg-brand-dark py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                  <h2 className="font-script text-5xl sm:text-6xl mb-4">Get In Touch</h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">Have a question or ready to book your session? Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                  <div className="lg:mt-8 text-gray-300">
                      <div className="border-l-4 border-brand-gold pl-6">
                          <h4 className="font-bold text-2xl text-white mb-2">Our Process</h4>
                           <p className="text-sm leading-relaxed text-gray-400 mb-4">
                              Your journey with us is a partnership. It starts with your idea and ends with a piece of art you'll cherish forever.
                          </p>
                          <ol className="list-none space-y-3 text-sm">
                              <li className="flex items-start gap-3">
                                  <span className="font-bold text-brand-gold">1.</span>
                                  <span><strong>Submit Your Vision:</strong> Use this form to send us your initial concept.</span>
                              </li>
                              <li className="flex items-start gap-3">
                                  <span className="font-bold text-brand-gold">2.</span>
                                  <span><strong>Collaborate &amp; Refine:</strong> We'll contact you for a personal consultation to finalize the design, placement, and sizing.</span>
                              </li>
                              <li className="flex items-start gap-3">
                                  <span className="font-bold text-brand-gold">3.</span>
                                  <span><strong>Book Your Session:</strong> Once perfected, we'll provide a quote and secure your appointment date.</span>
                              </li>
                          </ol>
                      </div>
                       <div className="mt-10 border-l-4 border-brand-gold pl-6">
                          <h4 className="font-bold text-2xl text-white mb-2">Help Us See Your Vision</h4>
                          <p className="text-sm leading-relaxed text-gray-400 mb-4">
                              The more detail you provide, the better we can prepare for your consultation. Please include:
                          </p>
                           <ul className="list-none space-y-3 text-sm mt-4">
                              <li className="flex items-start gap-3">
                                  <span className="text-brand-gold mt-1">✨</span>
                                  <span><strong>Your Concept:</strong> A detailed description of your tattoo idea. What's the story or meaning behind it?</span>
                              </li>
                              <li className="flex items-start gap-3">
                                  <span className="text-brand-gold mt-1">✨</span>
                                  <span><strong>Placement &amp; Size:</strong> Where on your body do you want it, and what's the approximate size in cm?</span>
                              </li>
                              <li className="flex items-start gap-3">
                                  <span className="text-brand-gold mt-1">✨</span>
                                  <span><strong>Inspiration:</strong> Upload any reference images that have caught your eye.</span>
                              </li>
                           </ul>
                      </div>
                  </div>
                  
                  {/* 3D Form Container */}
                  <div className="relative w-full [perspective:1000px]">
                      {/* Lid */}
                      <div className="absolute -top-12 left-0 w-full h-24 bg-[#1a1a1a] rounded-t-xl border-t border-x border-white/10 [transform:rotateX(25deg)] [transform-origin:bottom_center] shadow-2xl shadow-black/80">
                         <div className="w-1/3 h-2 bg-white/10 mx-auto mt-3 rounded-full"></div>
                      </div>

                      {/* Box Body */}
                      <div className="relative bg-[#101010] border border-white/10 rounded-xl shadow-2xl shadow-black/80">
                         {/* Inner Shadow for Depth */}
                         <div className="absolute inset-0 rounded-xl shadow-[inset_0_8px_15px_rgba(0,0,0,0.7)]"></div>
                         
                         <div className="relative p-8">
                            <h3 className="font-bold text-2xl mb-6 text-white text-center">Request a Booking</h3>
                            <form onSubmit={handleSubmit} className="space-y-6 text-left">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="w-full bg-brand-dark/80 border border-gray-700 rounded-lg p-3 text-white focus:ring-brand-gold focus:border-brand-gold shadow-inner shadow-black/50" required/>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="w-full bg-brand-dark/80 border border-gray-700 rounded-lg p-3 text-white focus:ring-brand-gold focus:border-brand-gold shadow-inner shadow-black/50" required/>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Preferred Contact Method</label>
                                    <div className="flex gap-1 rounded-lg bg-brand-dark/80 border border-gray-700 p-1 shadow-inner shadow-black/50">
                                        <button type="button" onClick={() => setContactMethod('email')} className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-colors ${contactMethod === 'email' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}>Email</button>
                                        <button type="button" onClick={() => setContactMethod('whatsapp')} className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-colors ${contactMethod === 'whatsapp' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}>WhatsApp</button>
                                    </div>
                                </div>

                                {contactMethod === 'whatsapp' && (
                                    <div className="animate-fade-in">
                                        <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-400 mb-2">WhatsApp Number</label>
                                        <input type="tel" id="whatsapp" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} placeholder="e.g. 27795904162" className="w-full bg-brand-dark/80 border border-gray-700 rounded-lg p-3 text-white focus:ring-brand-gold focus:border-brand-gold shadow-inner shadow-black/50" required/>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-400 mb-2">Preferred Date</label>
                                    <input type="date" id="bookingDate" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={today} className="w-full bg-brand-dark/80 border border-gray-700 rounded-lg p-3 text-white focus:ring-brand-gold focus:border-brand-gold shadow-inner shadow-black/50" required style={{ colorScheme: 'dark' }} />
                                </div>
                                <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                                <textarea id="message" rows={4} value={message} onChange={e => setMessage(e.target.value)} placeholder="Tell us about the tattoo you have in mind..." className="w-full bg-brand-dark/80 border border-gray-700 rounded-lg p-3 text-white focus:ring-brand-gold focus:border-brand-gold shadow-inner shadow-black/50" required></textarea>
                                </div>
                                <div>
                                    <label htmlFor="referenceImage" className="block text-sm font-medium text-gray-400 mb-2">Reference Images (Optional, up to 5)</label>
                                    <input type="file" id="referenceImage" multiple accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"/>
                                    {referenceImagePreviews.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {referenceImagePreviews.map((src, index) => (
                                                <img key={index} src={src} alt={`Preview ${index + 1}`} className="w-16 h-16 object-cover rounded-lg" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                {errorMessage && <p className="text-center text-red-400 text-sm">{errorMessage}</p>}
                                {successMessage && <p className="text-center text-yellow-400 text-sm">{successMessage}</p>}

                                <div>
                                <button type="submit" className="w-full bg-brand-gold text-white py-3 rounded-full font-bold text-lg hover:bg-opacity-80 transition-all duration-300 mt-2 transform hover:-translate-y-1 [filter:drop-shadow(0_4px_8px_rgba(234,179,8,0.3))]">
                                    Send Request
                                </button>
                                </div>
                            </form>
                         </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactForm;