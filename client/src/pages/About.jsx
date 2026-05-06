import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Settings, 
  MessageSquare, 
  ShieldCheck, 
  Zap, 
  Github, 
  Linkedin, 
  Twitter, 
  Globe, 
  Cpu, 
  Code2, 
  ArrowLeft,
  ExternalLink,
  Mail
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-gold/50 transition-all duration-300 hover:-translate-y-1">
    <div className="w-12 h-12 rounded-xl bg-accent-gold/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-accent-gold" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans selection:bg-accent-gold selection:text-black">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-accent-gold/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-accent-gold/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 lg:py-20">
        {/* Header */}
        <header className="flex items-center justify-between mb-16">
          <button onClick={() => navigate('/')} className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Back to Chat</span>
          </button>
          <div className="flex gap-4">
            <a href="mailto:parthpanewar@gmail.com" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all" title="Contact Developer">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <section className="mb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-accent-gold text-xs font-bold tracking-widest uppercase mb-6">
            <Zap className="w-3 h-3" /> Version 2.0 is live
          </div>
          <h1 className="text-6xl lg:text-8xl font-black text-white mb-8 tracking-tighter">
            Chatify<span className="text-accent-gold">.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A premium real-time messaging experience crafted with <span className="text-white italic">precision</span> and <span className="text-white italic">passion</span>.
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          <FeatureCard 
            icon={MessageSquare} 
            title="Real-time Engine" 
            description="Powered by Firebase for sub-millisecond latency. Experience messaging as fast as thought." 
          />
          <FeatureCard 
            icon={ShieldCheck} 
            title="Secure by Design" 
            description="Robust authentication and data privacy protocols to keep your conversations personal." 
          />
          <FeatureCard 
            icon={Zap} 
            title="Fluid Interface" 
            description="Premium glassmorphism design with smooth micro-interactions and mobile-first responsiveness." 
          />
        </section>

        {/* Tech Stack */}
        <section className="mb-32">
          <h2 className="text-center text-sm uppercase tracking-[0.3em] text-slate-500 font-bold mb-12">Built With</h2>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex flex-col items-center gap-2 group cursor-default">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 transition-colors">
                   <Code2 className="w-8 h-8 text-blue-400" />
                </div>
                <span className="text-xs font-bold text-slate-500 group-hover:text-white transition-colors">React 19</span>
             </div>
             <div className="flex flex-col items-center gap-2 group cursor-default">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                   <Cpu className="w-8 h-8 text-cyan-400" />
                </div>
                <span className="text-xs font-bold text-slate-500 group-hover:text-white transition-colors">Vite</span>
             </div>
             <div className="flex flex-col items-center gap-2 group cursor-default">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-orange-500/50 transition-colors">
                   <Zap className="w-8 h-8 text-orange-400" />
                </div>
                <span className="text-xs font-bold text-slate-500 group-hover:text-white transition-colors">Firebase</span>
             </div>
             <div className="flex flex-col items-center gap-2 group cursor-default">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-teal-500/50 transition-colors">
                   <Settings className="w-8 h-8 text-teal-400" />
                </div>
                <span className="text-xs font-bold text-slate-500 group-hover:text-white transition-colors">Tailwind v4</span>
             </div>
          </div>
        </section>

        {/* Developer Section */}
        <section className="mb-32">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="text-sm uppercase tracking-[0.3em] text-accent-gold font-bold mb-4">The Architect</h2>
              <h3 className="text-4xl font-bold text-white mb-6">Parth Panewar</h3>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                A Full-Stack Developer and UI Specialist dedicated to pushing the boundaries of web technology. 
                With a focus on performance, scalability, and aesthetic excellence, I build digital products 
                that people love to use.
              </p>
              
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-accent-gold" /> Frontend
                  </h4>
                  <p className="text-sm text-slate-500">React.js, Tailwind CSS, Material You</p>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-accent-gold" /> Backend
                  </h4>
                  <p className="text-sm text-slate-500">Node.js, Firebase, Real-time DB</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <a href="#" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium">
                  <Github className="w-4 h-4" /> GitHub
                </a>
                <a href="#" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
                <a href="#" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black hover:bg-[#C5A028] transition-all text-sm font-bold">
                  <Globe className="w-4 h-4" /> Portfolio
                </a>
              </div>
            </div>

            <div className="relative w-full max-w-md aspect-square lg:w-[400px]">
              <div className="absolute inset-0 bg-accent-gold/20 blur-3xl rounded-full animate-pulse" />
              <div className="relative h-full w-full rounded-[2rem] overflow-hidden border border-white/10 bg-slate-900 group">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                {/* Developer Image Placeholder with Premium Styling */}
                <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a]">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-accent-gold/10 flex items-center justify-center mx-auto mb-4 border border-accent-gold/20">
                       <span className="text-4xl font-bold text-accent-gold">PP</span>
                    </div>
                    <p className="text-slate-400 font-medium">Parth Panewar</p>
                    <p className="text-xs text-slate-600 uppercase tracking-widest mt-1">Full-Stack Developer</p>
                  </div>
                </div>
                
                <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-bold text-white tracking-widest uppercase">Based in India</span>
                  <div className="flex gap-3">
                    <Mail className="w-4 h-4 text-white hover:text-accent-gold cursor-pointer" />
                    <ExternalLink className="w-4 h-4 text-white hover:text-accent-gold cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Info */}
        <footer className="pt-12 border-t border-white/5 text-center">
          <p className="text-slate-600 text-sm mb-4">
            &copy; 2026 Chatify Messaging. All rights reserved.
          </p>
          <div className="flex justify-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
            <a href="#" className="hover:text-accent-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent-gold transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-accent-gold transition-colors">Documentation</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default About;

