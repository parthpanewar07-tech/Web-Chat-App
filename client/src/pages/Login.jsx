import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { LogIn, Mail, Lock, MessageSquare } from 'lucide-react';
import '../Chatify/chatify.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to log in. Check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      setError('Failed to sign in with Google.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatify-container">
      <div className="mobile-mockup p-6 flex flex-col justify-center page-enter">
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-20 h-20 mb-6 rounded-3xl glass-panel flex items-center justify-center gold-glow">
            <MessageSquare size={40} className="text-gold" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
            Welcome to Chat<span className="text-gold">ify</span>
          </h2>
          <p className="text-subtle text-sm tracking-widest uppercase opacity-80">
            Premium Messaging
          </p>
        </div>

        {error && (
          <div className="glass-panel border-red-500/30 text-red-400 p-4 rounded-2xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 w-full">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={20} className="text-subtle" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 glass-input-area border-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none text-white transition-all placeholder:text-subtle"
                placeholder="Email address"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={20} className="text-subtle" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 glass-input-area border-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none text-white transition-all placeholder:text-subtle"
                placeholder="Password"
              />
            </div>
            <div className="flex justify-end mt-2 px-2">
              <Link to="/forgot-password" className="text-xs text-subtle hover:text-[#D4AF37] transition-colors">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4AF37] hover:bg-yellow-500 text-[#121212] font-semibold py-3.5 px-4 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(212,175,55,0.4)] active:scale-95 mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 flex items-center w-full">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-subtle text-sm">Or continue with</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="mt-6 w-full flex items-center justify-center gap-3 glass-panel hover:bg-white/10 text-white font-medium py-3.5 px-4 rounded-full transition-all active:scale-95 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>

        <p className="mt-8 text-center text-subtle text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#D4AF37] hover:text-yellow-400 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
