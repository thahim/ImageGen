import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
      {/* Rounded rectangle container with glassmorphism */}
      <div className="bg-brand-900/90 backdrop-blur-md border border-brand-500/40 rounded-2xl p-2 pr-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center gap-4 pointer-events-auto transform transition-all hover:scale-105 hover:shadow-brand-500/30 duration-300 ring-1 ring-white/10">
        
        {/* Image in a circle frame */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-brand-400 shadow-inner shrink-0">
          <img 
            src="https://thahim.github.io/ast/images/IMG-20250516-WA0027.jpg" 
            alt="Saad Thahim" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text content */}
        <div className="flex flex-col justify-center">
          <span className="text-brand-400 text-[10px] uppercase tracking-widest font-bold mb-0.5">Developed by</span>
          <span className="text-white font-bold text-sm tracking-wide leading-none">Saad Thahim</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;