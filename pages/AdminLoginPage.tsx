// FIX: Add missing React import
import React, { useState, FormEvent, MouseEvent } from 'react';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigate: (view: 'home' | 'admin') => void;
  logoUrl: string;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onNavigate, logoUrl }) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onNavigate('home');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (username.toLowerCase() === 'santa' && pin === '1900') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Invalid username or PIN. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center text-brand-light p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <a href="#" onClick={handleLinkClick} aria-label="Back to home" className="flex items-center gap-3">
             <img src={logoUrl} alt="Beautively Inked Logo" className="h-96 w-96 object-contain" />
          </a>
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 tracking-wider">Admin Portal</h1>
        <p className="text-center text-gray-400 mb-8">Login to manage your website.</p>
        
        <div className="bg-black/20 border border-white/10 rounded-lg p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Santa"
                className="w-full bg-brand-dark border border-gray-700 rounded-md p-3 focus:ring-brand-light/50 focus:border-brand-light/50 transition"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-400 mb-2">
                PIN
              </label>
              <input
                type="password"
                id="pin"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full bg-brand-dark border border-gray-700 rounded-md p-3 focus:ring-brand-light/50 focus:border-brand-light/50 transition"
                required
                aria-required="true"
              />
            </div>
            
            {error && <p className="text-red-500 text-sm text-center" role="alert">{error}</p>}

            <div>
              <button
                type="submit"
                className="w-full bg-brand-light text-brand-dark py-3 rounded-md font-bold text-lg hover:bg-white/90 transition-transform transform hover:scale-105"
              >
                Login
              </button>
            </div>
          </form>
        </div>
        <p className="text-center text-gray-600 mt-8 text-sm">
          &copy; {new Date().getFullYear()} Beautively Inked.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;