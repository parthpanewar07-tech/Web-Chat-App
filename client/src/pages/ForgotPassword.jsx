import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';
import '../Chatify/chatify.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setMessage('');
      setError('');
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError('Failed to send password reset email. Make sure the email is correct.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatify-container">
      <div className="mobile-mockup p-6 flex flex-col justify-center page-enter">
        <Link to="/login" className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/10 transition active:scale-90 text-white z-10">
          <ArrowLeft size={24} />
        </Link>
        
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="w-20 h-20 mb-6 rounded-3xl glass-panel flex items-center justify-center gold-glow">
            <KeyRound size={40} className="text-gold" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
            Reset Password
          </h2>
          <p className="text-subtle text-sm tracking-widest uppercase opacity-80">
            Secure Recovery
          </p>
        </div>

        {error && (
          <div className="glass-panel border-red-500/30 text-red-400 p-4 rounded-2xl mb-6 text-sm text-center">
            {error}
          </div>
        )}
        
        {message && (
          <div className="glass-panel border-green-500/30 text-green-400 p-4 rounded-2xl mb-6 text-sm text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4 w-full">
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
                placeholder="Enter your email address"
              />
            </div>
            <p className="mt-4 text-xs text-subtle px-2 text-center">
              We'll send you a link to securely reset your password.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4AF37] hover:bg-yellow-500 text-[#121212] font-semibold py-3.5 px-4 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(212,175,55,0.4)] active:scale-95 mt-4"
          >
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-10 text-center text-subtle text-sm">
          Remembered your password?{' '}
          <Link to="/login" className="text-[#D4AF37] hover:text-yellow-400 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
