import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function Splash() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative animate-splash" style={{ height: '100%', background: 'linear-gradient(180deg, #121212 0%, #0a0a0a 100%)' }}>
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-600/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="w-24 h-24 mb-6 rounded-3xl glass-panel flex items-center justify-center gold-glow">
          <MessageSquare size={48} className="text-gold" />
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Chat<span className="text-gold">ify</span>
        </h1>
        <p className="mt-4 text-subtle text-sm tracking-widest uppercase opacity-60">
          Premium Messaging
        </p>
      </div>
    </div>
  );
}
