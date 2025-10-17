import React, { useState, FormEvent, MouseEvent } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';


interface AdminLoginPageProps {
  onNavigate: (view: 'home' | 'admin') => void;
  logoUrl: string;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate, logoUrl }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onNavigate('home');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in successfully.
        // The onAuthStateChanged listener in App.tsx will handle the navigation.
        setLoading(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        let friendlyMessage = 'An unknown error occurred.';
        if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
          friendlyMessage = 'Invalid email or password. Please try again.';
        } else if (errorCode === 'auth/invalid-email') {
          friendlyMessage = 'Please enter a valid email address.';
        }
        console.error("Firebase Login Error:", error);
        setError(friendlyMessage);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center text-brand-light p-4">
      <div className="w-full max-w-sm mx-auto">
        <a href="#" onClick={handleLinkClick} className="flex justify-center mb-6">
          <img src={logoUrl} alt="Beautively Inked Logo" className="w-32 h-32 object-contain" />
        </a>

        <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-center mb-1">Admin Access</h1>
          <p className="text-center text-gray-400 text-sm mb-6">Enter your credentials to manage the studio.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-dark/80 border border-gray-700 rounded-lg p-3 text-white focus:ring-brand-gold focus:border-brand-gold shadow-inner shadow-black/50"
              />
            </div>

            <div>
              <label htmlFor="password"className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-dark/80 border border-gray-700 rounded-lg p-3 text-white focus:ring-brand-gold focus:border-brand-gold shadow-inner shadow-black/50"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-gold text-white py-3 rounded-full font-bold text-lg hover:bg-opacity-80 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed [filter:drop-shadow(0_4px_8px_rgba(234,179,8,0.3))]"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
        <p className="text-center text-xs text-gray-600 mt-6">
          <a href="#" onClick={handleLinkClick} className="hover:text-brand-light transition-colors">
            &larr; Back to Main Site
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
