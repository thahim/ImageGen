import React from 'react';
import { GeneratedImage } from '../types';

interface ImageCardProps {
  image: GeneratedImage;
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `abdul-salams-ai-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="group relative bg-brand-800 rounded-xl overflow-hidden shadow-lg border border-brand-500/10 hover:border-brand-500/50 transition-all duration-300">
      <div className="aspect-square w-full relative overflow-hidden">
        <img 
          src={image.url} 
          alt={image.prompt} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <p className="text-white text-sm line-clamp-2 mb-3 font-medium text-shadow">
            {image.prompt}
          </p>
          <button 
            onClick={handleDownload}
            className="w-full bg-brand-500 hover:bg-brand-400 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M12 12.75l-3-3m3 3 3-3m-3 3V3" />
            </svg>
            Download
          </button>
        </div>
      </div>
      
      {/* Badge for Reference */}
      {image.hasReference && (
        <div className="absolute top-2 right-2 bg-purple-500/90 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
          REF USED
        </div>
      )}
    </div>
  );
};

export default ImageCard;