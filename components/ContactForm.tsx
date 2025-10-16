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
    onAddBooking: (booking: Omit<Booking, 'id' | 'status' | 'bookingType'> & { referenceImage?: string }) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onAddBooking }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string>('');

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setReferenceImage(file);
        try {
            const dataUrl = await fileToDataUrl(file);
            setReferenceImagePreview(dataUrl);
        } catch (error) {
            console.error("Error creating image preview:", error);
            setReferenceImagePreview('');
        }
    } else {
        setReferenceImage(null);
        setReferenceImagePreview('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message || !bookingDate) {
      setErrorMessage('Please fill out all fields to request a booking.');
      return;
    }
    
    let referenceImageDataUrl: string | undefined = undefined;
    if (referenceImage) {
        try {
            referenceImageDataUrl = await fileToDataUrl(referenceImage);
        } catch (error) {
            console.error("Error processing image:", error);
            setErrorMessage('There was an error processing your image. Please try again.');
            return;
        }
    }

    onAddBooking({ name, email, message, bookingDate, referenceImage: referenceImageDataUrl });
    
    // Reset form and show success message
    setName('');
    setEmail('');
    setMessage('');
    setBookingDate('');
    setReferenceImage(null);
    setReferenceImagePreview('');
    setErrorMessage('');
    setSuccessMessage('Your booking request has been sent! We will contact you shortly to confirm.');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <section id="contact-form" className="bg-brand-dark py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="font-script text-5xl sm:text-6xl mb-4">Get In Touch</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">Have a question or ready to book your session? Fill out the form below and we'll get back to you as soon as possible.</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div className="lg:mt-8 text-gray-300">
                    <div className="border-l-4 border-brand-green pl-6">
                        <h4 className="font-bold text-2xl text-white mb-2">Our Process</h4>
                        <p className="text-sm leading-relaxed">
                            Booking an appointment is the first step. Once we receive your request, we'll reach out via email to schedule a consultation. This is where we'll discuss your ideas, placement, and sizing to give you an accurate quote and book your tattoo session.
                        </p>
                    </div>
                     <div className="mt-10 border-l-4 border-brand-green pl-6">
                        <h4 className="font-bold text-2xl text-white mb-2">What to Include</h4>
                         <ul className="list-none space-y-3 text-sm mt-4">
                            <li className="flex items-start gap-3">
                                <span className="text-brand-green mt-1">✔️</span>
                                <span>A detailed description of your tattoo idea.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-brand-green mt-1">✔️</span>
                                <span>Placement and approximate size (in cm).</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-brand-green mt-1">✔️</span>
                                <span>Any reference images you have for inspiration.</span>
                            </li>
                         </ul>
                    </div>
                </div>
                <div className="bg-black/20 border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50">
                    <h3 className="font-bold text-2xl mb-6 text-white text-center">Request a Booking</h3>
                    <form onSubmit={handleSubmit} className="space-y-6 text-left">
                        <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="w-full bg-brand-dark border border-gray-700 rounded-md p-3 focus:ring-brand-green focus:border-brand-green"/>
                        </div>
                        <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="w-full bg-brand-dark border border-gray-700 rounded-md p-3 focus:ring-brand-green focus:border-brand-green"/>
                        </div>
                        <div>
                            <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-400 mb-2">Preferred Date</label>
                            <input type="date" id="bookingDate" value={bookingDate} onChange={e => setBookingDate(e.target.value)} min={today} className="w-full bg-brand-dark border border-gray-700 rounded-md p-3 focus:ring-brand-green focus:border-brand-green" style={{ colorScheme: 'dark' }} />
                        </div>
                        <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                        <textarea id="message" rows={4} value={message} onChange={e => setMessage(e.target.value)} placeholder="Tell us about the tattoo you have in mind..." className="w-full bg-brand-dark border border-gray-700 rounded-md p-3 focus:ring-brand-green focus:border-brand-green"></textarea>
                        </div>
                        <div>
                            <label htmlFor="referenceImage" className="block text-sm font-medium text-gray-400 mb-2">Reference Image (Optional)</label>
                            <div className="flex items-center gap-4">
                                {referenceImagePreview && <img src={referenceImagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-md flex-shrink-0" />}
                                <input type="file" id="referenceImage" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"/>
                            </div>
                        </div>
                        
                        {errorMessage && <p className="text-center text-red-400 text-sm">{errorMessage}</p>}
                        {successMessage && <p className="text-center text-green-400 text-sm">{successMessage}</p>}

                        <div>
                        <button type="submit" className="w-full bg-brand-green text-white py-3 rounded-md font-bold text-lg hover:bg-opacity-80 transition-colors mt-2">
                            Send Request
                        </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;