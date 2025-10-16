import React from 'react';

const AboutUs: React.FC = () => {
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about-us" className="relative bg-brand-dark py-24 sm:py-32 overflow-hidden">
      <div 
        className="absolute inset-0 bg-repeat bg-center opacity-20" 
        style={{ backgroundImage: "url('https://www.toptal.com/designers/subtlepatterns/uploads/dark-chalk-board.png')" }}
        aria-hidden="true"
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/80 via-brand-dark/50 to-brand-dark/80" aria-hidden="true"></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center [text-shadow:0_2px_10px_rgba(0,0,0,0.8)]">
            <h2 className="font-script text-5xl sm:text-6xl text-brand-light mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-200 leading-relaxed">
              <p>
                Founded in 2020, Beautively Inked was born from a passion for permanent art and personal expression. We believe that every tattoo is a chapter in a person's story, a mark of a moment, a feeling, or a dream. Our studio is a sanctuary where creativity meets precision.
              </p>
              <p>
                Our artists are dedicated to their craft, specializing in a range of styles from delicate fine-line work to bold, intricate sleeves. We are committed to providing a clean, safe, and welcoming environment for every client. Your vision is our blueprint, and we are here to bring it to life on skin.
              </p>
            </div>
            <a href="#contact-form" 
               onClick={handleAnchorClick}
               className="inline-block mt-8 bg-brand-green text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-opacity-80 transition-colors">
              Start Your Story
            </a>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;