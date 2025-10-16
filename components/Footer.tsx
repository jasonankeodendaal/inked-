import React from 'react';
import { SocialLink } from '../App';

interface FooterProps {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  socialLinks: SocialLink[];
}

const Footer: React.FC<FooterProps> = ({ companyName, address, phone, email, socialLinks }) => {
  return (
    <footer className="bg-brand-off-white text-brand-dark border-t border-gray-200 py-10 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
          <div>
            <h3 className="font-bold text-lg tracking-wider uppercase mb-4">{companyName.replace(' Tattoo Studio', '')}</h3>
            <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} {companyName}. All Rights Reserved.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Contact Us</h4>
            <address className="not-italic text-sm text-gray-600 space-y-2">
              <p>{address}</p>
              <p><a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-brand-green transition-colors">{phone}</a></p>
              <p><a href={`mailto:${email}`} className="hover:text-brand-green transition-colors">{email}</a></p>
            </address>
          </div>
           <div>
            <h4 className="font-semibold text-gray-800 mb-3">Follow Us</h4>
            {socialLinks.length > 0 ? (
                <div className="flex justify-center md:justify-start items-center gap-4">
                  {socialLinks.map(link => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-brand-green transition-colors">
                      <img src={link.icon} alt="Social media icon" className="w-6 h-6 object-contain" />
                    </a>
                  ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500">Social links not set.</p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;