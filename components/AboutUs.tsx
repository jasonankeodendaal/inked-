import React from 'react';

interface AboutUsProps {
  aboutUsImageUrl: string;
}

const AboutUs: React.FC<AboutUsProps> = ({ aboutUsImageUrl }) => {
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
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-2 relative w-64 h-64 sm:w-80 sm:h-80 mx-auto">
             <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse -z-10"></div>
            <img 
              src={aboutUsImageUrl} 
              alt="Portrait of the tattoo artist" 
              className="relative w-full h-full object-cover rounded-full shadow-2xl shadow-black/70 border-4 border-white/20"
            />
          </div>
          <div className="lg:col-span-3 text-center lg:text-left">
            <h2 className="font-script text-4xl sm:text-6xl text-brand-light mb-4">
              Our Story
            </h2>
            <div className="w-24 h-1 bg-brand-green mx-auto lg:mx-0 mb-6"></div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Founded on a passion for permanent art and personal expression, Beautively Inked is more than just a tattoo studio—it's a creative sanctuary. With years of experience and a dedication to craftsmanship, we specialize in turning your unique stories into timeless designs.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              We believe every tattoo is a collaboration. From the initial consultation to the final touch, we prioritize a clean, comfortable, and inspiring environment, ensuring your experience is as memorable as the art itself.
            </p>
            <a href="#contact-form" onClick={handleAnchorClick} className="inline-block bg-brand-green border border-brand-green text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-opacity-80 transition-colors">
              Start Your Journey
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;