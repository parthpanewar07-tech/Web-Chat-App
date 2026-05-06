import React from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';


const About = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-6 tracking-tight">
          About the <span className="text-blue-500">App</span>
        </h1>
        
        <p className="text-slate-300 text-lg leading-relaxed mb-8">
          This is a premium real-time chat application featuring an iOS-inspired glassmorphism design, lightning-fast message delivery, and secure authentication. Built for speed and scalability.
        </p>

        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-sm uppercase tracking-widest text-slate-400 font-semibold mb-2">Developed By</h3>
          <p className="text-2xl font-bold text-white mb-2">Parth Panewar</p>
          <p className="text-slate-400 text-sm">
            Full-Stack Developer passionate about scalable architectures, UI/UX design, and creating exceptional web experiences.
          </p>
        </div>
        
        <div className="mt-10 flex gap-4">
          <Link 
            to="/" 
            className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
          >
            Back to Chat
          </Link>
          
          <Link 
            to="/settings" 
            className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-slate-700 text-base font-medium rounded-full text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
