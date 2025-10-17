// FIX: Add missing React import
import React, { useState, FormEvent, MouseEvent } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';


interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigate: (view: 'home' | 'admin') => void;
  logoUrl: string;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onNavigate, logoUrl }) => {
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
        // Signed in successfully
        setLoading(false);
        onLoginSuccess();
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
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <a href="#" onClick={handleLinkClick} aria-label="Back to home" className="flex items-center gap-3">
             <img src={logoUrl} alt="Beautively Inked Logo" className="h-96 w-96 object-contain" />
          </a>
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 tracking-wider">Admin Portal</h1>
        <p className="text-center text-gray-400 mb-8">Login to manage your website.</p>
        
        <div className="bg-black/20 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                className="w-full bg-brand-dark border border-gray-700 rounded-lg p-3 focus:ring-brand-light/50 focus:border-brand-light/50 transition"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-dark border border-gray-700 rounded-lg p-3 focus:ring-brand-light/50 focus:border-brand-light/50 transition"
                required
                aria-required="true"
              />
            </div>
            
            {error && <p className="text-red-500 text-sm text-center" role="alert">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-light text-brand-dark py-3 rounded-lg font-bold text-lg hover:bg-white/90 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
              >
                {loading ? 'Logging in...' : 'Login'}
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